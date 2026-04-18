const { getDB } = require('../../db');
const logger = require('../utils/logger');

async function batchProcessor(batch) {
  try {
    if (batch.length === 0) {
      logger.info('Batch is empty, nothing to process');
      return;
    }

    const db = getDB();
    const collection = db.collection('plantLogs');

    // Split batch into chunks of 100
    const chunkSize = 100;
    const chunks = [];
    
    for (let i = 0; i < batch.length; i += chunkSize) {
      chunks.push(batch.slice(i, i + chunkSize));
    }

    // Insert each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const result = await collection.insertMany(chunk);
      logger.info(`Inserted chunk ${i + 1}/${chunks.length} (${result.insertedIds.length} documents)`);
    }

    logger.info(`Batch processing complete: ${batch.length} documents inserted`);
    
  } catch (err) {
    logger.error(`Batch processing error: ${err.message}`);
  }
}

module.exports = {
  batchProcessor,
};
