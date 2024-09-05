const Block = require('./block');
const BlockchainModel = require('./models/blockchain.models');
const { hash_document } = require('./utils');

class Blockchain {
    constructor() {
        // Initialize chain with the Genesis Block
        this.chain = [];
        // Set difficulty for PoW
        this.difficulty = 0;
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
            
            // Validate the chain after loading
            if (!this.is_chain_valid()) {
                throw new Error('Blockchain data is invalid');
            }

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
        // mine the block before adding
        new_block.mine_block(this.difficulty);
        
        if (this.is_new_block_valid(new_block)) {
            this.chain.push(new_block);
            await this.save_blockchain();
            console.log('Block added and blockchain updated.')
        }
        else {
            throw new Error('New block is invalid and cannot be added to the chain.');
        }
        return new_block;
    }

    is_new_block_valid(new_block) {
        const latest_block = this.get_latest_block();

        if (new_block.previous_hash !== latest_block.hash) {
            return false;
        }
        
        if (new_block.hash !== new_block.calculate_hash()) {
            return false;
        }
        
        return true;
    }

    // default interval is 60 seconds
    validate_chain_periodically(interval = 60000) {
        setInterval(() => {
            if (!this.is_chain_valid()) {
                console.error('Blockchain validation failed! Possible tampering detected.');
            }
            else {
                console.log('Blockchain validation passed.')
            }
        }, interval);
    }

    async revalidate_chain() {
        if (!this.is_chain_valid()) {
            throw new Error('Blockchain is invalid after revalidation!');
        }
        else {
            console.log('Blockchain revalidation passed.')
        }
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
                console.log(`Block ${i} has an invalid hash.`);
                return false;
            }
            
            if (current_block.previous_hash !== previous_block.hash) {
                console.log(`Block ${i} has an invalid previous hash.`);
                return false;
            }

            // Check if the block meets the PoW criteria
            if (current_block.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
                console.log(`Block ${i} does not meet the PoW requirement.`);
                return false;
            }
        }

        return true;
    }

    // Additional method to check PoW for the entire chain
    validate_pow() {
        for (let i = 0; i < this.chain.length; i++) {
            const block = this.chain[i];
            if (block.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
                console.log(`Block ${i} does not meet the PoW requirement.`);
                return false;
            }
        }
        console.log("All blocks meet the PoW requirement.");
        return true;
    }
}

module.exports = Blockchain;