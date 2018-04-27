function cssLoader(options) {
    return {
        loader: require.resolve('css-loader'),
        options: options
    }
}

module.exports = cssLoader;
