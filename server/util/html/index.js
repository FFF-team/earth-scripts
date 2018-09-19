const React = require('react');
const ReactDOMServer = require('react-dom/server');
const StaticRouter = require('react-router-dom').StaticRouter;
// const multiStream = require('multistream');
const stringStream = require('string-to-stream');

const cheerio = require('cheerio');
const readFile = require('../readFile').readFile;
const getAppForPage = require('../getAppForPage');
const pageStream = require('./stream');
const logger = require('../logger');
const maxMem = require('../../def').maxMem;
const console = require('../../../tools').clog.ssr;


const osBusy = require('./osCheck');

const enableReaderStream = (() => (+React.version.split('.')[0] === 16))();

const ReactDomRenderMethod = (() => {
    if (enableReaderStream) {
        return ReactDOMServer.renderToNodeStream
    } else {
        return ReactDOMServer.renderToString
    }
})();

let context = {};

const AppWithRouter = (page, req, isBrowserRouter) => {
    const App = getAppForPage(page);

    if (isBrowserRouter) {
        return (
            <StaticRouter
                basename={`/${page}`}
                location={req.url}
                context={context}
            >
                <App/>
            </StaticRouter>
        )
    }

    return (
        <StaticRouter context={context}>
            <App/>
        </StaticRouter>
    )
};

/**
 * const htmlObj = await new Html(req, page).init({
 *     ssr: true/false            // 是否打开服务端渲染
 *     browserRouter： true/false //  是否使用browserRouter，在ssr为true时，建议本项也为true
 * })
 * 如果没用redux
 * htmlObj.render()即可
 *
 * 如果用了redux，需要传入store
 * htmlObj.injectStore(store).render()
 */
class Html {

    constructor(ctx, page) {
        this.page = page;
        this.req = ctx.request;
        this.option = {};
        this.ctx = ctx;

        this._store = null;
        this._$html = '';
    }

    init(option) {
        this.option = option;
        return this.__initHtml
    }


    injectStore(store) {

        if (!this.option.ssr) return this;

        this._store = store;

        const initState = `window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState()).replace(/</g, '\\\u003c')}`

        // 将initState塞进head
        this._$html('head').append(`<script>${initState}</script>`);


        return this
    }

    render() {

        // 内存占用大于300M时关闭ssr
        // todo: 判断负载过高用内存？？
        const _osBusy = osBusy({maxMem: maxMem});
        if (_osBusy) {
            logger.info(`mem usage: ${_osBusy}`);
            this.option.ssr = false;
        }

        const { ssr } = this.option;

        // !ssr
        if (!ssr) {
            // this.__renderToStream();
            // 直接输出性能高一倍
            this.__renderToString();

            return
        }

        // 不能为空字符串，stream会有问题
        // todo: other fix
        let pageMarkup = ' ';

        try {

            pageMarkup = this._store ?
                this.__getPageMarkupWithStore() :
                this.__getPageMarkup();


        } catch (e) {
            logger.error(e.stack);
            console.log('generate HTML error')
        }

        this.__renderToStream(pageMarkup);

    }

    /**
     * 异步获取html
     * @return {*}
     * @private
     */
    get __initHtml() {

        if (this._$html) return this._$html;

        return (async () => {
            const html = await readFile(this.page).catch((err) => {
                console.error('GET FILE ERROR: ' + err);
            });
            this._$html = cheerio.load(html || '');
            return this
        })()
    }

    __renderToString() {
        this.ctx.set('Content-Type', 'text/html; charset=utf-8');
        this.ctx.status = 200;
        this.ctx.body = this._$html.html()
    }

    /**
     * stream渲染结果
     * @param pageMarkup
     * @private
     */
    __renderToStream(pageMarkup = ' ') {


        const stream = typeof pageMarkup === 'string' ? stringStream(pageMarkup) : pageMarkup;
        const ctx = this.ctx;
        const _$ = this._$html;


        _$('#root').remove();



        const  htmlWriter = new pageStream({
            head: `<!DOCTYPE html><html>${_$('head').html()}<body><div id='root'>`,
            footer: `</div>${_$('body').html()}</body></html>`
        });


        ctx.set('Content-Type', 'text/html; charset=utf-8');
        ctx.status = 200;
        ctx.body = stream.pipe(htmlWriter)


        // todo: 以下方式压测时会有Error: read ECONNRESET错误
        /*ctx.set('Content-Type', 'text/html; charset=utf-8');
        ctx.status = 200;

        try {
            ctx.body = multiStream(
                [
                    stringStream(`<!DOCTYPE html><html>${_$('head').html()}<body><div id='root'>`),
                    stream,
                    stringStream(`</div>${_$('body').html()}</body></html>`)
                ]
            )
        } catch (e) {
            console.log(e);
            ctx.body = 'html parse failed'
        }*/



    }

    /**
     * 使用redux情况
     * ReactDomRenderMethod(App)
     * @return {*}
     * @private
     */
    __getPageMarkupWithStore() {
        let Provider = null;
        try {
            Provider =  require('react-redux').Provider;
        } catch (e) {
            console.log('react-redux is missing')
        }

        return ReactDomRenderMethod(
            <Provider store={this._store}>
                {AppWithRouter(this.page, this.req, this.option.browserRouter)}
            </Provider>
        );
    }

    /**
     * 没有redux
     * ReactDomRenderMethod(App)
     * @return {*}
     * @private
     */
    __getPageMarkup() {

        return ReactDomRenderMethod(
            AppWithRouter(this.page, this.req, this.option.browserRouter)
        );
    }




}

module.exports = Html;

