const {SSR_ENTRY_PATH} = require('./constants');

module.exports = {
    apps: [{
        name: 'USER_CENTER_SSR_ONLINE',
        script: SSR_ENTRY_PATH,
        env: { // 部署到正式服务器上
            NODE_ENV: 'production',
            // todo: string形式报错？？
            // args: ["Online"],
        },
        instance_var: 'INSTANCE_ID',
        // watch: ['server/dist/*.js']
    }]
};
