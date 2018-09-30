/**
 * ssr-init copy to _server/def.js
 * @type {{port: {Online: string, Test: string, Local: string}, localServer: string, proxyPath: {Local: string, Test: string, Online: string}, selfHandleResponseApi: boolean}}
 */
module.exports = {
    port: {
        Online: '8003',
        Test: '8001',
        Local: '8001'
    },
    localServer: 'http://localhost:3200',
    proxyPath: {
        Local: 'http://localhost:3201',
        Test: 'http://test001.payment.58v5.cn',
        Online: 'http://fbupay.58.com'
    },
    selfHandleResponseApi: true
};
