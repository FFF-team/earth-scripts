const cp = require('recursive-copy');
const { resolve, join } = require('path');


const setConfig = async (env) => {


    await cp(
        resolve('config/index.js'),
        resolve('_server/def.js'),
        {overwrite: true}
    )
    // if (env === 'development') {
    //     await cp(
    //         resolve('config/index.js'),
    //         resolve('_server/def.js'),
    //         {overwrite: true}
    //     )
    // }
    //
    // if (env === 'test') {
    //     await cp(
    //         resolve('offline/index.js'),
    //         resolve('_server/def.js'),
    //         {overwrite: true}
    //     )
    // }
    //
    // if (env === 'production') {
    //     await cp(
    //         resolve('online/index.js'),
    //         resolve('_server/def.js'),
    //         {overwrite: true}
    //     )
    // }
};

module.exports = setConfig
