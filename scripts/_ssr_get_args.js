const args = process.argv.slice(2);
const yargs = require('yargs').parse(args);

const ssrGetArgs = async () => {

    const {
        env = 'development',
        name = 'PROJECT_NAME',
        entry = require.resolve("../server/index.js")
    } = yargs;

    return {
        env,
        name: `${name}_${env}`.toLocaleUpperCase(),
        entry
    };

};

module.exports = ssrGetArgs;


