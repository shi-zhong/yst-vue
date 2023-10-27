import { RichNode, RangeArea, RichNodeMap } from '.'

class RichNodeAction {
  constructor(private updater: () => void) {
    this.dict = new RichNodeMap()
    this.richNode = this.dict.new()
    this.HEAD = this.richNode
  }

  private richNode: RichNode
  private dict: RichNodeMap

  private HEAD: RichNode

  get node() {
    return this.richNode
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
   * [_________][__________]  a = null; b = 1; c = 1;
   *
   *       [--------]
   * [_________][__________]  a = 1; b = 0; c = 1;
   *
   *        [--------------]
   * [_________][__________]  a = 1; b = 1; c = null;
   *
   * [--------]
   * [________]               a = 0; b = 1; c= 0;
   *
   *    [-----]
   * [___________]            a = 1; b = 0; c = 1;
   */

  /**
   * @param that 顶级文本节点
   * @param from 开始的字符下标
   * @param to   结束的字符下标(不包括)
   * @param style
   */
  private addStyleAtThatWithRange(
    that: RichNode,
    from: number,
    to: number,
    style: Record<string, string>
  ) {
    const range = new RangeArea(that.length)

    const areas = range.getRanges(from, to)

    if (that.type === 'text') {
      // 该节点全选 -> 更改节点样式
      if (areas.length === 1) {
        // 应该尝试   <-合并->
        that.appendStyle(style)
        return
      }

      // 生成子节点
      const children = areas.map((i) => {
        const child = this.dict.new(that.text.slice(...i.range))
        if (that.parent === null) {
          // 在当前节点搜索会被覆盖的属性，将这些属性分发给分支节点
          const extendsStyle: Record<string, string> = {}

          Object.keys(style)
            .filter((s) => that.style[s])
            .forEach((s) => (extendsStyle[s] = that.style[s]))

          if (i.type !== 'crt') child.appendStyle(extendsStyle)
        } else {
          child.appendStyle({ ...that.style })
        }

        if (i.type === 'crt') {
          child.appendStyle(style)
        }
        return child
      })

      // 如果是顶层节点
      if (that.parent === null) {
        that.children = children
        that.removeStyle(style, 0)
        // 非顶层空节点
      } else {
        // parent.children => [..., children, ...]
        that.parent.replaceChild(that.key, children)
        that.destory()
      }

      return
    }

    // else
    // 处理 crt
    areas.forEach((i) => {
      if (i.type !== 'crt') return

      const { preSplit, midrange, aftSplit } = range.getSlicePlan(
        that.children.map((i) => i.length),
        i.range
      )

      // 前后分割不为空，且为同一节点
      if (preSplit && aftSplit && preSplit.child_index === aftSplit.child_index) {
        // 给该节点进行分割
        return this.addStyleAtThatWithRange(
          that.getChildByIndex(preSplit.child_index),
          preSplit.range[0],
          aftSplit.range[1],
          style
        )
      }

      // 前后分割不为同一节点
      // 从后往前，防止index变化引起问题
      if (aftSplit) {
        this.addStyleAtThatWithRange(
          that.getChildByIndex(aftSplit.child_index),
          aftSplit.range[0],
          aftSplit.range[1],
          style
        )
      }

      if (midrange) {
        // 只有一个节点
        if (midrange[0] === midrange[1]) {
          // 获取该节点后传递样式参数
          // 尝试合并
          that.getChildByIndex(midrange[0]).appendStyle(style)
          // 选中该元素的所有子元素
        } else if (midrange[0] === 0 && midrange[1] === that.children.length - 1) {
          // 尝试合并
          that.appendStyle(style)
        } else {
          // 获取所有范围内节点
          const list = that.children.slice(midrange[0], midrange[1] + 1)

          list.forEach((c) => c.appendStyle(style))
        }
      }

      if (preSplit) {
        this.addStyleAtThatWithRange(
          that.getChildByIndex(preSplit.child_index),
          preSplit.range[0],
          preSplit.range[1],
          style
        )
      }
    })
  }

  public initWithText(txt: string) {
    // 重置所有内容
    if (this.dict) this.dict.destroy()
    this.dict = new RichNodeMap()
    this.richNode = this.dict.new()
    this.richNode.text = txt
    this.HEAD = this.richNode
  }

  private getSelection() {
    const selection = document.getSelection()
    if (selection === null || selection.isCollapsed) return null
    const range = selection.getRangeAt(0)

    const getClosestRichNode = (node: any) => {
      let datasetNode = node
      let max = 15

      while (node !== null && max > 0) {
        if (datasetNode?.dataset?.role === 'rich') {
          return datasetNode
        }
        datasetNode = node?.parentElement || null
        max--
      }

      return null
    }

    const common = getClosestRichNode(range.commonAncestorContainer)
    const start = getClosestRichNode(range.startContainer)
    const end = getClosestRichNode(range.endContainer)

    if (common === null || start === null || end === null) return null

    const commonNode = this.dict.get(common.dataset.key)
    const startNode = this.dict.get(start.dataset.key)
    const endNode = this.dict.get(end.dataset.key)

    if (commonNode === null || startNode === null || endNode === null) return null

    const offsets = [
      RangeArea.convertOffsetToKeyNode(startNode, common.dataset.key, range.startOffset),
      RangeArea.convertOffsetToKeyNode(endNode, common.dataset.key, range.endOffset)
    ]

    return {
      richNode: commonNode,
      range: offsets
    }
  }

  public addStyle(style: string | string[] | Record<string, string>) {
    const selection = this.getSelection()
    if (selection === null) return

    const willAppend: Record<string, string> = {}

    if (typeof style === 'string') {
      willAppend[style] = style
    } else if (style instanceof Array) {
      style.forEach((s) => (willAppend[s] = s))
    } else {
      Object.entries(style).forEach(([k, v]) => (willAppend[k] = v))
    }

    this.addStyleAtThatWithRange(
      selection.richNode,
      selection.range[0],
      selection.range[1],
      willAppend
    )

    this.updater()
  }
}

export default RichNodeAction
