# Supabase configuration for Notes Frontend

This app persists notes in Supabase when configured. It expects a table named public.notes with the following schema.

## Table schema

SQL to create the table:

create table if not exists public.notes (
  id uuid primary key,
  title text,
  content text,
  updated_at timestamp with time zone
);

-- Optional helpful index
create index if not exists notes_updated_at_idx on public.notes (updated_at desc);

## Row Level Security (RLS)

For quick testing you can disable RLS:

alter table public.notes disable row level security;

For production, enable RLS and add policies appropriate to your auth strategy.

## Migration steps

1) In Supabase SQL editor, run the SQL above to create the table and index.
2) If needed, disable RLS for testing (see above).
3) In your frontend environment, set:

- REACT_APP_SUPABASE_URL=your-project-url
- REACT_APP_SUPABASE_KEY=your-service-role-or-anon-key

We recommend using a service role key only in secure environments. For local demos you can use anon key with permissive policies.

Copy .env.example to .env and fill the values:

cp .env.example .env
# Edit .env with your values

## Notes

- The app reads only the columns: id, title, content, updated_at.
- The client library used: @supabase/supabase-js v2.
- When env vars are present and the library initializes successfully, the UI will show "Supabase".
- If initialization fails (e.g., missing library, invalid URL/key), the app falls back to local storage and shows "Local". An error banner explains the failure.

```sh
npm install @supabase/supabase-js
npm start
```
