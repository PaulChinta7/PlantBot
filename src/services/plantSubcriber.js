const mqtt = require('mqtt');

const client = mqtt.connect({
  host: 'cd90eaefeabd487e919b3a6fc5118b70.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts', // 🔐 REQUIRED for HiveMQ Cloud

  username: 'paulchinta ',   // from HiveMQ
  password: 'Nitroboy7',   // from HiveMQ

  rejectUnauthorized: true // ensures SSL cert validation
});

client.on('connect', () => {
  console.log('✅ Connected to HiveMQ Cloud');

  client.subscribe('myapp/events', (err) => {
    if (!err) {
      console.log('📡 Subscribed to topic');
    } else {
      console.error('Subscribe error:', err);
    }
  });
});

client.on('message', async (topic, message) => {
  const data = message.toString();
  console.log('📩 Received:', data);

  // 👉 Example: call API
  // await fetch('https://your-api.com', { method: 'POST', body: data });

  // 👉 Example: save to DB
  // await db.insert({ data });
});

client.on('error', (err) => {
  console.error('❌ Connection error:', err);
});