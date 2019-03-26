const paths = require('../../config/paths');
const isValid = require('./util').isValid;
const babel_loader = require('../../config/common/loaders/babel');

const DEFAULT = [{
    test: /\.(js|jsx)$/,
    include: paths.appSrc,
    use: [
        babel_loader({

            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
        }),
        {
            loader: require.resolve('webpack-conditional-loader'),
        }
    ]
}]

/**
 * js相关loader包装
 * @param loaders []
 * @return {{test: RegExp, include: *, loader: {loader, options}}[]}
 */
function jsLoaders(loaders) {

    loaders = isValid(loaders)? loaders : DEFAULT;

    return loaders
}

module.exports = jsLoaders;