/**
 * 该文件存放和圣遗物种类有关的函数
 *
 * 旨在把圣遗物的种类缩小到一种，包括圣遗物种类和部位
 *
 */

import { type ArtifactSuitModel } from '../interface';

/**
 * 通过圣遗物id找到对应套装
 * @param suits
 * @param id
 * @returns
 */
const GetArtifactSuitInfoWithID = (
  suits: ArtifactSuitModel[],
  id: number
): ArtifactSuitModel | null => {
  for (const suit of suits) {
    if (suit.id == id) return suit;
  }
  return null;
};

const VerifyArtifactHasSlot = (suit: ArtifactSuitModel, slot: ArtifactSlots): boolean => {
  return suit.slots[slot] !== null;
};

const VerifyArtifactHasSlots = (suit: ArtifactSuitModel, slots: ArtifactSlots[]): boolean => {
  return slots.map((slot) => VerifyArtifactHasSlot(suit, slot)).reduce((x, y) => x && y, true);
};

const GetArtifactSlot = (suit: ArtifactSuitModel, slot: ArtifactSlots) => {
  return (
    suit.slots[slot] || {
      name: '',
      imgUrl: '',
      describe: ''
    }
  );
};


const C2E = {
  生之花: 'FlowerOfLife',
  死之羽: 'PlumnOfDeath',
  时之沙: 'SandsOfEon',
  空之杯: 'GobletOfEonothem',
  理之冠: 'CircletOfLogos'
};

const E2C = {
  FlowerOfLife: '生之花',
  PlumnOfDeath: '死之羽',
  SandsOfEon: '时之沙',
  GobletOfEonothem: '空之杯',
  CircletOfLogos: '理之冠'
};

export type ArtifactSlots = keyof typeof E2C;
export type ArtifactSlotsChinese = keyof typeof C2E;

export const ArtifactSlotsToChinese = (name: ArtifactSlots) => E2C[name];
export const ArtifactSlotsToEnglish = (name: ArtifactSlotsChinese) => C2E[name];

export {
  GetArtifactSuitInfoWithID,
  VerifyArtifactHasSlot,
  VerifyArtifactHasSlots,
  GetArtifactSlot,
};
