const koa = require("koa")
const path = require("path")
const router = require("./route/index")
const { koaBody } = require('koa-body');
const koaStatic = require('koa-static');
const app = new koa()
if(process.env.NODE_ENV === "development") {
  const middlewareHeader = require("./middleware/koa-response-header")
  app.use(middlewareHeader)
}
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, `/static/image`), //上传文件存储目录
    keepExtensions: true,//允许保留后缀名
    multipart: true,
    filename:(name, ext, part, from) => (name+ext) 
  }
}))
app.use(router.routes())
app.use(router.allowedMethods())
let opts = {
  maxAge: 2592000000, //静态资源30天缓存 实际上 = 2592000秒
};
app.use(koaStatic(path.join(__dirname, "./static"), opts))
app.listen(3001)
