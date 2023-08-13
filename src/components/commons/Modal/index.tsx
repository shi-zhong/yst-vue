import { useStack } from '@/utils/hooks/useStack';
import { defineComponent, onUnmounted, ref, watch, computed } from 'vue';
import ModalView from './Modal.vue';
import ModalStyle from './index.module.less';

// 初始化容器
let container: HTMLElement | null = null;

export const elementId = ModalStyle.modal;

interface ModalButtonConfig {
  text?: String;
  icon?: String;
  onClick?: () => void;
  disable?: Boolean;
}

// 需要消费的属性
export interface ModalPropsConsume {
  visible: number;
  title?: String;
  style?: { [key in 'top' | 'left' | 'right' | 'bottom']: number };

  okText?: String;
  okIcon?: String;
  cancelText?: String;
  cancelIcon?: String;
  okDisable?: Boolean;
  cancelDisable?: Boolean;
  // 总配置 单个配置优先
  ok?: ModalButtonConfig;
  cancel?: ModalButtonConfig;
}

export interface ModalAttri {
  mask?: boolean;
  theme?: 'dark' | 'light';
}

const stack = useStack<{ symbol: symbol; index: number }, {}>([], (stack, origin) => {
  const max = stack.stack.reduce((pve, aft) => {
    if (aft.key === origin.symbol) {
      return pve;
    } else if (aft.payload.index > pve) {
      return aft.payload.index;
    }
    return pve;
  }, 1);

  origin.index = max + 1;

  return stack.toStack(origin.symbol, origin);
});

export const Modal = defineComponent(
  (props: ModalPropsConsume & ModalAttri, { attrs, slots }) => {
    const instance = Symbol('modal');

    const index = ref(0);
 
    watch(
      () => props.visible,
      (aft, pve) => {
        // 打开置顶
        if (aft > 0 && pve > 0) {
          stack.jumpTop(instance);
          if (stack.top.value) {
            index.value = stack.top.value.index;
          }
          // 打开
        } else if (aft > 0 && pve <= 0) {
          stack.push({ symbol: instance, index: 0 });
          if (stack.top.value) {
            index.value = stack.top.value.index;
          }
        } else {
          stack.cancelMiddle(instance);
        }
      }
    );

    onUnmounted(() => {
      stack.cancelMiddle(instance);
    });

    const okButtonProps = {
      text: props.okText || props.ok?.text,
      special: props.okIcon || props.ok?.icon,
      onClick: props.ok?.onClick || undefined,
      disable: props.okDisable || props.ok?.disable || false
    };

    const cancelButtonProps = {
      text: props.cancelText || props.cancel?.text,
      special: props.cancelIcon || props.cancel?.icon,
      onClick: props.cancel?.onClick || undefined,
      disable: props.cancelDisable || props.cancel?.disable || false
    };

    const visible = computed(() => {
      return (stack.top.value === null || stack.top.value.symbol === instance) && props.visible > 0;
    });

    return () => {
      if (container != null) {
        // createPortal 会返回一个元素
        // 当该元素被挂载到VDom树中时，参数中的元素会被挂载到指定节点
        return (
          <ModalView
            visible={visible.value}
            index={index.value}
            container={container}
            ok={props.ok && okButtonProps}
            cancel={props.cancel && cancelButtonProps}
            {...(attrs as any)}
          >
            {slots.default ? slots.default() : undefined}
          </ModalView>
        );
      }
      return <template>找不到该节点</template>;
    };
  },
  {
    props: [
      'visible',
      'title',
      'okText',
      'okIcon',
      'cancelText',
      'cancelIcon',
      'okDisable',
      'cancelDisable',
      'ok',
      'cancel'
    ]
  }
);

// init
if (container === null) {
  const findDOM = document.getElementById(ModalStyle.modal);
  if (findDOM === null) {
    const modal = document.createElement('div');
    modal.id = ModalStyle.modal;
    container = modal;
    document.body.appendChild(modal);
  } else {
    container = findDOM;
  }
}
