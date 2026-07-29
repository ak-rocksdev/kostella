The signature Kostella element: a typographic floor-by-floor room inventory. Property pages OPEN with this, not a photo carousel. Same component on the public site and the operator dashboard — one system, two views.

```jsx
<FloorGrid
  floors={[
    { label: 'Lantai 2', rooms: [
      { room: '205', status: 'held', type: 'Superior', price: 'Rp1.950.000' },
      { room: '211', status: 'available', type: 'Standard', price: 'Rp1.650.000' },
    ]},
    { label: 'Lantai 1', rooms: [{ room: '105', status: 'available', type: 'Standard', price: 'Rp1.650.000' }]},
  ]}
  selectedRoom="105" onSelect={r => setRoom(r)} animate
/>
<FloorGridLegend />
```

Rules: cells are 0-radius (floorplan, not buttons); status shown via border+pattern, never color alone; floors listed top floor first. `compact` for dashboard. `animate` staggers cells 40ms apart on entry.
