import React, { useEffect, useMemo, useState } from 'react';
import '../styles/theme.css';
import { renderMarkdown } from '../utils/markdown';

/**
 * PUBLIC_INTERFACE
 * NoteEditor allows editing note title/content with optional markdown preview
 */
export default function NoteEditor({ note, onChange, onDelete }) {
  const [local, setLocal] = useState({ title: note?.title || '', content: note?.content || '' });
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setLocal({ title: note?.title || '', content: note?.content || '' });
  }, [note?.id]);

  useEffect(() => {
    const h = setTimeout(() => onChange?.(local), 250);
    return () => clearTimeout(h);
  }, [local]); // eslint-disable-line react-hooks/exhaustive-deps

  const html = useMemo(() => {
    return renderMarkdown(local.content || '');
  }, [local.content]);

  if (!note) {
    return (
      <div className="editor">
        <div className="empty-state">
          Select or create a note to begin.
        </div>
      </div>
    );
  }

  return (
    <div className="editor" role="region" aria-label="Note editor">
      <div className="editor-header">
        <input
          className="editor-title"
          placeholder="Note title"
          aria-label="Note title"
          value={local.title}
          onChange={(e) => setLocal(prev => ({ ...prev, title: e.target.value }))}
        />
        <button className="btn danger" onClick={() => onDelete?.()} aria-label="Delete note">Delete</button>
      </div>
      <div className="editor-toolbar">
        <div className="toggle" role="tablist" aria-label="Editor mode">
          <button
            role="tab"
            className={preview ? '' : 'active'}
            aria-selected={!preview}
            onClick={() => setPreview(false)}
          >
            Edit
          </button>
          <button
            role="tab"
            className={preview ? 'active' : ''}
            aria-selected={preview}
            onClick={() => setPreview(true)}
          >
            Preview
          </button>
        </div>
      </div>
      {!preview ? (
        <textarea
          className="editor-textarea"
          placeholder="Write your note in plain text or Markdown..."
          aria-label="Note content"
          value={local.content}
          onChange={(e) => setLocal(prev => ({ ...prev, content: e.target.value }))}
        />
      ) : (
        <div
          className="preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}
