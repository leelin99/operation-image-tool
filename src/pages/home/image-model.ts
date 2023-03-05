export default class ImageModel {

    public x:number

    public y:number

    public w:number

    public h:number

    public scale:number

    public centerX:number

    public centerY:number

    public rotate:number

    public selected:boolean

    public _image:HTMLImageElement

    public _ctx:CanvasRenderingContext2D

		public place:string

		public index:number

		private _reload:boolean

		private _leftRightMirror:number = 1

		private _upDownMirror:number = 1

		private _iconWidth:number = 24

		private _iconImgs = {
			ScaleIcon:new Image(),
			CloseIcon:new Image(),
			RotateIcon:new Image()
		}

    constructor(src:string, ctx:CanvasRenderingContext2D){
			//x y为初始坐标
			this.x = 0;
			this.y = 0;
			this._ctx = ctx;
			this._image = new Image()
			this._image.src = src
			this._image.onload = () => {
				const W = 400;
				const radio = Number((this._image.width / W).toFixed(0))
				this.w = this._image.width / radio
				this.h = this._image.height / radio
				this._ctx.drawImage(this._image, this.x, this.y, this.w, this.h);
			}
			this.rotate = 0;
			this.selected = false;
			this._iconImgs.ScaleIcon.src = "/static/icons/scale.png"
			this._iconImgs.CloseIcon.src = "/static/icons/close.png"
			this._iconImgs.RotateIcon.src = "/static/icons/rotate.png"
    }

		public changeSrc(src:string) {
			this.selected = false
			this._image.src = src
			this.reLoadImg()
		}

		/**
		 * 重新加载图片
		 * @param src 
		 */
		public async reLoadImg() {
			new Promise((resolve, reject) => {
				this._reload = true
				this._image.onload = () => {
					const W = 400;
					const radio = Number((this._image.width / W).toFixed(0))
					this.w = this._image.width / radio
					this.h = this._image.height / radio
					this._ctx.drawImage(this._image, this.x, this.y, this.w, this.h);
					this._reload = false
					resolve(null)
				}
			})
		}

    /**
     * 绘制图片
     */
    public paint() {
				this._ctx.restore()
        this._ctx.save()
        //计算图片中心的坐标，后续要用上
        this.centerX = this.x + this.w / 2;
        this.centerY = this.y + this.h / 2;
        // 变更原点至图片的中点
        this._ctx.translate(this.centerX, this.centerY);
        //根据transform的旋转角度旋转坐标轴
        this._ctx.rotate(this.rotate * Math.PI / 180);
				// 镜像
				this._ctx.scale(this._leftRightMirror, this._upDownMirror)
        //变更回来
        this._ctx.translate(-this.centerX, -this.centerY);
        // 描述图片
				this._ctx.drawImage(this._image, this.x, this.y, this.w, this.h);
        // 如果是选中状态，绘制选择虚线框，和缩放图标、删除图标
        if (this.selected) {
          //对于canvas其他的描述api
          this._ctx.setLineDash([10, 10]);
          this._ctx.lineWidth = 2;
          this._ctx.strokeStyle = "rgb(0, 110, 255)";
          this._ctx.lineDashOffset = 10;
          this._ctx.strokeRect(this.x, this.y, this.w, this.h);
					this.loadImg(this._iconImgs.ScaleIcon, this.x + this.w - 15, this.y + this.h - 15)
					this.loadImg(this._iconImgs.CloseIcon, this.x - this._iconWidth / 2, this.y - this._iconWidth / 2)
					this.loadImg(this._iconImgs.RotateIcon, this.centerX, this.centerY * 2 - this.y)
					this._ctx.restore()
        }
    }

		/**
		 * 加载图片
		 */
		loadImg(img:HTMLImageElement, x:number, y:number) {
			this._ctx.drawImage(img, x, y, this._iconWidth, this._iconWidth)
		}

		/**
		 * 获取图片点击指令
		 * @param x 
		 * @param y 
		 * @returns 
		 */
    public getImageOrder(x:number, y:number):string {
			// 变换区域左上角的坐标和区域的高度宽度
			let transformX = this.x + this.w ;
			let transformY = this.y + this.h ;
			// 获得图标旋转后的角度，等于初始角度+图片旋转角度
			let transformAngle = Math.atan2(transformY - this.centerY, transformX - this.centerX) / Math.PI * 180 + this.rotate
			// 获得该角度下图标的xy坐标
			let scaleXY = this.getTransform(transformX, transformY, transformAngle);
			// 将新的坐标赋值给坐标变量
			let scaleX = scaleXY.x, scaleY = scaleXY.y
			let delX = this.x;
			let delY = this.y;
			let delAngle = Math.atan2(delY - this.centerY, delX - this.centerX) / Math.PI * 180 + this.rotate
			let delXY = this.getTransform(delX, delY, delAngle);
			delX = delXY.x, delY = delXY.y
			//移动区域的坐标
			let moveX = this.x;
			let moveY = this.y;
			//旋转
			let rotateX = this.centerX, rotateY = this.centerY * 2 - this.y
			let ratateAngle = Math.atan2(rotateY - this.centerY, rotateX - this.centerX) / Math.PI * 180 + this.rotate
			let rotateXY = this.getTransform(rotateX, rotateY, ratateAngle);
			rotateX = rotateXY.x, rotateY = rotateXY.y

			if (x - scaleX >= 0 && y - scaleY >= 0 && scaleX + this._iconWidth - x >= 0 && scaleY + this._iconWidth - y >= 0) {
				// 缩放区域
				return "scale";
			}else if (x - delX >= 0 && y - delY >= 0 && delX + this._iconWidth - x >= 0 && delY + this._iconWidth - y >= 0) {
				// 删除区域
				return 'del'
			}else if (x - rotateX >= 0 && y - rotateY >= 0 && rotateX + this._iconWidth - x >= 0 && rotateY + this._iconWidth - y >= 0) {
				// 旋转
				return "rotate";
			}else if (x - moveX >= 0 && y - moveY >= 0 && moveX + this.w - x >= 0 && moveY + this.h - y >= 0) {
				// 移动区域
				return "move";
			}
			// 不在选择区域里面
			return "false";
    }

    public getTransform(x:number, y:number, rotate:number) {
         //将角度化为弧度
        var angle = Math.PI / 180 * rotate;
        //初始坐标与中点形成的直线长度不管怎么旋转都是不会变的，用勾股定理求出然后将其作为斜边
        var r = Math.sqrt(Math.pow(x - this.centerX, 2) + Math.pow(y - this.centerY, 2));
        //斜边乘sin值等于即可求出y坐标
        var a = Math.sin(angle) * r;
        //斜边乘cos值等于即可求出x坐标
        var b = Math.cos(angle) * r;
        //目前的xy坐标是相对于图片中点为原点的坐标轴，而我们的主坐标轴是canvas的坐标轴，所以要加上中点的坐标值才是标准的canvas坐标
        return {
					x: this.centerX + b - this._iconWidth / 2,
					y: this.centerY + a - this._iconWidth / 2                                                                                                                                                     / 2
        };
    }

		public leftRightMirror() {
			this._leftRightMirror = -this._leftRightMirror
		}
		public upDownMirror() {
			this._upDownMirror = -this._upDownMirror
		}

}