const logger = require('../lib/logger');

module.exports = () => {

    return async (ctx, next) => {
        const start = new Date();

        await next();

        const end = new Date();

        // const redirectLocation = ctx.response.headers.location;
        //
        // // todo: 有些接口输出时已经被gzip过，如何打日志
        // // todo: html stream如何打日志
        // // todo: best practice
        // console.log(ctx.respond)
        // // proxy
        if (ctx.respond !== false) {

            logger.info(
                `${ctx.method} ${ctx.status} ${end-start}ms ${ctx.path} ${ctx.ip} ${ctx.request.get('user-agent')}`
            )
        }




    }
};
