const Router = require('koa-router');
const html = require('earth-scripts/server/util/html');


module.exports = (page) => {

    const router = new Router();

    router.get('*',
        // page middleware
        async (ctx, next) => {

            const htmlObj = await new html(ctx, page).init({
                ssr: true,
                browserRouter: true
            }).catch(() => {console.log('page get file error')});

            htmlObj.injectStore().render();


            return next()
        }
    );

    return router
};
