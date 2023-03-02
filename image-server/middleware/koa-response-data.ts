const fs = require("fs")

const baseUrl = "http://localhost:3001"
module.exports = async (ctx:any, next:any) => {
  const url = ctx.request.url.replace("/api", "")
  if(url === "/getImageList") {
    const path = require("path")
    const fileArr = fs.readdirSync(path.join(__dirname, "../static/image"), {encode: "utf-8", writeFileTypes: true})
    const result = fileArr.map((file:any, index:number) => {
      return {
        path: `${baseUrl}/image/${file}`,
        id: index
      }
    })
    ctx.response.body = {
      code: 200,
      message: "获取成功",
      result,
    }
  }

  await next()
}