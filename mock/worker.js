const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const configResultes = require('./transform')

const routerCreateFun = (configResulte) => {

    const { url, type, dataPath, delay, customRouter } = configResulte;

    if (customRouter) {
        //延迟&&存在自定义router逻辑
        server[type](url, (req, res) => {

            customRouter(req, res)

        })

    } else if (delay) {
        //延迟
        server[type](url, (req, res) => {

            const resulteData = fs.readFileSync(path.resolve('mock') + dataPath, 'utf-8');

            setTimeout(() => {

                res.send(JSON.parse(resulteData))

            }, delay)

        })

    } else {
        //普通情况
        server[type](url, (req, res) => {

            const resulteData = fs.readFileSync(path.resolve('mock') + dataPath, 'utf-8');
            
            res.send(JSON.parse(resulteData))

        })

    }

};

configResultes.forEach((item) => {

    routerCreateFun(item)

})

server.use(jsonServer.bodyParser)
server.use(middlewares)
server.use(router)

server.listen(3001, () => {
    console.log('mock server has restart')
})

//watch config.js file 
// const watchedFile = path.resolve('mock/config');
// fs.watch(watchedFile, (err, file) => {

// 	//console.log('trigger watch and will restart mock server ...')

// 	process.exit(0);

// })