const express = require('express');
require('dotenv').config(); 
const { connectDB } = require('./db');
const passport = require('./src/config/passport');
const userRoutes = require('./src/routes/userRoutes');
const plantRoutes = require('./src/routes/plantRoutes');
const { connectMQTT } = require('./src/services/mqttService');
const logger = require('./src/utils/logger');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(passport.initialize());
app.use('/users', userRoutes);
app.use('/plant', plantRoutes);

async function start() {
  try {
    await connectDB();
    connectMQTT();

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error(`Server startup error: ${err.message}`);
  }
}

start();