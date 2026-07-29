/** Dashboard metric card — eyebrow label + big Archivo number. */
export interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
  style?: React.CSSProperties;
}
export declare function MetricCard(props: MetricCardProps): JSX.Element;
/** Thin proof bar — Archivo numbers + small labels, 1px rules, NO icons. */
export interface ProofBarProps {
  items: { value: string; label: string }[];
  style?: React.CSSProperties;
}
export declare function ProofBar(props: ProofBarProps): JSX.Element;
