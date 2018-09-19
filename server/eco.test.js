const {SSR_ENTRY_PATH} = require('./constants');


module.exports = {
    apps: [{
        name: 'USER_CENTER_SSR_TEST',
        script: SSR_ENTRY_PATH,
        env: { // 部署到测试服务器上
            NODE_ENV: 'test',
        },
        instance_var: 'INSTANCE_ID',
        // watch: ['server/dist/*.js']
    }]
};
