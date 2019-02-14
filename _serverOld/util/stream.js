var Transform = require("stream").Transform;

module.exports = class HtmlWriterStream extends Transform {
    constructor(options = {}) {
        super(options);
        this.started = false;

        this.headString = options.head;
        this.footerString = options.footer;

    }

    get isHead() {
        return !this.started;
    }

    head(data) {
        this.push(`${this.headString}${data}`);

        this.started = true;
    }

    body(data) {
        this.push(data.toString());
    }

    footer() {
        this.push(`${this.footerString}`);

        // end the stream
        this.push(null);
    }


    // 在每次 stream 中有数据来了之后都会被执行
    _transform(chunk, encoding, done) {
        let data = chunk.toString();
        this.isHead ? this.head(data) : this.body(data);
        // this.body(data);
        done();
    }

    // 在所有的数据块都被 _transform 方法处理过后，才会调用 _flush 方法
    _flush(done) {
        this.footer();
        // this._lastLineData = null;
        done();
    }
}
