import React from 'react';
export function Eyebrow({ children, inverse, style }) {
  return <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, lineHeight: 1.4,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: inverse ? '#9A9892' : 'var(--ink-soft)', display: 'block', ...style }}>{children}</span>;
}
