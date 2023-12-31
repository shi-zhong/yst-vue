import { ToEqual } from '@/utils/variable';
import type { RichNodeMap } from '.';

class RichNode {
  constructor(text: string, children?: RichNode[], style?: Record<string, string>) {
    this._key = '';
    this._parent = null;

    this._text = text;
    this._children = children || [];

    this._layer = 1;

    this._length = text.length;

    // 防止爆红的伪初始化
    this._style = {};

    style && this.appendStyle(style);
  }

  private _key: string;
  private _parent: RichNode | null;

  private _text: string;
  private _children: RichNode[];

  private _style: Record<string, string>;
  private _layer: number;

  private _length: number;

  private control: RichNodeMap | null = null;

  get key() {
    return this._key;
  }

  set key(_argu) {
    if (this._key === '') {
      this._key = _argu;
    } else {
      throw Error('Key Is ReadOnly.');
    }
  }

  get type() {
    return this.children.length === 0 ? 'text' : 'group';
  }

  get parent() {
    return this._parent;
  }

  set parent(that) {
    this._parent = that;
    if (that !== null) {
      this.layer = that.layer + 1;
    } else {
      this.layer = 1;
    }
  }

  get text() {
    return this.toString();
  }

  set text(_t) {
    if (this.children.length) {
      console.error('Text Is ReadOnly.');
    } else {
      this._text = _t;
      this.length = _t.length;
    }
  }

  get children() {
    return this._children;
  }

  set children(children) {
    this._children = children;
    // 设置子元素的父元素
    this._children.forEach((i) => {
      i.parent = this;
    });
    //
    if (this.children.length) {
      this._text = '';
    }
  }

  get style() {
    return this._style;
  }

  set style(s) {
    this._style = s;
  }

  get stringStyle() {
    return Object.values(this._style).join(' ');
  }

  get layer() {
    return this._layer;
  }

  set layer(layer) {
    if (this.layer === layer) {
      return;
    } else {
      this._layer = layer;
      this._children.forEach((i) => (i.layer = layer + 1));
    }
  }

  get length() {
    return this._length;
  }

  set length(len) {
    if (this.length !== len) {
      if (this.children.length) {
        this._length = this.children.reduce((x, y) => x + y.length, 0);
      } else {
        this._length = this.text.length;
      }
      if (this.parent !== null) {
        this.parent.length = this.parent.children.reduce((x, y) => x + y.length, 0);
      }
    }
  }

  public toBeControlled(control: RichNodeMap) {
    this.control = control;
  }

  public toString(): string {
    if (this._children.length) {
      return this._children.map((i) => i.toString()).reduce((x, y) => x + y, '');
    } else {
      return this._text;
    }
  }

  public styleWillChange(style: Record<string, string>) {
    /**
     * 1. 添加新样式，与当前样式不同
     * 2. 当前为group 且 有清除样式
     */
    return Object.entries(style).some(([k, v]) => {
      return (
        (v !== '' && this.style[k] !== v) ||
        (v === '' && this.type === 'group') ||
        (v === '' && this.style[k] !== undefined)
      );
    });
  }

  // 对于一个样式来说，当当前节点未匹配到该样式时，需要交由后继节点继续处理
  // 若当前未发生实际样式变化，免去后继节点的调用执行
  public appendStyle(style: Record<string, string>) {
    const newStyle: string[] = [];

    // 样式不存在更新则不执行后续逻辑
    if (!this.styleWillChange(style)) return;

    Object.entries(style).forEach(([k, v]) => {
      // 新样式，子节点可能包含，需要移除
      if (this.style[k] === undefined && v !== '') {
        newStyle.push(k);
        this.style[k] = v;
      }

      // 更新样式
      if (v === '') {
        // 自身不存在这个样式，代表后继子孙可能存在
        if (this.style[k] === undefined) newStyle.push(k);
        delete this.style[k];
      } else {
        this.style[k] = v;
      }
    });

    [...this.children].forEach((c) => c.removeStyle(newStyle));

    this.merge();

    return this.style;
  }

  // 在设计上，style包裹在最上层，一旦搜索到，将不再向下层删除
  public removeStyle(style: string | string[] | Record<string, string>, spread: number = 1) {
    const willRemove =
      typeof style === 'string'
        ? [style]
        : style instanceof Array
        ? [...style]
        : Object.keys(style);

    if (!willRemove.length) return;

    const spreadRemove: string[] = [];

    willRemove.forEach((r) => {
      if (this.style[r] === undefined) spreadRemove.push(r);
      else delete this.style[r];
    });

    if (this.children.length && spreadRemove.length && spread) {
      [...this.children].forEach((c) => c.removeStyle(spreadRemove));
    }

    // spreadRemove 为当前未删除的样式，两者相等则未发生样式改变
    if (spreadRemove.length !== willRemove.length) this.merge();
    return this.style;
  }

  public getChildByIndex(number: number) {
    return this._children[number];
  }

  public getChildByKey(key: string) {
    return this.children.find((i) => i.key === key);
  }

