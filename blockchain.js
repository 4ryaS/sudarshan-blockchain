const Block = require('./block');

class Blockchain {
    constructor() {
        // Initialize chain with the Genesis Block
        this.chain = [this.create_genesis_block()];
    }

    create_genesis_block() {
        return new Block(0, Date.now(), "Genesis Block", "0");
    }

    get_latest_block() {
        return this.chain[this.chain.length - 1];
    }

    add_block(new_block) {
        new_block.previous_hash = this.get_latest_block().hash;
        new_block.hash = new_block.calculate_hash();
        this.chain.push(new_block);
    }

    is_chain_valid() { 
        for (let i = 1; i < this.chain.length; i++) {
            const current_block = this.chain[i];
            const previous_block = this.chain[i - 1];

            if (current_block.hash !== current_block.calculate_hash()) {
                return false;
            }
            
            if (current_block.previous_hash !== previous_block.hash) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Blockchain;