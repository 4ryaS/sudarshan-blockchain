const express = require('express');
const router = express.Router();
const blockchain_controller = require('../controllers/blockchain.controllers');

router.post('/add-block', blockchain_controller.add_block);

router.post('/verify-data', blockchain_controller.verify_data);

module.exports = router;
