/** Filter / search chip — horizontal chips replace sidebars and empty search fields. */
export interface ChipProps {
  selected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;
