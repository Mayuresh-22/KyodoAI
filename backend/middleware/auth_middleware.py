
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from typing import Optional
from datetime import datetime

from supabase_auth import User
from helpers.supabase_helper import SupabaseHelper

class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.supabase_helper = SupabaseHelper()

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        auth_header = request.headers.get("Authorization")
        refresh_token = request.headers.get("X-Refresh-Token")
        if not auth_header:
            return JSONResponse(status_code=401, content={"detail": "Authorization header missing"})
        try:
            scheme, _, token = auth_header.partition(" ")
            if scheme.lower() != "bearer" or not token:
                raise ValueError("Invalid auth header format")
            user = self.verify_token(token)
            if not user:
                return JSONResponse(status_code=401, content={"detail": "Invalid or expired token", "refresh_token": refresh_token})
            request.state.user = user
        except Exception as e:
            return JSONResponse(status_code=401, content={"detail": f"Invalid token: {str(e)}"})
        return await call_next(request)

    def verify_token(self, jwt_token: str) -> Optional[User]:
        """
        Verify JWT token validity and return user information using Supabase SDK.
        Args:
            jwt_token (str): JWT token to verify
        Returns:
            dict: User information if token is valid
        """
        try:
            if not jwt_token:
                return None
            db_user = self.supabase_helper.client.auth.get_user(jwt_token)
            if not db_user or not db_user.user:
                return None
            # Check expiration
            exp = self.supabase_helper.client.auth._decode_jwt(jwt_token).get("exp")
            if exp:
                curr_epoch = int(datetime.now().timestamp())
                if exp < curr_epoch:
                    return None
            return db_user.user if db_user else None
        except Exception:
            return None
