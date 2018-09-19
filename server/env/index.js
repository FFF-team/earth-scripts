// todo: check file exists
module.exports = {
    get: (prop) => {

        const context = require.context(`./`, true, /\.js/);
        const envPath = `./${process.env.NODE_ENV}.js`;
        return context(envPath)[prop]
    }
};
