/** Kostella action button. Primary = plum; max one primary per view.
 * @startingPoint section="Components" subtitle="Plum action button — primary, secondary, ghost, inverse" viewport="700x200"
 */
export interface ButtonProps {
  /** Visual style */
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
