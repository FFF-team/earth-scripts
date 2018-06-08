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


module.exports = {
    mergeLoaders,
    ensureSlash
};