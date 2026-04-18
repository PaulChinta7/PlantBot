const mqtt = require('mqtt');
const cron = require('node-cron');
const { batchProcessor } = require('./batchProcessor');
const { MQTT_TOPICS, CRON_SCHEDULES } = require('../enums');
const logger = require('../utils/logger');

let batch = []

let client;

function subscribe(topicName) {
  client.subscribe(topicName, (err) => {
    if (!err) {
      logger.info(`Subscribed to ${topicName}`);
    } else {
      logger.error(`Failed to subscribe to ${topicName}: ${err.message}`);
    }
  });
}

function handleMessage(topic, message) {
  const data = message.toString();
  logger.info(`Received message on topic ${topic}: ${data}`);

  if (topic === MQTT_TOPICS.PLANT_EVENTS) {
    try {
      const parsed = JSON.parse(data);
      parsed.timestamp = new Date();
      logger.info(`Parsed data: ${JSON.stringify(parsed)}`);
      batch.push(parsed);
      logger.debug(`Current batch: ${JSON.stringify(batch)}`);

    } catch (err) {
      logger.error(`MQTT message error: ${err.message}`);
    }
  }
}

function connectMQTT() { 
    logger.info('Starting MQTT connection');
  client = mqtt.connect({
    host: 'cd90eaefeabd487e919b3a6fc5118b70.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  });

  client.on('connect', () => {
    logger.info('MQTT connected successfully');

    // subscribe to topics here
    subscribe(MQTT_TOPICS.PLANT_EVENTS);
  });

  client.on('message', handleMessage);

  // Create a cron job to process batch every minute
  cron.schedule(CRON_SCHEDULES.EVERY_MINUTE, async () => {
    logger.info(`Processing batch with ${batch.length} items: ${JSON.stringify(batch)}`);
    if (batch.length > 0) {
      await batchProcessor(batch);
      batch = [];
    }
  });

  client.on('error', (err) => {
    logger.error(`MQTT connection error: ${err.message}`);
  });
}

function publish(topic, message) {
  if (!client) {
    logger.error('Cannot publish: MQTT not connected');
    return;
  }

  client.publish(topic, JSON.stringify(message));
}

module.exports = {
  connectMQTT,
  publish,
};