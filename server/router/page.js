const Router = require('koa-router');
const html = require('earth-scripts/server/util/html');


module.exports = (page) => {

    const router = new Router();

    router.get(['/', '/*'],
        // page middleware
        async (ctx, next) => {

            const htmlObj = new html(ctx, PAGE)
                .init({
                    ssr: false,
                    browserRouter: false,
                })
                .injectStore(createStore(reducers, {}));

            await htmlObj.render().catch(() => {console.log('page get file error')});

            return next()
        }
    );

    return router
};
