/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        manualChunks: {
          manage: [
            './src/pages/management/index.vue',
            './src/pages/management/components/Character/index.vue',
            './src/pages/management/components/Artifact/index.vue',
            './src/pages/management/components/Weapon/index.vue'
          ]
        }
      }
    }
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/static': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  plugins: [vue(), vueJsx()],
  test: {
    // 模拟dom环境
    environment: 'node'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@@': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@@@': fileURLToPath(new URL('./src/assets/styles', import.meta.url))
    },
    extensions: ['.ts', '.tsx']
  },
  css: {
    preprocessorOptions: {
      less: {
        // 引入全局变量
        additionalData: `@import '@@@/index.less';`
      }
    }
  }
});
