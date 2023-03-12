<template>
    <div class="drawArea">
        <canvas id="myCanvas" class="canvas" style="border:1px solid #000000;"> </canvas>
        <van-action-sheet v-model:show="showAction" :actions="rightKeyMenu" @select="onSelect" close-on-click-action/>
    </div>

</template>

<script setup lang="ts">
import { useManageStore } from '@/store/index';
import { onMounted, Ref, ref, defineEmits } from 'vue';
import ImageModel from './image-model';
const emits = defineEmits(["deleteImg"])
const sources = []
const selectMenu = []
const dropdown = ref(null)
let showAction = ref(false)
enum MENU_CONST { LEFT_RIGHT_MIRROR, UP_DWON_MIRROR, UP, DOWN}
const rightKeyMenu = [
    {name:"左右镜像", value:MENU_CONST.LEFT_RIGHT_MIRROR},
    {name:"上下镜像", value:MENU_CONST.UP_DWON_MIRROR},
    {name:"向上移动一层", value:MENU_CONST.UP},
    {name:"向下移动一层", value:MENU_CONST.DOWN}
]
const onSelect = (item:{name:string, value:number}) => {
    handleCommand(item.value)
}
const handleCommand = (command: string | number | object) => {
    if(!selectModel) return;
    switch(command) {
        case MENU_CONST.LEFT_RIGHT_MIRROR :
            leftRightMirror()
            break
        case MENU_CONST.UP_DWON_MIRROR :
            upDownMirror()
            break
        case MENU_CONST.UP :
            up()
            break
        case MENU_CONST.DOWN :
            down()
            break
        default:
            break
    }
}
function leftRightMirror() {
    selectModel.leftRightMirror()
    draw()
}
function upDownMirror() {
    selectModel.upDownMirror()
    draw()
}

function up() {
    const index = modelsManage.findIndex(el => el.img === selectModel)
    const model = modelsManage[index]
    modelsManage.splice(index, 1)
    modelsManage.splice(index + 1, 0, model)
    draw()
}

function down() {
    const index = modelsManage.findIndex(el => el.img === selectModel)
    const model = modelsManage[index]
    modelsManage.splice(index, 1)
    modelsManage.splice(index - 1, 0, model)
    draw()
}

let ctx:CanvasRenderingContext2D = null
let clickedkArr:any[] = []
let canvas:HTMLCanvasElement = null
let lastImg:ImageModel = null
let initial:any = null
let startTouch:any = null
let canMove = false
let { modelsManage, selectModel} = useManageStore()
const props = defineProps({
    selectedSrc:null
})
function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    modelsManage.forEach((item) => {
        item.img.paint()
    })
}

function start (e:TouchEvent) {
    debugger

    canMove = true
    // 初始化一个数组用于存放所有被点击到的图片对象
    clickedkArr = []
    const x = e.targetTouches[0].clientX
    const y = e.targetTouches[0].clientY
    modelsManage.forEach((item, index) => {
        const place = item.img.getImageOrder(x, y - canvas.offsetTop)
        item.img.place = place
        item.img.index = index
        // 先将所有的item.img的selected变为flase
        item.img.selected = false
        selectModel = null
        if (place !== "false") {
            clickedkArr.push(item.img)
        }
    })
    const length = clickedkArr.length
    if (length) {
        // 我们知道cavans绘制的图片的层级是越来越高的，因此我们取这个数组的最后一项，保证取到的图片实例是层级最高的
        lastImg = clickedkArr[length - 1]
        if (lastImg.place === 'del') {
            modelsManage.splice(lastImg.index, 1)
            // 重新绘制
            draw()
            return
        }
        // 将该实例的被选值设为true，下次重新绘制将绘制边框
        selectModel = lastImg
        lastImg.selected = true
        // 保存这个实例的初始值，以后会用上
        initial = {
            initialX: lastImg.x,
            initialY: lastImg.y,
            initialH: lastImg.h,
            initialW: lastImg.w,
            initialRotate: lastImg.rotate
        }
    }
    // 重新绘制
    draw()
    // 保存点击的坐标，move时要用
    startTouch = { startX: x, startY: y }
    canvas.addEventListener("touchmove", move)
    canvas.addEventListener("touchmove", touchend)
}

