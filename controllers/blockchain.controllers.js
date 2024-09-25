const blockchain = require('../config/blockchain.config');
const { hash_document } = require('../utils');

const add_block = async (req, res) => {
    const { document_content } = req.body;

    if (!document_content) {
        return res.status(400).json({ error: 'Document content is required' });
    }

    try {
        if (!blockchain.initialized) {
            await blockchain.initialize_blockchain();
        }
        const new_block = await blockchain.add_block(document_content);
        res.status(201).json({ message: 'Block added successfully', block_data: new_block });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the block' });
    }
};

const verify_data = async (req, res) => {
    const { document_content } = req.body;
    if (!document_content || !document_content.aadhar_number) {
        return res.status(400).json({ error: 'Aadhar number is required' });
    }

    const aadhar_number = document_content.aadhar_number.toString(); // Ensure it is a string

    try {
        if (!blockchain.initialized) {
            await blockchain.initialize_blockchain();
        }

        // Calculate the hash of the input Aadhar number
        const input_document_hash = hash_document(aadhar_number);
        console.log(`Input Document Hash: ${input_document_hash}`);

        // Map the blockchain to include both document_hash and timestamp
        const document_data = blockchain.chain.map(block => ({
            document_hash: block.document_hash,
            timestamp: block.timestamp,
            block // Include the block itself if needed for more information
        }));

        // Filter data to include only blocks with the specific document hash
        const relevant_blocks = document_data.filter(data => data.document_hash === input_document_hash);

        console.log(`Relevant Blocks: ${JSON.stringify(relevant_blocks, null, 2)}`);

        if (relevant_blocks.length > 0) {
            // Find the block with the latest timestamp
            const latest_block = relevant_blocks.reduce((latest, current) =>
                current.timestamp > latest.timestamp ? current : latest
            );

            if (latest_block) {
                // Send response with the latest block details
                res.status(200).json({
                    message: 'Document is valid.',
                    latest_block
                });
            }
        } 
        else {
            console.log(aadhar_number);
            // Check if the Aadhar number is valid
            const is_valid = is_valid_aadhar(aadhar_number);
            console.log(`Is Aadhar Number Valid: ${is_valid}`);

            if (!is_valid) {
                return res.status(404).json({ message: 'Document is invalid or altered.' });
            }

            // Add new block to the blockchain
            const new_block = await blockchain.add_block(aadhar_number);
            res.status(201).json({ message: 'Block added successfully', block_data: new_block });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while verifying the document' });
    }
};



// const calculate_verhoeff_check_digit = (num) => {
//     // Verhoeff's algorithm tables
//     const d = [
//         [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
//         [1, 0, 3, 2, 5, 4, 7, 6, 9, 8],
//         [2, 3, 0, 1, 6, 7, 4, 5, 8, 9],
//         [3, 2, 1, 0, 7, 6, 5, 4, 9, 8],
//         [4, 5, 6, 7, 0, 1, 2, 3, 8, 9],
//         [5, 4, 7, 6, 1, 0, 3, 2, 9, 8],
//         [6, 7, 4, 5, 2, 3, 0, 1, 9, 8],
//         [7, 6, 5, 4, 3, 2, 1, 0, 9, 8],
//         [8, 9, 8, 9, 8, 9, 8, 9, 8, 9],
//         [9, 8, 9, 8, 9, 8, 9, 8, 9, 8]
//     ];

//     const p = [
//         [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
//         [1, 5, 7, 3, 9, 2, 8, 4, 6, 0],
//         [2, 7, 8, 9, 5, 0, 3, 1, 4, 6],
//         [3, 8, 9, 0, 7, 1, 4, 2, 5, 6],
//         [4, 9, 0, 1, 8, 2, 5, 3, 6, 7],
//         [5, 0, 1, 2, 9, 3, 6, 4, 7, 8],
//         [6, 1, 2, 3, 0, 4, 7, 5, 8, 9],
//         [7, 2, 3, 4, 1, 5, 8, 6, 9, 0],
//         [8, 3, 4, 5, 2, 6, 9, 7, 0, 1],
//         [9, 4, 5, 6, 3, 7, 0, 8, 1, 2]
//     ];

//     const inv = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

//     let c = 0;
//     num.split('').reverse().forEach((digit, i) => {
//         const digitValue = parseInt(digit, 10);
//         const index = (i % 8);
//         console.log(`Processing digit ${digitValue} at index ${i}, c = ${c}`);
//         c = d[c][p[index][digitValue]];
//         console.log(`Updated c = ${c}`);
//     });
//     console.log(`Final Check Digit: ${inv[c]}`);
//     return inv[c];
// };

// const is_valid_aadhar = (aadhar_number) => {
//     if (!/^\d{12}$/.test(aadhar_number)) {
//         console.log('Invalid Aadhar Number Length');
//         return false; // Aadhar number should be exactly 12 digits
//     }
//     const check_digit = aadhar_number.slice(-1);
//     const number_without_check_digit = aadhar_number.slice(0, -1);
//     const is_valid = calculate_verhoeff_check_digit(number_without_check_digit) === parseInt(check_digit, 10);
//     console.log(`Aadhar Number: ${aadhar_number}, Check Digit: ${check_digit}, Valid: ${is_valid}`);
//     return is_valid;
// };

const is_valid_aadhar = (aadhar_number) => {
    // multiplication table
    const d = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], 
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], 
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], 
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], 
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], 
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], 
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], 
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], 
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];
      
    // permutation table
    const p = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], 
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], 
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], 
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], 
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], 
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], 
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    if (typeof aadhar_number !== 'string' || aadhar_number.length !== 12 || !/^\d{12}$/.test(aadhar_number)) {
        return false; // Invalid format
    }

    let c = 0;
    let inverted_array = aadhar_number.split('').map(Number).reverse();

    inverted_array.forEach((val, i) => {
        c = d[c][p[(i % 8)][val]];
    });

    return (c === 0); // Checksum validation
};

module.exports = { 
    add_block,
    verify_data,
};