/* @ds-bundle: {"format":4,"namespace":"KostellaDesignSystem_f6d153","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"StatusBadge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"RoomCell","sourcePath":"components/core/FloorGrid.jsx"},{"name":"FloorGrid","sourcePath":"components/core/FloorGrid.jsx"},{"name":"FloorGridLegend","sourcePath":"components/core/FloorGrid.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"MetricCard","sourcePath":"components/core/MetricCard.jsx"},{"name":"ProofBar","sourcePath":"components/core/MetricCard.jsx"},{"name":"PropertyCard","sourcePath":"components/core/PropertyCard.jsx"},{"name":"ReceiptTable","sourcePath":"components/core/ReceiptTable.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"534ebaeb5dde","components/core/Button.jsx":"34294762d653","components/core/Chip.jsx":"f85ef8099f49","components/core/Eyebrow.jsx":"f9c90e8c01db","components/core/FloorGrid.jsx":"ab45364f8a44","components/core/Input.jsx":"6d84114e1a67","components/core/MetricCard.jsx":"ae4c4953ddbd","components/core/PropertyCard.jsx":"7b74f6135abc","components/core/ReceiptTable.jsx":"452e97528418","ui_kits/beranda/Beranda.jsx":"b75fb0057840","ui_kits/beranda/image-slot.js":"fff26d081c8d","ui_kits/beranda/standalone-app.jsx":"8dd96e256b3a","ui_kits/dashboard/Dashboard.jsx":"717d1eaae619","ui_kits/detail/Detail.jsx":"f8250d73fd77","ui_kits/pencarian/Pencarian.jsx":"e99bba581a2b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KostellaDesignSystem_f6d153 = window.KostellaDesignSystem_f6d153 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = 'plum',
  children,
  style
}) {
  const tones = {
    plum: {
      background: 'var(--plum-soft)',
      color: 'var(--plum)'
    },
    neutral: {
      background: 'var(--stone)',
      color: 'var(--ink-soft)'
    },
    available: {
      background: 'var(--available)',
      color: '#fff'
    },
    held: {
      background: '#F5E3D7',
      color: 'var(--held)'
    },
    occupied: {
      background: '#E7E5E0',
      color: 'var(--ink-soft)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.4,
      padding: '4px 10px',
      borderRadius: 'var(--radius-badge)',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      ...tones[tone],
      ...style
    }
  }, children);
}
function StatusBadge({
  status,
  count
}) {
  const map = {
    available: {
      tone: 'available',
      label: count != null ? `${count} kosong` : 'Ada kamar'
    },
    held: {
      tone: 'held',
      label: 'Sisa 1'
    },
    occupied: {
      tone: 'occupied',
      label: 'Penuh'
    }
  };
  const m = map[status] || map.available;
  return /*#__PURE__*/React.createElement(Badge, {
    tone: m.tone
  }, m.label);
}
Object.assign(__ds_scope, { Badge, StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  onClick,
  style
}) {
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    border: '1px solid transparent',
    borderRadius: 'var(--radius-badge)',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background 150ms ease, border-color 150ms ease',
    padding: size === 'lg' ? '14px 28px' : size === 'sm' ? '7px 14px' : '10px 20px',
    fontSize: size === 'lg' ? 16 : 14,
    lineHeight: 1.2
  };
  const variants = {
    primary: {
      background: 'var(--plum)',
      color: '#fff'
    },
    secondary: {
      background: 'var(--paper)',
      color: 'var(--ink)',
      borderColor: 'var(--line)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--plum)'
    },
    inverse: {
      background: 'var(--stone)',
      color: 'var(--ink)'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: disabled ? undefined : onClick,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      if (disabled) return;
      if (variant === 'primary') e.currentTarget.style.background = '#451325';
      if (variant === 'secondary') e.currentTarget.style.borderColor = 'var(--ink-soft)';
      if (variant === 'ghost') e.currentTarget.style.background = 'var(--plum-soft)';
    },
    onMouseLeave: e => {
      const v = variants[variant];
      e.currentTarget.style.background = v.background;
      e.currentTarget.style.borderColor = v.borderColor || 'transparent';
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function Chip({
  selected,
  children,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 1.2,
      padding: '8px 16px',
      borderRadius: 999,
      cursor: 'pointer',
      background: selected ? 'var(--ink)' : 'var(--paper)',
      color: selected ? 'var(--stone)' : 'var(--ink)',
      border: selected ? '1px solid var(--ink)' : '1px solid var(--line)',
      transition: 'border-color 150ms ease',
      ...style
    },
    onMouseEnter: e => {
      if (!selected) e.currentTarget.style.borderColor = 'var(--ink-soft)';
    },
    onMouseLeave: e => {
      if (!selected) e.currentTarget.style.borderColor = 'var(--line)';
    }
  }, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function Eyebrow({
  children,
  inverse,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: inverse ? '#9A9892' : 'var(--ink-soft)',
      display: 'block',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/FloorGrid.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CELL_STYLES = {
  available: {
    border: '2px solid var(--available)',
    color: '#fff',
    background: 'var(--available)'
  },
  held: {
    border: '1px solid var(--held)',
    color: 'var(--held)',
    background: 'repeating-linear-gradient(45deg,#fff 0 4px,#F5E3D7 4px 8px)'
  },
  occupied: {
    border: '1px solid var(--line)',
    color: '#B7B5AF',
    background: '#E7E5E0'
  }
};
function RoomCell({
  room,
  status = 'occupied',
  type,
  price,
  selected,
  onClick,
  compact
}) {
  const s = CELL_STYLES[status];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      fontFamily: 'var(--font-mono)',
      borderRadius: 0,
      cursor: onClick ? 'pointer' : 'default',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 2,
      padding: compact ? '8px 10px' : '12px 14px',
      minWidth: compact ? 64 : 108,
      textAlign: 'left',
      outline: selected ? '2px solid var(--plum)' : 'none',
      outlineOffset: 2,
      ...s
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 500
    }
  }, room), !compact && type && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontFamily: 'var(--font-body)',
      fontWeight: 500
    }
  }, type), !compact && price && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11
    }
  }, price));
}
function FloorGrid({
  floors,
  selectedRoom,
  onSelect,
  compact,
  animate
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, floors.map((f, fi) => /*#__PURE__*/React.createElement("div", {
    key: f.label,
    style: {
      display: 'grid',
      gridTemplateColumns: '90px 1fr',
      gap: 20,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-soft)',
      paddingTop: 12
    }
  }, f.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, f.rooms.map((r, ri) => /*#__PURE__*/React.createElement("div", {
    key: r.room,
    style: animate ? {
      animation: `kstCellIn 300ms ease-out both`,
      animationDelay: `${(fi * 4 + ri) * 40}ms`
    } : undefined
  }, /*#__PURE__*/React.createElement(RoomCell, _extends({}, r, {
    compact: compact,
    selected: selectedRoom === r.room,
    onClick: onSelect ? () => onSelect(r) : undefined
  }))))))), animate && /*#__PURE__*/React.createElement("style", null, `@keyframes kstCellIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`));
}
function FloorGridLegend() {
  const item = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--ink-soft)'
  };
  const sq = {
    width: 14,
    height: 14,
    display: 'inline-block'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: item
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...sq,
      ...CELL_STYLES.available
    }
  }), "tersedia"), /*#__PURE__*/React.createElement("span", {
    style: item
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...sq,
      ...CELL_STYLES.held
    }
  }), "dibooking"), /*#__PURE__*/React.createElement("span", {
    style: item
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...sq,
      ...CELL_STYLES.occupied
    }
  }), "terisi"));
}
Object.assign(__ds_scope, { RoomCell, FloorGrid, FloorGridLegend });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/FloorGrid.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function Input({
  label,
  value,
  placeholder,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-soft)'
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    value: value,
    placeholder: placeholder,
    onChange: onChange ? e => onChange(e.target.value) : undefined,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--ink)',
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-badge)',
      padding: '10px 12px',
      outline: 'none'
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = 'var(--plum)';
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = 'var(--line)';
    }
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/MetricCard.jsx
try { (() => {
function MetricCard({
  label,
  value,
  detail,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-card)',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-soft)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 40,
      lineHeight: 1,
      color: 'var(--ink)',
      letterSpacing: '-0.01em'
    }
  }, value), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-soft)'
    }
  }, detail));
}
function ProofBar({
  items = [],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      padding: '20px 24px',
      borderLeft: i ? '1px solid var(--line)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 32,
      lineHeight: 1,
      color: 'var(--ink)'
    }
  }, it.value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-soft)'
    }
  }, it.label))));
}
Object.assign(__ds_scope, { MetricCard, ProofBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MetricCard.jsx", error: String((e && e.message) || e) }); }

// components/core/PropertyCard.jsx
try { (() => {
function PropertyCard({
  number,
  street,
  distances = [],
  priceFrom,
  status = 'available',
  count,
  photo,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      fontFamily: 'var(--font-body)',
      boxShadow: 'var(--shadow-max)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4/5',
      background: '#DDDBD4',
      overflow: 'hidden'
    }
  }, photo ? /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: `Kostella ${number}`,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 400ms ease-out'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'scale(1.03)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink-soft)',
      fontSize: 12
    }
  }, "foto 4:5"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 8,
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 56,
      lineHeight: 0.85,
      letterSpacing: '-0.02em',
      color: '#fff',
      textShadow: '0 1px 6px rgba(22,23,26,0.35)'
    }
  }, number)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, street), distances.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.6,
      color: 'var(--ink-soft)'
    }
  }, distances.join(' · ')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--ink)'
    }
  }, priceFrom), /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    status: status,
    count: count
  }))));
}
Object.assign(__ds_scope, { PropertyCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PropertyCard.jsx", error: String((e && e.message) || e) }); }

// components/core/ReceiptTable.jsx
try { (() => {
function ReceiptTable({
  rows = [],
  total,
  note,
  style
}) {
  const row = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 32,
    padding: '6px 0'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--ink)',
      ...style
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: row
  }, /*#__PURE__*/React.createElement("span", null, r.label), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right',
      color: r.soft ? 'var(--ink-soft)' : 'var(--ink)'
    }
  }, r.value))), total && /*#__PURE__*/React.createElement("div", {
    style: {
      ...row,
      borderTop: '1px solid var(--ink)',
      marginTop: 6,
      paddingTop: 10,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("span", null, total.label), /*#__PURE__*/React.createElement("span", null, total.value)), note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--ink-soft)',
      marginTop: 12
    }
  }, note));
}
Object.assign(__ds_scope, { ReceiptTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ReceiptTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/beranda/Beranda.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  Chip,
  Badge,
  StatusBadge,
  Eyebrow,
  PropertyCard,
  ReceiptTable,
  ProofBar
} = window.KostellaDesignSystem_f6d153;
const wrap = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 32px'
};
const eyebrowRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 12
};
const eyebrowRule = {
  width: 32,
  height: 2,
  background: 'var(--plum)',
  flexShrink: 0
};
function SectionEyebrow({
  children,
  inverse
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: eyebrowRow
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...eyebrowRule,
      background: inverse ? 'var(--stone)' : 'var(--plum)'
    }
  }), /*#__PURE__*/React.createElement(Eyebrow, {
    inverse: inverse,
    style: {
      display: 'inline'
    }
  }, children));
}
function Header() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: '1px solid var(--line)',
      background: 'var(--stone)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 64
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 20,
      letterSpacing: '-0.01em'
    }
  }, "Kostella"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 32,
      fontSize: 14,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "../pencarian/index.html"
  }, "Cari kamar"), /*#__PURE__*/React.createElement("a", {
    href: "#kawasan"
  }, "Kawasan"), /*#__PURE__*/React.createElement("a", {
    href: "#biaya"
  }, "Biaya"), /*#__PURE__*/React.createElement("a", {
    href: "#franchise",
    style: {
      color: 'var(--ink-soft)'
    }
  }, "Untuk pemilik kos")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Jadwalkan survei")));
}
function Icon({
  name,
  size = 20,
  style
}) {
  const ref = React.useRef();
  React.useEffect(() => {
    if (!ref.current || !window.lucide || !lucide.icons[name]) return;
    ref.current.innerHTML = '';
    const el = lucide.createElement(lucide.icons[name]);
    el.setAttribute('width', size);
    el.setAttribute('height', size);
    el.setAttribute('stroke-width', '1.5');
    ref.current.appendChild(el);
  }, [name, size]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      flexShrink: 0,
      ...style
    }
  });
}
function AvailPill({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--available)',
      color: '#fff',
      font: '500 11px var(--font-mono)',
      padding: '3px 8px',
      borderRadius: 4,
      whiteSpace: 'nowrap'
    }
  }, children);
}
function Hero() {
  const rooms = [['362', '205', 'Superior', 'Rp1.950.000', 'kosong 1 Agu'], ['362', '105', 'Standard', 'Rp1.650.000', 'kosong hari ini'], ['351', '302', 'Standard', 'Rp1.550.000', 'kosong hari ini'], ['2A3', '108', 'Pojok', 'Rp2.100.000', 'kosong 5 Agu']];
  const chips = ['Trisakti/Untar', 'Kelapa Gading', 'Setiabudi', 'Kebayoran', 'Bandung', 'Nusa Dua'];
  const [sel, setSel] = React.useState('Trisakti/Untar');
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--stone)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 64,
      padding: '88px 32px 96px'
    },
    "data-comment-anchor": "b11a0b105c-div-24-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Milik & dikelola sendiri sejak 2008"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '600 52px/1.08 var(--font-body)',
      margin: '20px 0 0',
      letterSpacing: '-0.015em',
      textWrap: 'balance'
    }
  }, "Kos yang kamarnya kami kelola sendiri."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 17px/1.65 var(--font-body)',
      color: 'var(--ink-soft)',
      maxWidth: 500,
      margin: '20px 0 36px'
    }
  }, "31 gedung di Jakarta, Bandung, dan Bali. Kamar yang tampil di sini benar-benar kosong hari ini."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '600 15px/1.6 var(--font-body)',
      margin: '0 0 12px'
    }
  }, "Kamu kuliah atau kerja di mana?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      maxWidth: 520
    }
  }, chips.map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c,
    selected: sel === c,
    onClick: () => setSel(c)
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Lihat kamar kosong"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg"
  }, "Jadwalkan survei"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      alignSelf: 'stretch',
      minHeight: 520
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -24,
      right: -48,
      bottom: 120,
      left: 72,
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "hero-gedung",
    shape: "rect",
    src: "../../assets/DHP00456-large.jpg",
    placeholder: "Foto Kostella \u2014 ruang bersama atau tampak gedung"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 48,
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      boxShadow: '0 12px 32px rgba(22,23,26,0.10)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Kosong sekarang"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      font: '400 12px var(--font-mono)',
      color: 'var(--ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--available)'
    }
  }), "diperbarui hari ini")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, rooms.map((r, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "../detail/index.html",
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      padding: '10px 0',
      borderTop: i ? '1px solid var(--line)' : 'none',
      font: '400 13px var(--font-mono)',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 17,
      minWidth: 40
    }
  }, r[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-soft)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, r[1], " \xB7 ", r[2]), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontWeight: 500,
      whiteSpace: 'nowrap'
    }
  }, r[3]), /*#__PURE__*/React.createElement(AvailPill, null, r[4]))))))));
}
function Kawasan() {
  const areas = [{
    name: 'Grogol',
    sub: 'dekat Trisakti & Untar',
    kosong: 7,
    props: [{
      number: '362',
      street: 'Jl. Dr. Susilo 2 No. 362',
      distances: ['Trisakti 1 km', 'Central Park 0,2 km'],
      priceFrom: 'mulai Rp1.650.000',
      status: 'available',
      count: 2,
      photo: '../../assets/WhatsApp-Image-2022-10-11-at-13.53.44-rotated-e1669953526877.jpeg'
    }, {
      number: '351',
      street: 'Jl. Dr. Susilo 2 No. 351',
      distances: ['Trisakti 1,1 km', 'Terminal Grogol 0,3 km'],
      priceFrom: 'mulai Rp1.550.000',
      status: 'available',
      count: 5,
      photo: '../../assets/Cove-Arleyta_Deluxe-Queen-1-large.jpg'
    }, {
      number: '360',
      street: 'Jl. Dr. Susilo 2 No. 360',
      distances: ['Trisakti 1 km', 'Terminal Grogol 0,2 km'],
      priceFrom: 'mulai Rp1.650.000',
      status: 'held',
      photo: '../../assets/DHP00714-large.jpg'
    }, {
      number: '2C',
      street: 'Jl. Dr. Susilo 2C',
      distances: ['Untar 0,9 km', 'Central Park 0,4 km'],
      priceFrom: 'mulai Rp1.750.000',
      status: 'occupied',
      photo: '../../assets/DHP00456-large.jpg'
    }]
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "kawasan",
    style: {
      background: 'var(--paper)',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: '96px 32px'
    }
  }, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Properti per kawasan"), areas.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.name,
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 16,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 36px/1.15 var(--font-body)',
      margin: 0,
      letterSpacing: '-0.01em'
    }
  }, a.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 14px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, a.sub), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      background: 'var(--available)',
      color: '#fff',
      font: '500 13px var(--font-mono)',
      padding: '5px 12px',
      borderRadius: 4
    }
  }, a.kosong, " kamar kosong")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 24
    }
  }, a.props.map(p => /*#__PURE__*/React.createElement(PropertyCard, _extends({
    key: p.number
  }, p, {
    onClick: () => {
      location.href = '../detail/index.html';
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "../pencarian/index.html",
    style: {
      font: '600 15px var(--font-body)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, "Lihat semua kawasan ", /*#__PURE__*/React.createElement(Icon, {
    name: "ArrowRight",
    size: 18
  })))));
}
function Biaya() {
  return /*#__PURE__*/React.createElement("section", {
    id: "biaya",
    style: {
      background: 'var(--stone)',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: 64,
      padding: '96px 32px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Transparansi biaya"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 36px/1.15 var(--font-body)',
      margin: '20px 0 0',
      letterSpacing: '-0.01em'
    }
  }, "Yang kamu bayar, tanpa kejutan."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 16px/1.65 var(--font-body)',
      color: 'var(--ink-soft)',
      maxWidth: 460,
      marginTop: 16
    }
  }, "Semua biaya tercantum sebelum kamu survei. Deposit kembali penuh saat keluar, listrik dihitung sesuai pemakaian, dan tidak ada biaya lain yang muncul belakangan."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      marginTop: 28
    }
  }, [['0', 'biaya tersembunyi'], ['100%', 'deposit kembali']].map(s => /*#__PURE__*/React.createElement("div", {
    key: s[1]
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 34,
      lineHeight: 1
    }
  }, s[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px var(--font-body)',
      color: 'var(--ink-soft)',
      marginTop: 4
    }
  }, s[1]))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      padding: 32,
      borderTop: '3px solid var(--plum)',
      boxShadow: 'var(--shadow-max)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 13px var(--font-mono)',
      color: 'var(--ink-soft)',
      marginBottom: 16
    }
  }, "Contoh: Kostella 362 \xB7 kamar 105 \xB7 Standard"), /*#__PURE__*/React.createElement(ReceiptTable, {
    rows: [{
      label: 'Sewa bulanan',
      value: 'Rp 1.650.000'
    }, {
      label: 'Deposit (dikembalikan)',
      value: 'Rp 1.500.000'
    }, {
      label: 'Listrik',
      value: 'dihitung terpisah',
      soft: true
    }, {
      label: 'Parkir motor',
      value: 'gratis',
      soft: true
    }],
    total: {
      label: 'Bayar di awal',
      value: 'Rp 3.150.000'
    }
  }))));
}
function CaraSewa() {
  const steps = [['01', 'Cari', 'Pilih kawasan, lihat kamar yang benar-benar kosong.', 'Search'], ['02', 'Jadwalkan survei', 'Datang lihat kamarnya. Ditemani pengelola gedung.', 'CalendarCheck'], ['03', 'Ajukan sewa', 'Isi data, pilih tanggal masuk.', 'FileText'], ['04', 'Bayar dan masuk', 'Bayar di awal, terima kunci di hari yang sama.', 'KeyRound']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--paper)',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: '96px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Cara sewa"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 14px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, "Dari cari sampai masuk, bisa dalam satu hari.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 0,
      marginTop: 40
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s[0],
    style: {
      padding: '0 28px 0 0',
      borderLeft: i ? '1px solid var(--line)' : 'none',
      paddingLeft: i ? 28 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 44,
      lineHeight: 1,
      color: 'var(--plum)'
    }
  }, s[0]), /*#__PURE__*/React.createElement(Icon, {
    name: s[3],
    size: 20,
    style: {
      color: 'var(--ink-soft)',
      marginTop: 4
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 20px/1.3 var(--font-body)',
      margin: '14px 0 8px'
    }
  }, s[1]), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 14px/1.6 var(--font-body)',
      color: 'var(--ink-soft)',
      margin: 0
    }
  }, s[2]))))));
}
function Franchise() {
  return /*#__PURE__*/React.createElement("section", {
    id: "franchise",
    style: {
      background: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 48,
      padding: '72px 32px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionEyebrow, {
    inverse: true
  }, "Punya kos?"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '600 28px/1.3 var(--font-body)',
      color: 'var(--stone)',
      margin: '16px 0 0',
      maxWidth: 620,
      letterSpacing: '-0.01em'
    }
  }, "Kami mengelola 31 gedung. Kami juga bisa mengelola milik Anda."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "inverse"
  }, "Pelajari kemitraan"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 140,
      lineHeight: 0.85,
      color: 'transparent',
      WebkitTextStroke: '1px var(--ink-soft)'
    }
  }, "31")));
}
function FooterMap() {
  const ref = React.useRef();
  React.useEffect(() => {
    if (!ref.current || !window.L || ref.current._map) return;
    const map = L.map(ref.current, {
      scrollWheelZoom: false
    }).setView([-6.1645, 106.7890], 16);
    L.tileLayer('https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(map);
    [['362', -6.1636, 106.7884], ['361', -6.1640, 106.7892], ['351', -6.1652, 106.7898], ['2A3', -6.1659, 106.7880]].forEach(p => L.marker([p[1], p[2]], {
      icon: L.divIcon({
        className: '',
        html: `<div style="background:#57182F;color:#fff;font:500 12px 'IBM Plex Mono',monospace;padding:3px 7px;border-radius:4px;white-space:nowrap;box-shadow:0 1px 3px rgba(22,23,26,.3)">${p[0]}</div>`,
        iconSize: null
      })
    }).addTo(map));
    ref.current._map = map;
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      height: 300,
      borderRadius: 12,
      border: '1px solid var(--line)',
      overflow: 'hidden'
    }
  });
}
function Footer() {
  const buildings = [['362', 'Jl. Dr. Susilo 2 No. 362'], ['361', 'Jl. Dr. Susilo 2 No. 361'], ['351', 'Jl. Dr. Susilo 2 No. 351'], ['2A3', 'Jl. Dr. Susilo 2A No. 3']];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--paper)',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: '72px 32px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Gedung kami di Grogol"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(FooterMap, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px var(--font-body)',
      color: 'var(--ink-soft)',
      marginTop: 8
    }
  }, "Lokasi perkiraan \u2014 alamat pasti dikirim saat jadwal survei dikonfirmasi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Alamat gedung"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px 24px'
    }
  }, buildings.map(b => /*#__PURE__*/React.createElement("div", {
    key: b[0],
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      font: '400 13px/1.5 var(--font-mono)',
      color: 'var(--ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 15,
      color: 'var(--ink)',
      minWidth: 34
    }
  }, b[0]), b[1]))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px var(--font-body)',
      color: 'var(--ink-soft)',
      marginTop: 12
    }
  }, "Grogol, Jakarta Barat \xB7 + 27 gedung lain di Jakarta, Bandung, dan Bali.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--stone)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Hubungi kami"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MessageCircle",
    size: 22,
    style: {
      color: 'var(--plum)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 22px var(--font-mono)',
      color: 'var(--ink)',
      whiteSpace: 'nowrap'
    }
  }, "0812 8000 0362"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: 'var(--plum-soft)',
      color: 'var(--plum)',
      font: '600 12px var(--font-body)',
      padding: '4px 10px',
      borderRadius: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BadgeCheck",
    size: 14
  }), "terverifikasi")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      font: '400 14px var(--font-body)',
      color: 'var(--ink-soft)',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Clock",
    size: 18
  }), "Jam operasional 08.00\u201321.00 WIB, setiap hari"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Chat lewat WhatsApp"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid var(--line)',
      marginTop: 56,
      padding: '20px 0 24px',
      font: '400 12px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--ink)'
    }
  }, "Kostella"), /*#__PURE__*/React.createElement("span", null, "Konsep \u2014 bukan situs final"), /*#__PURE__*/React.createElement("span", null, "\xA9 Kostella 2026"))));
}
function App() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(ProofBar, {
    items: [{
      value: '2008',
      label: 'tahun berdiri'
    }, {
      value: '31',
      label: 'gedung dikelola sendiri'
    }, {
      value: '340',
      label: 'kamar'
    }, {
      value: '14 bln',
      label: 'rata-rata lama tinggal'
    }],
    style: {
      background: 'var(--paper)'
    }
  }), /*#__PURE__*/React.createElement(Kawasan, null), /*#__PURE__*/React.createElement(Biaya, null), /*#__PURE__*/React.createElement(CaraSewa, null), /*#__PURE__*/React.createElement(Franchise, null), /*#__PURE__*/React.createElement(Footer, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/beranda/Beranda.jsx", error: String((e && e.message) || e) }); }

// ui_kits/beranda/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/beranda/image-slot.js", error: String((e && e.message) || e) }); }

// ui_kits/beranda/standalone-app.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  onClick,
  style
}) {
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    border: '1px solid transparent',
    borderRadius: 'var(--radius-badge)',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background 150ms ease, border-color 150ms ease',
    padding: size === 'lg' ? '14px 28px' : size === 'sm' ? '7px 14px' : '10px 20px',
    fontSize: size === 'lg' ? 16 : 14,
    lineHeight: 1.2
  };
  const variants = {
    primary: {
      background: 'var(--plum)',
      color: '#fff'
    },
    secondary: {
      background: 'var(--paper)',
      color: 'var(--ink)',
      borderColor: 'var(--line)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--plum)'
    },
    inverse: {
      background: 'var(--stone)',
      color: 'var(--ink)'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: disabled ? undefined : onClick,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      if (disabled) return;
      if (variant === 'primary') e.currentTarget.style.background = '#451325';
      if (variant === 'secondary') e.currentTarget.style.borderColor = 'var(--ink-soft)';
      if (variant === 'ghost') e.currentTarget.style.background = 'var(--plum-soft)';
    },
    onMouseLeave: e => {
      const v = variants[variant];
      e.currentTarget.style.background = v.background;
      e.currentTarget.style.borderColor = v.borderColor || 'transparent';
    }
  }, children);
}
function Chip({
  selected,
  children,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 1.2,
      padding: '8px 16px',
      borderRadius: 999,
      cursor: 'pointer',
      background: selected ? 'var(--ink)' : 'var(--paper)',
      color: selected ? 'var(--stone)' : 'var(--ink)',
      border: selected ? '1px solid var(--ink)' : '1px solid var(--line)',
      transition: 'border-color 150ms ease',
      ...style
    },
    onMouseEnter: e => {
      if (!selected) e.currentTarget.style.borderColor = 'var(--ink-soft)';
    },
    onMouseLeave: e => {
      if (!selected) e.currentTarget.style.borderColor = 'var(--line)';
    }
  }, children);
}
function Badge({
  tone = 'plum',
  children,
  style
}) {
  const tones = {
    plum: {
      background: 'var(--plum-soft)',
      color: 'var(--plum)'
    },
    neutral: {
      background: 'var(--stone)',
      color: 'var(--ink-soft)'
    },
    available: {
      background: 'var(--available)',
      color: '#fff'
    },
    held: {
      background: '#F5E3D7',
      color: 'var(--held)'
    },
    occupied: {
      background: '#E7E5E0',
      color: 'var(--ink-soft)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.4,
      padding: '4px 10px',
      borderRadius: 'var(--radius-badge)',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      ...tones[tone],
      ...style
    }
  }, children);
}
function StatusBadge({
  status,
  count
}) {
  const map = {
    available: {
      tone: 'available',
      label: count != null ? `${count} kosong` : 'Ada kamar'
    },
    held: {
      tone: 'held',
      label: 'Sisa 1'
    },
    occupied: {
      tone: 'occupied',
      label: 'Penuh'
    }
  };
  const m = map[status] || map.available;
  return /*#__PURE__*/React.createElement(Badge, {
    tone: m.tone
  }, m.label);
}
function Eyebrow({
  children,
  inverse,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: inverse ? '#9A9892' : 'var(--ink-soft)',
      display: 'block',
      ...style
    }
  }, children);
}
function PropertyCard({
  number,
  street,
  distances = [],
  priceFrom,
  status = 'available',
  count,
  photo,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      fontFamily: 'var(--font-body)',
      boxShadow: 'var(--shadow-max)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '4/5',
      background: '#DDDBD4',
      overflow: 'hidden'
    }
  }, photo ? /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: `Kostella ${number}`,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 400ms ease-out'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'scale(1.03)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink-soft)',
      fontSize: 12
    }
  }, "foto 4:5"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 8,
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 56,
      lineHeight: 0.85,
      letterSpacing: '-0.02em',
      color: '#fff',
      textShadow: '0 1px 6px rgba(22,23,26,0.35)'
    }
  }, number)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--ink)'
    }
  }, street), distances.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.6,
      color: 'var(--ink-soft)'
    }
  }, distances.join(' · ')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--ink)'
    }
  }, priceFrom), /*#__PURE__*/React.createElement(StatusBadge, {
    status: status,
    count: count
  }))));
}
function ReceiptTable({
  rows = [],
  total,
  note,
  style
}) {
  const row = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 32,
    padding: '6px 0'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--ink)',
      ...style
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: row
  }, /*#__PURE__*/React.createElement("span", null, r.label), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right',
      color: r.soft ? 'var(--ink-soft)' : 'var(--ink)'
    }
  }, r.value))), total && /*#__PURE__*/React.createElement("div", {
    style: {
      ...row,
      borderTop: '1px solid var(--ink)',
      marginTop: 6,
      paddingTop: 10,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("span", null, total.label), /*#__PURE__*/React.createElement("span", null, total.value)), note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--ink-soft)',
      marginTop: 12
    }
  }, note));
}
function MetricCard({
  label,
  value,
  detail,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-card)',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-soft)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 40,
      lineHeight: 1,
      color: 'var(--ink)',
      letterSpacing: '-0.01em'
    }
  }, value), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-soft)'
    }
  }, detail));
}
function ProofBar({
  items = [],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      padding: '20px 24px',
      borderLeft: i ? '1px solid var(--line)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 32,
      lineHeight: 1,
      color: 'var(--ink)'
    }
  }, it.value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-soft)'
    }
  }, it.label))));
}
const wrap = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 32px'
};
const eyebrowRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 12
};
const eyebrowRule = {
  width: 32,
  height: 2,
  background: 'var(--plum)',
  flexShrink: 0
};
function SectionEyebrow({
  children,
  inverse
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: eyebrowRow
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...eyebrowRule,
      background: inverse ? 'var(--stone)' : 'var(--plum)'
    }
  }), /*#__PURE__*/React.createElement(Eyebrow, {
    inverse: inverse,
    style: {
      display: 'inline'
    }
  }, children));
}
function Header() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: '1px solid var(--line)',
      background: 'var(--stone)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 64
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 20,
      letterSpacing: '-0.01em'
    }
  }, "Kostella"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 32,
      fontSize: 14,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "../pencarian/index.html"
  }, "Cari kamar"), /*#__PURE__*/React.createElement("a", {
    href: "#kawasan"
  }, "Kawasan"), /*#__PURE__*/React.createElement("a", {
    href: "#biaya"
  }, "Biaya"), /*#__PURE__*/React.createElement("a", {
    href: "#franchise",
    style: {
      color: 'var(--ink-soft)'
    }
  }, "Untuk pemilik kos")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Jadwalkan survei")));
}
function Icon({
  name,
  size = 20,
  style
}) {
  const ref = React.useRef();
  React.useEffect(() => {
    if (!ref.current || !window.lucide || !lucide.icons[name]) return;
    ref.current.innerHTML = '';
    const el = lucide.createElement(lucide.icons[name]);
    el.setAttribute('width', size);
    el.setAttribute('height', size);
    el.setAttribute('stroke-width', '1.5');
    ref.current.appendChild(el);
  }, [name, size]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      flexShrink: 0,
      ...style
    }
  });
}
function AvailPill({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--available)',
      color: '#fff',
      font: '500 11px var(--font-mono)',
      padding: '3px 8px',
      borderRadius: 4,
      whiteSpace: 'nowrap'
    }
  }, children);
}
function Hero() {
  const rooms = [['362', '205', 'Superior', 'Rp1.950.000', 'kosong 1 Agu'], ['362', '105', 'Standard', 'Rp1.650.000', 'kosong hari ini'], ['351', '302', 'Standard', 'Rp1.550.000', 'kosong hari ini'], ['2A3', '108', 'Pojok', 'Rp2.100.000', 'kosong 5 Agu']];
  const chips = ['Trisakti/Untar', 'Kelapa Gading', 'Setiabudi', 'Kebayoran', 'Bandung', 'Nusa Dua'];
  const [sel, setSel] = React.useState('Trisakti/Untar');
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--stone)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 64,
      padding: '88px 32px 96px'
    },
    "data-comment-anchor": "b11a0b105c-div-24-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Milik & dikelola sendiri sejak 2008"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '600 52px/1.08 var(--font-body)',
      margin: '20px 0 0',
      letterSpacing: '-0.015em',
      textWrap: 'balance'
    }
  }, "Kos yang kamarnya kami kelola sendiri."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 17px/1.65 var(--font-body)',
      color: 'var(--ink-soft)',
      maxWidth: 500,
      margin: '20px 0 36px'
    }
  }, "31 gedung di Jakarta, Bandung, dan Bali. Kamar yang tampil di sini benar-benar kosong hari ini."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '600 15px/1.6 var(--font-body)',
      margin: '0 0 12px'
    }
  }, "Kamu kuliah atau kerja di mana?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      maxWidth: 520
    }
  }, chips.map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c,
    selected: sel === c,
    onClick: () => setSel(c)
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Lihat kamar kosong"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg"
  }, "Jadwalkan survei"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      alignSelf: 'stretch',
      minHeight: 520
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -24,
      right: -48,
      bottom: 120,
      left: 72,
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "hero-gedung",
    shape: "rect",
    placeholder: "Foto gedung 362 \u2014 tampak depan, siang hari"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 48,
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      boxShadow: '0 12px 32px rgba(22,23,26,0.10)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Kosong sekarang"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      font: '400 12px var(--font-mono)',
      color: 'var(--ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--available)'
    }
  }), "diperbarui hari ini")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, rooms.map((r, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "../detail/index.html",
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      padding: '10px 0',
      borderTop: i ? '1px solid var(--line)' : 'none',
      font: '400 13px var(--font-mono)',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 17,
      minWidth: 40
    }
  }, r[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-soft)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, r[1], " \xB7 ", r[2]), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontWeight: 500,
      whiteSpace: 'nowrap'
    }
  }, r[3]), /*#__PURE__*/React.createElement(AvailPill, null, r[4]))))))));
}
function Kawasan() {
  const areas = [{
    name: 'Grogol',
    sub: 'dekat Trisakti & Untar',
    kosong: 7,
    props: [{
      number: '362',
      street: 'Jl. Dr. Susilo 2 No. 362',
      distances: ['Trisakti 1 km', 'Central Park 0,2 km'],
      priceFrom: 'mulai Rp1.650.000',
      status: 'available',
      count: 2
    }, {
      number: '351',
      street: 'Jl. Dr. Susilo 2 No. 351',
      distances: ['Trisakti 1,1 km', 'Terminal Grogol 0,3 km'],
      priceFrom: 'mulai Rp1.550.000',
      status: 'available',
      count: 5
    }, {
      number: '360',
      street: 'Jl. Dr. Susilo 2 No. 360',
      distances: ['Trisakti 1 km', 'Terminal Grogol 0,2 km'],
      priceFrom: 'mulai Rp1.650.000',
      status: 'held'
    }, {
      number: '2C',
      street: 'Jl. Dr. Susilo 2C',
      distances: ['Untar 0,9 km', 'Central Park 0,4 km'],
      priceFrom: 'mulai Rp1.750.000',
      status: 'occupied'
    }]
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "kawasan",
    style: {
      background: 'var(--paper)',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: '96px 32px'
    }
  }, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Properti per kawasan"), areas.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.name,
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 16,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 36px/1.15 var(--font-body)',
      margin: 0,
      letterSpacing: '-0.01em'
    }
  }, a.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 14px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, a.sub), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      background: 'var(--available)',
      color: '#fff',
      font: '500 13px var(--font-mono)',
      padding: '5px 12px',
      borderRadius: 4
    }
  }, a.kosong, " kamar kosong")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 24
    }
  }, a.props.map(p => /*#__PURE__*/React.createElement(PropertyCard, _extends({
    key: p.number
  }, p, {
    onClick: () => {
      location.href = '../detail/index.html';
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "../pencarian/index.html",
    style: {
      font: '600 15px var(--font-body)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, "Lihat semua kawasan ", /*#__PURE__*/React.createElement(Icon, {
    name: "ArrowRight",
    size: 18
  })))));
}
function Biaya() {
  return /*#__PURE__*/React.createElement("section", {
    id: "biaya",
    style: {
      background: 'var(--stone)',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: 64,
      padding: '96px 32px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Transparansi biaya"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 36px/1.15 var(--font-body)',
      margin: '20px 0 0',
      letterSpacing: '-0.01em'
    }
  }, "Yang kamu bayar, tanpa kejutan."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 16px/1.65 var(--font-body)',
      color: 'var(--ink-soft)',
      maxWidth: 460,
      marginTop: 16
    }
  }, "Semua biaya tercantum sebelum kamu survei. Deposit kembali penuh saat keluar, listrik dihitung sesuai pemakaian, dan tidak ada biaya lain yang muncul belakangan."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      marginTop: 28
    }
  }, [['0', 'biaya tersembunyi'], ['100%', 'deposit kembali']].map(s => /*#__PURE__*/React.createElement("div", {
    key: s[1]
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 34,
      lineHeight: 1
    }
  }, s[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px var(--font-body)',
      color: 'var(--ink-soft)',
      marginTop: 4
    }
  }, s[1]))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      padding: 32,
      borderTop: '3px solid var(--plum)',
      boxShadow: 'var(--shadow-max)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 13px var(--font-mono)',
      color: 'var(--ink-soft)',
      marginBottom: 16
    }
  }, "Contoh: Kostella 362 \xB7 kamar 105 \xB7 Standard"), /*#__PURE__*/React.createElement(ReceiptTable, {
    rows: [{
      label: 'Sewa bulanan',
      value: 'Rp 1.650.000'
    }, {
      label: 'Deposit (dikembalikan)',
      value: 'Rp 1.500.000'
    }, {
      label: 'Listrik',
      value: 'dihitung terpisah',
      soft: true
    }, {
      label: 'Parkir motor',
      value: 'gratis',
      soft: true
    }],
    total: {
      label: 'Bayar di awal',
      value: 'Rp 3.150.000'
    }
  }))));
}
function CaraSewa() {
  const steps = [['01', 'Cari', 'Pilih kawasan, lihat kamar yang benar-benar kosong.', 'Search'], ['02', 'Jadwalkan survei', 'Datang lihat kamarnya. Ditemani pengelola gedung.', 'CalendarCheck'], ['03', 'Ajukan sewa', 'Isi data, pilih tanggal masuk.', 'FileText'], ['04', 'Bayar dan masuk', 'Bayar di awal, terima kunci di hari yang sama.', 'KeyRound']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--paper)',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: '96px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Cara sewa"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 14px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, "Dari cari sampai masuk, bisa dalam satu hari.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 0,
      marginTop: 40
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s[0],
    style: {
      padding: '0 28px 0 0',
      borderLeft: i ? '1px solid var(--line)' : 'none',
      paddingLeft: i ? 28 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 44,
      lineHeight: 1,
      color: 'var(--plum)'
    }
  }, s[0]), /*#__PURE__*/React.createElement(Icon, {
    name: s[3],
    size: 20,
    style: {
      color: 'var(--ink-soft)',
      marginTop: 4
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 20px/1.3 var(--font-body)',
      margin: '14px 0 8px'
    }
  }, s[1]), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 14px/1.6 var(--font-body)',
      color: 'var(--ink-soft)',
      margin: 0
    }
  }, s[2]))))));
}
function Franchise() {
  return /*#__PURE__*/React.createElement("section", {
    id: "franchise",
    style: {
      background: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 48,
      padding: '72px 32px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionEyebrow, {
    inverse: true
  }, "Punya kos?"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '600 28px/1.3 var(--font-body)',
      color: 'var(--stone)',
      margin: '16px 0 0',
      maxWidth: 620,
      letterSpacing: '-0.01em'
    }
  }, "Kami mengelola 31 gedung. Kami juga bisa mengelola milik Anda."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "inverse"
  }, "Pelajari kemitraan"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 140,
      lineHeight: 0.85,
      color: 'transparent',
      WebkitTextStroke: '1px var(--ink-soft)'
    }
  }, "31")));
}
function FooterMap() {
  const ref = React.useRef();
  React.useEffect(() => {
    if (!ref.current || !window.L || ref.current._map) return;
    const map = L.map(ref.current, {
      scrollWheelZoom: false
    }).setView([-6.1645, 106.7890], 16);
    L.tileLayer('https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(map);
    [['362', -6.1636, 106.7884], ['361', -6.1640, 106.7892], ['351', -6.1652, 106.7898], ['2A3', -6.1659, 106.7880]].forEach(p => L.marker([p[1], p[2]], {
      icon: L.divIcon({
        className: '',
        html: `<div style="background:#57182F;color:#fff;font:500 12px 'IBM Plex Mono',monospace;padding:3px 7px;border-radius:4px;white-space:nowrap;box-shadow:0 1px 3px rgba(22,23,26,.3)">${p[0]}</div>`,
        iconSize: null
      })
    }).addTo(map));
    ref.current._map = map;
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      height: 300,
      borderRadius: 12,
      border: '1px solid var(--line)',
      overflow: 'hidden'
    }
  });
}
function Footer() {
  const buildings = [['362', 'Jl. Dr. Susilo 2 No. 362'], ['361', 'Jl. Dr. Susilo 2 No. 361'], ['351', 'Jl. Dr. Susilo 2 No. 351'], ['2A3', 'Jl. Dr. Susilo 2A No. 3']];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--paper)',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: '72px 32px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Gedung kami di Grogol"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(FooterMap, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px var(--font-body)',
      color: 'var(--ink-soft)',
      marginTop: 8
    }
  }, "Lokasi perkiraan \u2014 alamat pasti dikirim saat jadwal survei dikonfirmasi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Alamat gedung"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px 24px'
    }
  }, buildings.map(b => /*#__PURE__*/React.createElement("div", {
    key: b[0],
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      font: '400 13px/1.5 var(--font-mono)',
      color: 'var(--ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 15,
      color: 'var(--ink)',
      minWidth: 34
    }
  }, b[0]), b[1]))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px var(--font-body)',
      color: 'var(--ink-soft)',
      marginTop: 12
    }
  }, "Grogol, Jakarta Barat \xB7 + 27 gedung lain di Jakarta, Bandung, dan Bali.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--stone)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(SectionEyebrow, null, "Hubungi kami"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MessageCircle",
    size: 22,
    style: {
      color: 'var(--plum)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 22px var(--font-mono)',
      color: 'var(--ink)',
      whiteSpace: 'nowrap'
    }
  }, "0812 8000 0362"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: 'var(--plum-soft)',
      color: 'var(--plum)',
      font: '600 12px var(--font-body)',
      padding: '4px 10px',
      borderRadius: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "BadgeCheck",
    size: 14
  }), "terverifikasi")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      font: '400 14px var(--font-body)',
      color: 'var(--ink-soft)',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Clock",
    size: 18
  }), "Jam operasional 08.00\u201321.00 WIB, setiap hari"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Chat lewat WhatsApp"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid var(--line)',
      marginTop: 56,
      padding: '20px 0 24px',
      font: '400 12px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--ink)'
    }
  }, "Kostella"), /*#__PURE__*/React.createElement("span", null, "Konsep \u2014 bukan situs final"), /*#__PURE__*/React.createElement("span", null, "\xA9 Kostella 2026"))));
}
function App() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(ProofBar, {
    items: [{
      value: '2008',
      label: 'tahun berdiri'
    }, {
      value: '31',
      label: 'gedung dikelola sendiri'
    }, {
      value: '340',
      label: 'kamar'
    }, {
      value: '14 bln',
      label: 'rata-rata lama tinggal'
    }],
    style: {
      background: 'var(--paper)'
    }
  }), /*#__PURE__*/React.createElement(Kawasan, null), /*#__PURE__*/React.createElement(Biaya, null), /*#__PURE__*/React.createElement(CaraSewa, null), /*#__PURE__*/React.createElement(Franchise, null), /*#__PURE__*/React.createElement(Footer, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/beranda/standalone-app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Dashboard.jsx
try { (() => {
const {
  Button,
  Badge,
  Eyebrow,
  FloorGrid,
  FloorGridLegend,
  MetricCard
} = window.KostellaDesignSystem_f6d153;
const FLOORS = [{
  label: 'Lantai 3',
  rooms: [{
    room: '304',
    status: 'occupied'
  }]
}, {
  label: 'Lantai 2',
  rooms: [{
    room: '205',
    status: 'held'
  }, {
    room: '208',
    status: 'occupied'
  }, {
    room: '211',
    status: 'available'
  }, {
    room: '212',
    status: 'occupied'
  }]
}, {
  label: 'Lantai 1',
  rooms: [{
    room: '101',
    status: 'occupied'
  }, {
    room: '105',
    status: 'available'
  }, {
    room: '107',
    status: 'occupied'
  }]
}];
const BILLS = [['205', 'Sari W.', '16 Jul', 'terlambat', 'Rp 50.000'], ['208', 'Dina P.', '1 Agu', 'belum dibayar', '—'], ['212', 'Maya K.', '1 Agu', 'belum dibayar', '—'], ['304', 'Rina S.', '5 Jul', 'lunas', '—'], ['101', 'Ayu L.', '3 Jul', 'lunas', '—']];
const SURVEYS = [['10.00', 'Nadia Putri', '0812 3456 7890'], ['13.30', 'Ibu Hartono (orang tua)', '0813 9876 5432'], ['16.00', 'Tasya A.', '0857 1122 3344']];
function Header() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: 'var(--paper)',
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1376,
      margin: '0 auto',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      height: 64
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 18
    }
  }, "Kostella ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-soft)',
      fontWeight: 500
    }
  }, "Pengelola")), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--stone)',
      border: '1px solid var(--line)',
      borderRadius: 4,
      padding: '8px 14px',
      font: '500 15px var(--font-mono)',
      cursor: 'pointer',
      color: 'var(--ink)'
    }
  }, "362 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, "\u25BE")), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      font: '400 14px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, "Rabu, 29 Juli 2026")));
}
function StatusText({
  s
}) {
  const map = {
    terlambat: 'var(--held)',
    'belum dibayar': 'var(--ink)',
    lunas: 'var(--available)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: map[s] || 'var(--ink)',
      fontWeight: 500
    }
  }, s);
}
function Bills() {
  const th = {
    font: '600 11px var(--font-body)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--ink-soft)',
    textAlign: 'left',
    padding: '10px 16px',
    borderBottom: '1px solid var(--line)'
  };
  const td = {
    font: '400 14px var(--font-mono)',
    padding: '12px 16px',
    borderBottom: '1px solid var(--line)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Kamar', 'Penghuni', 'Jatuh tempo', 'Status', 'Denda'].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      ...th,
      textAlign: i >= 2 ? 'right' : 'left'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, BILLS.map(b => /*#__PURE__*/React.createElement("tr", {
    key: b[0]
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 500
    }
  }, b[0]), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontFamily: 'var(--font-body)'
    }
  }, b[1]), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    }
  }, b[2]), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right',
      fontFamily: 'var(--font-body)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(StatusText, {
    s: b[3]
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    }
  }, b[4]))))));
}
function App() {
  const [room, setRoom] = React.useState('211');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1376,
      margin: '0 auto',
      padding: '24px 32px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(MetricCard, {
    label: "Okupansi",
    value: "8/11",
    detail: "2 kamar kosong, 1 dibooking"
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Pendapatan bulan berjalan",
    value: "Rp 14,2 jt",
    detail: "dari Rp 18,9 jt target"
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Tagihan belum dibayar",
    value: "3",
    detail: "1 terlambat, denda Rp 50.000"
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Survei terjadwal",
    value: "3",
    detail: "hari ini"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Kisi lantai \u2014 sama dengan halaman publik"), /*#__PURE__*/React.createElement(FloorGridLegend, null)), /*#__PURE__*/React.createElement(FloorGrid, {
    compact: true,
    floors: FLOORS,
    selectedRoom: room,
    onSelect: r => setRoom(r.room)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 20,
      paddingTop: 16,
      borderTop: '1px solid var(--line)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 14px var(--font-mono)',
      marginRight: 8
    }
  }, "Kamar ", room), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "Tandai terisi"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "Atur harga"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Blokir untuk perbaikan"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 16
    }
  }, "Survei hari ini"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, SURVEYS.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 0',
      borderTop: i ? '1px solid var(--line)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 15px var(--font-mono)',
      minWidth: 48
    }
  }, s[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 14px var(--font-body)'
    }
  }, s[1]), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px var(--font-mono)',
      color: 'var(--ink-soft)'
    }
  }, s[2])), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "Konfirmasi")))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 12
    }
  }, "Tagihan"), /*#__PURE__*/React.createElement(Bills, null))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/detail/Detail.jsx
