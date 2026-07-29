import React from 'react';
export function Chip({ selected, children, onClick, style }) {
  return <button onClick={onClick} style={{
    fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, lineHeight: 1.2,
    padding: '8px 16px', borderRadius: 999, cursor: 'pointer',
    background: selected ? 'var(--ink)' : 'var(--paper)',
    color: selected ? 'var(--stone)' : 'var(--ink)',
    border: selected ? '1px solid var(--ink)' : '1px solid var(--line)',
    transition: 'border-color 150ms ease', ...style }}
    onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--ink-soft)'; }}
    onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--line)'; }}>{children}</button>;
}
