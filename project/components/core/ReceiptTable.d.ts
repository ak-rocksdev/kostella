/** Cost breakdown styled as a receipt — IBM Plex Mono, right-aligned values, 1px total rule.
 * @startingPoint section="Components" subtitle="Receipt-style cost table in Plex Mono" viewport="700x260"
 */
export interface ReceiptRow { label: string; value: string; /** grey value, for non-amounts like "gratis" */ soft?: boolean; }
export interface ReceiptTableProps {
  rows: ReceiptRow[];
  total?: { label: string; value: string };
  /** Small body-font footnote under the table */
  note?: string;
  style?: React.CSSProperties;
}
export declare function ReceiptTable(props: ReceiptTableProps): JSX.Element;
