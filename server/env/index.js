// todo: check file exists
const { getEnv } = require('../context');
const console = require('../../tools').clog.ssr;

module.exports = {
    get: (prop) => {
        const obj = getEnv(`./${process.env.NODE_ENV}.js`);

        let data = '';

        try {
            data = obj[prop];
        } catch (e) {
            console.error(`${process.env.NODE_ENV} is not supported, try development, test, production`)
        }

        return data
    }
};
