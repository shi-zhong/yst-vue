/**
 * message 全局消息通知
 *
 * 初次调用时初始化容器
 * 通过配置向容器内自动挂载节点
 * 指定时间后移除队列
 */
import { useQueue } from '@/utils/hooks/useQueue';

import S from './index.module.less';
import Msg from './Message.vue';
import { createApp } from 'vue';

export interface MessageInfo {
  text: string | number;
  style: string;
}

/**通过操作队列来操作消息列表 */
export const Queue = useQueue<MessageInfo>();

const messageFunc = (
  msg: string | number,
  option?: {
    type?: 'success' | 'info' | 'error';
    duration?: number;
  }
) => {
  // 创建一个组件
  Queue.enQueue({
    text: msg,
    style: option?.type || 'success'
  });
  // 卸载
  setTimeout(() => {
    Queue.deQueue();
  }, option?.duration || 1000);
};

export const Message = {
  msg: messageFunc,
  success: (msg: string | number, duration?: number) =>
    messageFunc(msg, { type: 'success', duration }),
  info: (msg: string | number, duration?: number) => messageFunc(msg, { type: 'info', duration }),
  error: (msg: string | number, duration?: number) => messageFunc(msg, { type: 'error', duration }),
  clear: Queue.clear
};

/**
 * 自执行函数，创建容器，放在Queue创建后，避免Msg组件的循环导入
 */
(() => {
  const box = document.createElement('div');
  box.id = S['message-box'];
  document.body.appendChild(box);
  const app = createApp(Msg);
  app.mount(box);
})();