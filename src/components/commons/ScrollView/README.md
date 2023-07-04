自定义滚动条设计

最外层为 滚动容器，其中包括可视区和自定义滚动条
如不需要滚动条，可将滚动容器和可视区重合


```xml
<!-- 自定义 -->
<ScrollContainer>
<!-- 100% -->
  <ScrollVisible>
    <Blank /> 
    <!-- 100% -->
    <HighLimit>
      <!-- 不限高 -->
      <Content />
    </HighLimit>
    </Blank>
  </ScrollVisible>
  <ScrollBar></ScrollBar>
<ScrollContainer>
```


使用文档
使用指南，使用rootClass指定最外层的高度大小

ps： 全部可选
| props           | 类型                                                                              | 说明                      |
| --------------- | --------------------------------------------------------------------------------- | ------------------------- |
| dataType        | string                                                                            |                           | 用于事件委托挂载 |
| slide           | boolean                                                                           |                           | 用于处理滑动惯性 |
| slideOption     | {threshold?：number， distance?： (x: number) => number}                          |                           |
| blank           | {top?: number, bottom?: number }                                                  |
| scrollBehavior  | 'auto'                                                    \| 'scroll' \| 'hidden' | 决定滚动条展示            |
| customScrollbar | string                                                                            | 配合选择器重写滚动条样式  |
| rootClass       | string                                                                            | 根节点样式 用于决定滚动条 |

| 支持的事件  | 函数定义                   | 类型定义                                                      |
| ----------- | -------------------------- | ------------------------------------------------------------- |
| click       | (e: Event) => void;        |
| scroll      | (e: Event) => void;        |
| touchCell   | ({type, ref: any}) => void |
| touchBottom | ({type, ref: any}) => void | type: 'up-top' \| 'up-bottom' \| 'move-top' \| 'move-bottom'; |