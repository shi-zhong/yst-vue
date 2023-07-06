import { createRouter, createWebHistory } from 'vue-router';

import NotFound from '@/pages/NotFound.vue';
import Character from '@/pages/Character/index.vue';
import Test from '@/pages/test/test.vue'
import Test2 from '@/pages/test/test2.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // 引入layout组件
      // component: App,
      children: [
        {
          path: '/test',
          meta: {
            title: 'test'
          },
          component: Test
        },
        {
          path: '/test2',
          meta: {
            title: 'test2'
          },
          component: Test2
        },
        {
          path: '/character',
          meta: {
            title: '角色管理'
          },
          component: Character
        },
        {
          path: '/importinfo',
          meta: {
            title: '角色管理'
          },
          component: Character
        },
        {
          path: '',
          redirect: { name: 'NotFound' }
        }
      ]
    },
    {
      path: '/404',
      name: 'NotFound',
      meta: {
        title: '404'
      },
      component: NotFound
    },
    { path: '/:catchAll(.*)', redirect: { name: 'NotFound' } }
  ]
});

export default router;
