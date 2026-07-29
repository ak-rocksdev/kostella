import React from 'react';
export function Badge({ tone = 'plum', children, style }) {
  const tones = {
    plum: { background: 'var(--plum-soft)', color: 'var(--plum)' },
    neutral: { background: 'var(--stone)', color: 'var(--ink-soft)' },
    available: { background: 'var(--available)', color: '#fff' },
    held: { background: '#F5E3D7', color: 'var(--held)' },
    occupied: { background: '#E7E5E0', color: 'var(--ink-soft)' },
  };
  return <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, lineHeight: 1.4,
    padding: '4px 10px', borderRadius: 'var(--radius-badge)', display: 'inline-block', whiteSpace: 'nowrap', ...tones[tone], ...style }}>{children}</span>;
}
export function StatusBadge({ status, count }) {
  const map = {
    available: { tone: 'available', label: count != null ? `${count} kosong` : 'Ada kamar' },
    held: { tone: 'held', label: 'Sisa 1' },
    occupied: { tone: 'occupied', label: 'Penuh' },
  };
  const m = map[status] || map.available;
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
