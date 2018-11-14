const Router = require('koa-router');
const html = require('earth-scripts/server/util/html');


module.exports = (page) => {

    const router = new Router();

    router.get(['/', '/*'],
        // page middleware
        async (ctx, next) => {

            const htmlObj = new html(ctx, page)
                .init({
                    ssr: false,
                    browserRouter: false,
                });

            await htmlObj.render().catch(() => {console.log('page get file error')});

        }
    );

    return router
};
