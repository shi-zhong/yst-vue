import type {
  TimeLineItemAbs,
  TimeLineItemP,
  TimeLineItemRela,
  Thumb,
  TimeLineGroupTrackColor,
  TimeLineGroupThumbColor,
  ThumbPayload
} from '../interface';

interface Options {
  trackColor?: TimeLineGroupTrackColor;
  thumbColor?: TimeLineGroupThumbColor;
}

export class TimeLineGroup {
  constructor(
    name: string,
    weight: number,
    id: number,
    options: Options = {},
    payload: object = {}
  ) {
    this.name = name;
    this.weight = weight;
    this.id = id;
    this.payload = payload;
    this.options = {
      trackColor: '',
      thumbColor: '',
      ...options
    };
  }

  payload: object = {};

  weight = 0;

  id = 0;

  usedID = 0;

  name = '';

  options: Options = {};

  items = new Map<number, TimeLineItemP>();

  /**
   * 绝对定位添加
   * @param start
   * @param last
   * @param payload
   * @returns
   */
  addItem(start: number, last: number, payload?: ThumbPayload) {
    const item: TimeLineItemAbs = {
      id: ++this.usedID,
      type: 'abs',

      start: start,
      last: last,

      payload: payload || {},
      dep: new Set<number>()
    };

    this.items.set(this.usedID, item);

    return item;
  }

  /**
   * 相对定位添加
   * @param target
   * @param offset
   * @param last
   * @param direct
   * @param payload
   * @returns
   */
  addItemBy(
    target: number,
    offset: number,
    last: number,
    direct: 'before' | 'after',
    payload?: object
  ) {
    const targetItem = this.items.get(target)!;
    let start = 0;
    if (direct === 'before') {
      start = targetItem.start - last - offset;
    } else {
      start = targetItem.start + targetItem.last + offset;
    }
    const item: TimeLineItemRela = {
      id: ++this.usedID,
      type: 'rela',

      start: start,

      target: target,
      offset: offset,
      last: last,
      direct: direct,

      payload: payload || {},
      dep: new Set()
    };

    this.items.set(this.usedID, item);

    return item;
  }

  addItemBefore(target: number, offset: number, last: number, payload?: ThumbPayload) {
    if (this.items.has(target)) {
      const item = this.addItemBy(target, offset, last, 'before', payload);
      this.items.get(target)!.dep.add(item.id);
      return item;
    }
  }

  addItemAfter(target: number, offset: number, last: number, payload?: ThumbPayload) {
    if (this.items.has(target)) {
      const item = this.addItemBy(target, offset, last, 'after', payload);
      this.items.get(target)!.dep.add(item.id);
      return item;
    }
  }

  modifyItem(target: number, modify: Partial<Omit<TimeLineItemP, 'id' | 'dep'>>) {
    const item = this.items.get(target)!;
    if (item) {
      // modify
      if (modify.type === undefined || item.type === modify.type) {
        // type not change
        const newItem: TimeLineItemP = {
          ...item,
          ...modify,
          payload: { ...item.payload, ...(modify.payload || {}) }
        } as any;

        if (item.type === 'abs' && (item.start !== newItem.start || item.last !== newItem.last)) {
          // 绝对的位置变化
          // update deps
          newItem.dep.forEach((id) => this.updateDeps(id));
        }

        if (
          item.type === 'rela' &&
          newItem.type === 'rela' &&
          (item.last !== newItem.last ||
            item.target !== newItem.target ||
            item.offset !== newItem.offset ||
            item.direct !== newItem.direct)
        ) {
          // 更新相对位置
          const oldStart = item.start;
          const target = this.items.get(item.target)!;

          if (item.direct === 'before') {
            newItem.start = target.start - item.last - item.offset;
          } else {
            newItem.start = target.start + target.last + item.offset;
          }

          if (oldStart !== newItem.start || item.last !== newItem.last) {
            newItem.dep.forEach((id) => this.updateDeps(id));
          }
        }
        this.items.set(newItem.id, newItem);
      } else {
        // type change
        if (modify.type === 'abs') {
          const newItem: TimeLineItemAbs = {
            id: item.id,
            type: 'abs',
            start: modify.start ?? item.start,
            last: modify.last ?? item.last,
            dep: item.dep,
            payload: {
              ...item.payload,
              ...(modify.payload || {})
            }
          };
          this.items.set(newItem.id, newItem);
        } else {
          // @ts-ignore
          const target = this.items.get(modify.target);
          if (target === undefined) return false;

          const newItem: TimeLineItemRela = {
            // @ts-ignore
            target: modify.target,
            // @ts-ignore
            offset: modify.offset || 0,
            // @ts-ignore
            direct: modify.direct || 'after',
            id: item.id,
            type: 'rela',
            start: modify.start ?? item.start,
            last: modify.last ?? item.last,
            dep: item.dep,
            payload: {
              ...item.payload,
              ...(modify.payload || {})
            }
          };

          if (newItem.direct === 'before') {
            newItem.start = target.start - newItem.last - newItem.offset;
          } else {
            newItem.start = target.start + target.last + newItem.offset;
          }

          newItem.dep.forEach((id) => this.updateDeps(id));
        }
      }
    }
  }

  /**
   * @todo 在删除某一个项时，需要对相应的依赖项进行修改
   * @param id
   * @returns
   */
  removeItem(id: number) {
    const item = this.items.get(id);
    if (item && item.dep.size !== 0) {
      item.dep.forEach((depID) => {
        // update dep
        const dep = this.items.get(depID);
        if (dep) {
          // @ts-ignore
          delete dep.target;
          // @ts-ignore
          delete dep.offset;
          // @ts-ignore
          delete dep.direct;
          // @ts-ignore
          dep.type = 'abs';
        }
      });
    }
    return this.items.delete(id);
  }

  getItem(id: number) {
    return this.items.get(id);
  }

  /**
   * 递归更新,last变化不在此函数考虑范围
   * @param item
   * @returns
   */
  updateDeps(id: number): void {
    const item = this.items.get(id);

    if (!item || item.type === 'abs') return;

    const target = this.items.get(item.target)!;

    const oldStart = item.start;

    if (item.direct === 'before') {
      item.start = target.start - item.last - item.offset;
    } else {
      item.start = target.start + target.last + item.offset;
    }

    if (item.dep.size && oldStart !== item.start) {
      return item.dep.forEach((id) => this.updateDeps(id));
    }
  }

  buildThumbs(): Thumb[][] {
    const absoluteList: Thumb[] = [];

    // 转换成数组形式
    this.items.forEach((item, index) => {
      absoluteList.push({
        id: item.id,
        order: index,
        start: item.start,
        last: item.last,
        space: 0,
        payload: item.payload
      });
    });

    // 对绝对索引进行排序
    absoluteList.sort((pre, aft) => {
      return pre.start - aft.start;
    });

    const thumb: Thumb[][] = [[]];

    // 生成不冲突的序列表
    absoluteList.forEach((item) => {
      let loop = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const last = thumb[loop][thumb[loop].length - 1];

        if (last === undefined) {
          thumb[loop].push({
            ...item,
            space: item.start
          });
          break;
        } else if (item.start >= last.start + last.last) {
          thumb[loop].push({
            ...item,
            space: item.start - last.start - last.last
          });
          break;
        } else {
          loop++;
          if (thumb[loop] === undefined) {
            thumb[loop] = [];
          }
          continue;
        }
      }
    });

    return thumb;
  }
}
