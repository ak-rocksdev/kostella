Cost transparency table — reads like a receipt, not marketing. Plex Mono, values right-aligned, single 1px ink rule above the total. The section competitors don't have; give it room.

```jsx
<ReceiptTable rows={[
  { label: 'Sewa bulanan', value: 'Rp 1.650.000' },
  { label: 'Deposit (dikembalikan)', value: 'Rp 1.500.000' },
  { label: 'Listrik', value: 'dihitung terpisah', soft: true },
  { label: 'Parkir motor', value: 'gratis', soft: true },
]} total={{ label: 'Bayar di awal', value: 'Rp 3.150.000' }}
   note="Pembayaran tanggal 1–16 tiap bulan." />
```
