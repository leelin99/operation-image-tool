const Router = require('koa-router')
const fs = require("fs")
const router = new Router()
const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "http://39.108.236.220:3001"

router.get("/", async (ctx) => {
   ctx.type = "html"
    ctx.body = `<h1>hello wordld</h1>`
})
router.post("/api/uploadImage", async (ctx) => {
  const headImg = baseUrl + "/image/" + ctx.request.files.file.originalFilename
  ctx.body = {
      code:200,
      data:{headImg},
      msg:'上传成功'
    };
})
router.get("/api/getImageList", async (ctx) => {
  const path = require("path")
  const fileArr = fs.readdirSync(path.join(__dirname, "../static/image"), {encode: "utf-8", writeFileTypes: true})
  const result = fileArr.map((file, index) => {
    return {
      path: `${baseUrl}/image/${file}`,
      id: index,
      name: file.split(".")[0],
      price: parseInt(Math.random() * 30000 + 1000) 
    }
  })
  ctx.body = {
    code: 200,
    message: "获取成功",
    result,
  }
})
module.exports = router