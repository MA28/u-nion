var crypto = require ('crypto');

module.exports = function (passwd) {
    return crypto.createHash('sha256').update(passwd).digest ('base64');
}