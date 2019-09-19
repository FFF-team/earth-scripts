'use strict';

const paths = require('../paths');
const fs = require('fs');
const path = require('path');

const { alias } = require('../../config-user/webpack');

const fileExists = path => {
    return fs.existsSync(path);
}

// 获取alias配置
const getAliasConfig = config => {
    if(!alias) {
        return config;
    }

    try {
        const aliasConfigMap = {};
        for (let key in alias) {
            const mapKey = `^${key}/(.*)$`;
            aliasConfigMap[mapKey] = path.resolve(alias[key], '$1');
        }

        config.moduleNameMapper = {
            ...config.moduleNameMapper,
            ...aliasConfigMap
        }

        return config;
    } catch (e) {
        return config;
    }
}

// 自定义jest配置
const getCustomerConfig = config => {
    const customerConfigPath = path.resolve(paths.appPath, "config/jest.config.js");
    const isConfigPathExists = fileExists(customerConfigPath);
    const changeDefaultConfig = !!isConfigPathExists ? require(customerConfigPath) : null;

    if (!isConfigPathExists || (typeof changeDefaultConfig !== 'function')) {
        return config;
    }

    return changeDefaultConfig(config);
}

const config =  (resolve, rootDir) => {
    const defaultConfig = {
        rootDir: '',
        roots: ['<rootDir>/src'],
        setupFiles: [resolve('config/jest/setupJest.js')],
        browser: true,

        testPathIgnorePatterns: ['<rootDir>/node_modules/'],

        setupFilesAfterEnv: [resolve('config/jest/setupFilesAfterEnv.js')],
        testEnvironment: 'jsdom',

        transform: {
            '^.+\\.(js|jsx|ts|tsx)$': resolve('config/jest/babelTransform.js'),
            '^.+\\.css$': resolve('config/jest/cssTransform.js'),
            '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': resolve('config/jest/fileTransform.js'),
        },
        transformIgnorePatterns: [
            '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
            '^.+\\.module\\.(css|sass|scss)$',
        ],
        moduleNameMapper: {
            '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        },

        collectCoverage: true, //是否生成测试报告
        testRegex: ".*.test.js$",
        watchPlugins: [
            'jest-watch-typeahead/filename',
            'jest-watch-typeahead/testname',
        ],
        verbose: true,
    };

    if (rootDir) {
        defaultConfig.rootDir = rootDir;
    }

    return getCustomerConfig(getAliasConfig(defaultConfig));
};

module.exports = config;