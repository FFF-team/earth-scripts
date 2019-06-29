const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcss_loader = require('../common/loaders/postcss');
const css_loader = require('../common/loaders/css');
const scss_loader = require('../common/loaders/scss');
const _ = require('lodash');


function scssLoaders(customConfig, extractTextPluginOptions) {


    const loaderObj = {
        test: /\.scss$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: false
                }
            },
            css_loader({
                importLoaders: 2,
                import: true,
                sourceMap: false,
                // sourceMap: shouldUseSourceMap,
            }),
            postcss_loader,
            scss_loader
        ]
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
        // todo: 暂不考虑cssModule情况
        normalLoader() :
        // cssModuleLoader({
        //     exclude,
        //     config
        // }) :
        normalLoader()


}

module.exports = scssLoaders;
