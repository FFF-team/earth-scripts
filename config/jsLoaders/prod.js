const paths = require('../paths');
const babel_loader = require('../common/loaders/babel');
const ts_loader = require('../common/loaders/ts');

module.exports = [
    {
        test: /\.(ts|tsx)$/,
        include: paths.appSrc,
        use: ts_loader({
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
            }
        ),
    },
    {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: babel_loader({
            compact: true,
        })
    }
];