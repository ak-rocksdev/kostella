/** Small label badge (4px radius). Status tones only for availability, never decoration. */
export interface BadgeProps {
  tone?: 'plum' | 'neutral' | 'available' | 'held' | 'occupied';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
/** Availability badge with canonical copy: "5 kamar kosong" / "Sisa 1" / "Penuh". */
export interface StatusBadgeProps {
  status: 'available' | 'held' | 'occupied';
  /** Number of empty rooms, for the available state */
  count?: number;
}
export declare function StatusBadge(props: StatusBadgeProps): JSX.Element;
