// todo: too simple, need more valid :(
function isValid(data) {
    return Object.prototype.toString.call(data) === "[object Array]"
}

module.exports = {
    isValid
};