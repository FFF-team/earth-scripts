const webpack = require('webpack');
const config = require('../server/webpack.config');
const console = require('../tools').clog.ssr;
const path = require('path');

console.log('start compile...');

// todo: default entry的地址有问题
// entry = require.resolve("./index.js")
const ssrWatch = ({
                      entry
                  }) => {
    return new Promise((resolve, reject) => {

        const compiler = webpack(
            Object.assign(config, {
                entry: {
                    main: path.resolve(entry)
                }
            }),
            (err, stats) => {
                if (err || stats.hasErrors()) {
                    console.log(err);
                    console.log('webpack compiler error');
                    process.exit(1);
                    // Handle errors here
                }
                // Done processing
            }
        );

        compiler.watch({
            // Example watchOptions
            aggregateTimeout: 300,
            poll: true
        }, (err, stats) => {
            // todo: 不输出信息
            // Print watch/build result here...
            if (err) {
                console.error(err);
                reject(err);
                return;
            }


            const info = stats.toJson();


            if (stats.hasErrors()) {
                console.error(info.errors);
            }

            if (stats.hasWarnings()) {
                console.warn(info.warnings);
            }


            resolve(true);

        });
    })
};

module.exports = ssrWatch;