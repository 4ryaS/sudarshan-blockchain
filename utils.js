const crypto = require('crypto');

const hash_document = (document) => {
    return crypto.createHash('sha256').update(document).digest('hex');
}

module.exports = {
    hash_document,
};