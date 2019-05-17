process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const del = require('del');
const path = require('path');
const webpack = require('webpack');
const nodemon = require('nodemon');
const clearModule = require('clear-module');
const decache = require('decache');
const config = require('../server/webpack.config');
// const console = require('../tools').clog.ssr;
const openBrowser = require('react-dev-utils/openBrowser');
const {
    prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');


/**
 * Clear bundled server cache
 * @param serverBundlePath Path to the server bundle file.
 */
const clearRequireCache = serverBundlePath => {

    // todo: only one instance of babel-polyfill is allowed
    decache(serverBundlePath)

    /*const resolveFrom = require('resolve-from');
    const parentModule = require('parent-module');



    const filePath = resolveFrom(path.dirname(parentModule(__filename)), serverBundlePath);

    // Delete itself from module parent
    if (require.cache[filePath] && require.cache[filePath].parent) {
        let i = require.cache[filePath].parent.children.length;

        while (i--) {
            if (require.cache[filePath].parent.children[i].id === filePath) {
                require.cache[filePath].parent.children.splice(i, 1);
            }
        }
    }

    // 先在parent中清空cache，再在require.cache中清空，
    // 否则会产生内存泄露，https://zhuanlan.zhihu.com/p/34702356
    // Delete module from cache
    delete require.cache[filePath];*/


    // clearModule(serverBundlePath)

    // const cacheIds = Object.keys(require.cache);
    // for (const id of cacheIds) {
    //     if (id === serverBundlePath) {
    //         const serverModule = require.cache[id];
    //
    //
    //         clearModule(serverBundlePath)
    //         // delete serverModule.children;
    //         // delete require.cache[id];
    //         return;
    //     }
    // }
};

const initHttpServer = async (serverBundlePath) => {
    let httpServer;

    try {
        httpServer = await require(serverBundlePath)
    } catch (e) {
        console.log(e);
        return null
    }

    const sockets = new Map();
    let nextSocketId = 0;

    httpServer.on('connection', socket => {
        const socketId = nextSocketId ++;
        sockets.set(socketId, socket);

        socket.on('close', () => {
            sockets.delete(socketId)
        })
    });

    return {
        httpServer,
        sockets
    }

}

// this is test code start
let initialLoad = true;
let httpServerInitObject;
// this is test code end


let openFlag = false;

/**
 * 0. init
 * 1. webpack watch
 * 2. nodemon start server
 */

const ssrStart = async () => {

    const {entry, webpackEntry, devWatchFiles, serverPort} = await require('./_ssr_get_args')();

    console.info(`current environment: development`);

    await require('./_ssr_init')();

    // clear
    await del(path.resolve('build/server'));

    // webpack watch
    try {
        await ssrWatch({
            entry: webpackEntry,
            serverEntry: entry
        });
    } catch (e) {
        console.error(e);
        console.error('watch fail');
        return;
    }

    // start nodemon
    // if (entry) {
    //     nodemonStart(entry, devWatchFiles, serverPort)
    //         .on('start', function () {
    //             console.log('=== App has started === \n');
    //
    //             if (!openFlag) {
    //                 openFlag = true;
    //                 // open browser
    //                 _openBrowser(serverPort, Object.keys(webpackEntry)[0])
    //             }
    //
    //
    //         }).on('quit', function () {
    //         console.log('App has quit');
    //         process.exit();
    //     }).on('restart', function (files) {
    //         // console.log('App restarted due to: ', files);
    //     });
    // }

};

const _openBrowser = (port, pageName) => {
    const urls = prepareUrls('http', '0.0.0.0', port);

    openBrowser(
        urls.localUrlForBrowser + (pageName ? pageName : '')
    )
}

const ssrWatch = ({
                      entry,
                      serverEntry
                  }) => {
    return new Promise((resolve, reject) => {

        const bundlePath = path.resolve(serverEntry);

        const compiler = webpack(
            Object.assign(config, {
                entry: entry
            })
        );

        compiler.watch({
            // Example watchOptions
            aggregateTimeout: 300,
            poll: true
        }, async (err, stats) => {
            // todo: 不输出信息
            // Print watch/build result here...
            if (err) {
                reject(err);
                return;
            }

            console.info('react component for ssr has rebuild!');


            // test code start
            clearRequireCache(bundlePath);

            if (!initialLoad) {
                httpServerInitObject.httpServer.close(async () => {
                    console.log('http server on close')
                    httpServerInitObject = await initHttpServer(bundlePath);

                    if (httpServerInitObject) {
                        initialLoad = false;
                        console.log(`Server bundled & restarted ${new Date()}`);
                    } else {
                        // server bundling error has occurred
                        initialLoad = true;
                    }
                });

                // Destroy all open sockets
                for (const socket of httpServerInitObject.sockets.values()) {
                    socket.destroy();
                }
            } else {
                httpServerInitObject = await initHttpServer(bundlePath);

                if (httpServerInitObject) {
                    initialLoad = false;
                    console.log('Server bundled successfully');
                } else {
                    // server bundling error has occurred
                    initialLoad = true;
                }
            }
            // test code end

            const info = stats.toJson();


            if (stats.hasErrors()) {
                console.error(info.errors);
            }

            if (stats.hasWarnings()) {
                console.warn(info.warnings);
            }


            resolve(true);

        });
    })
};

// module.exports = ssrWatch;


const nodemonStart = (serverEntry, devWatchFiles = []) => {
    return nodemon({
        "script": serverEntry,
        "ext": 'js',
        "verbose": true,
        "env": {
            "NODE_ENV": "development"
        },
        "watch": [
            // path.resolve('build/server'),
            path.resolve('template'),
            // todo: 没想好怎么传watch参数，暂时写死
            path.resolve('server'),
            serverEntry,
            ...devWatchFiles
        ],
        "ignore": [
            path.resolve('src')
        ],
        "delay": "1000"
    });

}


ssrStart();