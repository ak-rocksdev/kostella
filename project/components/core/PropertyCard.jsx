import React from 'react';
import { StatusBadge } from './Badge.jsx';
export function PropertyCard({ number, street, distances = [], priceFrom, status = 'available', count, photo, onClick, style }) {
  return <div onClick={onClick} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius-card)',
    overflow: 'hidden', cursor: onClick ? 'pointer' : 'default', fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-max)', ...style }}>
    <div style={{ position: 'relative', aspectRatio: '4/5', background: '#DDDBD4', overflow: 'hidden' }}>
      {photo ? <img src={photo} alt={`Kostella ${number}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 400ms ease-out' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', fontSize: 12 }}>foto 4:5</div>}
      <span style={{ position: 'absolute', left: 16, bottom: 8, fontFamily: 'var(--font-display)', fontStretch: '125%', fontWeight: 700,
        fontSize: 56, lineHeight: 0.85, letterSpacing: '-0.02em', color: '#fff', textShadow: '0 1px 6px rgba(22,23,26,0.35)' }}>{number}</span>
    </div>
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{street}</div>
      {distances.length > 0 && <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-soft)' }}>{distances.join(' · ')}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{priceFrom}</span>
        <StatusBadge status={status} count={count} />
      </div>
    </div>
  </div>;
}
