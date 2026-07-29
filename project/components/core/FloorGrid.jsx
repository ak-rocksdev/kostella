import React from 'react';
const CELL_STYLES = {
  available: { border: '2px solid var(--available)', color: '#fff', background: 'var(--available)' },
  held: { border: '1px solid var(--held)', color: 'var(--held)', background: 'repeating-linear-gradient(45deg,#fff 0 4px,#F5E3D7 4px 8px)' },
  occupied: { border: '1px solid var(--line)', color: '#B7B5AF', background: '#E7E5E0' },
};
export function RoomCell({ room, status = 'occupied', type, price, selected, onClick, compact }) {
  const s = CELL_STYLES[status];
  return <button onClick={onClick} style={{
    fontFamily: 'var(--font-mono)', borderRadius: 0, cursor: onClick ? 'pointer' : 'default',
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
    padding: compact ? '8px 10px' : '12px 14px', minWidth: compact ? 64 : 108, textAlign: 'left',
    outline: selected ? '2px solid var(--plum)' : 'none', outlineOffset: 2, ...s }}>
    <span style={{ fontSize: 15, fontWeight: 500 }}>{room}</span>
    {!compact && type && <span style={{ fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500 }}>{type}</span>}
    {!compact && price && <span style={{ fontSize: 11 }}>{price}</span>}
  </button>;
}
export function FloorGrid({ floors, selectedRoom, onSelect, compact, animate }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {floors.map((f, fi) => <div key={f.label} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 20, alignItems: 'start' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', paddingTop: 12 }}>{f.label}</span>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {f.rooms.map((r, ri) => <div key={r.room} style={animate ? { animation: `kstCellIn 300ms ease-out both`, animationDelay: `${(fi * 4 + ri) * 40}ms` } : undefined}>
          <RoomCell {...r} compact={compact} selected={selectedRoom === r.room} onClick={onSelect ? () => onSelect(r) : undefined} />
        </div>)}
      </div>
    </div>)}
    {animate && <style>{`@keyframes kstCellIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>}
  </div>;
}
export function FloorGridLegend() {
  const item = { display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-soft)' };
  const sq = { width: 14, height: 14, display: 'inline-block' };
  return <div style={{ display: 'flex', gap: 24 }}>
    <span style={item}><span style={{ ...sq, ...CELL_STYLES.available }}></span>tersedia</span>
    <span style={item}><span style={{ ...sq, ...CELL_STYLES.held }}></span>dibooking</span>
    <span style={item}><span style={{ ...sq, ...CELL_STYLES.occupied }}></span>terisi</span>
  </div>;
}
