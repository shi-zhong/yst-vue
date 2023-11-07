import { createRouter, createWebHistory } from 'vue-router';

import GlobalLayout from '@/layout/Global/index.vue';

import NotFound from '@/pages/NotFound.vue';
import Character from '@/pages/Character/index.vue';
import Test from '@/pages/test/test.vue';
import Test2 from '@/pages/test/test2.vue';
import ManageCharacterPreview from '@/pages/management/components/Character/preview.vue';

import { useArtifactStore } from '@/stores/Artifact';
import { useWeaponStore } from '@/stores/Weapon';
import { useConfig } from '@/stores/config';
import { useCharacterLayoutStore } from '@/stores/CharacterLayout';

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
      component: GlobalLayout,
      beforeEnter() {
        const config = useConfig();
        config.RequestConfig();
      },
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
          path: '/manage',
          meta: {
            title: '角色管理'
          },
          component: Manage,
          children: [
            {
              path: 'character',
              component: ManageCharacter,
              beforeEnter: () => {
                const store = useCharacterLayoutStore();
                store.getAllCharacterStatic()
              }
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
              component: ManageWeapon,
              beforeEnter: () => {
                const store = useWeaponStore();
                if (store.weaponTypes.size === 0) {
                  store.GenerateWeaponTypes();
                }
              }
            },
            {
              path: '',
              redirect: '/manage/character'
            }
          ]
        },
        {
          path: '/manage/character/preview',
          component: ManageCharacterPreview
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
