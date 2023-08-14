/**
 * 该文件存放和圣遗物种类有关的函数
 *
 * 旨在把圣遗物的种类缩小到一种，包括圣遗物种类和部位
 *
 */

import { type ArtifactSlot, ArtifactSlotChinese, type ArtifactSuitModel } from '../interfaces';

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

const VerifyArtifactHasSlot = (suit: ArtifactSuitModel, slot: ArtifactSlot): boolean => {
  return suit.slots[slot] !== null;
};

const VerifyArtifactHasSlots = (suit: ArtifactSuitModel, slots: ArtifactSlot[]): boolean => {
  return slots.map((slot) => VerifyArtifactHasSlot(suit, slot)).reduce((x, y) => x && y, true);
};

const GetArtifactSlot = (suit: ArtifactSuitModel, slot: ArtifactSlot) => {
  return (
    suit.slots[slot] || {
      name: '',
      imgUrl: '',
      describe: ''
    }
  );
};

const GetArtifactTypeChinese = (slot: ArtifactSlot) => {
  return ArtifactSlotChinese[slot];
};

export {
  GetArtifactSuitInfoWithID,
  VerifyArtifactHasSlot,
  VerifyArtifactHasSlots,
  GetArtifactSlot,
  GetArtifactTypeChinese
};
