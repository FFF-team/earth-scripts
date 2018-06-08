const postcss_loader = require('../common/loaders/postcss');
const css_loader = require('../common/loaders/css');
const style_loader = require('../common/loaders/style');

const mergeLoaders = require('../util').mergeLoaders;


const base = {
    test: /\.css$/,
    use: [
        style_loader,
        postcss_loader,
    ]
};


const normalLoader = () => {
    return mergeLoaders(base)([
        {use: [1, css_loader({importLoaders: 1})]}
    ])
    /*return [
        {
            test: /\.css$/,
            use: [
                style_loader,
                css_loader({importLoaders: 1}),
                postcss_loader,
            ],
        }
    ]*/
};


const cssModuleLoader = ({exclude, config}) => {

    return exclude ?
        mergeLoaders(base)([
            {
                exclude: exclude,
                use: [1,
                    css_loader(
                        Object.assign({importLoaders: 1, module: true,}, config)
                    )
                ]
            },
            {
                include: exclude,
                use: [1,
                    css_loader({
                        importLoaders: 1,
                    })
                ]
            }
        ]) :
        mergeLoaders(base)([
            {
                use: [1,
                    css_loader(
                        Object.assign({importLoaders: 1, module: true,}, config)
                    )]
            }
        ])
};


function cssLoaders(customConfig) {


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

module.exports =  cssLoaders;