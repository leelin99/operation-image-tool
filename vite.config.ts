import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { PiniaVuePlugin } from 'pinia'
console.log(process.env.NODE_ENV)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV !== 'production' ? '/' : './',
  assetsInclude:["**/*.jpg"],
  resolve:{
    alias:{
      "@":resolve(__dirname, "./src")
    }
  },
  build: {
    outDir:"./dist",
    target: "modules",
    assetsDir: 'assets',
    assetsInlineLimit: 360000
  }
})
