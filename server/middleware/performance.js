const logger = require('../util/logger');

module.exports = () => {

    return async (ctx, next) => {
        const start = new Date();

        await next();

        const end = new Date();

        logger.info(`path: ${ctx.path}, status: ${ctx.status},  time usage: ${end - start}ms`)



    }
};
