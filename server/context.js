const _getContextPath = (keys, filename) => {
    const ret =  keys.filter((v, i) => v.indexOf(filename) > -1);
    return ret.length ? ret[0] : null
};

const _getContext = (context, filename) => {
    const path = _getContextPath(context.keys(), filename);
    return path ? context(path) : null

};

module.exports = {
    getCustomDef:
        (name = 'server.js') =>
            _getContext(require.context('rootConfig', false, /server\.js/), name),
    getAppByPage:
        (name) =>
            _getContext(require.context(`clientSrc/pages`, true, /containers\/App\.js/), name),
    getTplByPage:
        (name) =>
            _getContext(require.context(`clientTpl`, true, /\.js/), name),
    getManifest:
        (name = 'asset-manifest.json') =>
            _getContext(require.context(`rootServer`, false, /asset-manifest.json$/), name),
    getBundleAssets:
        (name = 'react-loadable.json') =>
            _getContext(require.context(`rootServer`, false, /react-loadable.json$/), name)
};