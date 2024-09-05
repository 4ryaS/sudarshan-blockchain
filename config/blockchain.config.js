const Blockchain = require('../blockchain');

let blockchain;

const create_blockchain = () => {
    if (!blockchain) {
        blockchain = new Blockchain();
        return blockchain;
    }
    else {
        return blockchain;
    }
}

blockchain = create_blockchain();

module.exports = blockchain;
