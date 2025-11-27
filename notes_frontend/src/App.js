import React, { useMemo, useState } from 'react';
import './App.css';
import './styles/theme.css';
import { NotesProvider, useNotes } from './context/NotesContext';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import Header from './components/Header';

// PUBLIC_INTERFACE
function AppShell() {
  const { notes, selectedId, selectNote, createNote, updateNote, deleteNote, loading, error, isSupabase } = useNotes();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(n =>
      (n.title || '').toLowerCase().includes(query) ||
      (n.content || '').toLowerCase().includes(query)
    );
  }, [notes, q]);

  const selected = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  return (
    <div className="app-shell">
      <Sidebar
        onNew={createNote}
        onSearch={setQ}
      />
      <main className="main">
        <Header isSupabase={isSupabase} />
        <section className="notes-area">
          <div>
            <NotesList
              notes={filtered}
              selectedId={selectedId}
              onSelect={selectNote}
              emptyText={loading ? 'Loading...' : 'No notes yet. Click "New" to create one.'}
            />
            {error && (
              <div style={{
                marginTop: 12,
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#7F1D1D',
                padding: '10px 12px',
                borderRadius: 8
              }} role="alert">
                {isSupabase
                  ? `Supabase error: ${error}. Falling back to localStorage is automatic only when env vars are not set.`
                  : `Storage error: ${error}`}
              </div>
            )}
          </div>
          <NoteEditor
            note={selected}
            onChange={(patch) => selected && updateNote(selected.id, patch)}
            onDelete={() => selected && deleteNote(selected.id)}
          />
        </section>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <NotesProvider>
      <AppShell />
    </NotesProvider>
  );
}

export default App;
