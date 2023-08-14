/**
 * 该文件存放已经缩小到某一部位的圣遗物有关的函数
 *
 * 主要用于校验圣遗物合法性
 */

import { type ArtifactInstanceModel, type ArtifactSuitModel } from '../interfaces';

import { GetArtifactSuitInfoWithID, VerifyArtifactHasSlot } from './artifact.type';

const VerifyLvlWithRarity = (lvl: number, rarity: number): boolean => {
  return lvl <= rarity * 4 && lvl >= 0;
};

const getMaxUpgradeTime = (lvl: number) => {
  return Math.floor(lvl / 4);
};

const Verify = (suits: ArtifactSuitModel[], artifact: ArtifactInstanceModel) => {
  const { suit_id, slot, lvl, subs, main } = artifact;
  // 种类和星级 和接受的部位
  const artifactSuit = GetArtifactSuitInfoWithID(suits, suit_id);

  if (artifactSuit == null) return false;

  const chaim = [
    VerifyArtifactHasSlot(artifactSuit, slot),
    // 校验星级和等级
    VerifyLvlWithRarity(lvl, artifactSuit.rarity)
    // // 校验部位和主属性
    // this._artifact_attributes.verifyMainAttributeWithSlot(slot, main.tag),

    // // 校验主属性数值
    // this._artifact_attributes.verifyMainAttributesValue(main, lvl, rarity),
    // // 校验副属性数,
    // this._artifact_attributes.verifyAllSubAttributes(
    //   subs,
    //   this.getMaxUpgradeTime(lvl),
    //   rarity,
    // ),
  ];
  return chaim.reduce((i, j) => i && j, true);
};

export { Verify, getMaxUpgradeTime };
