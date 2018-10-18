const path = require('path');
const console = require('../tools').clog.ssr;

// todo: 先判断"npm run start"是否已经执行
// 开发环境下用nodemon
const nodemon = require('nodemon');



nodemon({
    script: path.resolve('_server/dist/main.generated.js'),
    ext: 'js json',
    "env": {
        "NODE_ENV": "development"
    },
    watch: path.resolve('_server/dist/main.generated.js')
});

nodemon.on('start', function () {
    console.log('=== App has started === \n');
}).on('quit', function () {
    console.log('App has quit');
    process.exit();
}).on('restart', function (files) {
    // console.log('App restarted due to: ', files);
});
