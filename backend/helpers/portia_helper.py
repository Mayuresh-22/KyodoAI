from dotenv import load_dotenv
from enum import Enum
from typing import Any, Dict, Optional, Union

from portia import (
    Config,
    LLMProvider,
    LLMTool,
    Portia,
    PortiaToolRegistry,
    StorageClass,
    logger,
    PlanBuilderV2,
    StepOutput,
    Input,
)
from portia.cli import CLIExecutionHooks
from portia.end_user import EndUser
from supabase_auth import User

from helpers.schemas import SearchColabEmailsResponse
from helpers.supabase_helper import SupabaseHelper


class PortiaTask(Enum):
    SEARCH_COLAB_EMAILS = ("""
        Search the user's mailbox (last 30 days) for emails that are genuine collaboration or brand deal requests intended for the user, sent by other parties (not the user themselves). Only include emails where the sender is clearly reaching out to propose a partnership, sponsorship, brand deal, or collaboration, and where the intent is explicit in the message content—not just emails that contain related keywords.

        Exclude:
        - Newsletters, notifications, or automated emails.
        - Emails where the user is the sender or where the message is not a direct request to the user.
        - Emails that merely mention collaboration/brand terms without a clear intent to initiate a deal.

        REQUIRED FINAL output schema (exact JSON keys and types):
        {
            "emails": [
                {
                    "email_id": "string",                 # unique id of email
                    "from_name": "string",
                    "from_email": "string",
                    "subject": "string",
                    "snippet": "string",           # short text preview (1-2 lines)
                    "received_at": "ISO8601 string",
                    "thread_link": "string (permalink)",
                    "labels": ["brand","offer","sponsored","negotiation"],
                    "tags": ["optional category tags"],
                    "relevance_score": 0-1,          # how likely this is a colab offer
                    "confidence": 0-1,               # model confidence in parsing
                    "first_received": "ISO8601 string",
                    "last_received": "ISO8601 string",
                    "ui_actions": ["start_colab_process"],
                    "notes": "string (optional parsed notes)"
                }
            ],
            "summary": {
                "total_found": 0,
                "by_label": { "brand": 0, "offer": 0, "sponsored": 0 },
                "top_senders": [{ "email": "", "count": 0 }]
            }
        }
        """
    )

    START_COLAB_PROCESS = ("""
        Trigger: user has clicked the UI action/button (label examples: "Start Colab Process", "Activate AI")
        for one selected collaboration/brand email displayed in the grid/list. Once triggered,
        run this workflow one instruction at a time and return a single coherent JSON summary
        for the UI to present and for subsequent autonomous actions.

        Step 1) CONTEXT & PARSING
            - Accept the selected email (raw text, thread link, metadata) and optional
                user preference context appended by caller.
            - Parse and return `email_parsed` with: { sender, sender_email, brand, subject,
                offer_summary, proposed_deliverables, compensation_terms, exclusivity, deadlines,
                attachments, thread_link, received_at }.

        Step 2) PREFERENCE MATCHING
            - Compare parsed fields with the creator's stored preferences (tone, min_comp,
                allowed_exclusivity, timeline_limits, deliverable_format). Return `analysis`:
                { fit: high|medium|low, relevance_notes, missing_info: [...], risk_flags: [...] }.

        Step 3) DECIDE & ROUTE
            - Based on `analysis`, choose a single `next_action` with `confidence_score`:
                * ready_to_proceed  -> TIMELINE 1 (prepare/send contract)
                * need_clarification -> TIMELINE 2 (ask questions / iterate)
                * reject            -> Draft polite decline
            - Provide rationale for decision and an ordered `next_steps` array.

        Step 4) TIMELINE 1 (ready_to_proceed)
            - Draft `temporary_contract` including: summary_terms, payment_terms,
                deliverables, milestones, timeline, acceptance_criteria, basic clauses (IP,
                termination, exclusivity). Keep it creator-friendly and editable.
            - Draft `suggested_reply` (subject, body) that attaches or embeds the contract,
                clearly lists next steps, and offers points for negotiation.
            - Provide a UI action set for the creator: ["preview_contract", "send_contract_and_email",
                "save_draft", "schedule_meeting", "edit_terms"].

        Step 5) TIMELINE 2 (need_clarification)
            - Generate `clarifying_questions` targeting missing/ambiguous fields.
            - Draft `suggested_reply` to request clarifications and optionally propose
                provisional terms. Produce `temporary_contract_draft` skeleton for iteration.
            - Provide UI action set: ["send_questions", "save_draft", "escalate_to_human"].

        Step 6) REJECT
            - Draft a concise, polite `suggested_reply` explaining reasons and optionally
                offer alternatives. Provide UI action: ["send_decline", "save_note"].

        Step 7) AUTONOMOUS TOOL USE
            - The agent may autonomously choose to perform allowed side-tasks (if permitted
                by user settings): e.g., schedule a meeting, create a calendar event, save
                contract to docs, or open a negotiation thread. Enumerate chosen `autonomous_actions`.

        Step 8) ITERATION & LOOP
            - When partner replies, re-run Steps 1-7. Always include `assumptions`, `sources`,
                and a short `rationale` for changes between iterations. Stop iterating when
                `next_action` == ready_to_proceed and creator confirms, or when `reject` is final.

        OUTPUT schema (single JSON):
            {
                "email_parsed": {...},
                "analysis": {...},
                "next_action": "ready_to_proceed|need_clarification|reject",
                "confidence_score": 0-1,
                "suggested_reply": {"subject":"...","body":"..."},
                "temporary_contract_draft": {...},
                "clarifying_questions": [...],
                "autonomous_actions": [...],
                "assumptions": [...],
                "next_steps": [...]
            }

        UI notes for caller: present the email list/grid; on selection show this JSON with
        quick-action buttons (preview contract, send email, ask questions, schedule meeting,
        save to docs). Agent must always include clear `assumptions` and not auto-send
        anything requiring funds/signature without explicit creator confirmation.

        Keep instructions explicit and stepwise to make outputs deterministic and easily
        mapped to UI actions. If caller provides the raw email and/or full user preference
        profile after this prompt, incorporate them into all steps.
        """
    )


