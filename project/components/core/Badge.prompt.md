Badge — small 4px-radius label. `tone="plum"` for type badges (`Khusus putri`), neutral for meta. Status tones (available/held/occupied) are reserved for availability.

StatusBadge — canonical availability copy, always one line: `5 kosong` / `Sisa 1` / `Penuh` (no count → `Ada kamar`).

```jsx
<Badge tone="plum">Khusus putri</Badge>
<StatusBadge status="available" count={5} />
<StatusBadge status="occupied" />
```
