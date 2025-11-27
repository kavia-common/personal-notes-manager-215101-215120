import React from 'react';
import '../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Header component shows title and status badge for persistence mode
 */
export default function Header({ isSupabase }) {
  return (
    <div className="topbar" role="banner" aria-label="Application header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <strong>Personal Notes</strong>
        <span
          title={isSupabase ? 'Using Supabase persistence' : 'Using localStorage persistence'}
          style={{
            fontSize: 12,
            padding: '4px 8px',
            borderRadius: 999,
            background: isSupabase ? 'rgba(37,99,235,0.1)' : 'rgba(245,158,11,0.1)',
            color: isSupabase ? '#1e40af' : '#92400e',
            border: `1px solid ${isSupabase ? '#bfdbfe' : '#fde68a'}`
          }}
          aria-live="polite"
        >
          {isSupabase ? 'Supabase' : 'Local'}
        </span>
      </div>
      <div style={{ color: '#6b7280', fontSize: 12 }}>
        Tip: Press <span className="kbd">Ctrl/⌘ + K</span> to focus search
      </div>
    </div>
  );
}
