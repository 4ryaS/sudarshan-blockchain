const Blockchain = require('./blockchain');
const SmartContracts = require('./smart_contracts');

// Create a new instance of the blockchain
const my_blockchain = new Blockchain();

// Create an instance of the smart contracts
const my_contracts = new SmartContracts(my_blockchain);

// Add authorities
my_contracts.add_issuer('University');
my_contracts.add_verifier('Government Office');

// Try to issue a document with an unauthorized entity
console.log('Attempting to issue document by "Fake Entity"...');
my_contracts.issue_document('Fake Entity', 'Unauthorized Document Content');

// Issue a document with an authorized entity
console.log('Issuing document by "University"...');
my_contracts.issue_document('University', 'Official Document Content 1');

// Try to verify a document with an unauthorized entity
console.log('Attempting to verify document by "Unauthorized Office"...');
my_contracts.verify_document('Unauthorized Office', 'Official Document Content 1');

// Verify a document with an authorized entity
console.log('Verifying document by "Government Office"...');
const is_verified = my_contracts.verify_document('Government Office', 'Official Document Content 1');
console.log('Verification result: ' + is_verified);

// Check if the blockchain is still valid
console.log('Blockchain valid? ' + my_blockchain.is_chain_valid());

// Print the blockchain
console.log(JSON.stringify(my_blockchain, null, 4));
