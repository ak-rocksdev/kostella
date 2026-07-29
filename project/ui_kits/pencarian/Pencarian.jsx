const { Button, Chip, Badge, Eyebrow } = window.KostellaDesignSystem_f6d153;
const RESULTS = [
  { number: '362', street: 'Jl. Dr. Susilo 2 No. 362, Grogol', type: 'Khusus putri', fac: ['Kamar mandi dalam', 'AC', 'Wifi'], walk: '12 menit jalan kaki ke Trisakti', price: 'Rp1.650.000', avail: '3 dari 8 kamar kosong', status: 'available' },
  { number: '351', street: 'Jl. Dr. Susilo 2 No. 351, Grogol', type: 'Campur', fac: ['Kamar mandi dalam', 'AC', 'Dapur bersama'], walk: '14 menit jalan kaki ke Trisakti', price: 'Rp1.550.000', avail: '5 dari 12 kamar kosong', status: 'available' },
  { number: '360', street: 'Jl. Dr. Susilo 2 No. 360, Grogol', type: 'Khusus putri', fac: ['AC', 'Wifi', 'Laundry'], walk: '12 menit jalan kaki ke Trisakti', price: 'Rp1.650.000', avail: 'sisa 1 kamar', status: 'held' },
  { number: '2A3', street: 'Jl. Dr. Susilo 2A No. 3, Grogol', type: 'Campur', fac: ['Kamar mandi dalam', 'AC', 'Parkir motor'], walk: '10 menit jalan kaki ke Untar', price: 'Rp2.100.000', avail: 'penuh', status: 'occupied' },
];
const FILTERS = ['Putri', 'Campur', 'Kamar mandi dalam', 'AC', 'Bisa pasutri', '< Rp2 juta'];
function Header() {
  return <header style={{ borderBottom: '1px solid var(--line)', background: 'var(--paper)' }}>
    <div style={{ maxWidth: 1376, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 32, height: 64 }}>
      <a href="../beranda/index.html" style={{ fontWeight: 600, fontSize: 20, color: 'var(--ink)' }}>Kostella</a>
      <span style={{ font: '400 14px var(--font-body)', color: 'var(--ink-soft)' }}>Dekat <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Trisakti/Untar</strong> · urut jarak terdekat</span>
      <div style={{ marginLeft: 'auto' }}><Button variant="primary" size="sm">Jadwalkan survei</Button></div>
    </div>
  </header>;
}
function StatusLine({ r }) {
  const color = r.status === 'available' ? 'var(--available)' : r.status === 'held' ? 'var(--held)' : 'var(--ink-soft)';
  return <span style={{ font: '500 13px var(--font-mono)', color }}>{r.avail}</span>;
}
function ResultCard({ r, active, onClick }) {
  return <div onClick={onClick} style={{ display: 'flex', gap: 20, background: 'var(--paper)', border: active ? '1px solid var(--ink)' : '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', boxShadow: 'var(--shadow-max)' }}>
    <div style={{ width: 220, aspectRatio: '4/3', background: '#DDDBD4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)', fontSize: 12, flexShrink: 0 }}>foto 4:3</div>
    <div style={{ padding: '16px 20px 16px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontStretch: '125%', fontWeight: 700, fontSize: 32, lineHeight: 1 }}>{r.number}</span>
        <Badge tone="plum">{r.type}</Badge>
      </div>
      <div style={{ font: '400 14px var(--font-body)', color: 'var(--ink-soft)' }}>{r.street}</div>
      <div style={{ font: '400 13px var(--font-body)', color: 'var(--ink-soft)' }}>{r.fac.join(' · ')} · {r.walk}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'auto' }}>
        <span style={{ font: '500 16px var(--font-mono)' }}>{r.price} <span style={{ color: 'var(--ink-soft)', fontSize: 13 }}>/bulan</span></span>
        <StatusLine r={r} />
      </div>
    </div>
  </div>;
}
function MapPanel({ active }) {
  const pins = [{ n: '362', x: 38, y: 42 }, { n: '351', x: 52, y: 58 }, { n: '360', x: 44, y: 38 }, { n: '2A3', x: 62, y: 30 }];
  const pois = [{ l: 'Trisakti', x: 22, y: 68 }, { l: 'Untar', x: 74, y: 18 }, { l: 'Central Park', x: 70, y: 72 }, { l: 'Terminal Grogol', x: 30, y: 30 }];
  return <div style={{ position: 'sticky', top: 24, height: 'calc(100vh - 160px)', minHeight: 480, background: '#E4E2DB', borderRadius: 12, border: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)', backgroundSize: '64px 64px', opacity: 0.5 }}></div>
    {pois.map(p => <span key={p.l} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, font: '500 11px var(--font-body)', color: 'var(--ink-soft)', letterSpacing: '0.04em' }}>{p.l}</span>)}
    {pins.map(p => <span key={p.n} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)', background: active === p.n ? 'var(--plum)' : 'var(--ink)', color: '#fff', font: '500 13px var(--font-mono)', padding: '4px 8px', borderRadius: 4 }}>{p.n}</span>)}
    <span style={{ position: 'absolute', left: 16, bottom: 12, font: '400 11px var(--font-body)', color: 'var(--ink-soft)' }}>Grogol, Jakarta Barat — peta konsep</span>
  </div>;
}
function EmptyState() {
  return <div style={{ background: 'var(--paper)', border: '1px dashed var(--line)', borderRadius: 12, padding: '32px 24px', textAlign: 'center' }}>
    <p style={{ font: '600 16px var(--font-body)', margin: 0 }}>Belum ada kamar kosong di Setiabudi.</p>
    <p style={{ font: '400 14px/1.6 var(--font-body)', color: 'var(--ink-soft)', margin: '8px 0 16px' }}>Yang terdekat ada di Kebayoran, 15 menit.</p>
    <Button variant="secondary" size="sm">Lihat Kebayoran</Button>
  </div>;
}
function App() {
  const [filters, setFilters] = React.useState(['Putri']);
  const [active, setActive] = React.useState('362');
  const toggle = f => setFilters(v => v.includes(f) ? v.filter(x => x !== f) : [...v, f]);
  return <div>
    <Header />
    <div style={{ maxWidth: 1376, margin: '0 auto', padding: '24px 32px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {FILTERS.map(f => <Chip key={f} selected={filters.includes(f)} onClick={() => toggle(f)}>{f}</Chip>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Eyebrow>4 properti · Grogol</Eyebrow>
          {RESULTS.map(r => <ResultCard key={r.number} r={r} active={active === r.number} onClick={() => { setActive(r.number); if (r.number === '362') location.href = '../detail/index.html'; }} />)}
          <EmptyState />
        </div>
        <MapPanel active={active} />
      </div>
    </div>
  </div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
