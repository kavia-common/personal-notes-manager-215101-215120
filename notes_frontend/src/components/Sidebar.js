import React, { useEffect, useRef } from 'react';
import '../styles/theme.css';
import { debounce } from '../utils/debounce';

/**
 * PUBLIC_INTERFACE
 * Sidebar provides brand, search, and global actions
 */
export default function Sidebar({ onNew, onSearch }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const onSearchDebounced = debounce((e) => onSearch?.(e.target.value), 200);

  return (
    <aside className="sidebar" role="complementary" aria-label="Sidebar">
      <div className="brand" aria-label="Brand">
        <div className="dot" aria-hidden="true" />
        <div className="title">Ocean Notes</div>
      </div>

      <div className="search">
        <span className="icon" aria-hidden="true">🔎</span>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search notes..."
          aria-label="Search notes"
          onChange={onSearchDebounced}
        />
      </div>

      <div className="sidebar-actions">
        <button className="btn" onClick={onNew} aria-label="Create new note">+ New</button>
      </div>
    </aside>
  );
}
