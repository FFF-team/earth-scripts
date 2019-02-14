// PTS: PROXY_TO_SERVER
const RES_CODE = {
    PTS_ERROR: -1,       // 代理失败
    PTS_EMPTYBODY: -2,    // 代理成功，但是返回数据为空
    PTS_PARSEFAIL: -3,     // 代理成功，parse json失败
    PTS_SEND_TO_CLIENT_ERROR: -4 // 发送给client失败
};

const resBody = (level, msg) => {
    return {
        code: level,
        msg: `ERROR: ${msg}`
    }
};

module.exports = {
    RES_CODE,
    resBody
};