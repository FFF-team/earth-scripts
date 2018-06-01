const getFilenames = require('../util').getFilenames;
const url_loader = require('../common/loaders/url');

function imgLoaders(customConfig) {
    return [
        {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: url_loader,
            options: {
                limit: 10000,
                name: getFilenames(customConfig).img,
            },
        }
    ]
}

module.exports = imgLoaders;