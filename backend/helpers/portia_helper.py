from dotenv import load_dotenv
from enum import Enum
from typing import Any, Dict, Optional, Union

from portia import (
    Config,
    ExecutionAgentType,
    LLMProvider,
    LLMTool,
    Output,
    Plan,
    PlanRun,
    Portia,
    DefaultToolRegistry,
    Step,
    StorageClass,
    logger,
)
from portia.cli import CLIExecutionHooks
from portia.end_user import EndUser
from supabase_auth import User

from helpers.schemas import EmailItem


class PortiaTask(Enum):
    SEARCH_COLAB_EMAILS = ("""
Search the user's mailbox (last 30 days) for emails that are genuine collaboration or brand deal requests intended for the user, sent by other parties (not the user themselves). Only include emails where the sender is clearly reaching out to propose a partnership, sponsorship, brand deal, or collaboration, and where the intent is explicit in the message content—not just emails that contain related keywords.

Exclude:
- Newsletters, notifications, or automated emails.
- Emails where the user is the sender or where the message is not a direct request to the user.
- Emails that merely mention collaboration/brand terms without a clear intent to initiate a deal.

REQUIRED output schema (exact JSON keys and types):
{
    "emails": [
        {
            "email_id": "string",                 # unique id or thread id
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

        Step A) CONTEXT & PARSING
            - Accept the selected email (raw text, thread link, metadata) and optional
                user preference context appended by caller.
            - Parse and return `email_parsed` with: { sender, sender_email, brand, subject,
                offer_summary, proposed_deliverables, compensation_terms, exclusivity, deadlines,
                attachments, thread_link, received_at }.

        Step B) PREFERENCE MATCHING
            - Compare parsed fields with the creator's stored preferences (tone, min_comp,
                allowed_exclusivity, timeline_limits, deliverable_format). Return `analysis`:
                { fit: high|medium|low, relevance_notes, missing_info: [...], risk_flags: [...] }.

        Step C) DECIDE & ROUTE
            - Based on `analysis`, choose a single `next_action` with `confidence_score`:
                * ready_to_proceed  -> TIMELINE 1 (prepare/send contract)
                * need_clarification -> TIMELINE 2 (ask questions / iterate)
                * reject            -> Draft polite decline
            - Provide rationale for decision and an ordered `next_steps` array.

        Step D) TIMELINE 1 (ready_to_proceed)
            - Draft `temporary_contract` including: summary_terms, payment_terms,
                deliverables, milestones, timeline, acceptance_criteria, basic clauses (IP,
                termination, exclusivity). Keep it creator-friendly and editable.
            - Draft `suggested_reply` (subject, body) that attaches or embeds the contract,
                clearly lists next steps, and offers points for negotiation.
            - Provide a UI action set for the creator: ["preview_contract", "send_contract_and_email",
                "save_draft", "schedule_meeting", "edit_terms"].

        Step E) TIMELINE 2 (need_clarification)
            - Generate `clarifying_questions` targeting missing/ambiguous fields.
            - Draft `suggested_reply` to request clarifications and optionally propose
                provisional terms. Produce `temporary_contract_draft` skeleton for iteration.
            - Provide UI action set: ["send_questions", "save_draft", "escalate_to_human"].

        Step F) REJECT
            - Draft a concise, polite `suggested_reply` explaining reasons and optionally
                offer alternatives. Provide UI action: ["send_decline", "save_note"].

        Step G) AUTONOMOUS TOOL USE
            - The agent may autonomously choose to perform allowed side-tasks (if permitted
                by user settings): e.g., schedule a meeting, create a calendar event, save
                contract to docs, or open a negotiation thread. Enumerate chosen `autonomous_actions`.

        Step H) ITERATION & LOOP
            - When partner replies, re-run Steps A-G. Always include `assumptions`, `sources`,
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

        self.config = Config.from_default(llm_provider=llm_provider, storage_class=storage_class)
        self.structure_email_item = LLMTool(
            id="structure_email_item", 
            name="Structure Email Item",
            description="A tool for extracting and structuring email items. In particular, it focuses on identifying and organizing collaboration-related emails.",
            structured_output_schema=EmailItem)
        self.portia = Portia(
            config=self.config,
            tools=DefaultToolRegistry(config=self.config)._add([self.structure_email_item]),
            execution_hooks=CLIExecutionHooks(),
        )

    def log_after_every_step(self, plan: Plan, plan_run: PlanRun, step: Step, output: Output) -> None:
        """Log the output of each executed step. Kept small to avoid noisy logs."""
        try:
            logger().info(f"Finished step {step.task} with output: {getattr(output, 'summary', repr(output))}")
        except Exception:
            logger().exception("Failed to log step output")

    def run_task(
        self,
        task: Union[PortiaTask, str], 
        end_user: User,
        context: Optional[dict] = None
    ) -> Dict[str, Any]:
        """Run a Portia task and return a JSON-serializable result.

        If `context` is provided it will be appended to the task prompt to give Portia the
        relevant email text or metadata.
        """
        if isinstance(task, PortiaTask):
            prompt = task.value
        else:
            prompt = str(task)

        if context:
            prompt = f"{prompt}\n\nContext (User details & preferences):\n{context}"

        try:
            plan = self.portia.run(
                prompt,
                # TODO: uncomment this line
                # end_user=EndUser(external_id=end_user.id, email=str(end_user.email))
                end_user=EndUser(external_id="255af79e-3ea8-448c-80f2-7470492b8979", email="mayureshchoudhary22@gmail.com")
                
            )
        except Exception as exc:  # keep broad to capture SDK/runtime errors
            logger().exception("Portia run failed")
            return {"error": "portia_run_failed", "details": str(exc)}

        # Attempt to extract model output in a safe way
        try:
            return {
                "value": str(plan.outputs.final_output.value),
                "summary": str(plan.outputs.final_output.summary)
            }
        except Exception:
            return {"value": None, "summary": None}

    def run_search_colab_emails(self, end_user: User, context: dict) -> Dict[str, Any]:
        """Convenience wrapper for searchning collaboration emails (30d)."""
        return self.run_task(
            PortiaTask.SEARCH_COLAB_EMAILS,
            end_user=end_user,
            context=context
        )

    def start_colab_process(self, end_user: User, email_text: Dict) -> Dict[str, Any]:
        """Start the collaboration analysis process.

        Optionally pass the raw `email_text` (or a short link/summary). The prompt accepts context
        appended to the task.
        """
        return self.run_task(
            PortiaTask.START_COLAB_PROCESS, 
            end_user=end_user,
            context=email_text
        )

