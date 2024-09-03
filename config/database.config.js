require('dotenv').config();
const mongoose = require('mongoose');
let connection;

const connect_db = () => {
  if (!connection) {
    connection = mongoose.createConnection(process.env.DB_URL, {
      dbName: process.env.DEFAULT_DB,
    });
    console.log('New Connection Established');
  } else {
    console.log('Reusing Existing Connection');
  }
  return connection;
}

connection = connect_db();
module.exports = { connection };