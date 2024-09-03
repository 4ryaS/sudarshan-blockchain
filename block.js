const crypto = require('crypto');

class Block {
    constructor(index, timestamp, data, previous_hash = '') {
        // position of the block in the chain
        this.index = index;
        // when the block was created
        this.timestamp = timestamp;
        // the actual data (document hash and metadata)
        this.data = data;
        // hash of the previous block
        this.previous_hash = previous_hash;
        // hash of the current block
        this.hash = this.calculate_hash();

    };

    calculate_hash() {
        // create a SHA-256 hash of the block's data
        return crypto.createHash('sha256').update(
            this.index + this.previous_hash + this.timestamp + JSON.stringify(this.data)
        ).digest('hex');
    }
}

module.exports = Block;