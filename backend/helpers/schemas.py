from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field

class EmailSummary(BaseModel):
    total_found: int
    by_label: Dict[str, int]
    top_senders: List[Dict[str, int]]

class EmailItem(BaseModel):
    email_id: str
    from_name: str
    from_email: str
    subject: str
    snippet: str
    received_at: str
    thread_link: str
    labels: List[str]
    tags: Optional[List[str]] = None
    relevance_score: float
    confidence: float
    first_received: str
    last_received: str
    ui_actions: List[str]
    notes: Optional[str] = None

class SearchColabEmailsResponse(BaseModel):
    emails: List[EmailItem]

# START_COLAB_PROCESS Schema Models

class EmailParsed(BaseModel):
    sender: str
    sender_email: str
    brand: Optional[str] = None
    subject: str
    offer_summary: str
    proposed_deliverables: List[str]
    compensation_terms: Optional[str] = None
    exclusivity: Optional[str] = None
    deadlines: Optional[List[str]] = None
    attachments: Optional[List[str]] = None
    thread_link: str
    received_at: str

class Analysis(BaseModel):
    fit: Literal["high", "medium", "low"]
    relevance_notes: str
    missing_info: List[str]
    risk_flags: List[str]

class SuggestedReply(BaseModel):
    subject: str
    body: str

class TemporaryContract(BaseModel):
    summary_terms: str
    payment_terms: str
    deliverables: List[str]
    milestones: List[str]
    timeline: str
    acceptance_criteria: List[str]
    basic_clauses: Dict[str, str]  # IP, termination, exclusivity

class StartColabProcessResponse(BaseModel):
    email_parsed: EmailParsed
    analysis: Analysis
    next_action: Literal["ready_to_proceed", "need_clarification", "reject"]
    confidence_score: float = Field(ge=0, le=1)
    suggested_reply: SuggestedReply
    temporary_contract_draft: Optional[TemporaryContract] = None
    clarifying_questions: Optional[List[str]] = None
    autonomous_actions: List[str]
    assumptions: List[str]
    next_steps: List[str]
