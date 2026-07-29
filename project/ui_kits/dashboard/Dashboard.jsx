const { Button, Badge, Eyebrow, FloorGrid, FloorGridLegend, MetricCard } = window.KostellaDesignSystem_f6d153;
const FLOORS = [
  { label: 'Lantai 3', rooms: [{ room: '304', status: 'occupied' }] },
  { label: 'Lantai 2', rooms: [{ room: '205', status: 'held' }, { room: '208', status: 'occupied' }, { room: '211', status: 'available' }, { room: '212', status: 'occupied' }] },
  { label: 'Lantai 1', rooms: [{ room: '101', status: 'occupied' }, { room: '105', status: 'available' }, { room: '107', status: 'occupied' }] },
];
const BILLS = [
  ['205', 'Sari W.', '16 Jul', 'terlambat', 'Rp 50.000'],
  ['208', 'Dina P.', '1 Agu', 'belum dibayar', '—'],
  ['212', 'Maya K.', '1 Agu', 'belum dibayar', '—'],
  ['304', 'Rina S.', '5 Jul', 'lunas', '—'],
  ['101', 'Ayu L.', '3 Jul', 'lunas', '—'],
];
const SURVEYS = [['10.00', 'Nadia Putri', '0812 3456 7890'], ['13.30', 'Ibu Hartono (orang tua)', '0813 9876 5432'], ['16.00', 'Tasya A.', '0857 1122 3344']];
function Header() {
  return <header style={{ background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
    <div style={{ maxWidth: 1376, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 24, height: 64 }}>
      <span style={{ fontWeight: 600, fontSize: 18 }}>Kostella <span style={{ color: 'var(--ink-soft)', fontWeight: 500 }}>Pengelola</span></span>
      <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--stone)', border: '1px solid var(--line)', borderRadius: 4, padding: '8px 14px', font: '500 15px var(--font-mono)', cursor: 'pointer', color: 'var(--ink)' }}>362 <span style={{ fontSize: 10 }}>▾</span></button>
      <span style={{ marginLeft: 'auto', font: '400 14px var(--font-body)', color: 'var(--ink-soft)' }}>Rabu, 29 Juli 2026</span>
    </div>
  </header>;
}
function StatusText({ s }) {
  const map = { terlambat: 'var(--held)', 'belum dibayar': 'var(--ink)', lunas: 'var(--available)' };
  return <span style={{ color: map[s] || 'var(--ink)', fontWeight: 500 }}>{s}</span>;
}
function Bills() {
  const th = { font: '600 11px var(--font-body)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', textAlign: 'left', padding: '10px 16px', borderBottom: '1px solid var(--line)' };
  const td = { font: '400 14px var(--font-mono)', padding: '12px 16px', borderBottom: '1px solid var(--line)' };
  return <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr>{['Kamar', 'Penghuni', 'Jatuh tempo', 'Status', 'Denda'].map((h, i) => <th key={h} style={{ ...th, textAlign: i >= 2 ? 'right' : 'left' }}>{h}</th>)}</tr></thead>
      <tbody>{BILLS.map(b => <tr key={b[0]}>
        <td style={{ ...td, fontWeight: 500 }}>{b[0]}</td>
        <td style={{ ...td, fontFamily: 'var(--font-body)' }}>{b[1]}</td>
        <td style={{ ...td, textAlign: 'right' }}>{b[2]}</td>
        <td style={{ ...td, textAlign: 'right', fontFamily: 'var(--font-body)', fontSize: 13 }}><StatusText s={b[3]} /></td>
        <td style={{ ...td, textAlign: 'right' }}>{b[4]}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}
function App() {
  const [room, setRoom] = React.useState('211');
  return <div>
    <Header />
    <div style={{ maxWidth: 1376, margin: '0 auto', padding: '24px 32px 64px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <MetricCard label="Okupansi" value="8/11" detail="2 kamar kosong, 1 dibooking" />
        <MetricCard label="Pendapatan bulan berjalan" value="Rp 14,2 jt" detail="dari Rp 18,9 jt target" />
        <MetricCard label="Tagihan belum dibayar" value="3" detail="1 terlambat, denda Rp 50.000" />
        <MetricCard label="Survei terjadwal" value="3" detail="hari ini" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <Eyebrow>Kisi lantai — sama dengan halaman publik</Eyebrow><FloorGridLegend />
          </div>
          <FloorGrid compact floors={FLOORS} selectedRoom={room} onSelect={r => setRoom(r.room)} />
          <div style={{ display: 'flex', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)', alignItems: 'center' }}>
            <span style={{ font: '500 14px var(--font-mono)', marginRight: 8 }}>Kamar {room}</span>
            <Button variant="secondary" size="sm">Tandai terisi</Button>
            <Button variant="secondary" size="sm">Atur harga</Button>
            <Button variant="ghost" size="sm">Blokir untuk perbaikan</Button>
          </div>
        </div>
        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
          <Eyebrow style={{ marginBottom: 16 }}>Survei hari ini</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {SURVEYS.map((s, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderTop: i ? '1px solid var(--line)' : 'none' }}>
              <span style={{ font: '500 15px var(--font-mono)', minWidth: 48 }}>{s[0]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ font: '500 14px var(--font-body)' }}>{s[1]}</div>
                <div style={{ font: '400 12px var(--font-mono)', color: 'var(--ink-soft)' }}>{s[2]}</div>
              </div>
              <Button variant="secondary" size="sm">Konfirmasi</Button>
            </div>)}
          </div>
        </div>
      </div>
      <div>
        <Eyebrow style={{ marginBottom: 12 }}>Tagihan</Eyebrow>
        <Bills />
      </div>
    </div>
  </div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
