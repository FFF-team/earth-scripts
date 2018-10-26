const console = require('../tools').clog.ssr;
const path = require('path');
const pm2 = require('pm2');
const webpack = require('webpack');
const config = require('../server/webpack.config');
const del = require('del');

const supportEnv = {
    test: 'test',
    production: 'production'
};

const ssrDeploy = async () => {

    const {env, entry, name} = await require('./_ssr_get_args')();

    console.info(`current environment: ${env}`);

    if (!supportEnv[env]) {
        console.error(`cannot support env: ${env}`);
        process.exit(1)
    }

    process.env.ENABLE_BUNDLE_ANALYZE = 'false';
    process.env.IS_SERVER = 'true';
    process.env.BABEL_ENV = env;
    process.env.NODE_ENV = env;



    await require('./_ssr_init')();

    await require('./_ssr_set_config')(env);

    // clear
    del(path.resolve('_server/dist'));


    try {
        await startCompile({
            entry: entry
        })
    } catch (e) {
        console.log(e);
        console.log('webpack compiler error');
        process.exit(1);
    }

    startPm2(name, env);

};

ssrDeploy();



const startCompile = ({
                          entry
                      }) => {
    // compile
    return new Promise((resolve, reject) => {
        console.log('start compile...');

        webpack(
            Object.assign(config, {
                entry: {
                    main: path.resolve(entry)
                }
            }),
            (err, stats) => {
                if (err || stats.hasErrors()) {
                    reject(err);
                    // Handle errors here
                }
                // Done processing
            })
            .run((err, stats) => {

                if (err || stats.hasErrors()) {
                    reject(err);
                    // Handle errors here
                }

                console.log(stats.toString({
                    chunks: false,  // Makes the build much quieter
                    colors: true    // Shows colors in the console
                }));

                resolve()


            });
    })
}





const startPm2 = (name, env) => {
    pm2.connect(function (err) {
        console.log('pm2 connect...');

        if (err) {
            console.error(err);
            process.exit(2);
        }

        pm2.start(
            {
                name: name,
                script: path.resolve('_server/dist/main.generated.js'),
                env: {
                    NODE_ENV: env
                },
                instance_var: 'INSTANCE_ID',
                watch: ['server/dist/*.js']
            },
            function (err, apps) {
                err && console.log('start pm2: ' + err);
                pm2.disconnect();   // Disconnects from PM2
                if (err) throw err
            });
    });
};
