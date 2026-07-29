/** Eyebrow label — the only place uppercase is allowed. 12px, +0.08em. */
export interface EyebrowProps {
  /** Lighter tone for dark --ink blocks */
  inverse?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
