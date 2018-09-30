const webpack = require('webpack');
const config = require('../server/webpack.config');
const console = require('../tools').clog.ssr;

console.log('==== webpack start compile ===');

const ssrWatch =  () => {
    return new Promise((resolve, reject) => {
        const compiler = webpack(config,
            (err, stats) => {
                if (err || stats.hasErrors()) {
                    console.log(err)
                    console.log('webpack compiler error')
                    process.exit(1);
                    // Handle errors here
                }
                // Done processing
            }
        );

        compiler.watch({
            // Example watchOptions
            aggregateTimeout: 300,
            poll: undefined
        }, (err, stats) => {
            // todo: 不输出信息
            // Print watch/build result here...
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            console.log('==== webpack compile end ===');
            // console.log(stats.toString({
            //     chunks: false,  // Makes the build much quieter
            //     colors: true    // Shows colors in the console
            // }));

            resolve(true);

        });
    })
};

module.exports = ssrWatch;
// todo: err
// NODE_ENV=development webpack --config ./server/webpack.config.js --progress --watch
// 如果在这里执行npm run watch，会执行项目下的package.json中的scripts，这种方法不可取