function move (e:TouchEvent) {
    e.preventDefault()
    if(!canMove) return
    const x = e.targetTouches[0].clientX
    const y = e.targetTouches[0].clientY
    const { initialX, initialY } = initial
    const { startX, startY } = startTouch
    const { centerX, centerY } = lastImg
    if (clickedkArr.length) {
        if (lastImg.place === 'move') {
            canvas.style.cursor = "move"
            // 算出移动后的xy坐标与点击时xy坐标的差（即平移量）与图片对象的初始坐标相加即可
            lastImg.x = initialX + (x - startX)
            lastImg.y = initialY + (y - startY)
        }else if (lastImg.place === 'scale') {
            // 缩放部分
            const { initialH, initialW } = initial
            // 用勾股定理算出距离
            const lineA = Math.sqrt(Math.pow(centerX - startX, 2) + Math.pow(centerY - startY, 2))
            const lineB = Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2))
            const w = initialW + (lineB - lineA)
            // 由于是等比缩放，所以乘一个宽高比例。
            const h = initialH + (lineB - lineA) * (initialH / initialW)
            // 定义最小宽高
            lastImg.w = w <= 5 ? 5 : w
            lastImg.h = h <= 5 ? 5 : h
            if (w > 5 && h > 5) {
                // 放大 或 缩小
                lastImg.x = initialX - (lineB - lineA) / 2
                lastImg.y = initialY - (lineB - lineA) / 2
            }
        }else if(lastImg.place === 'rotate') {
            // 旋转部分
            const { initialRotate } = initial
            const angleBefore = Math.atan2(startY - centerY, startX - centerX) / Math.PI * 180
            const angleAfter = Math.atan2(y - centerY, x - centerX) / Math.PI * 180
            // 旋转的角度
            lastImg.rotate = initialRotate + angleAfter - angleBefore
        }
        draw()
    }
}

function touchend(e:TouchEvent) {
    e.preventDefault()
    const x = e.targetTouches[0].clientX
    const y = e.targetTouches[0].clientY
    if(!selectModel)return
    const place = selectModel.getImageOrder(x, y - canvas.offsetTop)
    if (place !== "false") {
        if (place === 'move') {
            canvas.style.cursor = "move"
        }else if (place === 'scale') {
            canvas.style.cursor = "se-resize"
        }else if (place === 'del') {
            canvas.style.cursor = "pointer"
        }else if (place === 'rotate') {
            canvas.style.cursor = "pointer"
        }
    }else {
        canvas.style.cursor = ""
    }
}

function changeImage(res:string) {
    if(!selectModel) return;
    selectModel.changeSrc(res)
    selectModel = null
    draw()
}

function pushImage(source:{name:string, id:number, path:string, [key:string]:any}) {
    const item = new ImageModel(source.path, ctx)
    modelsManage.push({img:item, name:source.name, id:source.id, price: source.price})
    draw()
}
function showEdit() {
    if(!selectModel) return;
    showAction.value = true
}

defineExpose({ pushImage, changeImage, showEdit })
let rightKey:Ref<HTMLElement> = ref(null)
onMounted(() => {
    canvas = document.getElementById('myCanvas') as HTMLCanvasElement
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight
    canvas.width = width * 0.6
    canvas.height = height * 0.78
    canvas.ontouchstart = e => start(e)
    canvas.ontouchend = e => {
        e.preventDefault()
        canvas.removeEventListener("touchmove", move)
        document.ontouchend = null;
        canMove = false;
        canvas.style.cursor = ""
    }
    canvas.addEventListener("tap", () => {
        debugger
    })
    // canvas.ontouchstart = e => {
    //     console.log(e.button)
    // }
    ctx = canvas.getContext('2d')
})

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rightKey {
    position: fixed;
}
#myCanvas {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url("../../assets/image/background.jpg");
}
</style>
