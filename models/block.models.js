const mongoose = require('mongoose');
const { connection } = require('../config/database.config');

const block_schema = new mongoose.Schema({
    index: Number,
    timestamp: String,
    document_hash: String,
    previous_hash: String,
    hash: String
}, {timestamps: true});

module.exports = connection.model('Block', block_schema);
