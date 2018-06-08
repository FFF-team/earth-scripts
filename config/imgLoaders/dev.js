const url_loader = require('../common/loaders/url');

function imgLoaders(customConfig) {
    return [
        {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: url_loader,
            options: {
                limit: 10000,
                name: customConfig.filenames.img,
            },
        }
    ]
}

module.exports = imgLoaders;