class SmartContracts {
    constructor(blockchain) {
        this.blockchain = blockchain;
        // List of authorized entities for issuing documents
        this.authorized_issuers = [];
        // List of authorized entities for verifying documents
        this.authorized_verifiers = [];
    }

    // Method to add an issuing authority
    add_issuer(authority_name) {
        this.authorized_issuers.push(authority_name);
        console.log(`${authority_name} is now authorized to issue documents.`);
    }

    // Method to add a verifying authority
    add_verifier(authority_name) {
        this.authorized_verifiers.push(authority_name);
        console.log(`${authority_name} is now authorized to verify documents.`);
    }

    // Document Issuance Contract with Access Control
    issue_document(authority_name, document_content) {
        if (this.authorized_issuers.includes(authority_name)) {
            this.blockchain.add_block(document_content);
            console.log(`${authority_name} has issued a document.`);
        } 
        else {
            console.log(`${authority_name} is not authorized to issue documents.`);
        }
    }

    // Document Verification Contract with Access Control
    verify_document(authority_name, document_content) {
        if (this.authorized_verifiers.includes(authority_name)) {
            const document_hashes = this.blockchain.chain.map(block => block.document_hash);
            const input_document_hash = require('./utils').hash_document(document_content);

            const is_valid = document_hashes.includes(input_document_hash);

            if (is_valid) {
                console.log(`${authority_name} has verified the document as valid.`);
            } 
            else {
                console.log('Document is invalid or altered.');
            }

            return is_valid;
        } 
        else {
            console.log(`${authority_name} is not authorized to verify documents.`);
            return false;
        }
    }
}

module.exports = SmartContracts;
