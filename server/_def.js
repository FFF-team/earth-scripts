/**
 * ssr-init copy to _server/def.js
 * @type {{port: string, staticServer: string, proxyPath: string, selfHandleResponseApi: boolean, serverName: string}}
 */
module.exports = {
    port: '8001',
    staticServer: 'http://localhost:3200',
    proxyPath: 'http://localhost:3201',
    selfHandleResponseApi: false,
    serverName: 'USER_CENTER'
};
