// todo: 这里添加更多自定义逻辑
const html = require('earth-scripts/server/util/html');
// const createStore  = require('redux').createStore;

const cusPageRouter = async (ctx, next) => {
    const page = ctx.params && ctx.params.page;

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
};

module.exports = cusPageRouter;