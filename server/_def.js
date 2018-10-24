/**
 * ssr-init copy to _server/def.js
 * @type {{port: {Online: string, Test: string, Local: string}, localServer: string, proxyPath: {Local: string, Test: string, Online: string}, selfHandleResponseApi: boolean}}
 */
module.exports = {
    port: '8001',
    localServer: 'http://localhost:3200',
    proxyPath: 'http://localhost:3201',
    selfHandleResponseApi: false
};
