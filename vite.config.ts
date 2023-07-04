import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
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
})
