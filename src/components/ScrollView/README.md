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


interface ScrollViewPayload {
  type: 'up-top' | 'up-bottom' | 'move-top' | 'move-bottom';
  ref: any;
}

支持的事件
1. click: (e: Event) => void;
2. scroll: (e: Event) => void;
3. touchCell: (payload: ScrollViewPayload) => void
4. touchBottom: (payload: ScrollViewPayload) => void

Props选项
1. dataType 用于事件委托挂载


interface ScrollViewProps {
  dataType?: string;
  slide?: boolean;
  slideOption?: {
    threshold: number;
    distance: (i: number) => number;
  };
  blank?: {
    top: number;
    bottom: number;
  };
}

interface ScrollViewProps {
  customScrollbar?: string;
  scrollBehavior?: 'auto' | 'scroll' | 'hidden';
  rootClass?: string;
  blank?: {
    top: number;
    bottom: number;
  };
}




