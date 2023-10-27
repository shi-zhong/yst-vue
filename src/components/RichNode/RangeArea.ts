import RichNode from './RichNode';

/**
 * 和 offset 有关的转换
 */
class RangeArea {
  constructor(length: number) {
    this.maxLen = length;
  }

  private maxLen: number;


  /**
   * 朴素的分片， 将原长度根据from to 分割成三部分， 切片长度为0时会被舍去。
   * @param from 
   * @param to 
   * @returns 
   */
  public getRanges(
    from: number,
    to: number,
  ): { type: string; range: [number, number] }[] {
    if (from > to) {
      [from, to] = [to, from];
    }

    from = from <= 0 ? 0 : Math.floor(from);
    to = to >= this.maxLen ? this.maxLen : Math.floor(to);

    // 获得合法range pre aft 用于分割字符串
    return [
      { type: 'pre', range: [0, from] },
      { type: 'crt', range: [from, to] },
      { type: 'aft', range: [to, this.maxLen] },
    ].filter((i) => i.range[0] < i.range[1]) as {
      type: string;
      range: [number, number];
    }[];
  }

  /**
   * @param list 子元素长度集合
   * @param range 分割范围
   * 
   * child_index 对子元素进行一次递归切割
   */
  public getSlicePlan(list: number[], range: [number, number]) {
    let total = 0;

    const plan = {
      preSplit: { child_index: -1, range: [-1, -1] },
      midrange: [0, list.length - 1],
      aftSplit: { child_index: list.length, range: [-1, -1] },
    };

    list.forEach((i, index) => {
      if (total <= range[0] && range[0] < total + i) {
        plan.preSplit.child_index = index;
        plan.preSplit.range = [range[0] - total, i];

        if (plan.preSplit.range[0] === 0) {
          plan.midrange[0] = index;
          // 标记为取消
          plan.preSplit.child_index = -1;
        } else {
          plan.midrange[0] = index + 1;
        }
      }

      if (total <= range[1] && range[1] < total + i) {
        plan.aftSplit.child_index = index;
        plan.aftSplit.range = [0, range[1] - total];

        if (plan.aftSplit.range[1] === 0) {
          // 标记为取消
          plan.aftSplit.child_index = list.length;
        }
        plan.midrange[1] = index - 1;
      }

      total += i;
    });

    return {
      preSplit: plan.preSplit.child_index != -1 ? plan.preSplit : null,
      midrange: plan.midrange[0] <= plan.midrange[1] ? plan.midrange : null,
      aftSplit: plan.aftSplit.child_index != list.length ? plan.aftSplit : null,
    };
  }

  static convertOffsetInParent(that: RichNode, offset: number) {
    if (that.parent === null) return offset;

    let total = 0;
    let flag = true;
    that.parent.children.forEach((i) => {
      if (flag) {
        if (i.key !== that.key) {
          total += i.length;
        } else {
          total += offset;
          flag = false;
        }
      }
    });
    return total;
  }

  static convertOffsetToKeyNode(that: RichNode, key: string, offset: number) {
    // 相对于自己的offset
    let offset_copy = offset;

    if (that === null || that.parent === null) return offset;

    /**
     * 判断自己是否符合key
     *
     * 不符合就算出当前偏移值在父节点中的偏移
     * that 指向父节点
     *
     * 最后返回符合key值节点的偏移
     */

    while (that.key !== key) {
      if (that.parent === null) return -1;
      offset_copy = this.convertOffsetInParent(that, offset_copy);
      that = that.parent;
    }

    return offset_copy;
  }
}

export default RangeArea;
