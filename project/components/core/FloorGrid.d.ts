/** Signature floor grid — typographic room inventory per floor. Status is never color alone:
 * available = thick border, held = diagonal hatch, occupied = grey fill.
 * @startingPoint section="Components" subtitle="Signature kisi lantai — room inventory per floor" viewport="700x320"
 */
export interface Room {
  room: string;
  status: 'available' | 'held' | 'occupied';
  type?: string;
  price?: string;
}
export interface Floor { label: string; rooms: Room[]; }
export interface FloorGridProps {
  floors: Floor[];
  selectedRoom?: string;
  onSelect?: (room: Room) => void;
  /** Number-only 64px cells (dashboard, small contexts) */
  compact?: boolean;
  /** Stagger cells in, 40ms apart (use once, on entry) */
  animate?: boolean;
}
export declare function FloorGrid(props: FloorGridProps): JSX.Element;
export interface RoomCellProps extends Room {
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}
export declare function RoomCell(props: RoomCellProps): JSX.Element;
/** tersedia / dibooking / terisi legend row */
export declare function FloorGridLegend(props: {}): JSX.Element;
