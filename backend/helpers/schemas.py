from typing import List, Dict, Optional
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
    summary: EmailSummary
