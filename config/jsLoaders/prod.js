const paths = require('../paths');
const babel_loader = require('../common/loaders/babel');

module.exports = [
    {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: babel_loader({
            compact: true,
        })
    }
]