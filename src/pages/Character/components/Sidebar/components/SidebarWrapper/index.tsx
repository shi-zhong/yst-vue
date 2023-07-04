import { useMemo, useEffect } from 'react';

//返回一个接受 mountready 的参数 的组件
const Wrapper = (Component: any) => {
  return (props: { mountReady: () => void }) => {
    const { mountReady } = props;

    useEffect(() => {
      mountReady();
    }, []);

    return useMemo(() => <Component />, []);
  };
};

export default Wrapper;
