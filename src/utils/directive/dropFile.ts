import { type Directive } from 'vue';

/**
 * 拖拽图片
 */

export const Drop = (): { vDrop: Directive } => {
  const preventDefault = function (e: Event) {
    e.preventDefault();
  };
  let handleDrop = (_e: any) => {
    _e;
  };
  return {
    vDrop: {
      mounted(el: Element, binding) {
        handleDrop = (e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (!e.dataTransfer?.files.length) return;

          const file = e.dataTransfer.files[0];
          const type: string = file.type;
          const filereader = new FileReader();
          // 处理文字数据
          if (type === 'application/json' || type === 'text/plain') {
            filereader.readAsText(file);
          } else if (type.startsWith('image')) {
            filereader.readAsDataURL(file);
          }
          filereader.onload = () => {
            binding.value(filereader.result, file);
          };
        };

        el.addEventListener('drop', handleDrop as any);
        el.addEventListener('dragover', preventDefault);
        el.addEventListener('dropenter', preventDefault);
        el.addEventListener('dropleave', preventDefault);
      },
      unmounted(el) {
        el.addEventListener('drop', handleDrop);
        el.removeEventListener('dragover', preventDefault);
        el.removeEventListener('dropenter', preventDefault);
        el.removeEventListener('dropleave', preventDefault);
      }
    }
  };
};
