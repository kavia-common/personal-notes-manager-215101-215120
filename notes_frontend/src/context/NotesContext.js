import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getNotesService } from '../services/NotesService';

const NotesContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useNotes exposes notes state, CRUD methods and UI helpers.
 */
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}

/**
 * PUBLIC_INTERFACE
 * NotesProvider loads notes and provides optimistic CRUD operations
 */
export function NotesProvider({ children }) {
  const service = useMemo(() => getNotesService(), []);
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const isSupabase = Boolean(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_KEY);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    service.list()
      .then(data => {
        if (!mounted) return;
        setNotes(data);
        if (data.length) setSelectedId(data[0].id);
      })
      .catch(e => { if (mounted) setErr(e.message || String(e)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [service]);

  const selectNote = (id) => setSelectedId(id);

  const createNote = async () => {
    const optimistic = { id: `opt-${Date.now()}`, title: 'Untitled', content: '', updated_at: new Date().toISOString() };
    setNotes(prev => [optimistic, ...prev]);
    setSelectedId(optimistic.id);
    try {
      const created = await service.create({ title: 'Untitled', content: '' });
      setNotes(prev => prev.map(n => n.id === optimistic.id ? created : n));
      setSelectedId(created.id);
      return created;
    } catch (e) {
      setNotes(prev => prev.filter(n => n.id !== optimistic.id));
      setErr(e.message || String(e));
      throw e;
    }
  };

  const updateNote = async (id, patch) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...patch, updated_at: new Date().toISOString() } : n));
    try {
      const updated = await service.update(id, patch);
      setNotes(prev => prev.map(n => n.id === id ? updated : n));
      return updated;
    } catch (e) {
      setErr(e.message || String(e));
      // No automatic rollback; user still sees optimistic changes; refresh is manual
      return null;
    }
  };

  const deleteNote = async (id) => {
    const previous = notes;
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedId === id) setSelectedId(prev => (previous.find(n => n.id !== id)?.id || null));
    try {
      await service.remove(id);
    } catch (e) {
      setErr(e.message || String(e));
      setNotes(previous); // rollback on failure
    }
  };

  const value = {
    notes,
    selectedId,
    loading,
    error: err,
    isSupabase,
    selectNote,
    createNote,
    updateNote,
    deleteNote,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
