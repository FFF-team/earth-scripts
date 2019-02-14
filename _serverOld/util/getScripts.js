const getBundles = require('react-loadable/webpack').getBundles;
const getManifest = require('../context').getManifest;
const getBundleAssets = require('../context').getBundleAssets;
const staticPath = require('../def').staticPath;

const preLoc = staticPath.js;

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
        .map((item) => item ? `${preLoc}${item.file}` : '')
};


const getScripts = (page, asyncModules) => {

    const modules = getAsyncBundle(asyncModules);

    const preLoc = staticPath.js;

    // development
    if (process.env.NODE_ENV === 'development') {


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