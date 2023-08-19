### 参数

1. direction?: 'x' | 'y' | 'both';
2. scrollBehavior?: 'auto' | 'scroll' | 'hidden';
3. customScrollbar?: string; 这个参数会被作为类传入滚动条中，使用：deep来进行样式设定
<!-- 4. transformBoxClass?: string; -->
5. border?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
   }; 规定边界的阈值
6. slide?: boolean; // 触发滑动
7. slideOption?: {
    threshold: number; 触发阈值
    distance: (i: number) => number; 距离转换函数
   };


### 绑定事件 
1. @click (e: Event) => void;
2. @touchBorder: (
    type: {
      direction: 'left' | 'right' | 'top' | 'bottom';
      mouseState: 'up' | 'down' | 'move';
    },
    ref: any
   ) => void; 当触碰到Props参数规定的边界后触发函数
3. @scroll: (
    e: Event,
    scrollState: {
      mouseState: 'up' | 'move' | 'down';
      scroll: {
        x: number;
        y: number;
      };
    }
  ): void;

### slots
1. default 作为滚动部分内容
2. extra 这部分不会被滚动，但是会受到父元素的限制


待解决
1. 滚动嵌套该如何反应
   1. 思路 判断是否触碰边界，如果碰到边界，把滚动事件传入父滚动组件