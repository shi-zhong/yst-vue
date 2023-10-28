interface BasicCardProps {
  star: 1 | 2 | 3 | 4 | 5;
  imgUrl: string;
  lvl: number;
}

interface CardProps extends BasicCardProps {
  type: 'artifact' | 'character' | 'weapon';
  class?: string;
}

interface CharacterCardProps extends BasicCardProps {
  // 风 雷 水 火 冰 草
  element: '风' | '雷' | '水' | '火' | '冰' | '草' | '岩';
  selected?: boolean;
}

export type { CardProps, CharacterCardProps, BasicCardProps };
