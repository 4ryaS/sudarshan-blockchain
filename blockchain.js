const Block = require('./block');
const BlockchainModel = require('./models/blockchain.models');
const { hash_document } = require('./utils');

class Blockchain {
    constructor() {
        // Initialize chain with the Genesis Block
        this.chain = [];
        this.initialize_blockchain();
    }

    // async initialize_blockchain() {
    //     // Load the blockchain from the database
    //     const blockchain_data = await BlockchainModel.findOne();
    //     if (blockchain_data) {
    //         this.chain = blockchain_data.chain;
    //         console.log('Blockchain loaded from the database.');
    //     }
    //     else {
    //         const genesis_block = this.create_genesis_block();
    //         this.chain.push(genesis_block);
    //         await this.save_blockchain();
    //         console.log('New blockchain created with Genesis Block.')
    //     }
    // }

    async initialize_blockchain() {
        const blockchain_data = await BlockchainModel.findOne();
        if (blockchain_data) {
            this.chain = blockchain_data.chain.map(block_data => {
                return new Block(
                    block_data.index,
                    block_data.timestamp,
                    block_data.document_hash, // Note: This is now the hash of the document, not the content itself.
                    block_data.previous_hash
                );
            });
            console.log('Blockchain loaded from the database.');
        }
        else {
            const genesis_block = this.create_genesis_block();
            this.chain.push(genesis_block);
            await this.save_blockchain();
            console.log('New blockchain created with Genesis Block.')
        }
    }

    create_genesis_block() {
        return new Block(0, Date.now().toString(), "Genesis Block", "0");
    }

    get_latest_block() {
        return this.chain[this.chain.length - 1];
    }

    async add_block(document_content) {
        const new_block = new Block(
            this.chain.length,
            Date.now(),
            hash_document(document_content),
            this.get_latest_block().hash
        );
        this.chain.push(new_block);
        await this.save_blockchain();
    }

    async save_blockchain() {
        await BlockchainModel.findOneAndUpdate({}, { chain: this.chain }, { upsert: true });
        console.log('Blockchain saved to database.');
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