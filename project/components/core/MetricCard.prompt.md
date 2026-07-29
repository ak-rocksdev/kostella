MetricCard — dashboard stat: eyebrow label + big Archivo Expanded number + optional detail line.
ProofBar — homepage trust strip: one thin row of numbers and labels between 1px rules. No icons, ever.

```jsx
<MetricCard label="Okupansi" value="8/11" detail="2 kamar kosong" />
<ProofBar items={[
  { value: '2008', label: 'berdiri' },
  { value: '31', label: 'gedung' },
  { value: '340', label: 'kamar' },
  { value: '14 bln', label: 'rata-rata lama tinggal' },
]} />
```
