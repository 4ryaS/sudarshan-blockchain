const Blockchain = require('./blockchain');
const SmartContracts = require('./smart_contracts');

// Create a new instance of the blockchain
const my_blockchain = new Blockchain();

// Create an instance of the smart contracts
const my_contracts = new SmartContracts(my_blockchain);

// Add some authorities (Placeholder for future expansion)
my_contracts.add_authority('Government Office');
my_contracts.add_authority('University');

// Issue a document
console.log('Issuing Document 1...');
my_contracts.issue_document('Document Content 1');

console.log('Issuing Document 2...');
my_contracts.issue_document('Document Content 2');

// Verify a document
console.log('Verifying Document 1...');
const is_verified = my_contracts.verify_document('Document Content 1');
console.log('Verification result: ' + is_verified);

// Print the blockchain
console.log(JSON.stringify(my_blockchain, null, 4));

// Validate the blockchain
console.log("Is blockchain valid? " + my_blockchain.is_chain_valid());
