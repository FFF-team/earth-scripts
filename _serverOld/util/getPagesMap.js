/**
 * 从src/pages下拿到文件名
 * @return {*} {a: a.html}
 *
 * todo: more 异常处理
 */
function getPagesMap(pagePath) {
    const glob = require('glob');

    const html = glob.sync(pagePath);

    let obj = {};

    return html.reduce((ret, next) => {
        const temp = next.split('/');
        const file = temp[temp.length - 1];
        obj[file] = `${file}.html`;
        return obj
    }, html[0])
}

module.exports = getPagesMap;
