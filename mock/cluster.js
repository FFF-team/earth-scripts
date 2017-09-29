const cluster = require('cluster');
const http = require('http');

let worker;

if (cluster.isMaster) {

	cluster.fork();

	cluster.on('exit', (worker, code, signal) => {

		cluster.fork();

	})

} else {

	require("./worker.js");

}