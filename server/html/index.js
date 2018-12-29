const React = require('react');
const ReactDOMServer = require('react-dom/server');
const StaticRouter = require('react-router-dom').StaticRouter;
// const multiStream = require('multistream');
const stringStream = require('string-to-stream');
const Loadable = require('react-loadable');

const cheerio = require('cheerio');
const readFile = require('../util/readFile').readFile;
const getAppForPage = require('./getAppForPage');
const pageStream = require('../util/stream');
const logger = require('../lib/logger');
const maxMem = require('../def').maxMem;
const getInitialData = require('./getInitialData');
const enhanceApp = require('./enhanceApp');
const getScripts = require('../util/getScripts');
const { matchRoutes, getRouteInitialData } = require('../util/parseRoute');


const osBusy = require('../util/osCheck');

const enableReaderStream = (() => (+React.version.split('.')[0] === 16))();

// todo: renderToNodeStream react-loadable cannot support
const ReactDomRenderMethod = (() => {
    // if (enableReaderStream) {
    //     return ReactDOMServer.renderToNodeStream
    // } else {
    //     return ReactDOMServer.renderToString
    // }
    return ReactDOMServer.renderToString
})();



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
        this.app = null;
        this.routerContext = {};

        this._store = null;
        // 保存初始数据
        this.__PRELOADED_STATE__ = {
            pageProps: {},
            store: {}
        };
        this._$html = '';
    }

    init(option) {

        if (!option.ssr) {
            return this
        }

        option.app = option.app ? option.app.default : null;

        let App = null;
        try {
            App = option.app || getAppForPage(this.page);
        } catch (e) {
            App = require('./MissingComp');
            logger.error(e.stack)
        }

        // save option
        this.option = option;
        this.app = App;

        if (this.app) {
            this.option.browserRouter = true
        }

        return this
    }


    injectStore(store) {

        if (!this.option.ssr) return this;
        if (!store) return this;


        this._store = store;

        return this
    }

    async render() {

        // get html
        const html = await readFile(this.page).catch((err) => {
            console.error('GET FILE ERROR: ' + err);
        });

        this._$html = cheerio.load(html || '');

        // 内存占用大于300M时关闭ssr
        // todo: 判断负载过高用内存？？
        if (process.env.NODE_ENV !== 'development') {
            const _osBusy = osBusy({maxMem: maxMem});
            if (_osBusy) {
                logger.info(`mem usage: ${_osBusy}`);
                this.option.ssr = false;
            }
        }


        const { ssr } = this.option;

        // !ssr
        if (!ssr) {
            // this.__renderToStream();
            // 直接输出性能高一倍
            this.__renderToString();

            return
        }

        this.app = await this.__enhanceApp(this.app);

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
    // get __initHtml() {
    //
    //     if (this._$html) return this._$html;
    //
    //     return (async () => {
    //         const html = await readFile(this.page).catch((err) => {
    //             console.error('GET FILE ERROR: ' + err);
    //         });
    //
    //
    //         this._$html = cheerio.load(html || '');
    //         return this
    //     })()
    // }

    /**
     * !ssr时直接输出
     * @private
     */
    __renderToString() {
        this.ctx.set('Content-Type', 'text/html; charset=utf-8');
        this.ctx.status = 200;
        this.ctx.body = this._$html.html()
    }

    /**
     * ssr时stream输出
     * @param pageMarkup
     * @private
     */
    __renderToStream(pageMarkup = ' ') {

        const scripts = getScripts(this.page, this.modules);

        const stream = typeof pageMarkup === 'string' ? stringStream(pageMarkup) : pageMarkup;
        const ctx = this.ctx;
        const _$ = this._$html;


        // 将initState塞进head
        const initState = `window.__PRELOADED_STATE__ = ${JSON.stringify(this.__PRELOADED_STATE__).replace(/</g, '\\\u003c')}`
        this._$html('head').append(`<script>${initState}</script>`);
        // 移除root
        _$('#root').remove();


        const  htmlWriter = new pageStream({
            head: `<!DOCTYPE html><html>${_$('head').html()}<body><div id='root'>`,
            // footer: `</div>${_$('body').html()}</body></html>`
            footer: `</div>${scripts.map((s) => `<script type="text/javascript" src="${s}"></script>`).join('\n')}</body></html>`
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
     * 包装App，获取初始数据
     * @param App
     * @return {Promise<*>}
     * @private
     */
    async __enhanceApp(App) {

        // get InitialData from <App/>
        const initialProps = await getInitialData(App, this.ctx, this._store);

        // get InitialData from route Component
        const routeConfig = this.option.routeConfig;
        if (routeConfig) {
            const pathname = this.ctx.request.path.replace(`/${this.page}`, '');
            const matchedRoute = matchRoutes(routeConfig, pathname);
            const ret = await getRouteInitialData(this.ctx, this._store, matchedRoute);
            this.__PRELOADED_STATE__.routeProps = ret;
        }




        this.__PRELOADED_STATE__.pageProps = initialProps;

        if (this._store && this._store.getState) {
            this.__PRELOADED_STATE__.store = this._store.getState();
        }
        const EnhancedApp = enhanceApp({
            initialData: initialProps
        })(App);
        // const EnhancedApp = App;

        return EnhancedApp
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


        const appWithRouter = this.__appWithRouter();

        return ReactDomRenderMethod(
            <Provider store={this._store}>
                {appWithRouter}
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
            this.__appWithRouter()
        );
    }


    __appWithRouter() {
        const App = this.app;

        this.modules = [];

        if (this.option.browserRouter) {
            return (
                <Loadable.Capture report={moduleName => this.modules.push(moduleName)}>
                    <StaticRouter
                        basename={`/${this.page}`}
                        location={this.req.url}
                        context={this.routerContext}
                    >
                        <App/>
                    </StaticRouter>
                </Loadable.Capture>
            )
        }

        return (
            <Loadable.Capture report={moduleName => this.modules.push(moduleName)}>
                <StaticRouter context={this.routerContext}>
                    <App/>
                </StaticRouter>
            </Loadable.Capture>
        )
    }


}

module.exports = Html;

