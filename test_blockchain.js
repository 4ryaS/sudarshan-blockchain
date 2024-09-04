const Blockchain = require('./blockchain');
const SmartContracts = require('./smart_contracts');

const my_blockchain = new Blockchain();

setTimeout(async () => {
    const my_contracts = new SmartContracts(my_blockchain);

    my_contracts.add_issuer('University');
    my_contracts.add_verifier('Government Office');

    console.log('Issuing document by "University"...');
    await my_contracts.issue_document('University', 'Official Document Content 2');
    await my_contracts.issue_document('University', 'Official Document Content 3');

    console.log('Verifying document by "Government Office"...');
    const is_verified = await my_contracts.verify_document('Government Office', 'Official Document Content 2');
    console.log('Verification result: ' + is_verified);

    console.log('Blockchain valid? ' + my_blockchain.is_chain_valid());
    console.log(JSON.stringify(my_blockchain, null, 4));

    process.exit();
}, 1000);
