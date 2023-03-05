import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    copy({
      targets:[
        {src:'./static/icons/close.png', dest:'./image-server/static/vueapp'}
      ]
    })
  ],
  base: process.env.NODE_ENV !== 'production' ? '/' : './',
  assetsInclude:["**/*.jpg"],
  resolve:{
    alias:{
      "@":resolve(__dirname, "./src")
    }
  },
  build: {
    outDir:"./image-server/static/vueapp",
    target: "modules",
    assetsDir: 'assets',
    assetsInlineLimit: 360000
  },
  define:{
   "process.env":process.env
  }
})
