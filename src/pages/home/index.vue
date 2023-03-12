<template>
  <div class="main">
    <div class="left-content">
      <canvas-drag ref="canvasDragRef" :selectedSrc="selectedSrc"> </canvas-drag>
      <div class="btn">
        <div class="uploadBtn">
          <div>
            <van-uploader accept="image/jpeg, image/png, image/jpg" class="upload" :before-read='beforeRead' :after-read="uploadBg" :multiple="false">
              <van-icon name="back-top" size="20px"  />
              <span>上传背景图</span>
              <!-- <van-button size='mini' icon="plus" type="primary" class="input-opacity">
              上传背景图
              </van-button> -->
            </van-uploader>
          </div>
          <div>
            <van-uploader accept="image/jpeg, image/png, image/jpg" class="upload" :before-read='beforeRead' :after-read="changeImage" :multiple="true">
              <van-icon  name="plus" size="20px"  />
              <span>上传本地素材图片</span>
              <!-- <van-button size='mini' icon="plus" type="success"  class="input-opacity" ref="inputImage">
                上传本地素材图片
              </van-button> -->
            </van-uploader>
          </div>
          
        </div>
        <div class="export">
          <span @click="showEdit">
            <van-icon name="records" size="20px" />
            编辑
          </span>
          <!-- <span @click="exportList">
            <van-icon name="down" size="20px"  />
            导出清单
          </span> -->
          <!-- <van-button @touchstart="showEdit" size='mini'>编辑</van-button>
          <van-button @touchstart="exportList" size='mini'>导出清单</van-button> -->
        </div>
      </div>
    </div>
    <div class="right-nav">
      <div class="right-nav-top">
          <van-image class="right-nav-img" :src="selectedSrc" fit="contain">
            <template #placeholder>
              <div class="image-slot">
                预览图
              </div>
            </template>
          </van-image>
          <div class="right-nav-info">
              <span class="right-info-content">家具信息:{{curSelInfo}}</span>
          </div>
      </div>
      <div class="right-nav-content">
          <div v-for="source in sourceData" :key="source.id" class="right-nav-content-img">
              <van-image 
                :src="source.path" 
                fit="contain" 
                class="sourceImage" 
                :class="{'image-border': source.id == selectedId}" 
                @touchstart="clickImage(source)"
                @click="addImage(source)"
                :draggable="true"
              >
                <template #placeholder>
                  <div v-loading="true" class="image-slot">
                  </div>
                </template>
              </van-image>
              <div class="image-info">
                <div class="info-title">{{ source.name }}</div>
                <div class="info-price">￥{{ source.price }}</div>
              </div>
          </div>
        </div>
    </div>
    <!-- <el-dialog v-model="dialogTableVisible" title="家居价格目录表">
      <el-table :data="tableData">
        <el-table-column property="家具名字" label="名称" width="150" />
        <el-table-column property="价格" label="价格（￥）" width="200" />
      </el-table>
      <el-button @touchstart="exportExcel">导出excel</el-button>
    </el-dialog> -->
  </div>
  
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';
import CanvasDrag from '@/pages/home/canvas-drag.vue';
import { ElMessage } from "element-plus"
import request from "@/utils/request"
import * as XLSX from 'xlsx' // Vue3 版本
import { useManageStore } from '@/store';
import { showToast, UploaderFileListItem } from 'vant';
let { modelsManage } = useManageStore()
const canvasDragRef = ref(null)
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

function handleCommand(id:number) {

}
let selectMenu = ref([
  {key:'材质1', id:1},
  {key:'材质2', id:2},
  {key:'材质3', id:3}
])
let showEdit = function() {
  setTimeout(() => {
    canvasDragRef.value.showEdit()
  }, 100);
}

const imageForm = ['image/jpeg', 'image/png', 'image/jpg']
/** 上传前做检查*/
const beforeRead = (files:File | File[]) => {
  if(files instanceof Array) {
    for(let file of files) {
      if (!imageForm.includes(file.type)) {
        showToast('请上传 jpg 、jpeg、png格式图片');
        return false;
      }
    }
  }else if(files instanceof File) {
    if (!imageForm.includes(files.type)) {
      showToast('请上传 jpg 、jpeg、png格式图片');
      return false;
    }
  }
  return true;
};
/**
 * 加载背景
 * @param fileListItem 
 */
function uploadBg(fileListItem:UploaderFileListItem) {
  const fileObj = new FileReader()
  fileObj.readAsDataURL(fileListItem.file)
  fileObj.onload = () => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
    canvas.style.backgroundImage = `url(${fileObj.result})` 
  }
}

let inputImage = ref(null)
function changeImage (fileListItemList:UploaderFileListItem[]) {
  const formData = new FormData()
  for(let UploaderFile of fileListItemList) {
    formData.append("file", UploaderFile.file)
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
let sourceData = ref([])
let selectedId:Ref<number> = ref(null)
let selectedSrc:Ref<string> = ref(null)

// 点击图片
function clickImage(source:{name:string, id:number, path:string, [key:string]:any}) {
  const { name, id, path } = source
  curSelInfo.value = name
  selectedId.value = id
  selectedSrc.value = path
  canvasDragRef.value.changeImage(path)
}

request({
  method:"get",
  url: "/api/getImageList"
}).then(res => {
  sourceData.value = res.data.result
})

function addImage(source:{name:string, price:string, [name:string]: any}) {
  canvasDragRef.value.pushImage(source, selectedSrc.value)
}
</script>

<style lang='scss' scoped>
.main {
  display: flex;
  width: 100vw;
  height: 100%;
  overflow: hidden;
}
.left-content {
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100%;
}
.btn {
  flex: 1;
  display: flex;
  justify-content: space-between;
  margin: 5px 30px 5px 10px;
  color: #1989fa;
  .uploadBtn {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    span {
      font-size: 12px;
    }
  }
  .export {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    span {
      font-size: 12px;
    }
  }
}
.upload {
  margin-right: 30px;
}
.left-content {
  flex: 2;
}
.right-nav {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 10px;
}
.right-nav-top {
  width: 100%;
  height: auto;
  max-height: 100px;
  display: flex;
  margin-bottom: 10px;
  .right-nav-img {
    width: 40px;
    height: auto;
  }
  .right-nav-info {
    flex: 1;
    padding-top: 10px;
    padding-left: 5px;
    font-size: 10px;
    line-height: 12px;
    word-break: break-all;
  }
}

.image-slot {
  width: 100px;
  height: 100px;
}
.sourceImage {
  width: 100%;
  height: auto;
}
.right-nav-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  text-align: center;
  justify-content: space-between;
  .right-nav-content-img {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30%;
    height: auto;
    font-size: 8px;
    padding: 5px 2px;
    overflow: hidden;
    .image-info {
      margin-top: 5px;
      div {
        
      }
      .info-title{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
      }
      .info-price {
        margin-top: 5px;
        color: #1989fa;
      }
    }
  }
}

</style>