class PortiaHelper:
    """Thin helper around Portia SDK to run common tasks used by the backend.

    Contract (inputs/outputs):
    - Inputs: PortiaTask enum or raw task string; optional context (email text/id)
    - Outputs: dict from Portia plan outputs (model_dump) or error dict
    - Errors: returned as {'error': '...', 'details': ...}
    """

    def __init__(
        self,
        llm_provider: LLMProvider = LLMProvider.GOOGLE,
        storage_class: StorageClass = StorageClass.MEMORY,
    ) -> None:
        load_dotenv(override=True)

        self.config = Config.from_default(
            default_model="google/gemini-2.0-flash", 
            storage_class=storage_class
        )
        self.supabase_helper = SupabaseHelper()
        self.current_msg_id = None  # TODO: Will be set when running tasks
        self.structure_email_item = LLMTool(
            id="structure_email_item", 
            name="Structure Email Item",
            description="A tool for extracting and structuring email items. In particular, it focuses on identifying and organizing collaboration-related emails.",
            structured_output_schema=SearchColabEmailsResponse
        )
        self.portia = Portia(
            config=self.config,
            tools=PortiaToolRegistry(config=self.config),
            execution_hooks=CLIExecutionHooks(),
        )

    def run_task(
        self,
        task: Union[PortiaTask, str], 
        end_user: User,
        context: Optional[dict] = None,
        msg_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Run a Portia task and return a JSON-serializable result.

        If `context` is provided it will be appended to the task prompt to give Portia the
        relevant email text or metadata.
        """
        logger().info(f"Starting run_task with task: {type(task).__name__ if isinstance(task, PortiaTask) else 'string'}")
        # Set message ID for logging context
        self.current_msg_id = msg_id
        
        if isinstance(task, PortiaTask):
            prompt = task.value
            logger().info(f"Using PortiaTask enum: {task.name}")
        else:
            prompt = str(task)
            logger().info("Using string task prompt")

        if context:
            prompt = f"{prompt}\n\nContext (User details & preferences):\n{context}"
            logger().info("Added context to prompt")

        try:
            logger().info("Executing Portia plan")
            plan = self.portia.run(
                prompt,
                # TODO: uncomment this line
                # end_user=EndUser(external_id=end_user.id, email=str(end_user.email))
                end_user=EndUser(external_id="255af79e-3ea8-448c-80f2-7470492b8979", email="mayureshchoudhary22@gmail.com")
                
            )
            logger().info("Portia plan execution completed successfully")
        except Exception as exc:  # keep broad to capture SDK/runtime errors
            logger().exception("Portia run failed")
            return {"error": "portia_run_failed", "details": str(exc)}
        finally:
            # Clear message ID after task completion
            self.current_msg_id = None
            logger().info("Cleared message ID context")

        # Attempt to extract model output in a safe way
        try:
            logger().info("Extracting output from plan results")
            return {
                "value": str(plan.outputs.final_output.value),
                "summary": str(plan.outputs.final_output.summary)
            }
        except Exception as e:
            logger().warning(f"Failed to extract plan output: {e}")
            return {"value": None, "summary": None}

    def run_search_colab_emails(self, end_user: User, context: dict) -> Dict[str, Any]:
        """Search collaboration emails using manual plan with Gmail integration."""
        logger().info("Starting manual plan for search collaboration emails")
        
        try:
            # Build manual plan for searching collaboration emails
            plan = (
                PlanBuilderV2("Search collaboration emails from last 30 days")
                .input(
                    name="context", 
                    description="End user details and preferences and other context"
                )
                .llm_step(
                    task="Generate an optimized Gmail search query for collaboration emails from the last 30 days. Focus on terms like collaboration, partnership, sponsorship, brand deal, influencer. Include date filter for last 30 days (after:2025/07/25) and exclude spam/promotional emails.",
                    inputs=[Input("context")]
                )
                .invoke_tool_step(
                    tool="portia:google:gmail:search_email",
                    args={
                        "query": StepOutput(0)
                    }
                )
                .llm_step(
                    task="Analyze the email search results and filter out only genuine collaboration, brand deal, or partnership requests. Exclude newsletters, automated emails, and emails where the user is the sender. Focus on emails with explicit intent to propose deals or collaborations. PERSIST THE INFORMATION ABOUT THE EMAILS.",
                    inputs=[StepOutput(1), Input("context")]
                )
                .llm_step(
                    task="""Structure the filtered collaboration emails into the required JSON schema with all fields: email_id, from_name, from_email, subject, snippet, received_at, thread_link, labels, tags, relevance_score, confidence, first_received, last_received, ui_actions, notes, and summary statistics. Structure the output as a list of email items like this: {
                        "emails": [
                            {
                                "email_id": "string", # unique id of the email received from google's search email tool
                                "from_name": "string",
                                "from_email": "string",
                                "subject": "string",
                                "snippet": "string", # short text preview (1-2 lines)
                                "received_at": "ISO8601 string",
                                "thread_link": "string (permalink)",
                                "labels": ["brand","offer","sponsored","negotiation"],
                                "tags": ["optional category tags"],
                                "relevance_score": 0-1, # how likely this is a colab offer
                                "confidence": 0-1, # model confidence in parsing
                                "first_received": "ISO8601 string",
                                "last_received": "ISO8601 string",
                                "ui_actions": ["start_colab_process"],
                                "notes": "string (optional parsed notes)"
                            }
                        ],
                        "summary": {
                            "total_found": 0,
                            "by_label": { "brand": 0, "offer": 0, "sponsored": 0 },
                            "top_senders": [{ "email": "", "count": 0 }]
                        }
                    }""",
                    inputs=[StepOutput(1), StepOutput(2), Input("context")],
                )
                .final_output(
                    output_schema=SearchColabEmailsResponse,
                    summarize=True
                )
                .build()
            )
            
            logger().info("Executing manual plan for collaboration email search")
            plan_run = self.portia.run_plan(
                plan,
                plan_run_inputs={"context": context},
                end_user=EndUser(external_id="255af79e-3ea8-448c-80f2-7470492b8979", email="mayureshchoudhary22@gmail.com")
            )
            
            logger().info("Manual plan execution completed successfully")
            
            # Try to extract the output safely
            try:
                if hasattr(plan_run.outputs, 'final_output') and plan_run.outputs.final_output:
                    final_output = plan_run.outputs.final_output
                    value = getattr(final_output, 'value', None)
                    summary = getattr(final_output, 'summary', None)
                    
                    return {
                        "value": value if value is not None else "",
                        "summary": str(summary) if summary is not None else ""
                    }
                else:
                    logger().warning("No final output found in plan results")
                    return {"value": "", "summary": ""}
            except Exception as extract_error:
                logger().warning(f"Failed to extract plan output: {extract_error}")
                return {"value": "", "summary": ""}
            
        except Exception as exc:
            logger().exception("Manual plan execution failed")
            return {"error": "manual_plan_failed", "details": str(exc)}

    def start_colab_process(self, end_user: User, email_text: dict, msg_id: str) -> Dict[str, Any]:
        """Start the collaboration analysis process.

        Optionally pass the raw `email_text` (or a short link/summary). The prompt accepts context
        appended to the task.
        """
        return self.run_task(
            PortiaTask.START_COLAB_PROCESS, 
            end_user=end_user,
            context=email_text,
            msg_id=msg_id
        )
