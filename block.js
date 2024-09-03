const crypto = require('crypto');
// const { hash_document } = require('./utils');

class Block {
    constructor(index, timestamp, document_content, previous_hash = '') {
        // position of the block in the chain
        this.index = index;
        // when the block was created
        this.timestamp = timestamp;
        // the actual data (hash of the document and metadata)
        // this.document_hash = hash_document(document_content);
        this.document_hash = document_content;
        // hash of the previous block
        this.previous_hash = previous_hash;
        // hash of the current block
        this.hash = this.calculate_hash();

    };

    calculate_hash() {
        // create a SHA-256 hash of the block's data
        return crypto.createHash('sha256').update(
            this.index + this.previous_hash + this.timestamp + this.document_hash
        ).digest('hex');
    }
}

module.exports = Block;