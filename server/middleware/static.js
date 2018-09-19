const config = require('../env');

const proxyToServer = require('../util/proxyToServer');

module.exports = (opts) => {

    // dev环境，直接代理到本地server
    if (process.env.NODE_ENV === 'development') {
        return async (ctx, next) => {
            await proxyToServer(ctx.req, ctx.res, {
                target: `${config.get('localServer')}${ctx.path}`
            }).catch((e) => {
                console.log(e)
            });
        }
    } else {

        // production环境，手动send
        const serve = require('koa-static');
        const root = config.get('pagesPath');

        // 注意：build/static/ 不要生成sourcemap
        return serve(`${root}`, {
            maxAge: 30 * 24 * 60 * 60,
        });

    }

};
