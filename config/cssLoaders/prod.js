const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcss_loader = require('../common/loaders/postcss');
const css_loader = require('../common/loaders/css');
const mergeLoaders = require('../util').mergeLoaders;

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
            postcss_loader,
        ],
    };


    const normalLoader = () => {
        return mergeLoaders(loaderObj)([{
            use: [1, css_loader({
                importLoaders: 1,
                sourceMap: false,
                import: true
            })]
        }])
    };

    const cssModuleLoader = ({exclude, config}) => {
        return exclude ? mergeLoaders(loaderObj)([
            {
                exclude: exclude,
                use: [1, css_loader({
                    importLoaders: 1,
                    sourceMap: false,
                    import: true
                })]
            },
            {
                test: exclude,
                use: [1,
                    css_loader(
                        Object.assign({
                            importLoaders: 1,
                            minimize: true,
                            sourceMap: false,
                            module: true,
                            // sourceMap: shouldUseSourceMap,
                        }, config)
                    )
                ]
            }
        ]) : mergeLoaders(loaderObj)([{
            use: [1,
                css_loader(
                    Object.assign({
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: false,
                        module: true,
                        // sourceMap: shouldUseSourceMap,
                    }, config)
                )
            ]
        }])
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

module.exports = cssLoaders;
