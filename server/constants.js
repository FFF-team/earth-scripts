const path = require('path');

module.exports = {
    SSR_PORT: 8001,
    PROXY_PATH: 'http://localhost:3101',
    STATIC_SERVER: 'http://localhost:3100',
    SELF_HANDLE_RESPONSE: false,

    // proxy_api  api可以自定义
    // 需要代理的地址都以api开头，例如/api/send/xxx
    PROXY_API_FILENAME_PREFIX: 'proxy_',
    CLIENT_BUILD_PATH: path.resolve('build'),
    PAGE_PATH: path.resolve('src/pages/*'),
    LOG_DIR: path.resolve('_server/log'),
    LOG_DIR_DEPLOY: '/opt/nodejslogs'
};