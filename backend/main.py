from os import stat
from typing import Optional
import uuid
from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from supabase_auth import User
from helpers.schemas import SearchColabEmailsResponse, StartColabProcessResponse
from middleware.auth_middleware import AuthMiddleware
from dotenv import load_dotenv
from helpers.supabase_helper import SupabaseHelper
from helpers.portia_helper import PortiaHelper
import json
import re
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
print("FastAPI application started")
# Add the authentication middleware
# app.add_middleware(AuthMiddleware)

# Models
class EmailSearchRequest(BaseModel):
    user_id: Optional[str] = None
    rescan: Optional[bool] = False

@app.post("/search-emails")
def search_emails(request: Request):
    logger.info("Starting search-emails endpoint")
    user: Optional[User] = getattr(request.state, "user", None)
    # TODO: uncomment following two comments
    # if not user or not getattr(user, "id", None):
    #     return JSONResponse(status_code=401, content={"detail": "User not authenticated"})

    logger.info("Initializing Supabase helper")
    supabase = SupabaseHelper()
    user_id = "255af79e-3ea8-448c-80f2-7470492b8979"  # TODO: replace this with actual user id from req state
    logger.info(f"Fetching profile for user_id: {user_id}")
    profile_resp = supabase.client.table("profiles").select(
        "email, min_budget, max_budget, content_niche, auto_generate_invoice, guidelines"
    ).eq("id", user_id).execute()
    logger.info(f"Profile response: {profile_resp}")
    profiles = profile_resp.data
    if not profiles:
        logger.warning("No profile found for user")
        return JSONResponse(status_code=404, content={"detail": "Profile not found"})
    profile = profiles[0]
    logger.info("Successfully fetched user profile from Supabase")

    profile_dict = dict(profile) if profile else {}
    logger.info(f"Profile dictionary: {profile_dict}")

    logger.info("Initializing Portia helper")
    portia_helper = PortiaHelper()
    logger.info("Running search collaboration emails task")
    result = portia_helper.run_search_colab_emails(
        end_user=user,
        context=profile_dict
    )
    logger.info(f"Portia helper returned result: {result}")
    _value: Optional[SearchColabEmailsResponse] = result.get("value")
    _summary = result.get("summary") or ""
    _status = "success"

    if not _value:
        logger.warning("No valid emails data found")
        _status = "error"
        return JSONResponse(status_code=404, content={"detail": "No valid emails data found", "status": _status})

    try:
        value_json = _value.model_dump()
        logger.info("Successfully parsed JSON response")
        # Check if value_json has the expected structure and insert emails into database
        if isinstance(value_json, dict) and "emails" in value_json and isinstance(value_json["emails"], list):
            logger.info(f"Found {len(value_json['emails'])} emails to insert into database")

            emails_to_insert = []
            for email_data in value_json["emails"]:
                insert_data = {
                    "email_id": email_data.get("email_id"),
                    "from_name": email_data.get("from_name"),
                    "from_email": email_data.get("from_email"),
                    "subject": email_data.get("subject"),
                    "summary": email_data.get("snippet"),  # using snippet as summary
                    "received_at": email_data.get("received_at"),
                    "thread_link": email_data.get("thread_link"),
                    "labels": email_data.get("labels", []),
                    "tags": email_data.get("tags", []),
                    "relevance_score": email_data.get("relevance_score", 0),
                    "confidence": email_data.get("confidence", 0),
                    "first_received": email_data.get("first_received"),
                    "last_received": email_data.get("last_received"),
                    "ui_actions": email_data.get("ui_actions", ["start_colab_process"]),
                    "notes": email_data.get("notes"),
                    "user_id": user_id
                }
                emails_to_insert.append(insert_data)
            try:
                # Batch insert all emails with upsert (on conflict update)
                result = supabase.client.table("emails").upsert(emails_to_insert).execute()
                logger.info(f"Successfully upserted {len(emails_to_insert)} emails")
            except Exception as e:
                logger.error(f"Failed to upsert emails: {e}")
        else:
            logger.warning("Invalid JSON structure: missing 'emails' array")
            
    except Exception as e:
        logger.warning("Failed to parse JSON")
        _status = "error"
        return JSONResponse(status_code=404, content={"detail": "No valid emails data found", "status": _status})

    logger.info("Returning response from search-emails endpoint")
    return JSONResponse(content={"value": value_json, "summary": _summary})


# Pydantic model for request body
class StartProcessRequest(BaseModel):
    email_id: str

