/**
 * Created by fengdewang on 17/9/7.
 */
'use strict';
const exec = require('child_process').exec;

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';


exec('cd ./src/scss_mixin/ && git pull origin master');
