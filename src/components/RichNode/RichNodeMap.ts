import RichNode from './RichNode';

class RichNodeMap {
  private _Index = new Map<string, RichNode>();

  private _KeyCount = 0;
  private _GetKey() {
    this._KeyCount++;
    return String(this._KeyCount);
  }

  public get(key: string) {
    return this._Index.get(key) || null;
  }

  public set(node: RichNode) {
    if (node.key !== '') {
      return false;
    }

    const key = this._GetKey();
    node.key = key;

    node.toBeControlled(this);

    this._Index.set(node.key, node);
    return true;
  }

  public new(str?: string | undefined, style?: Record<string, string>) {
    const newNode = new RichNode(str || '');

    if (style) {
      newNode.style = style;
    }

    this.set(newNode);
    return newNode;
  }

  public setList(nodes: RichNode[]) {
    return nodes.map((i) => this.set(i)).reduce((i, j) => i && j, true);
  }

  public delete(node: RichNode) {
    return this._Index.delete(node.key);
  }

  public destroy() {
    this._Index.forEach((r) => r.destory());
  }
}

export default RichNodeMap;
