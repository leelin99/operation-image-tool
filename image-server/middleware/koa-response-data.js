const fs = require("fs")
const imageList = require("../image-list.json")
const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "http://39.108.236.220:3001"
console.log(baseUrl)
module.exports = async (ctx, next) => {
  const url = ctx.request.url.replace("/api", "")
  if(url === "/getImageList") {
    const path = require("path")
    const result = fileArr.map((file, index) => {
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