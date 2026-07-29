/** Property card — 4:5 photo, big property number over bottom-left, availability badge.
 * @startingPoint section="Components" subtitle="4:5 photo card with big property number" viewport="700x420"
 */
export interface PropertyCardProps {
  /** Property number, e.g. "362" */
  number: string;
  street: string;
  /** e.g. ["Trisakti 1 km", "Central Park 0,2 km"] — max 2 */
  distances?: string[];
  /** e.g. "mulai Rp1.650.000" */
  priceFrom?: string;
  status?: 'available' | 'held' | 'occupied';
  /** Empty-room count for the available badge */
  count?: number;
  photo?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function PropertyCard(props: PropertyCardProps): JSX.Element;
