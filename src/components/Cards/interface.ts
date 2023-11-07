export interface CardProps {
  type: 'artifact' | 'character' | 'weapon';
  star: 1 | 2 | 3 | 4 | 5;
  imgUrl: string;
  desc?: string;
  foucsing?: boolean;
}

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

export interface CharacterCardProps {
  // 风 雷 水 火 冰 草
  element: '风' | '雷' | '水' | '火' | '冰' | '草' | '岩';
  inTeam?: boolean;
  star: 1 | 2 | 3 | 4 | 5;
  foucsing?: boolean;
  eName: string;
  name?: string;
  lvl: number;
}
