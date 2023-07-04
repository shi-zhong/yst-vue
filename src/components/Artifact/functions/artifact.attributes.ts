/**
 * 该文件存放和词条校验有关的函数
 */

import {
  type ArtifactSolt,
  type ArtifactLvlData,
  type ArtifactAttributesModel,
} from '../interfaces';

import CMath from '@/utils/math';

import {
  ArtifactAttributeShifts,
  ArtifactMainAttributes,
  AttributesConvertToChineseMapper,
} from '../const';

/**
 * 求出有限词条内最接近给定值的 词条
 *
 * 设 value = a * t1 + b * t2 + c * t3 + f
 * a = 词条总数; b = 档位总数; c = 档位补偿数;
 *
 * 可知 0 <= b <= 3a; 0 <= c <= a;
 * t1 > f; 将 value - a * t1 按档位分成 b 份
 * 当 b 满足 0 <= b <= 3a; f = value - a * t1 - b * t2
 * 当 b 大于 3a; f = value - a * t1 - 3a * t2;
 *
 * 由于 每一档 比例为 7：8：9：10;
 * 0次强化 0  - 7;  [-1, 6)
 * 1次强化 7  - 10; [6, 11)
 * 2次强化 14 - 20; [13, 21)
 * 3次强化 21 - 30; [20, 31)
 * 4次强化 28 - 40; [29, 41)
 * 5次强化 35 - 50; [35, 51)
 * 6次强化 42 - 60; [41, 61)
 *
 * 考虑误差且有些地方不属于任何一档 将吗，每次强化范围扩大 1 ; [x，y)
 *
 * 看得出  [11, 13) [61, +inifi) 会为 0
 * 加入特殊处理 [11, 12) 算入 1次强化, [12, 13) 算入 2次强化 [61, +inifi] 算入6次强化
 *
 * 如果所允许的强化次数不足，且没有合理的选择方案， 就按所给的最大强化次数强化
 */

/**
 * 计算单条属性的所有档位可能
 * @param tag
 * @param value
 * @param maxUpgradeTime
 * @param artifactAttributeStaticData
 * @returns {tag: string, value:number, origin:number, time:number, list: number[]}[]
 */
const getSingleSubAttribute = (
  tag: string,
  value: number,
  maxUpgradeTime: number,
  artifactAttributeStaticData: {
    [key: string]: [number, number, number, number];
  },
): { tag: string; time: number; list: number[]; value: number }[] => {
  /**
   * 根据强化次数返回档位组合
   *
   * @param value 提供的值
   * @param intensify 强化次数
   * @param shifts 每一档具体数值
   * @returns number[]
   */
  const accrodingToIntensifiedTimeGetRanks = (
    value: number,
    intensify: number,
    shifts: [number, number, number, number],
  ): number[] => {
    const stage = CMath.Round((shifts[3] - shifts[0]) / 3, 2);

    const stageRoundingCompensation = CMath.Round(
      shifts[3] - shifts[0] - stage * 3,
      2,
    );
    /**
     * intensifiedTime 强化次数
     * gears 档位数综合 [0, 1, 2, 3]
     * totalCompensation 真实数字的补偿 + 档位的补偿
     */
    let intensifiedTime = intensify;
    let gears = CMath.Round((value - intensifiedTime * shifts[0]) / stage, 0);
    const totalCompensation = CMath.Round(
      value - intensifiedTime * shifts[0] - gears * stage,
      3,
    );

    const keys = [];

    if (totalCompensation * stageRoundingCompensation > 0) {
      /**
       * 档位补偿 和 数字被舍入的误差 同号 则档位补偿 c+d 最大
       * 策略 优先分配 2号档位
       */
      for (; intensifiedTime > 0; intensifiedTime--) {
        if (2 * intensifiedTime < gears) {
          keys.push(shifts[3]);
          gears = gears - 3;
        } else if (gears >= 2) {
          keys.push(shifts[2]);
          gears = gears - 2;
        } else {
          keys.push(shifts[gears]);
          gears = 0;
        }
      }
    } else {
      /**
       *  档位补偿 和 数字被舍入的误差 异号 则档位补偿 c+d 最小
       *  总补偿为0 精度补偿部位0 c+d最小
       *  精度补偿为0 任意策略
       *  如果一定有3 优先分配 3 其次分配 1, 最后分配 2
       */
      for (; intensifiedTime > 0; intensifiedTime--) {
        if (intensifiedTime < gears && gears >= 3) {
          keys.push(shifts[3]);
          gears = gears - 3;
        } else if (intensifiedTime < gears) {
          keys.push(shifts[gears]);
          gears = 0;
        } else if (gears >= 1) {
          keys.push(shifts[1]);
          gears--;
        } else {
          keys.push(shifts[0]);
          gears = 0;
        }
      }
    }

    return keys;
  };

  const shifts: undefined | [number, number, number, number] =
    artifactAttributeStaticData[tag];

  const answers = [];

  if (shifts?.length) {
    /**
     * min. max 求出词条强化次数范围
     * stage 是该词条 每一档位的递增数
     */

    const stage = CMath.Round((shifts[3] - shifts[0]) / 3, 2);

    const min = Math.ceil(CMath.Round((value - stage) / shifts[3], 10));
    const max = Math.min(
      Math.floor(CMath.Round((value + stage) / shifts[0], 10)),
      maxUpgradeTime + 1,
    );

    // console.log(min, max);
    // 范围计算落在合理区间
    for (let i = min; i <= max; i++) {
      const keys = accrodingToIntensifiedTimeGetRanks(value, i, shifts);

      answers.push({
        tag,
        time: i,
        list: keys,
        value: CMath.Round(
          keys.reduce((x, y) => x + y, 0),
          2,
        ),
        origin: value,
      });
    }

    // 落在其余区间
    if (!answers.length) {
      const keys = accrodingToIntensifiedTimeGetRanks(value, max, shifts);

      answers.push({
        tag,
        time: max,
        list: keys,
        value: CMath.Round(
          keys.reduce((x, y) => x + y, 0),
          2,
        ),
        origin: value,
      });
    }
  }

  return answers;
};

