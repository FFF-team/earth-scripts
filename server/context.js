const _getContextPath = (keys, filename) => {
    const ret =  keys.filter((v, i) => v.indexOf(filename) > -1);
    return ret.length ? ret[0] : null
};

const _getContext = (context, filename) => {
    const path = _getContextPath(context.keys(), filename);
    return path ? context(path) : null

};

module.exports = {
    getEnv:
        (name = `./${process.env.NODE_ENV}.js`) =>
            _getContext(require.context(`./env`, true, /\.js/), name),
    getCustomDef:
        (name = 'def.js') =>
            _getContext(require.context('rootServer', false, /def\.js/), name),
    getCustomRouter: (name) =>
        _getContext(require.context(`rootServer/router/`, false, /\.js/), name),
    getStoreByPage:
        (name) =>
            _getContext(require.context(`clientSrc/pages/`, true, /store.js/), name),
    getAppByPage:
        (name) =>
            _getContext(require.context(`clientSrc/pages`, true, /containers\/App\.js/), name),
    getCusProxyRouter:
        (name) =>
            _getContext(require.context(`rootServer/`, true, /^\.\/proxy_.*\.js$/), name)
};