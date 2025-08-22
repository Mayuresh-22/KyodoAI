create table public.messages (
  msg_id uuid not null,
  user_id uuid not null,
  message text not null,
  chat_id text null,
  email_id text not null,
  processed boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint messages_pkey primary key (msg_id),
  constraint messages_email_id_fkey foreign KEY (email_id) references emails (email_id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_messages_created_at on public.messages using btree (created_at) TABLESPACE pg_default;
create index IF not exists idx_messages_processed on public.messages using btree (processed) TABLESPACE pg_default;
create index IF not exists idx_messages_chat_id on public.messages using btree (chat_id) TABLESPACE pg_default;
create index IF not exists idx_messages_email_id on public.messages using btree (email_id) TABLESPACE pg_default;
create index IF not exists idx_messages_user_id on public.messages using btree (user_id) TABLESPACE pg_default;