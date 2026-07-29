const { Button, Chip, Badge, StatusBadge, Eyebrow, PropertyCard, ReceiptTable, ProofBar } = window.KostellaDesignSystem_f6d153;
const wrap = { maxWidth: 1200, margin: '0 auto', padding: '0 32px' };
const eyebrowRow = { display: 'flex', alignItems: 'center', gap: 12 };
const eyebrowRule = { width: 32, height: 2, background: 'var(--plum)', flexShrink: 0 };
function SectionEyebrow({ children, inverse }) {
  return <div style={eyebrowRow}><span style={{ ...eyebrowRule, background: inverse ? 'var(--stone)' : 'var(--plum)' }}></span><Eyebrow inverse={inverse} style={{ display: 'inline' }}>{children}</Eyebrow></div>;
}
function Header() {
  return <header style={{ borderBottom: '1px solid var(--line)', background: 'var(--stone)', position: 'sticky', top: 0, zIndex: 10 }}>
    <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
      <span style={{ fontWeight: 600, fontSize: 20, letterSpacing: '-0.01em' }}>Kostella</span>
      <nav style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500 }}>
        <a href="../pencarian/index.html">Cari kamar</a><a href="#kawasan">Kawasan</a><a href="#biaya">Biaya</a><a href="#franchise" style={{ color: 'var(--ink-soft)' }}>Untuk pemilik kos</a>
      </nav>
      <Button variant="primary" size="sm">Jadwalkan survei</Button>
    </div>
  </header>;
}
function Icon({ name, size = 20, style }) {
  const ref = React.useRef();
  React.useEffect(() => {
    if (!ref.current || !window.lucide || !lucide.icons[name]) return;
    ref.current.innerHTML = '';
    const el = lucide.createElement(lucide.icons[name]);
    el.setAttribute('width', size); el.setAttribute('height', size); el.setAttribute('stroke-width', '1.5');
    ref.current.appendChild(el);
  }, [name, size]);
  return <span ref={ref} style={{ display: 'inline-flex', flexShrink: 0, ...style }}></span>;
}
function AvailPill({ children }) {
  return <span style={{ background: 'var(--available)', color: '#fff', font: '500 11px var(--font-mono)', padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{children}</span>;
}
function Hero() {
  const rooms = [
    ['362', '205', 'Superior', 'Rp1.950.000', 'kosong 1 Agu'],
    ['362', '105', 'Standard', 'Rp1.650.000', 'kosong hari ini'],
    ['351', '302', 'Standard', 'Rp1.550.000', 'kosong hari ini'],
    ['2A3', '108', 'Pojok', 'Rp2.100.000', 'kosong 5 Agu'],
  ];
  const chips = ['Trisakti/Untar', 'Kelapa Gading', 'Setiabudi', 'Kebayoran', 'Bandung', 'Nusa Dua'];
  const [sel, setSel] = React.useState('Trisakti/Untar');
  return <section style={{ background: 'var(--stone)', overflow: 'hidden' }}>
    <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, padding: '88px 32px 96px' }} data-comment-anchor="b11a0b105c-div-24-5">
      <div>
        <SectionEyebrow>Milik &amp; dikelola sendiri sejak 2008</SectionEyebrow>
        <h1 style={{ font: '600 52px/1.08 var(--font-body)', margin: '20px 0 0', letterSpacing: '-0.015em', textWrap: 'balance' }}>Kos yang kamarnya kami kelola sendiri.</h1>
        <p style={{ font: '400 17px/1.65 var(--font-body)', color: 'var(--ink-soft)', maxWidth: 500, margin: '20px 0 36px' }}>31 gedung di Jakarta, Bandung, dan Bali. Kamar yang tampil di sini benar-benar kosong hari ini.</p>
        <p style={{ font: '600 15px/1.6 var(--font-body)', margin: '0 0 12px' }}>Kamu kuliah atau kerja di mana?</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 520 }}>
          {chips.map(c => <Chip key={c} selected={sel === c} onClick={() => setSel(c)}>{c}</Chip>)}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <Button variant="primary" size="lg">Lihat kamar kosong</Button>
          <Button variant="secondary" size="lg">Jadwalkan survei</Button>
        </div>
      </div>
      <div style={{ position: 'relative', alignSelf: 'stretch', minHeight: 520 }}>
        <div style={{ position: 'absolute', top: -24, right: -48, bottom: 120, left: 72, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)' }}>
          <image-slot id="hero-gedung" shape="rect" src="../../assets/DHP00456-large.jpg" placeholder="Foto Kostella — ruang bersama atau tampak gedung"></image-slot>
        </div>
        <div style={{ position: 'absolute', left: 0, bottom: 0, right: 48, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, boxShadow: '0 12px 32px rgba(22,23,26,0.10)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <Eyebrow>Kosong sekarang</Eyebrow>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: '400 12px var(--font-mono)', color: 'var(--ink-soft)' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--available)' }}></span>diperbarui hari ini</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {rooms.map((r, i) => <a key={i} href="../detail/index.html" style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderTop: i ? '1px solid var(--line)' : 'none', font: '400 13px var(--font-mono)', color: 'var(--ink)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontStretch: '125%', fontWeight: 700, fontSize: 17, minWidth: 40 }}>{r[0]}</span>
              <span style={{ color: 'var(--ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r[1]} · {r[2]}</span>
              <span style={{ marginLeft: 'auto', fontWeight: 500, whiteSpace: 'nowrap' }}>{r[3]}</span>
              <AvailPill>{r[4]}</AvailPill>
            </a>)}
          </div>
        </div>
      </div>
    </div>
  </section>;
}
function Kawasan() {
  const areas = [
    { name: 'Grogol', sub: 'dekat Trisakti & Untar', kosong: 7, props: [
      { number: '362', street: 'Jl. Dr. Susilo 2 No. 362', distances: ['Trisakti 1 km', 'Central Park 0,2 km'], priceFrom: 'mulai Rp1.650.000', status: 'available', count: 2, photo: '../../assets/WhatsApp-Image-2022-10-11-at-13.53.44-rotated-e1669953526877.jpeg' },
      { number: '351', street: 'Jl. Dr. Susilo 2 No. 351', distances: ['Trisakti 1,1 km', 'Terminal Grogol 0,3 km'], priceFrom: 'mulai Rp1.550.000', status: 'available', count: 5, photo: '../../assets/Cove-Arleyta_Deluxe-Queen-1-large.jpg' },
      { number: '360', street: 'Jl. Dr. Susilo 2 No. 360', distances: ['Trisakti 1 km', 'Terminal Grogol 0,2 km'], priceFrom: 'mulai Rp1.650.000', status: 'held', photo: '../../assets/DHP00714-large.jpg' },
      { number: '2C', street: 'Jl. Dr. Susilo 2C', distances: ['Untar 0,9 km', 'Central Park 0,4 km'], priceFrom: 'mulai Rp1.750.000', status: 'occupied', photo: '../../assets/DHP00456-large.jpg' },
    ]},
  ];
  return <section id="kawasan" style={{ background: 'var(--paper)', borderTop: '1px solid var(--line)' }}>
    <div style={{ ...wrap, padding: '96px 32px' }}>
      <SectionEyebrow>Properti per kawasan</SectionEyebrow>
      {areas.map(a => <div key={a.name} style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28 }}>
          <h2 style={{ font: '600 36px/1.15 var(--font-body)', margin: 0, letterSpacing: '-0.01em' }}>{a.name}</h2>
          <span style={{ font: '400 14px var(--font-body)', color: 'var(--ink-soft)' }}>{a.sub}</span>
          <span style={{ marginLeft: 'auto', background: 'var(--available)', color: '#fff', font: '500 13px var(--font-mono)', padding: '5px 12px', borderRadius: 4 }}>{a.kosong} kamar kosong</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {a.props.map(p => <PropertyCard key={p.number} {...p} onClick={() => { location.href = '../detail/index.html'; }} />)}
        </div>
      </div>)}
      <div style={{ marginTop: 36 }}><a href="../pencarian/index.html" style={{ font: '600 15px var(--font-body)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>Lihat semua kawasan <Icon name="ArrowRight" size={18} /></a></div>
    </div>
  </section>;
}
function Biaya() {
  return <section id="biaya" style={{ background: 'var(--stone)', borderTop: '1px solid var(--line)' }}>
    <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 64, padding: '96px 32px', alignItems: 'center' }}>
      <div>
        <SectionEyebrow>Transparansi biaya</SectionEyebrow>
        <h2 style={{ font: '600 36px/1.15 var(--font-body)', margin: '20px 0 0', letterSpacing: '-0.01em' }}>Yang kamu bayar, tanpa kejutan.</h2>
        <p style={{ font: '400 16px/1.65 var(--font-body)', color: 'var(--ink-soft)', maxWidth: 460, marginTop: 16 }}>Semua biaya tercantum sebelum kamu survei. Deposit kembali penuh saat keluar, listrik dihitung sesuai pemakaian, dan tidak ada biaya lain yang muncul belakangan.</p>
        <div style={{ display: 'flex', gap: 24, marginTop: 28 }}>
          {[['0', 'biaya tersembunyi'], ['100%', 'deposit kembali']].map(s => <div key={s[1]}>
            <div style={{ fontFamily: 'var(--font-display)', fontStretch: '125%', fontWeight: 700, fontSize: 34, lineHeight: 1 }}>{s[0]}</div>
            <div style={{ font: '400 13px var(--font-body)', color: 'var(--ink-soft)', marginTop: 4 }}>{s[1]}</div>
          </div>)}
        </div>
      </div>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 32, borderTop: '3px solid var(--plum)', boxShadow: 'var(--shadow-max)' }}>
        <div style={{ font: '500 13px var(--font-mono)', color: 'var(--ink-soft)', marginBottom: 16 }}>Contoh: Kostella 362 · kamar 105 · Standard</div>
        <ReceiptTable rows={[
          { label: 'Sewa bulanan', value: 'Rp 1.650.000' },
          { label: 'Deposit (dikembalikan)', value: 'Rp 1.500.000' },
          { label: 'Listrik', value: 'dihitung terpisah', soft: true },
          { label: 'Parkir motor', value: 'gratis', soft: true },
        ]} total={{ label: 'Bayar di awal', value: 'Rp 3.150.000' }} />
      </div>
    </div>
  </section>;
}
function CaraSewa() {
  const steps = [['01', 'Cari', 'Pilih kawasan, lihat kamar yang benar-benar kosong.', 'Search'], ['02', 'Jadwalkan survei', 'Datang lihat kamarnya. Ditemani pengelola gedung.', 'CalendarCheck'], ['03', 'Ajukan sewa', 'Isi data, pilih tanggal masuk.', 'FileText'], ['04', 'Bayar dan masuk', 'Bayar di awal, terima kunci di hari yang sama.', 'KeyRound']];
  return <section style={{ background: 'var(--paper)', borderTop: '1px solid var(--line)' }}>
    <div style={{ ...wrap, padding: '96px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <SectionEyebrow>Cara sewa</SectionEyebrow>
        <span style={{ font: '400 14px var(--font-body)', color: 'var(--ink-soft)' }}>Dari cari sampai masuk, bisa dalam satu hari.</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, marginTop: 40 }}>
        {steps.map((s, i) => <div key={s[0]} style={{ padding: '0 28px 0 0', borderLeft: i ? '1px solid var(--line)' : 'none', paddingLeft: i ? 28 : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontStretch: '125%', fontWeight: 700, fontSize: 44, lineHeight: 1, color: 'var(--plum)' }}>{s[0]}</div>
            <Icon name={s[3]} size={20} style={{ color: 'var(--ink-soft)', marginTop: 4 }} />
          </div>
          <h3 style={{ font: '600 20px/1.3 var(--font-body)', margin: '14px 0 8px' }}>{s[1]}</h3>
          <p style={{ font: '400 14px/1.6 var(--font-body)', color: 'var(--ink-soft)', margin: 0 }}>{s[2]}</p>
        </div>)}
      </div>
    </div>
  </section>;
}
function Franchise() {
  return <section id="franchise" style={{ background: 'var(--ink)' }}>
    <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, padding: '72px 32px', alignItems: 'center' }}>
      <div>
        <SectionEyebrow inverse>Punya kos?</SectionEyebrow>
        <p style={{ font: '600 28px/1.3 var(--font-body)', color: 'var(--stone)', margin: '16px 0 0', maxWidth: 620, letterSpacing: '-0.01em' }}>Kami mengelola 31 gedung. Kami juga bisa mengelola milik Anda.</p>
        <div style={{ marginTop: 24 }}><Button variant="inverse">Pelajari kemitraan</Button></div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontStretch: '125%', fontWeight: 700, fontSize: 140, lineHeight: 0.85, color: 'transparent', WebkitTextStroke: '1px var(--ink-soft)' }}>31</div>
    </div>
  </section>;
}
function FooterMap() {
  const ref = React.useRef();
  React.useEffect(() => {
    if (!ref.current || !window.L || ref.current._map) return;
    const map = L.map(ref.current, { scrollWheelZoom: false }).setView([-6.1645, 106.7890], 16);
    L.tileLayer('https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors © CARTO' }).addTo(map);
    [['362', -6.1636, 106.7884], ['361', -6.1640, 106.7892], ['351', -6.1652, 106.7898], ['2A3', -6.1659, 106.7880]].forEach(p =>
      L.marker([p[1], p[2]], { icon: L.divIcon({ className: '', html: `<div style="background:#57182F;color:#fff;font:500 12px 'IBM Plex Mono',monospace;padding:3px 7px;border-radius:4px;white-space:nowrap;box-shadow:0 1px 3px rgba(22,23,26,.3)">${p[0]}</div>`, iconSize: null }) }).addTo(map));
    ref.current._map = map;
  }, []);
  return <div ref={ref} style={{ height: 300, borderRadius: 12, border: '1px solid var(--line)', overflow: 'hidden' }}></div>;
}
function Footer() {
  const buildings = [['362', 'Jl. Dr. Susilo 2 No. 362'], ['361', 'Jl. Dr. Susilo 2 No. 361'], ['351', 'Jl. Dr. Susilo 2 No. 351'], ['2A3', 'Jl. Dr. Susilo 2A No. 3']];
  return <footer style={{ background: 'var(--paper)', borderTop: '1px solid var(--line)' }}>
    <div style={{ ...wrap, padding: '72px 32px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56, alignItems: 'start' }}>
        <div>
          <SectionEyebrow>Gedung kami di Grogol</SectionEyebrow>
          <div style={{ marginTop: 20 }}><FooterMap /></div>
          <div style={{ font: '400 12px var(--font-body)', color: 'var(--ink-soft)', marginTop: 8 }}>Lokasi perkiraan — alamat pasti dikirim saat jadwal survei dikonfirmasi.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <SectionEyebrow>Alamat gedung</SectionEyebrow>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
              {buildings.map(b => <div key={b[0]} style={{ display: 'flex', alignItems: 'baseline', gap: 8, font: '400 13px/1.5 var(--font-mono)', color: 'var(--ink-soft)' }}><span style={{ fontFamily: 'var(--font-display)', fontStretch: '125%', fontWeight: 700, fontSize: 15, color: 'var(--ink)', minWidth: 34 }}>{b[0]}</span>{b[1]}</div>)}
            </div>
            <div style={{ font: '400 12px var(--font-body)', color: 'var(--ink-soft)', marginTop: 12 }}>Grogol, Jakarta Barat · + 27 gedung lain di Jakarta, Bandung, dan Bali.</div>
          </div>
          <div style={{ background: 'var(--stone)', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
            <SectionEyebrow>Hubungi kami</SectionEyebrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              <Icon name="MessageCircle" size={22} style={{ color: 'var(--plum)' }} />
              <span style={{ font: '500 22px var(--font-mono)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>0812 8000 0362</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--plum-soft)', color: 'var(--plum)', font: '600 12px var(--font-body)', padding: '4px 10px', borderRadius: 4 }}><Icon name="BadgeCheck" size={14} />terverifikasi</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, font: '400 14px var(--font-body)', color: 'var(--ink-soft)', marginTop: 12 }}>
              <Icon name="Clock" size={18} />Jam operasional 08.00–21.00 WIB, setiap hari
            </div>
            <div style={{ marginTop: 16 }}><Button variant="primary">Chat lewat WhatsApp</Button></div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', marginTop: 56, padding: '20px 0 24px', font: '400 12px var(--font-body)', color: 'var(--ink-soft)' }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>Kostella</span>
        <span>Konsep — bukan situs final</span>
        <span>© Kostella 2026</span>
      </div>
    </div>
  </footer>;
}
function App() {
  return <div>
    <Header /><Hero />
    <ProofBar items={[{ value: '2008', label: 'tahun berdiri' }, { value: '31', label: 'gedung dikelola sendiri' }, { value: '340', label: 'kamar' }, { value: '14 bln', label: 'rata-rata lama tinggal' }]} style={{ background: 'var(--paper)' }} />
    <Kawasan /><Biaya /><CaraSewa /><Franchise /><Footer />
  </div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
