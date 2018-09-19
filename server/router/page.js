const fs = require('fs');
const Router = require('koa-router');

const router = new Router();

const html = require('../util/html');
const getPagesMap = require('../util/getPagesMap');
const pagesMap = getPagesMap(fs.readdirSync(require('../env').get('pagesPath')));


const DEF = require('../def');





router.get('/:page/:others*', async (ctx, next) => {

    const page = ctx.params && ctx.params.page;

    if (page === DEF.proxyApiPrefix) {
        return next()
    }

    if (page && pagesMap[page]) {


        try {
            // custom logic
            const pageLogic = require('rootServer/router/page');
            await pageLogic(ctx, next);

        } catch (e) {

            // default logic
            // 默认不开启ssr，不开启browserRouter
            const htmlObj = await new html(ctx, page).init({
                ssr: false,
                browserRouter: false
            }).catch(() => {console.log('page get file error')});

            // htmlObj.injectStore(store).render();
            htmlObj.render();

            return next()

        }


    } else {

        ctx.body = `${page} 404, please visit ${Object.keys(pagesMap)[0]}.`;

        next()
    }




    /*const page = ctx.params && ctx.params.page;

    if (page === DEF.proxyApiPrefix) {
        return next()
    }


    if (page && pagesMap[page]) {

        // 从 store 中获得初始 state
        // 假设store一开始就有数据
        // const preloadedState = {basicData: {context: ''}};
        // const reducers = require(path.resolve(`src/pages/${page}/reducers`)).default;
        // const store = createStore(reducers, preloadedState);


        const htmlObj = await new html(ctx, page).init({
            ssr: true,
            browserRouter: true
        }).catch(() => {console.log('page get file error')});

        // htmlObj.injectStore(store).render();
        htmlObj.render();


        return next()
    } else {

        ctx.body = `${page} 404, please visit ${Object.keys(pagesMap)[0]}.`;

        next()
    }*/

});

module.exports = router;
