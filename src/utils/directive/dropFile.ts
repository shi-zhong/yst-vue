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
  const readFile = (file: File) =>
    new Promise<{ file: any; origin: File }>((resolve) => {
      const type: string = file.type;
      const filereader = new FileReader();
      // 处理文字数据
      if (type === 'application/json' || type === 'text/plain') {
        filereader.readAsText(file);
      } else if (type.startsWith('image')) {
        filereader.readAsDataURL(file);
      }
      filereader.onload = () => {
        resolve({
          file: filereader.result,
          origin: file
        });
      };
    });
  return {
    vDrop: {
      mounted(el: Element, binding) {
        handleDrop = (e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          if (!e.dataTransfer?.files.length) return;

          const files = e.dataTransfer.files;

          if (binding.modifiers.files === undefined && files.length === 1) {
            const file = files[0];
            readFile(file).then((res) => {
              binding.value(res.file, res.origin);
            });
          } else if (binding.modifiers.files === true) {
            if (binding.modifiers.each) {
              [...(Array(files.length) as any[])].map((_, i) => {
                readFile(e.dataTransfer?.files[i]!).then((res) => {
                  binding.value(res.file, res.origin);
                });
              });
            } else {
              Promise.all(
                [...(Array(files.length) as any[])].map((_, i) =>
                  readFile(e.dataTransfer?.files[i]!)
                )
              ).then((res) => {
                binding.value(res);
              });
            }
          }
        };

        el.addEventListener('drop', handleDrop as any);
        el.addEventListener('dragover', preventDefault);
      },
      unmounted(el) {
        el.removeEventListener('drop', handleDrop);
        el.removeEventListener('dragover', preventDefault);
      }
    }
  };
};
