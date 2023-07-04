import { type Router } from 'vue-router';

const changeTitle = (option: { title?: string }) => {
  document.title = option.title || 'Title';
};

export default (router: Router) => {
  router.beforeResolve((to) => {
    changeTitle(to.meta);
  });
};
