const _ = require('lodash');

/**
 * 向loader中merge数据。
 * 注：针对use有特殊处理
 *
 * retLoaders(对象)(对象 | 数组对象)
 *
 * eg: retLoaders({a: '1'})({b: 's'}) -> {a: '1', b: 's'}
 *
 *     retLoaders(
 *        {a: '1', use: ['u1', 'u2']}
 *     )([
 *        {b: '2', use: [1, 'u3']} // use特殊处理，表示在index为1处插入'u3'
 *     ])
 *     ->
 *     [{a: '1', b: '1', use: ['u1', 'u3', 'u2']}]
 *
 *
 * @param original
 * @return {function(*): *} arr为对象则返回对象，arr为数组则返回数组
 */
function mergeLoaders(original) {
    return (arr) => {

        function merge(srcV, objV) {
            return _.mergeWith(srcV, objV, (a, b, key) => {
                if (_.isArray(b) && _.isArray(a) && key === 'use') {
                    const r = a.slice();
                    r.splice(b[0], 0, b[1]).valueOf();
                    return r
                }
            })
        }

        if (_.isArray(arr)) {
            return  arr.map((v) => merge(Object.assign({}, original), v))
        }

        return merge(Object.assign({}, original), arr)


    }
}

function ensureSlash(path, needsSlash) {
    const hasSlash = path.endsWith('/');
    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${path}/`;
    } else {
        return path;
    }
}



function _recursiveIssuer(m) {
    if (m.issuer) {
        return _recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}

function getSplitChunks(paths) {
    let cacheGroups = {
        // 提取公共业务代码到default~AchunkName~BchunkName.js
        // default: false,
        default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
        },
        // 提取entry.vendor中配置的module到vendor
        vendor: {
            test: function(module, chunk) {

                const entryArr = Object.keys(paths.entriesMap || {}) || [];
                const vendorArr = paths.entriesMap.vendor || [];
                const allEntryRegexp = new RegExp(entryArr.join('|'));
                const allVendorRegexp = new RegExp(vendorArr.join('|'));

                for (const chunk of module.chunksIterable) {        //所有chunks的迭代
                    // 如果一个module在entry中用到，并且是node_modules包，这些包都会打包到vendor中
                    if (chunk.name && allEntryRegexp.test(chunk.name)) { //chunk的名称
                        // 把entry.vendor配置的module都打到vendor里
                        if (module.resource && allVendorRegexp.test(module.resource)) {
                            return true;
                        }
                    }
                }
                return false;

            },
            chunks: "all",
            minChunks: 1,
            priority: 10,
            name: "vendor",
            enforce: true
        },
        common: {
            name: "common",
            chunks: "initial",
            priority: 0,
            minChunks: 2
        }
    };
    // todo: 针对每个page提取出一个css文件。异步加载的文件会导出单独的css文件
    // todo: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/257
    // const allEntryArr = paths.allPages;
    // allEntryArr.forEach((_entry) => {
    //     cacheGroups[`${_entry}-style`] = {
    //         name: `${_entry}`,
    //         test: (m, c, entry = `${_entry}`) =>
    //             m.constructor.name === 'CssModule' && _recursiveIssuer(m) === entry,
    //         chunks: 'all',
    //         enforce: true,
    //     }
    // });
    return cacheGroups
}



module.exports = {
    mergeLoaders,
    ensureSlash,
    getSplitChunks
};
