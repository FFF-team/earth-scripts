const autoprefixer = require('autoprefixer');

module.exports = {
    loader: require.resolve('postcss-loader'),
    options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
                browsers: [
                    '>1%',
                    'last 0 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                ]
            }),
        ],
    },
};