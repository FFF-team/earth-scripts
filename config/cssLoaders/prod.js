const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcss_loader = require('../common/loaders/postcss');
const css_loader = require('../common/loaders/css');

const _ = require('lodash');

function cssLoaders(customConfig) {

    const loaderObj = {
        test: /\.css$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    // if hmr does not work, this is a forceful method.
                    reloadAll: true,
                    // only enable hot in development
                    hmr: true
                }
            },
            css_loader({
                importLoaders: 1,
                sourceMap: false,
                import: true
            }),
            postcss_loader,
        ],
    };


    const normalLoader = () => {
        return [loaderObj]
    };


    const {
        exclude,
        config,
        enable
    } = customConfig.cssModule;

    return enable ?
        normalLoader():
        // todo: 暂不考虑cssModule情况
        // cssModuleLoader({
        //     exclude,
        //     config
        // }) :
        normalLoader()

}

module.exports = cssLoaders;
