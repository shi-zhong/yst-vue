export interface ButtonProps {
  type: 'shrink' | 'spread';
  shape?: 'round';
  balance?: boolean;
  button?: string;
  icon?: 'round' | 'fork' | undefined | string;
  disable?: boolean;
  size?: number;
  attention?: boolean;
  theme?: 'dark' | 'light';
  sound?: 'ding' | 'dding' | 'dong' | 'open' | 'close';
}

export interface ButtonEmit {
  (event: 'click'): void;
}
