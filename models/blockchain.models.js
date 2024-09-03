const mongoose = require('mongoose');
const { connection } = require('../config/database.config');

const blockchain_schema = new mongoose.Schema({
    chain: [Object] // Array of blocks
}, {timestamps: true});

module.exports = connection.model('Blockchain', blockchain_schema);