  public findChild(child: RichNode) {
    return this.children.findIndex((n) => n === child);
  }

  public findLeft() {
    if (this.parent === null) return null;
    const index = this.parent.findChild(this);

    return this.parent.children[index - 1] || null;
  }

  public findRight() {
    if (this.parent === null) return null;
    const index = this.parent.findChild(this);

    return this.parent.children[index + 1] || null;
  }

  // 合并右边的兄弟节点
  public mergeRight() {
    // 判断是否可以合并
    if (this.parent === null) return false;
    const i = this.parent.findChild(this);
    if (i === this.parent.children.length - 1) return false;
    const node = this.parent.getChildByIndex(i + 1);

    if (!ToEqual(this.style, node.style)) return false;

    if (this.type === 'text' && node.type === 'text') {
      this._text += node.text;
      node.destory();
    } else if (this.type === 'group' && node.type === 'group') {
      // 两个子元素数组合并后，交界处需要一次合并尝试
      this.appendChildren(node.children);
      node.destory();
    } else {
      // 自己是text节点时，互换内部信息
      // 合并的节点变成了当前节点的子节点， 所以不需要销毁
      if (this.type === 'text') {
        const text = this.text;
        // 1. 继承node的children
        this.children = node.children;
        node.children = [];

        // 2. 传递 _text属性
        node.text = text;
      }

      this.appendChildren(node);
      node.removeStyle(Object.keys(node.style), 0);
    }

    this.updateLength();

    return true;
  }

  /**
   * 样式改变时会进行的操作，步骤如下
   * 1. 对两边节点分别进行一次合并
   * 2. 对所有兄弟节点进行一次公共样式提取，合并至父节点
   * 3. 当节点只剩一个时，整体合并至父节点
   *
   * 由于左节点对自己合并会导致当前节点的释放所有资源，需要在合并成功时，及时更改当前目标节点
   */
  public merge() {
    if (this.parent === null || this.control === null) return;

    this.mergeRight();

    const left = this.findLeft();

    const targetNode = left?.mergeRight() ? left : this;

    // merge parent
    targetNode.parent?.mergeChildrenCommonStyle();

    // 检查当前兄弟节点数量，判断是否需要把当前节点合并至父节点
    if (targetNode.parent!.children.length === 1) {
      targetNode.parent?.appendStyle(targetNode.style);

      targetNode.parent!.children = targetNode.children;
      targetNode.parent!.text = targetNode.text;

      targetNode.destory();
    }

    targetNode.updateLength();
  }

  // 提取子元素公共节点
  public mergeChildrenCommonStyle() {
    if (this.children.length <= 1) return;

    const children = [...this.children];

    const commonStyle = { ...children[0].style };

    // 提取子元素公共样式
    children.forEach((child, i) => {
      const styleName = Object.keys(commonStyle);
      if (i !== 0 && styleName.length) {
        styleName.forEach((s) => {
          if (child.style[s] !== commonStyle[s]) {
            delete commonStyle[s];
          }
        });
      }
    });

    const commonStyleNames = Object.keys(commonStyle);

    children.forEach((c) => c.removeStyle(commonStyleNames));

    this.appendStyle(commonStyle);
  }

  /**
   * 把列表元素替换到 子元素中, 自动更改 parent, 兼顾移除某个子节点的作用
   * @param key 被替换元素的key
   * @param list 替换的列表
   */
  public replaceChild(key: string, list: RichNode[]) {
    this.replaceChildren(key, 1, list);
  }

  /**
   * 把列表元素替换到 子元素中, 自动更改 parent
   * @param key 被替换起始元素的key
   * @param len 被替换的长度
   * @param list 替换的列表
   */
  public replaceChildren(key: string, len: number, list: RichNode[]) {
    const index = this._children.findIndex((i) => key === i.key);

    if (index === -1) return;

    const aftNode = this._children[index + len] || null;
    const preNode = this._children[index - 1] || null;

    const remove = this._children.splice(
      index,
      len,
      ...list.map((i) => {
        i.parent = this;
        return i;
      })
    );

    remove.forEach((n) => n.destory());

    aftNode && aftNode.findLeft()?.mergeRight();

    preNode?.mergeRight();

    this.updateLength();
  }

  public appendChildren(children: RichNode | RichNode[]) {
    const list = children instanceof Array ? [...children] : [children];

    list.forEach((l) => {
      this.children.push(l);
      l.parent = this;
    });

    // 数组合并后，交界处进行merge
    list[0].findLeft()?.mergeRight();

    this.updateLength();
  }

  public removeChild(key: string) {
    this.replaceChild(key, []);
  }

  public updateLength() {
    this.length = this.text.length;
  }

  public destory(from: RichNode | null = null) {
    // 当为null表示从高权限进行移除，richnode 表示发出移除指令的节点，只有父节点有权限进行移除
    if (from === null || from === this.parent) {
      this._children.forEach((c) => c.destory(this));
      this.parent?.removeChild(this.key);
      this.control?.delete(this);
      this.control = null;
    }
  }
}

export default RichNode;
