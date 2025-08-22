import os
from typing import Optional
from dotenv import load_dotenv
from supabase import Client, create_client


class SupabaseHelper:
    """Simple Supabase helper that only initializes the Supabase client.

    The helper intentionally contains only a constructor. Add methods on-demand
    in the calling code or request specific helpers to be added.
    """

    def __init__(
        self,
        url: Optional[str] = None,
        key: Optional[str] = None
    ) -> None:
        """Initialize the Supabase client.

        Args:
            url: Supabase URL (falls back to SUPABASE_URL env var)
            key: Supabase anon/service key (falls back to SUPABASE_KEY env var)

        Raises:
            ValueError: If url or key are not provided or found in environment.
        """
        load_dotenv(override=False)

        self.url = url or os.getenv("SUPABASE_URL")
        self.key = key or os.getenv("SUPABASE_KEY")
        if not self.url or not self.key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in env or passed to SupabaseHelper")

        self.client: Client = create_client(self.url, self.key)

