create table public.actions (
  action_id uuid not null,
  msg_id uuid not null,
  action_summary text not null,
  actor text null default 'agent'::text,
  details jsonb null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint actions_pkey primary key (action_id),
  constraint actions_msg_id_fkey foreign KEY (msg_id) references messages (msg_id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_actions_msg_id on public.actions using btree (msg_id) TABLESPACE pg_default;