const fs = require('fs');
const Router = require('koa-router');

const router = new Router();

const getPagesMap = require('../util/getPagesMap');
const pagesMap = getPagesMap(fs.readdirSync(require('../env').get('pagesPath')));

let pageLogic = () => {};

try {
    pageLogic = require('rootServer/router/page')
} catch (e) {
    pageLogic = require('./_page')
}


router.get('/:page/:others*', async (ctx, next) => {

        const page = ctx.params && ctx.params.page;

        if (page && pagesMap[page]) {
            return next()
        } else {
            ctx.body = `page:[${page}] 404, you can try ${Object.keys(pagesMap)[0]}.`;
        }

    },

    // page middleware
    pageLogic,
    () => {
        return
    }
);

module.exports = router;
