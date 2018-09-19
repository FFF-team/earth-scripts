const { SSR_ENTRY_PATH } = require('./constants');
const DEFAULT_proxyApiPrefix = '/api';
const {proxyPath, port} = require('rootServer/config');
const CUS_SERVER_CONFIG = require('rootServer/config');


const customServerConfig = CUS_SERVER_CONFIG;

// todo: 格式校验

module.exports = {
    // 环境定义
    env: {
        Online: 'production',       // online
        Test: 'test',             // test
        Local: 'development'  // dev
    },
    appPath: SSR_ENTRY_PATH,
    // 代理到的server地址
    proxyPath: {
        Local: proxyPath.Local,
        Test: proxyPath.Test,
        Online: proxyPath.Online
    },
    // 本地开发起的服务，用于获取html
    localServer: customServerConfig.localServer,
    maxMem: '300M',
    // 端口号
    port: {
        Online: port.Online,
        Test: port.Test,
        Local: port.Local
    },
    // todo: 格式校验，必须/开头，无/结尾
    proxyApiPrefix: customServerConfig.proxyApiPrefix || DEFAULT_proxyApiPrefix
};
