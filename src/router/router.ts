import { createRouter, createWebHistory } from 'vue-router';

import NotFound from '@/pages/NotFound.vue';
import Character from '@/pages/Character/index.vue';
import Test from '@/pages/test/test.vue';
import Test2 from '@/pages/test/test2.vue';

import { useArtifactStore } from '@/stores/Artifact';

const Manage = () => import(/* webpackChunkName: "manage" */ '@/pages/management/index.vue');
const ManageArtifact = () =>
  import(/* webpackChunkName: "manage" */ '@/pages/management/components/Artifact/index.vue');
const ManageCharacter = () =>
  import(/* webpackChunkName: "manage" */ '@/pages/management/components/Character/index.vue');
const ManageWeapon = () =>
  import(/* webpackChunkName: "manage" */ '@/pages/management/components/Weapon/index.vue');

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
          component: Test2,
          beforeEnter: () => {
            const store = useArtifactStore();
            if (store.artifactSuits.size === 0) {
              store.GenerateArtifactSuits();
            }
          }
        },
        {
          path: '/character',
          meta: {
            title: '角色管理'
          },
          component: Character
        },
        {
          path: '/manage',
          meta: {
            title: '角色管理'
          },
          component: Manage,
          children: [
            {
              path: 'character',
              component: ManageCharacter
            },
            {
              path: 'artifact',
              component: ManageArtifact,
              beforeEnter: () => {
                const store = useArtifactStore();
                if (store.artifactSuits.size === 0) {
                  store.GenerateArtifactSuits();
                }
              }
            },
            {
              path: 'weapon',
              component: ManageWeapon
            },
            {
              path: '',
              redirect: '/manage/character'
            }
          ]
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
