const logger = require('../util/logger');

module.exports = () => {

    return async (ctx, next) => {
        const start = new Date();

        await next();

        const end = new Date();

        // todo: 有些接口输出时已经被gzip过，如何打日志
        // todo: html stream如何打日志
        // todo: best practice
        // logger.info(`
        // path: ${ctx.path},
        // status: ${ctx.status},
        // time usage: ${end - start}ms
        // `
        // )



    }
};
