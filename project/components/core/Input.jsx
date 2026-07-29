import React from 'react';
export function Input({ label, value, placeholder, onChange, style }) {
  return <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', ...style }}>
    {label && <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>{label}</span>}
    <input value={value} placeholder={placeholder} onChange={onChange ? e => onChange(e.target.value) : undefined}
      style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', background: 'var(--paper)',
        border: '1px solid var(--line)', borderRadius: 'var(--radius-badge)', padding: '10px 12px', outline: 'none' }}
      onFocus={e => { e.currentTarget.style.borderColor = 'var(--plum)'; }}
      onBlur={e => { e.currentTarget.style.borderColor = 'var(--line)'; }} />
  </label>;
}
