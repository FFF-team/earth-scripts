const {SSR_ENTRY_PATH} = require('./constants');

module.exports = {
    apps: [{
        name: 'USER_CENTER_SSR_DEV',
        script: SSR_ENTRY_PATH,
        env: { // 本地调试用
            NODE_ENV: 'development'
        },
        instance_var: 'INSTANCE_ID',
        watch: ['server/dist/*.js']
    }]

};