/**
 * 检查所有的副词条数值
 * @param attributes
 * @param maxUpgradeTime
 * @param artifactAttributeStaticData
 * @returns
 */
const verifyAllSubAttributes = (
  attributes: { tag: string; value: number }[],
  maxUpgradeTime: number,
  raity: number,
) => {
  // 计算每条属性的可能值 一条属性可能有多种强化次数的可能,剩余强化次数要减去最小的可能
  let usedUpgradeTime = 0;
  let leftUpgradeTime = maxUpgradeTime;
  let flag = true;
  const artifactAttributeStaticData =
    ArtifactAttributeShifts[['one', 'two', 'three', 'four', 'five'][raity - 1]]
      .sub;

  // 负责计算数值是否正确，并给出最接近的数值
  const attributeValueCheckList = attributes.map((i) => {
    const checked = getSingleSubAttribute(
      i.tag,
      i.value,
      maxUpgradeTime,
      artifactAttributeStaticData,
    );

    // 减去最少需要的条数
    leftUpgradeTime = leftUpgradeTime - checked[0].time + 1;

    // 只有一种可能
    if (checked.length == 1) {
      if (checked[0].time == 0) {
        flag = false;
      }
      // 已经确定的词条数
      usedUpgradeTime = usedUpgradeTime + checked[0].time - 1;
      return checked[0];
    }

    return checked;
  });

  // 强化次数校验
  const upgradeTimeReduce = attributeValueCheckList.map((i) => {
    if (i instanceof Array) {
      // 按顺序选择第一个符合条件的
      for (const item of i) {
        if (
          item.time - 1 + usedUpgradeTime == leftUpgradeTime - 1 ||
          item.time - 1 + usedUpgradeTime == leftUpgradeTime
        ) {
          usedUpgradeTime = usedUpgradeTime + item.time - 1;
          return item;
        }
      }
      usedUpgradeTime += i[0].time - 1;
      leftUpgradeTime -= i[0].time - 1;
      return i[0];
    }
    return i;
  });

  const finalUpgradeTime = upgradeTimeReduce.reduce(
    (i, j) => (i += j.time - 1),
    0,
  );

  if (
    finalUpgradeTime != maxUpgradeTime &&
    finalUpgradeTime != maxUpgradeTime - 1
  ) {
    flag = false;
  }

  return {
    flag,
    list: upgradeTimeReduce,
  };
};

/**
 * 校验主属性是否存在
 * @param solt
 * @param tag
 * @returns
 */
const VerifyMainAttributeWithSoltIsExist = (
  solt: ArtifactSolt,
  tag: string,
): boolean => {
  return ArtifactMainAttributes[solt].indexOf(tag) !== -1;
};

const GetMainAttributesValue = (
  attribute: { tag: string; value: number },
  lvl: number,
  raity: number,
) => {
  const main = ArtifactAttributeShifts[
    ['one', 'two', 'three', 'four', 'five'][raity - 1]
  ] as ArtifactAttributesModel;

  const [lvl_0, lvl_grow] = main[attribute.tag] || [0, 0];

  return lvl_0 + lvl_grow * lvl;
};

/**
 * 获取属性中文
 * @param tag
 * @returns
 */
const ArtifactChineseMap = (tag: string): string => {
  return AttributesConvertToChineseMapper[tag];
};

export { verifyAllSubAttributes, VerifyMainAttributeWithSoltIsExist };
