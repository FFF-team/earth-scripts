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

const getRouteInitialData = async (ctx, reduxStore, matchedRoute) => {

    let _tempRouteComp = [];
    let finalData = {};



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
        finalData[comp.displayName] = next;
        comp.defaultProps = initialData[i]
    }, finalData);


    return finalData
}


module.exports = {
    matchRoutes,
    getRouteInitialData
};