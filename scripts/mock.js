// require('../mock/worker')
const fs = require('fs');
const fork = require('child_process').fork;
const path = require('path');

let work = null;
const actionShell = path.join(__dirname, '../mock/worker.js'); //执行文件路径

//看门狗 进程
let watchDog = function(){
	let timer = setTimeout(function(){
			work = fork(actionShell);	
		clearTimeout(timer);
	}, 100);
};

//监听mock文件变化 并重启进程
const watchedFolder = path.resolve('mock/');
fs.watch(watchedFolder, (err, file) => {

	console.log('trigger watchedFolder and will restart mock server ...')

	work.kill();

	watchDog();
});

//启动看门狗
watchDog();