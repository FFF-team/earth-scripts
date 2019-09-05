/**
 * 接口代理文件，放在项目src下：src/setupProxy.js
 *
 * 对于只有一个代理地址，可以直接写在package.json文件内proxy字段.eg: "proxy": "http://localhost:8888"
 * 对于两个及以上地址，使用本文件配置
 * @type {proxy}
 */
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/api', { target: 'http://localhost:5000/' }))
    app.use(proxy('/nodeapi', { target: 'http://localhost:5000/' }))
}
