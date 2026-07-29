import React from 'react';
export function MetricCard({ label, value, detail, style }) {
  return <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius-card)',
    padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--font-body)', ...style }}>
    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>{label}</span>
    <span style={{ fontFamily: 'var(--font-display)', fontStretch: '125%', fontWeight: 700, fontSize: 40, lineHeight: 1, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{value}</span>
    {detail && <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{detail}</span>}
  </div>;
}
export function ProofBar({ items = [], style }) {
  return <div style={{ display: 'flex', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', fontFamily: 'var(--font-body)', ...style }}>
    {items.map((it, i) => <div key={i} style={{ flex: 1, padding: '20px 24px', borderLeft: i ? '1px solid var(--line)' : 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontStretch: '125%', fontWeight: 700, fontSize: 32, lineHeight: 1, color: 'var(--ink)' }}>{it.value}</span>
      <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{it.label}</span>
    </div>)}
  </div>;
}
