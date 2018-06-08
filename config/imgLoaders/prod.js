const url_loader = require('../common/loaders/url');
const util = require('../util');

function imgLoaders(customConfig) {

    const cdnPath = customConfig.cdnPath;
    const filenames = customConfig.filenames;

    const imgOption = cdnPath && cdnPath.img ?
        {
            limit: 10000,
            name: cdnPath.img,
            publicPath: util.ensureSlash(cdnPath.img, true)
        } : {
            limit: 10000,
            name: filenames.img,
        };

    return [
        {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: url_loader,
            options: Object.assign(imgOption),
        }
    ]
}

module.exports = imgLoaders;