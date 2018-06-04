function babelLoader(options) {
    return {
        loader: require.resolve('babel-loader'),
        options: options
    }
}

module.exports = babelLoader;
