const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcss_loader = require('../common/loaders/postcss');
const css_loader = require('../common/loaders/css');
const scss_loader = require('../common/loaders/scss');
const _ = require('lodash');
const mergeLoaders = require('../util').mergeLoaders;


function scssLoaders(customConfig) {


    const loaderObj = {
        test: /\.scss$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: false
                }
            },
            postcss_loader,
            scss_loader
        ]
    };


    const normalLoader = () => {

        return mergeLoaders(loaderObj)([
            {
                use: [1, css_loader({
                    importLoaders: 2,
                    import: true,
                    sourceMap: false,
                    // sourceMap: shouldUseSourceMap,
                })]
            }
        ]);


    };

    const cssModuleLoader = ({exclude, config}) => {
        return exclude ? mergeLoaders(loaderObj)([
            {
                exclude: exclude,
                use: [1, css_loader({
                    importLoaders: 2,
                    import: true,
                    sourceMap: false,
                    // sourceMap: shouldUseSourceMap,
                })]
            },
            {
                test: exclude,
                use: [1,
                    css_loader(
                        Object.assign({
                            importLoaders: 2,
                            minimize: true,
                            sourceMap: false,
                            module: true,
                            // sourceMap: shouldUseSourceMap,
                        }, config)
                    )
                ]
            }
        ]) : mergeLoaders(loaderObj)([
            {
                use: [1,
                    css_loader(
                        Object.assign({
                            importLoaders: 2,
                            minimize: true,
                            sourceMap: false,
                            module: true,
                            // sourceMap: shouldUseSourceMap,
                        }, config)
                    )
                ]
            }
        ])
    };


    const {
        exclude,
        config,
        enable
    } = customConfig.cssModule;

    return enable ?
        cssModuleLoader({
            exclude,
            config
        }) :
        normalLoader()


}

module.exports = scssLoaders;
