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

};

const cssModuleLoader = ({exclude, config}) => {

    return exclude ?
        mergeLoaders(base)([
            {
                exclude: exclude,
                use: [1, css_loader({
                    importLoaders: 2,
                })]
            },
            {
                test: exclude,
                use: [1, css_loader(
                        Object.assign({importLoaders: 2, module: true}, config)
                    )]
            }
        ]) :
        mergeLoaders(base)([
            {
                use: [1, css_loader(
                    Object.assign({importLoaders: 2, module: true}, config)
                )]
            }
        ]);

};


function scssLoaders(customConfig) {

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
