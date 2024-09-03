const Blockchain = require('./blockchain');
const Block = require('./block');

class SmartContracts {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }

    // Document Issuance Contract
    issue_document(document_content) {
        this.blockchain.add_block(document_content);
        console.log('Document issued and added to the blockchain');
    }

    // Document Verification Contract
    verify_document(document_content) {
        const document_hash = this.blockchain.chain.map(block => block.document_hash);
        const input_document_hash = require('./utils').hash_document(document_content);

        const is_valid = document_hash.includes(input_document_hash);

        if (is_valid) {
            console.log('Document is valid and verified');
        }
        else {
            console.log('Document is invalid or altered');
        }
        return is_valid;
    }

    // Access Control (Basic Example)
    add_authority(authority_name) {
        // For now, we just log the authority addition
        console.log(`${authority_name} is now authorized to issue documents.`);
    }

}

module.exports = SmartContracts;