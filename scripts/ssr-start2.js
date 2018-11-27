process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const nodemon = require('nodemon');
const webpack = require("webpack");
const path = require('path');
const webpackClientConfig = require('./webpack.config.test');

const compiler = webpack(webpackClientConfig);

compiler.run((err, stats) => {


    if (err) {
        console.error(err);
        return;
    }


    const info = stats.toJson();


    if (stats.hasErrors()) {
        console.error(info.errors);
    }

    if (stats.hasWarnings()) {
        console.warn(info.warnings);
    }

    nodemonStart();
});



const nodemonStart = () => {
    nodemon({
        script: path.resolve('node_modules/earth-scripts/server/index.js'),
        ext: 'js json',
        "env": {
            "NODE_ENV": "development"
        },
        watch: path.resolve('node_modules/earth-scripts/server')
    });

    nodemon.on('start', function () {
        console.log('=== App has started === \n');
    }).on('quit', function () {
        console.log('App has quit');
        process.exit();
    }).on('restart', function (files) {
        // console.log('App restarted due to: ', files);
    });
}