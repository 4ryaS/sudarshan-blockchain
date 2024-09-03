const Blockchain = require('./blockchain');
const Block = require('./block');

// Create a new instance of the blockchain
const my_blockchain = new Blockchain();

// Add some blocks to the blockchain with document content
console.log('Adding block 1...');
my_blockchain.add_block('Document Content 1');

console.log('Adding block 2...');
my_blockchain.add_block('Document Content 2');

// Check if the blockchain is valid
console.log('Blockchain valid? ' + my_blockchain.is_chain_valid());

// Print the blockchain
console.log(JSON.stringify(my_blockchain, null, 4));


// Validate the blockchain
console.log("Is blockchain valid? " + my_blockchain.is_chain_valid());
