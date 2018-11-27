const getBundles = require('react-loadable/webpack').getBundles;
const getManifest = require('../context').getManifest;
const getBundleAssets = require('../context').getBundleAssets;

// todo: 异常处理
const getAsyncBundle = (modules) => {

    let loadableJson = getBundleAssets();


    let bundles = [];

    try {
        bundles = getBundles(loadableJson, modules)
    } catch (e) {
        // todo: logger
    }

    return bundles
        .filter((bundle) => {
            return /\.js$/.test(bundle.file)
        })
        .map((item) => item.publicPath)
};


const getScripts = (page, asyncModules) => {

    const modules = getAsyncBundle(asyncModules);


    // development
    if (process.env.NODE_ENV === 'development') {

        const clientWebpackConfig = require('earth-scripts/config/webpack.config.dev.js');
        // todo: 这里先写死，需要灵活配置
        const preLoc = clientWebpackConfig.output.publicPath;

        return [
            `${preLoc}static/js/runtime.js`,
            `${preLoc}static/js/vendor.js`,
            ...modules,
            `${preLoc}static/js/${page}.js`
        ]
    }
    // production
    else {

        let manifest =  getManifest();

        const clientWebpackConfig = require('earth-scripts/config/webpack.config.prod.js');
        const preLoc = clientWebpackConfig.output.publicPath;

        if (!manifest) return  [];

        return [
            `${preLoc}${manifest['runtime.js']}`,
            `${preLoc}${manifest['vendor.js']}`,
            ...modules,
            `${preLoc}${manifest[`${page}.js`]}`
        ]

    }
}

module.exports = getScripts;