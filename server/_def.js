/**
 * ssr-init copy to config/server.js
 * @type {{port: string, proxyPath: string, selfHandleResponseApi: boolean, serverName: string}}
 */
module.exports = {
    port: '8001',
    proxyPath: 'http://localhost:3201',  // 代理地址
    selfHandleResponseApi: false,        // 是否处理代理返回的数据
    serverName: 'USER_CENTER'            // pm2启动的应用名称
};
