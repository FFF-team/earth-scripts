// require('../mock/worker')
const fs = require('fs');
const fork = require('child_process').fork;
const path = require('path');
const chokidar = require('chokidar');

let watcher = null;
let work = null;

// process.on('SIGINT', function() {
//     // watcher && watcher.close();
//     // work && work.kill();
//     process.exit(1);
// });

const start = (serverRoot) => {
    const actionShell = serverRoot || path.join(__dirname, '../mock/worker.js'); //执行文件路径

    //看门狗 进程
    let watchDog = function(){
        let timer = setTimeout(function(){
            work = fork(actionShell);
            clearTimeout(timer);
        }, 100);
    };

    //监听mock文件变化 并重启进程
	// fs.watch callback会执行多次， 替换为 https://github.com/paulmillr/chokidar
    const watchedFolder = path.resolve('mock/');
    watcher = chokidar
        .watch(watchedFolder, {ignoreInitial: true})
        .on('all', (event, path) => {
            if (work) {
                console.log('trigger watchedFolder and will restart mock server ...');
                work.kill();

                watchDog();
            }
        });

    //启动看门狗
    watchDog();
};


module.exports = {
	start: start
};