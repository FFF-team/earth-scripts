const cssModuleConfig = require('../util').getCssModuleConfig;

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


const cssModuleLoader = ({exclude, name}) => {

    return exclude ?
        mergeLoaders(base)([
            {
                exclude: exclude,
                use: [1,
                    css_loader({
                        importLoaders: 1,
                        module: true,
                        localIdentName: name
                    })
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
                    css_loader({
                        importLoaders: 1,
                        module: true,
                        localIdentName: name
                    }),]
            }
        ])
};


function cssLoaders(customConfig) {


    const {
        exclude,
        name,
        enable
    } = cssModuleConfig(customConfig);

    console.log(cssModuleLoader({
        exclude,
        name
    }))

    return enable ?
        cssModuleLoader({
            exclude,
            name
        }) :
        normalLoader()

}

module.exports =  cssLoaders;