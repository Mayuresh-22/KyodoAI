create table public.emails (
  email_id text not null,
  from_name text null,
  from_email text null,
  subject text null,
  summary text null,
  received_at timestamp with time zone null,
  thread_link text null,
  labels text[] null default '{}'::text[],
  tags text[] null default '{}'::text[],
  relevance_score numeric(3, 2) null default 0,
  confidence numeric(3, 2) null default 0,
  first_received timestamp with time zone null,
  last_received timestamp with time zone null,
  ui_actions text[] null default '{start_colab_process}'::text[],
  notes text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  user_id uuid not null,
  constraint emails_pkey primary key (email_id)
) TABLESPACE pg_default;

create index IF not exists idx_emails_from_email on public.emails using btree (from_email) TABLESPACE pg_default;
create index IF not exists idx_emails_received_at on public.emails using btree (received_at) TABLESPACE pg_default;
create index IF not exists idx_emails_relevance on public.emails using btree (relevance_score) TABLESPACE pg_default;
create index IF not exists idx_emails_labels_gin on public.emails using gin (labels) TABLESPACE pg_default;
create index IF not exists idx_emails_tags_gin on public.emails using gin (tags) TABLESPACE pg_default;