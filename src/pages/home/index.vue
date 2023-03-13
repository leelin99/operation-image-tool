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
            @input.prevent="$event => changeImage($event)"
            class="input-opacity"
            ref="inputImage"
            >
          上传本地素材图片
        </div>
        <div class="export">
          <el-button @click="exportList">导出清单</el-button>
        </div>
      </div>
    </div>
      <div class="right-nav">
        <div class="right-nav-top">
            <el-image class="right-nav-img" :src="selectedSrc" fit="contain">
              <template #placeholder>
                <div class="image-slot">
                  预览图
                </div>
              </template>
            </el-image>
            <div class="right-nav-info">
                <div>家具信息:{{curSelInfo}}</div>
                <div class="right-nav-info-img">
                  <el-image 
                    :src="img.path"
                    v-for="img in typeArr"
                    :key="img.path"
                    class="selectImage" 
                    :class="{'image-border': img.id == typeSelectedId}" 
                    @click="selectType(img)"
                    @dblclick="addImage(img)"
                    >
                    <template #placeholder>
                      <div v-loading="true" class="image-slot">
                      </div>
                    </template>
                  </el-image>
                  <el-image   ></el-image>
                </div>
            </div>
        </div>
        <content class="right-nav-content">
            <div v-for="source in sourceData" :key="source.id" class="right-nav-content-img">
                <el-image 
                :src="source.path" 
                fit="contain" 
                class="sourceImage" 
                :class="{'image-border': source.id == selectedId}" 
                @click="clickImage(source)"
                @dblclick="addImage(source)"
                :draggable="true"
                loading = "lazy"
                >
                <template #placeholder>
                  <div v-loading="true" class="image-slot">
                  </div>
                </template>
                </el-image>
                <div>{{ source.name }}</div>
                <div>￥{{ source.price }}</div>
            </div>
        </content>
        <el-pagination
          small
          background
          layout="prev, pager, next"
          :total="sourceData.length"
          class="mt-4"
        />
    </div>
    <el-dialog v-model="dialogTableVisible" title="家居价格目录表">
      <el-table :data="tableData">
        <el-table-column property="家具名字" label="名称" width="150" />
        <el-table-column property="价格" label="价格（￥）" width="200" />
      </el-table>
      <el-button @click="exportExcel">导出excel</el-button>
    </el-dialog>
  </div>
  
</template>

<script lang="ts" setup>
import { onMounted, reactive, ReactiveFlags, Ref, ref } from 'vue';
import CanvasDrag from '@/pages/home/canvas-drag.vue';
import { ElButton, ElMessage } from "element-plus"
import request from "@/utils/request"
import * as XLSX from 'xlsx' // Vue3 版本
import { useManageStore } from '@/store';
interface IImageSource {name:string, id:string, path:string, [key:string]:any}

let { modelsManage } = useManageStore()
const canvasDragRef = ref(null)
let inputImage = ref(null)
function changeImage (e: Event) {
  const formData = new FormData()
  const files = (e.target as any).files
  for(let file of files) {
    formData.append("file", file)
  }
  request({
    method:'post',
    url:'/api/uploadImage',
    data: formData
  }).then(res => {
    ElMessage({
      message:res.data.msg,
      type:'success'
    })
  })
}
let dialogTableVisible = ref(false)
let tableData:Ref<{"家具名字":string, "价格": string}[]> = ref([])
// 导出清单
function exportList() {
  if(!modelsManage.length){ 
    ElMessage({
      message: "场景无家居"
    })
    return 
  }
  tableData.value = modelsManage.map(model => ({"家具名字":model.name, "价格": model.price}))
  const total = tableData.value.reduce((pre, next) => {
    return {'价格':String(Number(pre['价格']) + Number(next['价格'])), '家具名字': ''}
  })
  tableData.value.push({'家具名字':'', '价格':total['价格']})
  dialogTableVisible.value = true
}

// 导出表格
function exportExcel() {
    // 创建工作表
    const data = XLSX.utils.json_to_sheet(tableData.value)
    // 创建工作簿
    const wb = XLSX.utils.book_new()
    // 将工作表放入工作簿中
    XLSX.utils.book_append_sheet(wb, data, 'data')
    // 生成文件并下载
    XLSX.writeFile(wb, 'test.xlsx')
}
// 当前家具的信息
const curSelInfo = ref("")

function uploadBg(e:Event) {
  const fileObj = new FileReader()
  fileObj.readAsDataURL((e.target as any).files[0])
  fileObj.onload = () => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
    canvas.style.backgroundImage = `url(${fileObj.result})` 
  }
}
let sourceData = ref([])
let selectedId:Ref<string> = ref(null)
let selectedSrc:Ref<string> = ref(null)

let typeArr:Ref<IImageSource[]> = ref([])
// 点击图片
let typeSelectedId = ref("")
function clickImage(source:IImageSource) {
  const { name, id, path } = source
  curSelInfo.value = name
  selectedId.value = id
  typeSelectedId.value = id + String(0)
  selectedSrc.value = path
  canvasDragRef.value.changeImage(path)
  request({
    method:"post",
    url: "/api/getImageById",
    data:{id}
  }).then(res => {
    typeArr.value = res.data.result
  })
}
// 点击图片
function selectType(source:IImageSource) {
  const { name, id, path } = source
  curSelInfo.value = name
  typeSelectedId.value = id
  selectedSrc.value = path
  canvasDragRef.value.changeImage(path)
}

request({
  method:"get",
  url: "/api/getImageList"
}).then(res => {
  sourceData.value = res.data.result
})

function addImage(source:IImageSource) {
  canvasDragRef.value.pushImage(source, selectedSrc.value)
}
</script>

<style scoped lang="scss">
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
  padding: 0 20px;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  margin-top: 30px;
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
  justify-content: space-around;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 70vh;
}
.sourceImage {
  width: 150px;
  height: 150px;
}
.selectImage {
  width: 100px;
  height: 100px;
}
.image-border {
  border: 1px solid #000;
}
.right-nav-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .right-nav-info-img {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.right-nav-content-img{
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
</style>