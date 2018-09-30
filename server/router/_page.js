// todo: 这里添加更多自定义逻辑
const html = require('earth-scripts/server/util/html');

const cusPageRouter = async (ctx, next) => {
    const page = ctx.params && ctx.params.page;



    const htmlObj = await new html(ctx, page).init({
        ssr: true,
        browserRouter: true
    }).catch(() => {console.log('page get file error')});

    htmlObj.injectStore().render();
    // htmlObj.render();


    return next()
};

module.exports = cusPageRouter;