const paths = require('../paths');
const babel_loader = require('../common/loaders/babel');
const ts_loader = require('../common/loaders/ts');

module.exports = [
    {
        test: /\.(ts|tsx)$/,
        include: paths.appSrc,
        use: [
            babel_loader({

                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
            }),
            ts_loader({
                    // disable type checker - we will use it in fork plugin
                    transpileOnly: true,
                }
            )
        ],
    },
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
