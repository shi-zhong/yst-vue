import { TimeLineGroup } from './Group';
import type { BuildTimeLine, TimeLineThumbColor, TimeLineTrackColor } from './interface';

/**
 * 将功能点封装在一个类中，调用类方法来处理组件的长度荷载等信息
 *
 * 下有子封装类 TimeLineGroup，代表一个子分类
 *
 * group中使用 weight 和 id来进行展示排序
 */
export class TimeLine {
  constructor(
    trackColor: TimeLineTrackColor = 'aliceblue',
    thumbColor: TimeLineThumbColor = 'blue'
  ) {
    this.trackColor = trackColor;
    this.thumbColor = thumbColor;
  }

  usedID = 0;

  groups: TimeLineGroup[] = [];

  trackColor: TimeLineTrackColor = '';
  thumbColor: TimeLineThumbColor = '';

  addGroup(name: string, weight: number = 1) {
    const group = new TimeLineGroup(name, weight, this.usedID++);
    this.groups.push(group);
    return group;
  }

  removeGroup(symbol: number | string) {
    let index = -1;
    if (typeof symbol === 'number') {
      index = this.groups.findIndex((group) => group.id === symbol);
    } else {
      index = this.groups.findIndex((group) => group.name === symbol);
    }
    if (index >= 0) {
      this.groups.splice(index, 1);
    }
  }

  getGroup(symbol: number | string) {
    let index = -1;
    if (typeof symbol === 'number') {
      index = this.groups.findIndex((group) => group.id === symbol);
    } else {
      index = this.groups.findIndex((group) => group.name === symbol);
    }

    return this.groups[index];
  }

  buildTimeLine(): BuildTimeLine {
    // weight 越大 越靠前，同等weight，id越小越靠前
    this.groups.sort((a, b) => {
      return a.weight - b.weight || b.id - a.id;
    });

    return {
      trackColor: this.trackColor,
      thumbColor: this.thumbColor,
      groups: this.groups.map((group) => ({
        id: group.id,
        name: group.name,
        weight: group.weight,
        payload: group.payload,
        trackColor: group.options.trackColor,
        thumbColor: group.options.thumbColor,
        thumbs: group.buildThumbs()
      }))
    };
  }
}
