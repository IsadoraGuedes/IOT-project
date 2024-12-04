import mqtt from 'mqtt';

let client;

export const connectMQTT = (brokerUrl, options) => {
  client = mqtt.connect(brokerUrl, options);

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
  });

  client.on('error', (err) => {
    console.error('MQTT connection error:', err);
  });

  return client;
};

export const subscribe = (topic, callback) => {
  if (!client) {
    throw new Error('MQTT client is not initialized');
  }
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
    } else {
      console.error('Subscription error:', err);
    }
  });

  client.on('message', (receivedTopic, message) => {
    if (receivedTopic === topic) {
      callback(message.toString());
    }
  });
};

export const publish = (topic, message) => {
  if (!client) {
    throw new Error('MQTT client is not initialized');
  }
  client.publish(topic, message, (err) => {
    if (err) {
      console.error('Publish error:', err);
    }
  });
};
