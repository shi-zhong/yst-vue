interface BasicCardProps {
  star: 1 | 2 | 3 | 4 | 5;
  imgUrl: string;
  lvl: number;

}

interface CardProps extends BasicCardProps {
  type: 'artifact' | 'character' | 'weapon';
  class?: string;
  selected?: boolean;
}

interface CharacterCardProps {
  // 风 雷 水 火 冰 草
  element: '风' | '雷' | '水' | '火' | '冰' | '草' | '岩';
  inTeam?: boolean;
  star: 1 | 2 | 3 | 4 | 5;
  selected?: boolean;
  eName: string;
  lvl: number;
}

export type { CardProps, CharacterCardProps, BasicCardProps };
