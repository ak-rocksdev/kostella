import React from 'react';
export function ReceiptTable({ rows = [], total, note, style }) {
  const row = { display: 'flex', justifyContent: 'space-between', gap: 32, padding: '6px 0' };
  return <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, lineHeight: 1.6, color: 'var(--ink)', ...style }}>
    {rows.map((r, i) => <div key={i} style={row}>
      <span>{r.label}</span>
      <span style={{ textAlign: 'right', color: r.soft ? 'var(--ink-soft)' : 'var(--ink)' }}>{r.value}</span>
    </div>)}
    {total && <div style={{ ...row, borderTop: '1px solid var(--ink)', marginTop: 6, paddingTop: 10, fontWeight: 500 }}>
      <span>{total.label}</span><span>{total.value}</span>
    </div>}
    {note && <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-soft)', marginTop: 12 }}>{note}</div>}
  </div>;
}
