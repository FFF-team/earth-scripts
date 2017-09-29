const path = require('path');
const configList = require(path.resolve('mock/config'))

const configResulte = [];

const configResulteCreateFun = (item) => {

	let resulte;
	let { url, type, dataPath, delay, customRouter } = item;

	//needed params
	if (!url && !dataPath) { throw new Error('configObj need url&&dataPath') }
	//default params
	if (!type) item.type = 'get';

	resulte = Object.assign({}, item)

	configResulte.push(resulte)

};

configList.forEach((item) => {

	configResulteCreateFun(item)

});

module.exports = configResulte;