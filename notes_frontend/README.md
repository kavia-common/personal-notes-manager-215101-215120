# Notes Frontend (Ocean Professional)

A modern single-page React UI for creating, editing, listing, searching and deleting notes. It uses Supabase if configured, otherwise falls back to localStorage so it works out-of-the-box.

## Features
- Create, edit (title + markdown/plain), delete notes
- List and search notes with debounce
- Optimistic UI updates
- Supabase persistence when configured; localStorage fallback when not
- Ocean Professional theme with blue & amber accents
- Accessible keyboard focus and search shortcut (Ctrl/⌘ + K)
- Optional Markdown preview toggle in editor

## Getting Started

Install dependencies:
```
npm install
```

Run locally:
```
npm start
```
App runs at http://localhost:3000.

## Persistence options

By default, the app uses localStorage. To enable Supabase (optional):

1) Create table `notes` (see also SUPABASE.md):
```
create table if not exists public.notes (
  id uuid primary key,
  title text,
  content text,
  updated_at timestamp with time zone
);

create index if not exists notes_updated_at_idx on public.notes (updated_at desc);
```

RLS: For demos you can disable RLS:
```
alter table public.notes disable row level security;
```
For production, enable RLS and set policies to your needs.

2) Add environment variables (see .env.example):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

If you plan to use Supabase in this project, install the client library:
```
npm install @supabase/supabase-js
```

Create a `.env` file (or copy example):
```
cp .env.example .env
# then edit .env
REACT_APP_SUPABASE_URL=your-url
REACT_APP_SUPABASE_KEY=your-key
```

Behavior:
- When Supabase is properly initialized, the UI shows a "Supabase" badge.
- If env vars are present but initialization fails (e.g., wrong URL/key, missing library), the app falls back to localStorage for reliability and the UI shows "Local", along with an error banner describing the failure.

## Styling

Theme tokens and component styles live in `src/styles/theme.css` and are applied across Sidebar, NotesList, and NoteEditor to achieve the Ocean Professional look.

## Project structure
- src/services/NotesService.js: Storage abstraction (Supabase or localStorage)
- src/context/NotesContext.js: Global state + optimistic CRUD
- src/components/*: UI components
- src/utils/debounce.js: Small utility for debounced search
- src/App.js: Main layout (sidebar + main content)

## Environment variables
See `.env.example` for optional variables: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY and other common app vars.

## Accessibility
- Keyboard navigation for list and actions
- Search shortcut: Ctrl/⌘ + K
- Focus-visible ring and ARIA roles/labels for primary regions

## Notes
- When using Supabase, ensure Row Level Security (RLS) rules fit your use case, or disable RLS for demo/testing.
- The app does not manage Supabase auth; it writes notes anonymously with the provided service key.
