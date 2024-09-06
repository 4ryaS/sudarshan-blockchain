const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Import routes
const blockchain_routes = require('./routes/blockchain.routes');

// Use routes
app.use('/api/blockchain', blockchain_routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is live at localhost:${PORT}`);
});
