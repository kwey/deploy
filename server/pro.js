const fs = require('fs')
const path = require('path')
const send = require('koa-send')

const resolve = file => path.resolve(__dirname, file)
// 第 2 步：获得一个createBundleRenderer
const { createBundleRenderer } = require('vue-server-renderer')
const bundle = require('../dist/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: fs.readFileSync(resolve('../dist/index.ssr.html'), 'utf-8'),
    clientManifest: clientManifest
})

function renderToString(context) {
    return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
            err ? reject(err) : resolve(html)
        })
    })
}

// 第 3 步：添加一个中间件来处理所有请求
const handleRequest = async (ctx, next) => {
    const url = ctx.path
    if (url.includes('.')) {
        return await send(ctx, url, { root: path.resolve(__dirname, '../dist') })
    }

    ctx.res.setHeader('Content-Type', 'text/html')
    const context = {
        title: '红叶',
        url
    }
    // 将 context 数据渲染为 HTML
    const html = await renderToString(context)
    ctx.body = html
}

module.exports = handleRequest
