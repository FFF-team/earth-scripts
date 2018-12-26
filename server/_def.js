/**
 * ssr-init copy to config/server.js
 * @type {{port: string, proxyPath: string, selfHandleResponseApi: boolean, serverName: string}}
 */
module.exports = {
    port: '8001',
    proxyPath: 'http://localhost:3001',  // 代理地址
    selfHandleResponseApi: false,        // 是否处理代理返回的数据
};
