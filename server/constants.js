const path = require('path');


module.exports = {
    SSR_ENTRY_PATH: path.resolve('_server/dist/main.generated.js'),
    SSR_PORT: {
        Online: 8003,
        Test: 8001,
        Local: 8001
    },
    PROXY_PATH: {
        Local: 'http://localhost:3101',
        Test: 'http://192.168.66.26:60601',
        Online: 'https://jruc.58.com'
    },
    // localServer: 'https://jruc.58.com',
    LOCAL_SERVER: 'http://localhost:3100',
    SELF_HANDLE_RESPONSE: true,

    // proxy_api  api可以自定义
    // 需要代理的地址都以api开头，例如/api/send/xxx
    PROXY_API_FILENAME_PREFIX: 'proxy_',
    CLIENT_BUILD_PATH: path.resolve('build'),
    PAGE_PATH: path.resolve('src/pages/*')
};