import { type Directive } from 'vue';

const handleSrc = (src?: string) => {
  if (src === undefined) {
    return '';
  } else if (src.startsWith('data:image') || src.startsWith('/src/assets')) {
    return src;
  } else {
    return 'http://localhost:8000' + src;
  }
};

/**
 * 懒加载图片
 */

export const LazyImage = (root?: Element): { close: () => void; vLazy: Directive } => {
  const observe = new IntersectionObserver(
    (entrys) => {
      entrys.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute(
            'src',
            handleSrc(entry.target.getAttribute('data-src') || undefined) || ''
          );
          observe.unobserve(entry.target);
        }
      });
    },
    {
      root
    }
  );

  return {
    vLazy: {
      mounted(el, binding) {
        el.setAttribute('data-src', binding.value);
        observe.observe(el);
      }
    },
    close() {
      observe.disconnect();
    }
  };
};
