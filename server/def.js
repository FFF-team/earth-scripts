const {
    SSR_ENTRY_PATH,
    SSR_PORT,
    SELF_HANDLE_RESPONSE,
    PROXY_PATH,
    LOCAL_SERVER,
    CLIENT_BUILD_PATH,
    PAGE_PATH
} = require('./constants');

const {getCustomDef} = require('./context')

const cusDef = getCustomDef();

const {
    proxyPath = PROXY_PATH.Local,
    port = SSR_PORT.Local,
    selfHandleResponseApi,
    localServer,
} = cusDef;


// todo: 格式校验

module.exports = {
    // 环境定义
    env: {
        Online: 'production',       // online
        Test: 'test',             // test
        Local: 'development'  // dev
    },
    maxMem: '300M',
    appPath: SSR_ENTRY_PATH,
    clientBuildPath: CLIENT_BUILD_PATH,
    pagePath: PAGE_PATH,

    // below can config
    // 代理到的server地址
    proxyPath,
    // 本地开发起的服务，用于获取html
    localServer: localServer || LOCAL_SERVER,
    // 端口号
    port,
    selfHandleResponseApi: selfHandleResponseApi || SELF_HANDLE_RESPONSE,
};
