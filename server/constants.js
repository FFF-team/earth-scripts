const path = require('path');

module.exports = {
    SSR_PORT: 8001,
    PROXY_PATH: 'http://localhost:3101',
    STATIC_SERVER: 'http://localhost:3000',
    SELF_HANDLE_RESPONSE: false,

    CLIENT_BUILD_PATH: path.resolve('build'),
    PAGE_PATH: path.resolve('src/pages/*'),
    LOG_DIR: path.resolve('_server/log'),
    LOG_DIR_DEPLOY: '/opt/nodejslogs'
};