使用说明

1. 创建一个`RichNodeAction`实例，传入一个用于更新视图的函数，当style变更时会调用函数，更新视图。
2. 使用`RichNodeRender`组件，传入一个`RichNodeAction`实例和用于更新视图的数据，用于展示数据
3. 通过调用 `richNodeAction.addStyle(obj)`来对选区进行更新