const url_loader = require('../common/loaders/url');
const util = require('../util');

function imgLoaders(customConfig) {

    const staticPath = customConfig.staticPath;
    const filenames = customConfig.filenames;

    const imgOption = staticPath && staticPath.img ?
        {
            limit: 10000,
            name: filenames.img,
            publicPath: util.ensureSlash(staticPath.img, true)
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