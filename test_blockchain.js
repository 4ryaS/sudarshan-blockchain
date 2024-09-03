const Blockchain = require('./blockchain');
const Block = require('./block');

// Initialize a new Blockchain
let my_blockchain = new Blockchain();

// Add a new block
my_blockchain.add_block(new Block(1, Date.now(), { data: "First block data" }));

// Add another block
my_blockchain.add_block(new Block(2, Date.now(), { data: "Second block data" }));

// Log the blockchain
console.log(JSON.stringify(my_blockchain, null, 4));

// Validate the blockchain
console.log("Is blockchain valid? " + my_blockchain.is_chain_valid());
