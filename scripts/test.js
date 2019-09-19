'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const jest = require('jest');
const path = require('path');


const createJestConfig = require('../config/jest/defaultConfig');
const paths = require('../config/paths');

let argv = process.argv.slice(2);

const resolve = relativePath => path.resolve(__dirname, '..', relativePath);
const rootDir = path.resolve(paths.appSrc, '..');
// 兼容package.json中的写法
const packageJsonTest = require(paths.appPackageJson).jest || null;

argv.push('--config', JSON.stringify(packageJsonTest || createJestConfig(resolve, rootDir)));
argv.push('--watch');

jest.run(argv);
