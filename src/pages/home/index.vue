<template>
  <div class="main">
    <div class="left-content">
      <canvas-drag ref="canvasDragRef" :selectedSrc="selectedSrc"> </canvas-drag>
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
          上传本地素材图片
        </div>
        <div class="export">
          <el-button>导出清单</el-button>
        </div>
      </div>
    </div>
      <div class="right-nav">
        <div class="right-nav-top">
            <el-image class="right-nav-img" :src="selectedSrc" fit="contain">
              <template #error>
                <div class="image-slot">
                  预览图
                </div>
              </template>
            </el-image>
            <div class="right-nav-info">
                <div>家具信息，xxxxxxxxxxx</div>
                <el-dropdown>
                    <div>更换材质</div>
                    <template #dropdown>
                        <el-dropdown-menu v-for="item in selectMenu" :key="item.id">
                            <el-dropdown-item @click="handleCommand(item.id)">{{ item.key }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <content class="right-nav-content">
            <div v-for="source in sourceData" :key="source.id">
                <el-image 
                :src="source.path" 
                fit="contain" 
                class="sourceImage" 
                :class="{'image-border': source.id == selectedId}" 
                @click="clickImage(source.path, source.id)"
                :draggable="true"
                ></el-image>
            </div>
        </content>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
import { onMounted, reactive, Ref, ref } from 'vue';
import CanvasDrag from '@/pages/home/canvas-drag.vue';
import { ElButton } from "element-plus"
import request from "@/utils/request"
const canvasDragRef = ref(null)
let inputImage = ref(null)
// function changeImage (e: Event) {
//   const fileObj = new FileReader()
//   fileObj.readAsDataURL((e.target as any).files[0]) 
//   fileObj.onload = () => {
//     canvasDragRef.value.pushImage(fileObj.result)
//     if(inputImage.value)inputImage.value.value = ""
//   }
// }

function uploadBg(e:Event) {
  const fileObj = new FileReader()
  fileObj.readAsDataURL((e.target as any).files[0])
  fileObj.onload = () => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
    canvas.style.backgroundImage = `url(${fileObj.result})` 
  }
}
let sourceData = ref([])
let selectedId:Ref<number> = ref(null)
let selectedSrc:Ref<string> = ref(null)
function clickImage(src:string, id:number) {
  selectedId.value = id
  selectedSrc.value = src
}

request({
  method:"get",
  url: "/getImageList"
}).then(res => {
  console.log(res.data, "data")
  sourceData.value = res.data.result
})

</script>

<style  scoped>
.wrap {
  width: 100%;
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
  width: 70%;
  position: relative;
}
.btn > div {
  width: 200px;
  margin-right: 20px;
}
.export button{
  position: absolute;
  right: 0;
}
.main {
  display: flex;
  flex-direction: row;
}
.right-nav {
    display: flex;
    flex-direction: column;
    width: 30%;
    flex: 1;
    height: 100%;
    border:1px solid #999;
}
.right-nav .right-nav-top {
    display: flex;
    flex-direction: row;
}
.right-nav .right-nav-bottom {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.right-nav .right-nav-img {
  width: 200px;
  height: 200px;
  border: 1px solid #000;
}
.right-nav-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 70vh;
}
.sourceImage {
  width: 200px;
  height: 200px;
}
.image-border {
  border: 1px solid #000;
}
</style>