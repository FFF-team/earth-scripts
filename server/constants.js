const path = require('path');

module.exports = {
    SSR_ENTRY_PATH: path.resolve('_server/dist/main.generated.js'),
    SSR_PORT: {
        Online: 8003,
        Test: 8001,
        Local: 8001
    },
    PROXY_API_PREFIX: '/api',
    PROXY_PATH: {
        Local: 'http://localhost:3101',
        Test: 'http://192.168.66.26:60601',
        Online: 'https://jruc.58.com'
    },
    // localServer: 'https://jruc.58.com',
    LOCAL_SERVER: 'http://localhost:3100',
    SELF_HANDLE_RESPONSE: true,

};