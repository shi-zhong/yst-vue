export interface ButtonProps {
  type: 'shrink' | 'spread'
  shape?: 'round'
  balance?: boolean
  button?: string
  icon?: 'round' | 'fork' | undefined | string
  disable?: boolean
  size?: number
  attention?: boolean
}

export interface ButtonEmit {
  (event: 'click'): void
}

interface IconProps {
  icon: 'round' | 'fork' | string
  size: number | undefined
}
