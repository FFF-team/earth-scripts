// production环境，手动send
const serve = require('koa-static');
const mount = require('koa-mount');
const root = require('../def').clientBuildPath;
const path = require('path');

module.exports = (opts) => {

    // dev环境，直接next
    if (process.env.NODE_ENV === 'development') {
        return async (ctx, next) => {
            await next()
        }
    } else {

        // 注意：build/static/ 不要生成sourcemap
        return mount('/static',serve(path.join(root, './static'), {
            maxAge: 30 * 24 * 60 * 60,
        }));

    }

};