@app.post("/start-process")
def start_colab_process(request: Request, body: StartProcessRequest):
    logger.info("Starting start-process endpoint")
    user_id = "255af79e-3ea8-448c-80f2-7470492b8979"  # Use the same test user id
    msg_id = str(uuid.uuid4())

    # Initialize Supabase helper
    logger.info("Initializing Supabase helper")
    supabase = SupabaseHelper()
    
    # Save initial message to database
    logger.info(f"Saving initial message with msg_id: {msg_id}")
    try:
        message_data = {
            "msg_id": msg_id,
            "user_id": user_id,
            "message": "Starting colab processing",
            "chat_id": body.email_id,
            "email_id": body.email_id,
            "processed": False
        }
        supabase.client.table("messages").insert(message_data).execute()
        logger.info("Successfully saved initial message to database")
    except Exception as e:
        logger.error(f"Failed to save initial message: {e}")
        return JSONResponse(status_code=500, content={"detail": "Failed to initialize processing"})

    # Fetch email details for the user and given email_id
    logger.info(f"Fetching email with id: {body.email_id} for user: {user_id}")
    email_resp = supabase.client.table(
        "emails"
    ).select("*").eq("email_id", body.email_id).eq("user_id", user_id).execute()
    emails = email_resp.data
    if not emails:
        logger.warning(f"No email found with id: {body.email_id}")
        return JSONResponse(status_code=404, content={"detail": "Email not found"})
    email = emails[0]
    logger.info(f"Successfully fetched email: {email.get('subject', 'No subject')}")

    # Fetch user profile
    logger.info(f"Fetching profile for user_id: {user_id}")
    profile_resp = supabase.client.table("profiles").select(
        "email, min_budget, max_budget, content_niche, auto_generate_invoice, guidelines"
    ).eq("id", user_id).execute()
    profiles = profile_resp.data
    if not profiles:
        logger.warning("No profile found for user in start-process")
        return JSONResponse(status_code=404, content={"detail": "Profile not found"})
    profile = profiles[0]
    profile_dict = dict(profile) if profile else {}
    logger.info("Successfully fetched user profile")

    # Run PortiaHelper.start_colab_process with email text/context
    logger.info("Initializing Portia helper for start_colab_process")
    portia_helper = PortiaHelper()
    logger.info("Running start collaboration process task")
    
    # Use the updated method signature with user preferences
    result = portia_helper.run_start_colab_process(
        end_user=None,  # TODO: Replace with actual user object if needed
        email_data=email,
        user_preferences=profile_dict,
        msg_id=msg_id
    )

    logger.info(f"Portia helper returned result: {result}")
    _value: Optional[StartColabProcessResponse] = result.get("value")
    _summary = result.get("summary") or ""
    _status = "success"
    action_type = "final_start_colab_process"

    # Handle case where value is a string (fallback parsing)
    if isinstance(_value, str):
        logger.info("Value is string, attempting to parse JSON from markdown")
        try:
            # Try to extract JSON from markdown code blocks
            match = re.search(r"```json\s*([\s\S]*?)\s*```", _value.strip())
            if match:
                value_clean = match.group(1).strip()
                logger.info("Found JSON code block, extracted content")
            else:
                value_clean = _value.strip()
                logger.info("No JSON code block found, using raw value")
            
            # Parse the JSON string
            parsed_json = json.loads(value_clean)
            logger.info("Successfully parsed JSON from string value")
            _value = parsed_json  # Use the parsed JSON directly
        except Exception as e:
            logger.error(f"Failed to parse JSON from string value: {e}")
            _value = None

    if not _value:
        logger.warning("No valid collaboration analysis data found")
        _status = "error"
        action_type = "error"
        logger.warning("No valid collaboration analysis data found")
        _status = "error"
        action_type = "error"
        
        # Save error action to database
        logger.info("Saving error action to database")
        try:
            action_data = {
                "action_id": str(uuid.uuid4()),
                "msg_id": msg_id,
                "action_summary": "Initial collaboration analysis failed",
                "actor": "agent",
                "details": {"error": "No valid collaboration analysis data found", "status": _status},
                "action_type": action_type
            }
            supabase.client.table("actions").insert(action_data).execute()
            logger.info("Successfully saved error action to database")
        except Exception as e:
            logger.error(f"Failed to save error action: {e}")
        
        return JSONResponse(status_code=404, content={"detail": "No valid collaboration analysis data found", "status": _status})

    try:
        # Handle both structured response and parsed JSON
        if isinstance(_value, dict):
            # If it's already a dict (from fallback parsing), use it directly
            value_json = _value
            logger.info("Using parsed JSON dictionary directly")
        else:
            # If it's a structured response object, dump it
            value_json = _value.model_dump()
            logger.info("Successfully extracted structured collaboration analysis response")
        
        # Save successful action to database
        logger.info("Saving successful action to database")
        try:
            action_data = {
                "action_id": str(uuid.uuid4()),
                "msg_id": msg_id,
                "action_summary": "Initial collaboration analysis completed",
                "actor": "agent", 
                "details": value_json,
                "action_type": action_type
            }
            supabase.client.table("actions").insert(action_data).execute()
            logger.info("Successfully saved successful action to database")
        except Exception as e:
            logger.error(f"Failed to save successful action: {e}")
            
    except Exception as e:
        logger.error(f"Failed to extract structured response: {e}")
        _status = "error"
        action_type = "error"
        
        # Save error action to database
        logger.info("Saving error action to database")
        try:
            action_data = {
                "action_id": str(uuid.uuid4()),
                "msg_id": msg_id,
                "action_summary": "Initial collaboration analysis failed",
                "actor": "agent",
                "details": {"error": f"Failed to extract structured response: {e}", "status": _status},
                "action_type": action_type
            }
            supabase.client.table("actions").insert(action_data).execute()
            logger.info("Successfully saved error action to database")
        except Exception as e:
            logger.error(f"Failed to save error action: {e}")
            
        return JSONResponse(status_code=500, content={"detail": "Failed to process collaboration analysis", "status": _status})

    logger.info("Returning response from start-process endpoint")
    return JSONResponse(content={
        "value": value_json, 
        "summary": _summary, 
        "status": _status
    })
