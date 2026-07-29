import React from 'react';
export function Button({ variant = 'primary', size = 'md', disabled, children, onClick, style }) {
  const base = {
    fontFamily: 'var(--font-body)', fontWeight: 600, border: '1px solid transparent',
    borderRadius: 'var(--radius-badge)', cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.45 : 1, transition: 'background 150ms ease, border-color 150ms ease',
    padding: size === 'lg' ? '14px 28px' : size === 'sm' ? '7px 14px' : '10px 20px',
    fontSize: size === 'lg' ? 16 : 14, lineHeight: 1.2,
  };
  const variants = {
    primary: { background: 'var(--plum)', color: '#fff' },
    secondary: { background: 'var(--paper)', color: 'var(--ink)', borderColor: 'var(--line)' },
    ghost: { background: 'transparent', color: 'var(--plum)' },
    inverse: { background: 'var(--stone)', color: 'var(--ink)' },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}
    onMouseEnter={e => { if (disabled) return; if (variant === 'primary') e.currentTarget.style.background = '#451325'; if (variant === 'secondary') e.currentTarget.style.borderColor = 'var(--ink-soft)'; if (variant === 'ghost') e.currentTarget.style.background = 'var(--plum-soft)'; }}
    onMouseLeave={e => { const v = variants[variant]; e.currentTarget.style.background = v.background; e.currentTarget.style.borderColor = v.borderColor || 'transparent'; }}>{children}</button>;
}
