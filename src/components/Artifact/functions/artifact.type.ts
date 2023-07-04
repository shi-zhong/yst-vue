/**
 * 该文件存放和圣遗物种类有关的函数
 *
 * 旨在把圣遗物的种类缩小到一种，包括圣遗物种类和部位
 *
 */

import { type ArtifactSolt, ArtifactSoltChinese, type ArtifactSuitModel } from '../interfaces';

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

const VerifyArtifactHasSolt = (suit: ArtifactSuitModel, solt: ArtifactSolt): boolean => {
  return suit.solts[solt] !== null;
};

const VerifyArtifactHasSolts = (suit: ArtifactSuitModel, solts: ArtifactSolt[]): boolean => {
  return solts.map((solt) => VerifyArtifactHasSolt(suit, solt)).reduce((x, y) => x && y, true);
};

const GetArtifactSolt = (suit: ArtifactSuitModel, solt: ArtifactSolt) => {
  return (
    suit.solts[solt] || {
      name: '',
      imgUrl: '',
      describe: ''
    }
  );
};

const GetArtifactTypeChinese = (solt: ArtifactSolt) => {
  return ArtifactSoltChinese[solt];
};

export {
  GetArtifactSuitInfoWithID,
  VerifyArtifactHasSolt,
  VerifyArtifactHasSolts,
  GetArtifactSolt,
  GetArtifactTypeChinese
};
