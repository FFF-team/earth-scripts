const Router = require('koa-router');
const router = new Router();

const pageRouter = require('./_page');

const pagesMap = require('../def').pagesMap;


// page
Object.keys(pagesMap).forEach((page) => {
    router.use(`/${page}`, pageRouter(page).routes())
});

module.exports = router;