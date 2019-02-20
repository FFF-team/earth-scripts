const paths = require('../../config/paths');
const isValid = require('./util').isValid;
const babel_loader = require('../../config/common/loaders/babel');


const DEFAULT = [{
    test: /\.(js|jsx|mjs)$/,
    include: paths.appSrc,
    loader: babel_loader({
        compact: true,
    })
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

module.exports = jsLoaders