const { MongoClient } = require('mongodb');
const logger = require('./src/utils/logger');

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();
  db = client.db('GameDatabase');
  logger.info('Connected to MongoDB successfully');
}

function getDB() {
  if (!db) {
    throw new Error('DB not initialized. Call connectDB first.');
  }
  return db;
}

module.exports = {
  connectDB,
  getDB
};