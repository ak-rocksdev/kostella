const { Button, Badge, Eyebrow, FloorGrid, FloorGridLegend, ReceiptTable } = window.KostellaDesignSystem_f6d153;
const A = '../../assets/';
const PHOTOS = [
  { src: A + 'DHP00714-large.jpg', label: 'Kamar Superior' },
  { src: A + 'Cove-Arleyta_Deluxe-Queen-1-large.jpg', label: 'Kamar Standard' },
  { src: A + 'Cove-Arleyta_Deluxe-Queen-Bathroom-large.jpg', label: 'Kamar mandi dalam' },
  { src: A + 'DHP00456-large.jpg', label: 'Ruang bersama' },
  { src: A + 'WhatsApp-Image-2022-10-11-at-13.53.44-rotated-e1669953526877.jpeg', label: 'Tampak depan' },
];
const ROOMS = {
  '101': { type: 'Standard', price: 'Rp1.650.000', status: 'occupied', photo: 1 },
  '105': { type: 'Standard', price: 'Rp1.650.000', status: 'available', size: '3×4 m', avail: 'kosong hari ini', photo: 1 },
  '107': { type: 'Standard', price: 'Rp1.650.000', status: 'occupied', photo: 1 },
  '205': { type: 'Superior', price: 'Rp1.950.000', status: 'held', photo: 0 },
  '208': { type: 'Superior', price: 'Rp1.950.000', status: 'occupied', photo: 0 },
  '211': { type: 'Standard', price: 'Rp1.650.000', status: 'available', size: '3×4 m', avail: 'kosong 1 Agustus', photo: 0 },
  '212': { type: 'Superior', price: 'Rp1.950.000', status: 'occupied', photo: 0 },
  '304': { type: 'Pojok', price: 'Rp2.100.000', status: 'occupied', photo: 0 },
};
const FLOORS = [
  { label: 'Lantai 3', rooms: ['304'] },
  { label: 'Lantai 2', rooms: ['205', '208', '211', '212'] },
  { label: 'Lantai 1', rooms: ['101', '105', '107'] },
].map(f => ({ label: f.label, rooms: f.rooms.map(r => ({ room: r, type: ROOMS[r].type, price: ROOMS[r].price, status: ROOMS[r].status })) }));
const wrap = { maxWidth: 1200, margin: '0 auto', padding: '0 32px' };
function Header() {
  return <header style={{ borderBottom: '1px solid var(--line)', background: 'var(--stone)', position: 'sticky', top: 0, zIndex: 20 }}>
    <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
      <a href="../beranda/index.html" style={{ fontWeight: 600, fontSize: 20, color: 'var(--ink)' }}>Kostella</a>
      <a href="../pencarian/index.html" style={{ font: '500 14px var(--font-body)' }}>← Hasil pencarian</a>
    </div>
  </header>;
}
function HeroGallery() {
  const [active, setActive] = React.useState(0);
  const next1 = PHOTOS[(active + 1) % PHOTOS.length], next2 = PHOTOS[(active + 2) % PHOTOS.length];
  const thumbBtn = { position: 'relative', border: 'none', padding: 0, cursor: 'pointer', borderRadius: 12, overflow: 'hidden', background: '#DDDBD4', flex: 1 };
  return <section style={{ ...wrap, paddingTop: 24 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, height: 480 }}>
      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#DDDBD4' }}>
        <img src={PHOTOS[active].src} alt={PHOTOS[active].label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(22,23,26,0) 55%, rgba(22,23,26,0.45) 100%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', left: 28, bottom: 16, display: 'flex', alignItems: 'baseline', gap: 20, pointerEvents: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontStretch: '125%', fontWeight: 700, fontSize: 110, lineHeight: 0.85, letterSpacing: '-0.02em', color: '#fff', textShadow: '0 2px 16px rgba(22,23,26,0.35)' }}>362</span>
          <span style={{ font: '500 14px var(--font-body)', color: '#fff', textShadow: '0 1px 6px rgba(22,23,26,0.5)' }}>{PHOTOS[active].label} · {active + 1}/{PHOTOS.length}</span>
        </div>
        <span style={{ position: 'absolute', left: 28, top: 20, background: 'var(--plum)', color: '#fff', font: '600 12px var(--font-body)', padding: '5px 12px', borderRadius: 4 }}>Khusus putri</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button style={thumbBtn} onClick={() => setActive((active + 1) % PHOTOS.length)}>
          <img src={next1.src} alt={next1.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </button>
        <button style={thumbBtn} onClick={() => setActive((active + 2) % PHOTOS.length)}>
          <img src={next2.src} alt={next2.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <span style={{ position: 'absolute', right: 12, bottom: 12, background: 'rgba(22,23,26,0.72)', color: '#fff', font: '500 12px var(--font-body)', padding: '6px 12px', borderRadius: 4 }}>Lihat semua foto</span>
        </button>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '20px 4px 0' }}>
      <h1 style={{ font: '600 21px/1.3 var(--font-body)', margin: 0 }}>Jl. Dr. Susilo 2 No. 362, Grogol, Jakarta Barat</h1>
      <span style={{ font: '400 14px/1.6 var(--font-body)', color: 'var(--ink-soft)' }}>Trisakti 1 km · Terminal Grogol 0,2 km · Central Park 0,2 km</span>
      <div style={{ marginLeft: 'auto' }}><Button variant="primary" size="sm">Jadwalkan survei</Button></div>
    </div>
  </section>;
}
function RoomPanel({ room }) {
  const r = ROOMS[room];
  const canBook = r.status === 'available';
  const [img, setImg] = React.useState(null);
  React.useEffect(() => { setImg(null); }, [room]);
  const shown = img == null ? r.photo : img;
  return <aside style={{ position: 'sticky', top: 88, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, boxShadow: 'var(--shadow-max)', overflow: 'hidden' }}>
    <div style={{ aspectRatio: '3/2', background: '#DDDBD4' }}>
      <img src={PHOTOS[shown].src} alt={PHOTOS[shown].label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
    <div style={{ display: 'flex', gap: 6, padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>
      {[0, 1, 2, 3].map(i => <button key={i} onClick={() => setImg(i)} style={{ flex: 1, aspectRatio: '1', padding: 0, border: 'none', cursor: 'pointer', borderRadius: 4, overflow: 'hidden', outline: shown === i ? '2px solid var(--plum)' : 'none', outlineOffset: 1 }}>
        <img src={PHOTOS[i].src} alt={PHOTOS[i].label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </button>)}
    </div>
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ font: '500 15px var(--font-mono)' }}>Kamar {room} · {r.type}</span>
        <span style={{ font: '500 13px var(--font-mono)', color: canBook ? 'var(--available)' : r.status === 'held' ? 'var(--held)' : 'var(--ink-soft)' }}>{r.avail || (r.status === 'held' ? 'dibooking' : 'terisi')}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 32, margin: '8px 0 4px' }}>{r.price}<span style={{ fontSize: 14, color: 'var(--ink-soft)' }}> /bulan</span></div>
      <div style={{ font: '400 13px/1.6 var(--font-body)', color: 'var(--ink-soft)' }}>{r.size || '3×4 m'} · AC · kamar mandi dalam · kasur 120 · meja &amp; lemari</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
        <Button variant="primary" size="lg" disabled={!canBook}>Jadwalkan survei</Button>
        <Button variant="secondary" disabled={!canBook}>Ajukan sewa</Button>
      </div>
    </div>
  </aside>;
}
function Sekitar() {
  const pois = [{ l: 'Trisakti', x: 18, y: 64 }, { l: 'Untar', x: 78, y: 22 }, { l: 'Terminal Grogol', x: 34, y: 28 }, { l: 'Central Park', x: 66, y: 70 }, { l: 'Indomaret', x: 48, y: 62 }, { l: 'RS Royal Taruma', x: 70, y: 44 }, { l: 'BCA', x: 28, y: 46 }];
  return <div style={{ position: 'relative', height: 320, background: '#E4E2DB', borderRadius: 12, border: '1px solid var(--line)', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)', backgroundSize: '64px 64px', opacity: 0.5 }}></div>
    <div style={{ position: 'absolute', left: '50%', top: '50%', width: 260, height: 260, transform: 'translate(-50%,-50%)', border: '1px dashed var(--ink-soft)', borderRadius: '50%' }}></div>
    <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: 'var(--plum)', color: '#fff', font: '500 14px var(--font-mono)', padding: '5px 10px', borderRadius: 4 }}>362</span>
    {pois.map(p => <span key={p.l} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, font: '500 12px var(--font-body)', color: 'var(--ink)', background: 'rgba(255,255,255,0.8)', padding: '2px 6px', borderRadius: 4 }}>{p.l}</span>)}
    <span style={{ position: 'absolute', left: 16, bottom: 12, font: '400 11px var(--font-body)', color: 'var(--ink-soft)' }}>radius 10 menit jalan kaki — peta konsep</span>
  </div>;
}
function App() {
  const [room, setRoom] = React.useState('105');
  return <div>
    <Header /><HeroGallery />
    <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48, alignItems: 'start', padding: '48px 32px 96px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <Eyebrow>Semua kamar · pilih untuk lihat detail</Eyebrow><FloorGridLegend />
          </div>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 32 }}>
            <FloorGrid floors={FLOORS} selectedRoom={room} onSelect={r => setRoom(r.room)} animate />
          </div>
        </section>
        <section>
          <Eyebrow>Rincian biaya — kamar {room}</Eyebrow>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 32, marginTop: 16, borderTop: '3px solid var(--plum)' }}>
            <ReceiptTable rows={[
              { label: 'Sewa bulanan', value: ROOMS[room].price.replace('Rp', 'Rp ') },
              { label: 'Deposit (dikembalikan)', value: 'Rp 1.500.000' },
              { label: 'Listrik', value: 'dihitung terpisah', soft: true },
              { label: 'Orang kedua', value: 'Rp 400.000 /bulan' },
              { label: 'Tamu menginap', value: 'Rp 100.000 /malam' },
              { label: 'Parkir motor', value: 'gratis', soft: true },
            ]} total={{ label: 'Bayar di awal', value: room === '205' ? 'Rp 3.450.000' : 'Rp 3.150.000' }}
              note="Pembayaran tanggal 1–16 tiap bulan. Keterlambatan dikenakan denda sesuai perjanjian sewa." />
          </div>
        </section>
        <section><Eyebrow style={{ marginBottom: 16 }}>Sekitar</Eyebrow><Sekitar /></section>
        <section>
          <Eyebrow>Aturan rumah</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', marginTop: 16 }}>
            {[['Jam tamu', 'Tamu diterima 08.00–21.00 di area bersama.'], ['Pasangan', 'Khusus putri. Tamu laki-laki hanya di ruang tamu.'], ['Kebersihan', 'Kamar dibersihkan penghuni; area bersama oleh petugas setiap hari.'], ['Parkir', 'Motor gratis di halaman dalam. Mobil tidak tersedia.']].map(a => <div key={a[0]}>
              <h3 style={{ font: '600 15px var(--font-body)', margin: '0 0 4px' }}>{a[0]}</h3>
              <p style={{ font: '400 14px/1.6 var(--font-body)', color: 'var(--ink-soft)', margin: 0 }}>{a[1]}</p>
            </div>)}
          </div>
        </section>
      </div>
      <RoomPanel room={room} />
    </div>
  </div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
