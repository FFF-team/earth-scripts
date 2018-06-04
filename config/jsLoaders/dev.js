const paths = require('../paths');
const babel_loader = require('../common/loaders/babel');

module.exports = [
    {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: babel_loader({

            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
        })
    }
];