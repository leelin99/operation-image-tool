<template>
  <div class="wrap">
    <canvas-drag ref="canvasDragRef"> </canvas-drag>
    <div class="btn">
      <div class="upload">
      <input type="file"
        accept="image/jpeg, image/png, image/jpg"
        @input.prevent="uploadBg($event)"
        class="input-opacity">
      上传背景图
      </div>
      <div class="upload">
        <input type="file"
          accept="image/jpeg, image/png, image/jpg"
          @input.prevent="changeImage($event)"
          class="input-opacity"
          ref="inputImage"
          >
        上传图片
      </div>
    </div>
 
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import CanvasDrag from './pages/home/canvas-drag.vue';
const canvasDragRef = ref(null)
let inputImage = ref(null)
function changeImage (e: Event) {
  const fileObj = new FileReader()
  fileObj.readAsDataURL((e.target as any).files[0])
  fileObj.onload = () => {
    canvasDragRef.value.pushImage(fileObj.result)
    if(inputImage.value)inputImage.value.value = ""
  }
}

function uploadBg(e:Event) {
  const fileObj = new FileReader()
  fileObj.readAsDataURL((e.target as any).files[0])
  fileObj.onload = () => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
    canvas.style.backgroundImage = `url(${fileObj.result})` 
  }
}

</script>

<style>
*{
  margin: 0;
  padding: 0;
}
body{
  height: 100%;
}
.upload {
  position: relative;
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: 800;
  border-radius: 50px;
  background-color: rgb(0, 110, 255);
}
.input-opacity {
  position: absolute;
  top: 0;
  width: 100%;
  height: 35px;
  opacity: 0;
}
.btn {
  display: flex;
  flex-direction: row;
}
.btn > div {
  flex: 1;
}
</style>