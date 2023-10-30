import { RichNode, RangeArea, RichNodeMap } from '.';

class RichNodeAction {
  constructor(private updater: () => void) {
    this.dict = new RichNodeMap();
    this.richNode = this.dict.new();
  }

  private richNode: RichNode;
  private dict: RichNodeMap;

  get node() {
    return this.richNode;
  }

  /**
   *      from                 to
   *       [-------------------]
   * [________][____________][_______]
   *       | a |     b      | c |
   *
   * 对 a,c 执行递归操作
   * 对 b 进行依次赋值操作
   *
   * [------------]
   * [_________][__________]  a = 1; b = 0; c = 1;
   *
   *       [--------]
   * [_________][__________]
   *
   *        [--------------]
   * [_________][__________]
   *
   * [--------]
   * [________]               a = 0; b = 1; c= 0;
   *
   *    [-----]
   * [___________]            a = 1; b = 0; c= 1;
   */

  /**
   * 1. 判断当前节点类型，
   *    如果是文本节点，则对节点进行分割或者对整体进行样式整合
   *    如果是群组节点，则对群组内的每一个节点进行递归操作
   * 2. 合并操作带来的问题
   *    节点丢失，合并带来的引用缺失
   *    内容变动，合并带来的内容变动，导致原有range失效？
   */
  public addStyleWithRange(
    that: RichNode,
    range: [number, number],
    style: Record<string, string>
  ): any {
    if (!that || !that.styleWillChange(style)) return;

    const areas = RangeArea.getArea(that.length, range);
    const [from, to] = areas[1];

    // 无论类型，整个节点改变样式
    if (from === 0 && to === that.length) {
      return that.appendStyle(style);
    }

    if (that.type === 'text') {
      const children: RichNode[] = [];

      areas.forEach(([f, t], i) => {
        const text = that.text.slice(f, t);

        if (!text) return;

        const node = this.dict.new(text, { ...that.style });

        if (i === 1) node.appendStyle(style);

        children.push(node);
      });

      // 如果是顶层节点
      if (that.parent === null) {
        that.style = {};
        that.children = children;
        that.mergeChildrenCommonStyle();
        // 非顶层空节点
      } else {
        // parent.children => [..., children, ...]
        that.parent.replaceChild(that.key, children);
        that.destory();
      }

      return;
    }

    // 处理 crt
    const { preSplit, aftSplit } = RangeArea.getSlicePlan(
      that.children.map((i) => i.length),
      areas[1]
    );

    // 前后分割不为空，且为同一节点
    if (preSplit.child_index === aftSplit.child_index) {
      // 给该节点进行分割
      return this.addStyleWithRange(
        that.getChildByIndex(preSplit.child_index),
        [preSplit.range[0], aftSplit.range[1]],
        style
      );
    }

    // 前后分割不为同一节点
    // 从后往前，防止index变化引起问题

    this.addStyleWithRange(that.getChildByIndex(aftSplit.child_index), aftSplit.range, style);

    const midrange = [preSplit.child_index + 1, aftSplit.child_index - 1];

    that.children.slice(midrange[0], midrange[1] + 1).forEach((c) => c.appendStyle(style));

    this.addStyleWithRange(that.getChildByIndex(preSplit.child_index), preSplit.range, style);
  }

  public initWithText(txt: string) {
    // 重置所有内容
    if (this.dict) this.dict.destroy();
    this.dict = new RichNodeMap();
    this.richNode = this.dict.new();
    this.richNode.text = txt;
  }

  /**
   * 使用回调函数初始化节点，回调函数提供一个用于管理的node集合，需要返回根节点
   * @param stage
   */
  public initWithStage(stage: (dict: RichNodeMap) => RichNode) {
    if (this.dict) this.dict.destroy();
    this.dict = new RichNodeMap();

    this.richNode = stage(this.dict);
  }

  private getSelection() {
    const selection = document.getSelection();
    if (selection === null || selection.isCollapsed) return null;
    const range = selection.getRangeAt(0);

    const getClosestRichNode = (node: any) => {
      let datasetNode = node;
      let max = 15;

      while (node !== null && max > 0) {
        if (datasetNode?.dataset?.role === 'rich') {
          return datasetNode;
        }
        datasetNode = node?.parentElement || null;
        max--;
      }

      return null;
    };

    const common = getClosestRichNode(range.commonAncestorContainer);
    const start = getClosestRichNode(range.startContainer);
    const end = getClosestRichNode(range.endContainer);

    if (common === null || start === null || end === null) return null;

    const commonNode = this.dict.get(common.dataset.key);
    const startNode = this.dict.get(start.dataset.key);
    const endNode = this.dict.get(end.dataset.key);

    if (commonNode === null || startNode === null || endNode === null) return null;

    const offsets = [
      RangeArea.convertOffsetToKeyNode(startNode, common.dataset.key, range.startOffset),
      RangeArea.convertOffsetToKeyNode(endNode, common.dataset.key, range.endOffset)
    ];

    return {
      richNode: commonNode,
      range: offsets as [number, number]
    };
  }

  public addStyle(style: string | string[] | Record<string, string>) {
    const selection = this.getSelection();
    if (selection === null) return;

    const willAppend: Record<string, string> = {};

    if (typeof style === 'string') {
      willAppend[style] = style;
    } else if (style instanceof Array) {
      style.forEach((s) => (willAppend[s] = s));
    } else {
      Object.entries(style).forEach(([k, v]) => (willAppend[k] = v));
    }

    this.addStyleWithRange(selection.richNode, selection.range, willAppend);

    window.getSelection()?.collapseToEnd();

    this.updater();
  }
}

export default RichNodeAction;
