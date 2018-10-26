const {
    SSR_PORT,
    SELF_HANDLE_RESPONSE,
    PROXY_PATH,
    STATIC_SERVER,
    CLIENT_BUILD_PATH,
    PAGE_PATH,
    LOG_DIR,
    LOG_DIR_DEPLOY
} = require('./constants');

const pagesMap = require('./util/getPagesMap')(PAGE_PATH);

const {getCustomDef} = require('./context');

const cusDef = getCustomDef();

const {
    proxyPath = PROXY_PATH,
    port = SSR_PORT,
    selfHandleResponseApi,
    staticServer
} = cusDef;

const dev = process.env.NODE_ENV === 'development';

// todo: 格式校验

module.exports = {
    maxMem: '300M',
    clientBuildPath: CLIENT_BUILD_PATH,
    logDir: dev ? LOG_DIR : LOG_DIR_DEPLOY,
    pagesMap,

    // below can config
    // 代理到的server地址
    proxyPath,
    // 本地开发静态资源起的服务，用于获取html
    staticServer: staticServer || STATIC_SERVER,
    // 端口号
    port,
    selfHandleResponseApi: selfHandleResponseApi || SELF_HANDLE_RESPONSE

};
