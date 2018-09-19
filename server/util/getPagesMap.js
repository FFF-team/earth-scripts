/**
 * 筛选.html的文件
 * @param pagesArr fs.readdirSync的结果[]
 * @return {*} {a: a.html}
 *
 * todo: more 异常处理
 */
function getPagesMap(pagesArr) {
    let obj = {};
    const html = pagesArr.filter((p) => /\.html$/.test(p));

    return html.reduce((ret, next) => {
            obj[next.replace(/(.html)$/, '')] = next;
            return obj
        }, html[0])
}

module.exports = getPagesMap;