try { (() => {
const {
  Button,
  Badge,
  Eyebrow,
  FloorGrid,
  FloorGridLegend,
  ReceiptTable
} = window.KostellaDesignSystem_f6d153;
const A = '../../assets/';
const PHOTOS = [{
  src: A + 'DHP00714-large.jpg',
  label: 'Kamar Superior'
}, {
  src: A + 'Cove-Arleyta_Deluxe-Queen-1-large.jpg',
  label: 'Kamar Standard'
}, {
  src: A + 'Cove-Arleyta_Deluxe-Queen-Bathroom-large.jpg',
  label: 'Kamar mandi dalam'
}, {
  src: A + 'DHP00456-large.jpg',
  label: 'Ruang bersama'
}, {
  src: A + 'WhatsApp-Image-2022-10-11-at-13.53.44-rotated-e1669953526877.jpeg',
  label: 'Tampak depan'
}];
const ROOMS = {
  '101': {
    type: 'Standard',
    price: 'Rp1.650.000',
    status: 'occupied',
    photo: 1
  },
  '105': {
    type: 'Standard',
    price: 'Rp1.650.000',
    status: 'available',
    size: '3×4 m',
    avail: 'kosong hari ini',
    photo: 1
  },
  '107': {
    type: 'Standard',
    price: 'Rp1.650.000',
    status: 'occupied',
    photo: 1
  },
  '205': {
    type: 'Superior',
    price: 'Rp1.950.000',
    status: 'held',
    photo: 0
  },
  '208': {
    type: 'Superior',
    price: 'Rp1.950.000',
    status: 'occupied',
    photo: 0
  },
  '211': {
    type: 'Standard',
    price: 'Rp1.650.000',
    status: 'available',
    size: '3×4 m',
    avail: 'kosong 1 Agustus',
    photo: 0
  },
  '212': {
    type: 'Superior',
    price: 'Rp1.950.000',
    status: 'occupied',
    photo: 0
  },
  '304': {
    type: 'Pojok',
    price: 'Rp2.100.000',
    status: 'occupied',
    photo: 0
  }
};
const FLOORS = [{
  label: 'Lantai 3',
  rooms: ['304']
}, {
  label: 'Lantai 2',
  rooms: ['205', '208', '211', '212']
}, {
  label: 'Lantai 1',
  rooms: ['101', '105', '107']
}].map(f => ({
  label: f.label,
  rooms: f.rooms.map(r => ({
    room: r,
    type: ROOMS[r].type,
    price: ROOMS[r].price,
    status: ROOMS[r].status
  }))
}));
const wrap = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 32px'
};
function Header() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: '1px solid var(--line)',
      background: 'var(--stone)',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 64
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "../beranda/index.html",
    style: {
      fontWeight: 600,
      fontSize: 20,
      color: 'var(--ink)'
    }
  }, "Kostella"), /*#__PURE__*/React.createElement("a", {
    href: "../pencarian/index.html",
    style: {
      font: '500 14px var(--font-body)'
    }
  }, "\u2190 Hasil pencarian")));
}
function HeroGallery() {
  const [active, setActive] = React.useState(0);
  const next1 = PHOTOS[(active + 1) % PHOTOS.length],
    next2 = PHOTOS[(active + 2) % PHOTOS.length];
  const thumbBtn = {
    position: 'relative',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    borderRadius: 12,
    overflow: 'hidden',
    background: '#DDDBD4',
    flex: 1
  };
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 12,
      height: 480
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 12,
      overflow: 'hidden',
      background: '#DDDBD4'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PHOTOS[active].src,
    alt: PHOTOS[active].label,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(22,23,26,0) 55%, rgba(22,23,26,0.45) 100%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 28,
      bottom: 16,
      display: 'flex',
      alignItems: 'baseline',
      gap: 20,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 110,
      lineHeight: 0.85,
      letterSpacing: '-0.02em',
      color: '#fff',
      textShadow: '0 2px 16px rgba(22,23,26,0.35)'
    }
  }, "362"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 14px var(--font-body)',
      color: '#fff',
      textShadow: '0 1px 6px rgba(22,23,26,0.5)'
    }
  }, PHOTOS[active].label, " \xB7 ", active + 1, "/", PHOTOS.length)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 28,
      top: 20,
      background: 'var(--plum)',
      color: '#fff',
      font: '600 12px var(--font-body)',
      padding: '5px 12px',
      borderRadius: 4
    }
  }, "Khusus putri")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: thumbBtn,
    onClick: () => setActive((active + 1) % PHOTOS.length)
  }, /*#__PURE__*/React.createElement("img", {
    src: next1.src,
    alt: next1.label,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("button", {
    style: thumbBtn,
    onClick: () => setActive((active + 2) % PHOTOS.length)
  }, /*#__PURE__*/React.createElement("img", {
    src: next2.src,
    alt: next2.label,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 12,
      bottom: 12,
      background: 'rgba(22,23,26,0.72)',
      color: '#fff',
      font: '500 12px var(--font-body)',
      padding: '6px 12px',
      borderRadius: 4
    }
  }, "Lihat semua foto")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: '20px 4px 0'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '600 21px/1.3 var(--font-body)',
      margin: 0
    }
  }, "Jl. Dr. Susilo 2 No. 362, Grogol, Jakarta Barat"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 14px/1.6 var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, "Trisakti 1 km \xB7 Terminal Grogol 0,2 km \xB7 Central Park 0,2 km"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Jadwalkan survei"))));
}
function RoomPanel({
  room
}) {
  const r = ROOMS[room];
  const canBook = r.status === 'available';
  const [img, setImg] = React.useState(null);
  React.useEffect(() => {
    setImg(null);
  }, [room]);
  const shown = img == null ? r.photo : img;
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'sticky',
      top: 88,
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      boxShadow: 'var(--shadow-max)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '3/2',
      background: '#DDDBD4'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PHOTOS[shown].src,
    alt: PHOTOS[shown].label,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      padding: '8px 12px',
      borderBottom: '1px solid var(--line)'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setImg(i),
    style: {
      flex: 1,
      aspectRatio: '1',
      padding: 0,
      border: 'none',
      cursor: 'pointer',
      borderRadius: 4,
      overflow: 'hidden',
      outline: shown === i ? '2px solid var(--plum)' : 'none',
      outlineOffset: 1
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: PHOTOS[i].src,
    alt: PHOTOS[i].label,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 15px var(--font-mono)'
    }
  }, "Kamar ", room, " \xB7 ", r.type), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 13px var(--font-mono)',
      color: canBook ? 'var(--available)' : r.status === 'held' ? 'var(--held)' : 'var(--ink-soft)'
    }
  }, r.avail || (r.status === 'held' ? 'dibooking' : 'terisi'))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 32,
      margin: '8px 0 4px'
    }
  }, r.price, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--ink-soft)'
    }
  }, " /bulan")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px/1.6 var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, r.size || '3×4 m', " \xB7 AC \xB7 kamar mandi dalam \xB7 kasur 120 \xB7 meja & lemari"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    disabled: !canBook
  }, "Jadwalkan survei"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    disabled: !canBook
  }, "Ajukan sewa"))));
}
function Sekitar() {
  const pois = [{
    l: 'Trisakti',
    x: 18,
    y: 64
  }, {
    l: 'Untar',
    x: 78,
    y: 22
  }, {
    l: 'Terminal Grogol',
    x: 34,
    y: 28
  }, {
    l: 'Central Park',
    x: 66,
    y: 70
  }, {
    l: 'Indomaret',
    x: 48,
    y: 62
  }, {
    l: 'RS Royal Taruma',
    x: 70,
    y: 44
  }, {
    l: 'BCA',
    x: 28,
    y: 46
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 320,
      background: '#E4E2DB',
      borderRadius: 12,
      border: '1px solid var(--line)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
      backgroundSize: '64px 64px',
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 260,
      height: 260,
      transform: 'translate(-50%,-50%)',
      border: '1px dashed var(--ink-soft)',
      borderRadius: '50%'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      background: 'var(--plum)',
      color: '#fff',
      font: '500 14px var(--font-mono)',
      padding: '5px 10px',
      borderRadius: 4
    }
  }, "362"), pois.map(p => /*#__PURE__*/React.createElement("span", {
    key: p.l,
    style: {
      position: 'absolute',
      left: `${p.x}%`,
      top: `${p.y}%`,
      font: '500 12px var(--font-body)',
      color: 'var(--ink)',
      background: 'rgba(255,255,255,0.8)',
      padding: '2px 6px',
      borderRadius: 4
    }
  }, p.l)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 12,
      font: '400 11px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, "radius 10 menit jalan kaki \u2014 peta konsep"));
}
function App() {
  const [room, setRoom] = React.useState('105');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement(HeroGallery, null), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 48,
      alignItems: 'start',
      padding: '48px 32px 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Semua kamar \xB7 pilih untuk lihat detail"), /*#__PURE__*/React.createElement(FloorGridLegend, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      padding: 32
    }
  }, /*#__PURE__*/React.createElement(FloorGrid, {
    floors: FLOORS,
    selectedRoom: room,
    onSelect: r => setRoom(r.room),
    animate: true
  }))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Rincian biaya \u2014 kamar ", room), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 12,
      padding: 32,
      marginTop: 16,
      borderTop: '3px solid var(--plum)'
    }
  }, /*#__PURE__*/React.createElement(ReceiptTable, {
    rows: [{
      label: 'Sewa bulanan',
      value: ROOMS[room].price.replace('Rp', 'Rp ')
    }, {
      label: 'Deposit (dikembalikan)',
      value: 'Rp 1.500.000'
    }, {
      label: 'Listrik',
      value: 'dihitung terpisah',
      soft: true
    }, {
      label: 'Orang kedua',
      value: 'Rp 400.000 /bulan'
    }, {
      label: 'Tamu menginap',
      value: 'Rp 100.000 /malam'
    }, {
      label: 'Parkir motor',
      value: 'gratis',
      soft: true
    }],
    total: {
      label: 'Bayar di awal',
      value: room === '205' ? 'Rp 3.450.000' : 'Rp 3.150.000'
    },
    note: "Pembayaran tanggal 1\u201316 tiap bulan. Keterlambatan dikenakan denda sesuai perjanjian sewa."
  }))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginBottom: 16
    }
  }, "Sekitar"), /*#__PURE__*/React.createElement(Sekitar, null)), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Aturan rumah"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px 32px',
      marginTop: 16
    }
  }, [['Jam tamu', 'Tamu diterima 08.00–21.00 di area bersama.'], ['Pasangan', 'Khusus putri. Tamu laki-laki hanya di ruang tamu.'], ['Kebersihan', 'Kamar dibersihkan penghuni; area bersama oleh petugas setiap hari.'], ['Parkir', 'Motor gratis di halaman dalam. Mobil tidak tersedia.']].map(a => /*#__PURE__*/React.createElement("div", {
    key: a[0]
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '600 15px var(--font-body)',
      margin: '0 0 4px'
    }
  }, a[0]), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 14px/1.6 var(--font-body)',
      color: 'var(--ink-soft)',
      margin: 0
    }
  }, a[1])))))), /*#__PURE__*/React.createElement(RoomPanel, {
    room: room
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/detail/Detail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/pencarian/Pencarian.jsx
try { (() => {
const {
  Button,
  Chip,
  Badge,
  Eyebrow
} = window.KostellaDesignSystem_f6d153;
const RESULTS = [{
  number: '362',
  street: 'Jl. Dr. Susilo 2 No. 362, Grogol',
  type: 'Khusus putri',
  fac: ['Kamar mandi dalam', 'AC', 'Wifi'],
  walk: '12 menit jalan kaki ke Trisakti',
  price: 'Rp1.650.000',
  avail: '3 dari 8 kamar kosong',
  status: 'available'
}, {
  number: '351',
  street: 'Jl. Dr. Susilo 2 No. 351, Grogol',
  type: 'Campur',
  fac: ['Kamar mandi dalam', 'AC', 'Dapur bersama'],
  walk: '14 menit jalan kaki ke Trisakti',
  price: 'Rp1.550.000',
  avail: '5 dari 12 kamar kosong',
  status: 'available'
}, {
  number: '360',
  street: 'Jl. Dr. Susilo 2 No. 360, Grogol',
  type: 'Khusus putri',
  fac: ['AC', 'Wifi', 'Laundry'],
  walk: '12 menit jalan kaki ke Trisakti',
  price: 'Rp1.650.000',
  avail: 'sisa 1 kamar',
  status: 'held'
}, {
  number: '2A3',
  street: 'Jl. Dr. Susilo 2A No. 3, Grogol',
  type: 'Campur',
  fac: ['Kamar mandi dalam', 'AC', 'Parkir motor'],
  walk: '10 menit jalan kaki ke Untar',
  price: 'Rp2.100.000',
  avail: 'penuh',
  status: 'occupied'
}];
const FILTERS = ['Putri', 'Campur', 'Kamar mandi dalam', 'AC', 'Bisa pasutri', '< Rp2 juta'];
function Header() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: '1px solid var(--line)',
      background: 'var(--paper)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1376,
      margin: '0 auto',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      height: 64
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "../beranda/index.html",
    style: {
      fontWeight: 600,
      fontSize: 20,
      color: 'var(--ink)'
    }
  }, "Kostella"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 14px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, "Dekat ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink)',
      fontWeight: 600
    }
  }, "Trisakti/Untar"), " \xB7 urut jarak terdekat"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Jadwalkan survei"))));
}
function StatusLine({
  r
}) {
  const color = r.status === 'available' ? 'var(--available)' : r.status === 'held' ? 'var(--held)' : 'var(--ink-soft)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 13px var(--font-mono)',
      color
    }
  }, r.avail);
}
function ResultCard({
  r,
  active,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      gap: 20,
      background: 'var(--paper)',
      border: active ? '1px solid var(--ink)' : '1px solid var(--line)',
      borderRadius: 12,
      overflow: 'hidden',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-max)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220,
      aspectRatio: '4/3',
      background: '#DDDBD4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink-soft)',
      fontSize: 12,
      flexShrink: 0
    }
  }, "foto 4:3"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px 16px 0',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '125%',
      fontWeight: 700,
      fontSize: 32,
      lineHeight: 1
    }
  }, r.number), /*#__PURE__*/React.createElement(Badge, {
    tone: "plum"
  }, r.type)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 14px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, r.street), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, r.fac.join(' · '), " \xB7 ", r.walk), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 16px var(--font-mono)'
    }
  }, r.price, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-soft)',
      fontSize: 13
    }
  }, "/bulan")), /*#__PURE__*/React.createElement(StatusLine, {
    r: r
  }))));
}
function MapPanel({
  active
}) {
  const pins = [{
    n: '362',
    x: 38,
    y: 42
  }, {
    n: '351',
    x: 52,
    y: 58
  }, {
    n: '360',
    x: 44,
    y: 38
  }, {
    n: '2A3',
    x: 62,
    y: 30
  }];
  const pois = [{
    l: 'Trisakti',
    x: 22,
    y: 68
  }, {
    l: 'Untar',
    x: 74,
    y: 18
  }, {
    l: 'Central Park',
    x: 70,
    y: 72
  }, {
    l: 'Terminal Grogol',
    x: 30,
    y: 30
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 24,
      height: 'calc(100vh - 160px)',
      minHeight: 480,
      background: '#E4E2DB',
      borderRadius: 12,
      border: '1px solid var(--line)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
      backgroundSize: '64px 64px',
      opacity: 0.5
    }
  }), pois.map(p => /*#__PURE__*/React.createElement("span", {
    key: p.l,
    style: {
      position: 'absolute',
      left: `${p.x}%`,
      top: `${p.y}%`,
      font: '500 11px var(--font-body)',
      color: 'var(--ink-soft)',
      letterSpacing: '0.04em'
    }
  }, p.l)), pins.map(p => /*#__PURE__*/React.createElement("span", {
    key: p.n,
    style: {
      position: 'absolute',
      left: `${p.x}%`,
      top: `${p.y}%`,
      transform: 'translate(-50%,-50%)',
      background: active === p.n ? 'var(--plum)' : 'var(--ink)',
      color: '#fff',
      font: '500 13px var(--font-mono)',
      padding: '4px 8px',
      borderRadius: 4
    }
  }, p.n)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 12,
      font: '400 11px var(--font-body)',
      color: 'var(--ink-soft)'
    }
  }, "Grogol, Jakarta Barat \u2014 peta konsep"));
}
function EmptyState() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      border: '1px dashed var(--line)',
      borderRadius: 12,
      padding: '32px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: '600 16px var(--font-body)',
      margin: 0
    }
  }, "Belum ada kamar kosong di Setiabudi."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: '400 14px/1.6 var(--font-body)',
      color: 'var(--ink-soft)',
      margin: '8px 0 16px'
    }
  }, "Yang terdekat ada di Kebayoran, 15 menit."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "Lihat Kebayoran"));
}
function App() {
  const [filters, setFilters] = React.useState(['Putri']);
  const [active, setActive] = React.useState('362');
  const toggle = f => setFilters(v => v.includes(f) ? v.filter(x => x !== f) : [...v, f]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, null), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1376,
      margin: '0 auto',
      padding: '24px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 24,
      flexWrap: 'wrap'
    }
  }, FILTERS.map(f => /*#__PURE__*/React.createElement(Chip, {
    key: f,
    selected: filters.includes(f),
    onClick: () => toggle(f)
  }, f))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '60fr 40fr',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "4 properti \xB7 Grogol"), RESULTS.map(r => /*#__PURE__*/React.createElement(ResultCard, {
    key: r.number,
    r: r,
    active: active === r.number,
    onClick: () => {
      setActive(r.number);
      if (r.number === '362') location.href = '../detail/index.html';
    }
  })), /*#__PURE__*/React.createElement(EmptyState, null)), /*#__PURE__*/React.createElement(MapPanel, {
    active: active
  }))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/pencarian/Pencarian.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.RoomCell = __ds_scope.RoomCell;

__ds_ns.FloorGrid = __ds_scope.FloorGrid;

__ds_ns.FloorGridLegend = __ds_scope.FloorGridLegend;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.MetricCard = __ds_scope.MetricCard;

__ds_ns.ProofBar = __ds_scope.ProofBar;

__ds_ns.PropertyCard = __ds_scope.PropertyCard;

__ds_ns.ReceiptTable = __ds_scope.ReceiptTable;

})();
