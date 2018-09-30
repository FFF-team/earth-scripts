const {
    SSR_ENTRY_PATH,
    SSR_PORT,
    SELF_HANDLE_RESPONSE,
    PROXY_PATH,
    LOCAL_SERVER,
} = require('./constants');

const {getCustomDef} = require('./context')

const cusDef = getCustomDef();

const {
    proxyPath = {},
    port = {},
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

    // below can config
    // 代理到的server地址
    proxyPath: {
        Local: proxyPath.Local || PROXY_PATH.Local,
        Test: proxyPath.Test || PROXY_PATH.Test,
        Online: proxyPath.Online || PROXY_PATH.Online
    },
    // 本地开发起的服务，用于获取html
    localServer: localServer || LOCAL_SERVER,
    // 端口号
    port: {
        Online: port.Online || SSR_PORT.Online,
        Test: port.Test || SSR_PORT.Test,
        Local: port.Local || SSR_PORT.Local
    },
    selfHandleResponseApi: selfHandleResponseApi || SELF_HANDLE_RESPONSE,
};
