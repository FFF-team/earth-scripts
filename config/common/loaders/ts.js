function tsLoader(options) {
    return {
        loader: require.resolve('ts-loader'),
        options: options
    }
}

module.exports = tsLoader;
