import { type Directive } from 'vue';

/**
 * 懒加载图片
 */

export const LazyImage = (root?: Element): { close: () => void; vLazy: Directive } => {
  const observe = new IntersectionObserver((entrys) => {
    entrys.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('src', entry.target.getAttribute('data-src') || '');
        observe.unobserve(entry.target);
      }
    });
  }, {
    root
  });

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
