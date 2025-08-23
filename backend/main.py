from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv(override=True)

app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
    swagger_ui_oauth2_redirect_url=None
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/search-emails")
def search_emails():
    # Code to search emails
    
    return {"status": "Email search initiated"}