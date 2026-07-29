/** Text input, 4px radius, eyebrow label. Focus = plum border. */
export interface InputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
