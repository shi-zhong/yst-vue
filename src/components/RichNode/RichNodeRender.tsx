import RichNode from './RichNode';

/**
 * 目前使用 stringStyle，所有样式以类的方式嵌入组件。
 * 可以自定义对style进行特定前缀分析，用以区分class或行内style
 *
 * emp: richNodeAction.addStyle({ 'style:width': 10 })
 */
const RichNodeRender = ({ rich, update }: { rich: RichNode; update: number }) => (
  <span
    class={rich.stringStyle}
    key={rich.key}
    data-key={rich.key}
    data-role="rich"
  >
    {rich.children.length
      ? rich.children.map((r) => (
          <RichNodeRender
            rich={r}
            update={update}
          />
        ))
      : rich.text}
  </span>
);

export default RichNodeRender;
