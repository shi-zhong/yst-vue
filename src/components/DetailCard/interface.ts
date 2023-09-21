export interface BasicDetailCardProps {
  title: string;
  type: string;
  main: {
    key: string;
    value: string;
    [key: string]: any;
  };
  sub?: {
    key: string;
    value: string;
    [key: string]: any;
  };
  rarity: 1 | 2 | 3 | 4 | 5;
  imgUrl: string;
}
