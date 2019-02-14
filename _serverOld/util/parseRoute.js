const { matchPath } = require('react-router-dom');


const getRouteComp = async (matchedRoute) => {
    const _comp = matchedRoute.preload ? await matchedRoute.preload() : {default: matchedRoute}
    return _comp.default
};


function matchRoutes(routes, pathname, /*not public API*/ branch = []) {
    routes.some(route => {
        const match = route.path
            ? matchPath(pathname, route)
            : branch.length
                ? branch[branch.length - 1].match // use parent match
                : {}; // use default "root" match

        // todo: Router.computeRootMatch(pathname);
        // todo: react-router v3 not support

        if (match) {
            branch.push({ route, match });

            if (route.routes) {
                matchRoutes(route.routes, pathname, branch);
            }
        }

        return match;
    });

    return branch;
}

/**
 *
 * @param ctx
 * @param reduxStore
 * @param matchedRoute
 * @param defaultInitialData 直接从html()中传过来的初始数据
 * @return {Promise<void>}
 */
const getRouteInitialData = async (ctx, reduxStore, matchedRoute, defaultInitialData) => {

    let _tempRouteComp = [];
    let finalData = {};

    // 已经传入初始数据
    if (defaultInitialData && Object.keys(defaultInitialData).length) {
        const promise = matchedRoute.map(async ({ route, match }) => {
            return  await getRouteComp(route.component);
        });
        const routeComp = await Promise.all(promise);

        routeComp.forEach((comp) => {
            const compName = comp.displayName || comp.name;
            const data = defaultInitialData[compName];

            if (data) {
                comp.defaultProps = data;
                finalData[compName] = data
            }
        });

        return finalData
    }


    // 无初始数据，尝试从组件下getInitialProps中拿
    const promises = matchedRoute.map(async ({ route, match }) => {
        const comp = await getRouteComp(route.component);
        _tempRouteComp.push(comp);
        return comp.getInitialProps
            ? comp.getInitialProps(ctx, reduxStore, match)
            : Promise.resolve(null)
    });


    const initialData = await Promise.all(promises);

    initialData.reduce((ret, next, i) => {
        const comp = _tempRouteComp[i];
        const compName = comp.displayName || comp.name;
        if (compName && initialData[i]) {
            finalData[compName] = next;
            comp.defaultProps = initialData[i]
        }
    }, finalData);

    return finalData
}


module.exports = {
    matchRoutes,
    getRouteInitialData
};