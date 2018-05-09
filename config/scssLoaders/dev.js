const cssModuleConfig = require('../util').getCssModuleConfig;
const mergeLoaders = require('../util').mergeLoaders;

const postcss_loader = require('../common/loaders/postcss');
const css_loader = require('../common/loaders/css');
const style_loader = require('../common/loaders/style');
const scss_loader = require('../common/loaders/scss');

const base = {
    test: /\.scss$/,
    use: [
        style_loader,
        postcss_loader,
        scss_loader
    ]
};

const normalLoader = () => {

    return mergeLoaders(base)([
        {
            use: [1, css_loader({
                importLoaders: 2
            })]
        }
    ])

    // return [
    //     {
    //         test: /\.scss$/,
    //         use: [
    //             style_loader,
    //             css_loader({
    //                 importLoaders: 2
    //             }),
    //             postcss_loader,
    //             scss_loader
    //         ]
    //     }
    // ]
};

const cssModuleLoader = ({exclude, config}) => {

    return exclude ?
        mergeLoaders(base)([
            {
                exclude: exclude,
                use: [1, css_loader(
                    Object.assign({importLoaders: 2, module: true}, config)
                )]
            },
            {
                include: exclude,
                use: [1, css_loader({
                    importLoaders: 2,
                })]
            }
        ]) :
        mergeLoaders(base)([
            {
                use: [1, css_loader(
                    Object.assign({importLoaders: 2, module: true}, config)
                )]
            }
        ]);

    // return exclude ? [
    //     {
    //         test: /\.scss$/,
    //         exclude: exclude,
    //         use: [
    //             style_loader,
    //             css_loader({
    //                 importLoaders: 2,
    //                 module: true,
    //                 localIdentName: name
    //             }),
    //             postcss_loader,
    //             scss_loader
    //         ],
    //     },
    //     {
    //         test: /\.scss$/,
    //         include: exclude,
    //         use: [
    //             style_loader,
    //             css_loader({
    //                 importLoaders: 2,
    //             }),
    //             postcss_loader,
    //             scss_loader
    //         ],
    //     }
    // ] : [
    //     {
    //         test: /\.scss$/,
    //         use: [
    //             style_loader,
    //             css_loader({
    //                 importLoaders: 2,
    //                 module: true,
    //                 localIdentName: name
    //             }),
    //             postcss_loader,
    //             scss_loader
    //         ],
    //     }
    // ]
}


function scssLoaders(customConfig) {

    const {
        exclude,
        config,
        enable
    } = cssModuleConfig(customConfig);

    return enable ?
        cssModuleLoader({
            exclude,
            config
        }) :
        normalLoader()


}

module.exports = scssLoaders;