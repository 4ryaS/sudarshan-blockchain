const Blockchain = require('./blockchain');
const SmartContracts = require('./smart_contracts');

// Create a new instance of the blockchain
const my_blockchain = new Blockchain();

// Wait for the blockchain to initialize from the database
setTimeout(async () => {
    // Create an instance of the smart contracts
    const my_contracts = new SmartContracts(my_blockchain);

    // Add authorities
    my_contracts.add_issuer('University');
    my_contracts.add_verifier('Government Office');

    // Issue a document with an authorized entity
    console.log('Issuing document by "University"...');
    await my_contracts.issue_document('University', 'Official Document Content 2');

    // Verify a document with an authorized entity
    console.log('Verifying document by "Government Office"...');
    const is_verified = await my_contracts.verify_document('Government Office', 'Official Document Content 1');
    console.log('Verification result: ' + is_verified);

    // Check if the blockchain is still valid
    console.log('Blockchain valid? ' + my_blockchain.is_chain_valid());

    // Print the blockchain
    console.log(JSON.stringify(my_blockchain, null, 4));

    process.exit();
}, 1000);
