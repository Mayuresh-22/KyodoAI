from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Optional
import json
import uuid
import os

# For demonstration, import mock data from search_emails.py
from search_emails import portia, task as email_search_task

load_dotenv(override=True)

# Try to import Supabase client
try:
    from supabase import create_client, Client
    # Initialize Supabase client if env vars are set
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    
    if SUPABASE_URL and SUPABASE_KEY:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    else:
        print("WARNING: Supabase credentials not found. Using mock data only.")
        supabase = None
except ImportError:
    print("WARNING: Supabase Python client not installed. Using mock data only.")
    supabase = None

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class EmailSearchRequest(BaseModel):
    user_id: Optional[str] = None
    rescan: Optional[bool] = False

class EmailItem(BaseModel):
    deal_title: str
    date: str
    organisation: str
    email_id: str
    content: str
    short_summary: str
    budget: Optional[str] = None

class EmailSearchResponse(BaseModel):
    emails: List[EmailItem]