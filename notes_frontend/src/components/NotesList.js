import React from 'react';
import '../styles/theme.css';
import { clsx } from '../utils/clsx';

/**
 * PUBLIC_INTERFACE
 * NotesList renders a list of notes and highlights the selected one
 */
export default function NotesList({ notes, selectedId, onSelect, emptyText = 'No notes yet.' }) {
  return (
    <div className="notes-list" role="navigation" aria-label="Notes list">
      <div className="notes-list-header">Your Notes</div>
      <div role="list" aria-label="Notes">
        {notes.length === 0 && (
          <div className="empty-state">{emptyText}</div>
        )}
        {notes.map((n) => (
          <div
            key={n.id}
            role="listitem"
            tabIndex={0}
            className={clsx('note-item', selectedId === n.id && 'active')}
            onClick={() => onSelect?.(n.id)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelect?.(n.id); }}
            aria-current={selectedId === n.id ? 'true' : 'false'}
          >
            <div className="note-title">{n.title || 'Untitled'}</div>
            <div className="note-snippet">{(n.content || '').replace(/\n/g, ' ').slice(0, 80)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
