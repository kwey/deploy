const Koa = require("koa");
const koaStatic = require("koa-static");
const path = require("path");

const resolve = file => path.resolve(__dirname, file);
const app = new Koa();

// 开放目录
app.use(require("./pro.js"));
app.use(koaStatic(resolve("../dist")));

const port = 3000;

app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});

module.exports = app;
