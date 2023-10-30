import RichNode from './RichNode';

/**
 * 和 offset 有关的转换
 */
class RangeArea {
  static getArea(max: number, [from, to]: [number, number]) {
    if (from > to) {
      [from, to] = [to, from];
    }

    from = from <= 0 ? 0 : Math.floor(from);
    to = to >= max ? max : Math.floor(to);

    // 获得合法range pre aft 用于分割字符串
    return [
      [0, from],
      [from, to],
      [to, max]
    ] as [number, number][];
  }

  /**
   * @param list 子元素长度集合
   * @param range 分割范围
   *
   * child_index 对子元素进行一次递归切割
   */
  static getSlicePlan(list: number[], range: [number, number]) {
    let total = 0;

    const plan = {
      preSplit: { child_index: -1, range: [-1, -1] as [number, number] },
      aftSplit: { child_index: -1, range: [-1, -1] as [number, number] }
    };

    list.some((i, index) => {
      if (total <= range[0] && range[0] < total + i) {
        plan.preSplit.child_index = index;
        plan.preSplit.range = [range[0] - total, i];
      }

      if (total < range[1] && range[1] <= total + i) {
        plan.aftSplit.child_index = index;
        plan.aftSplit.range = [0, range[1] - total];
      }

      total += i;
      return total > range[1];
    });

    return plan;
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
