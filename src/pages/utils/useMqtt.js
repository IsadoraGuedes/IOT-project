import { useEffect } from 'react';
import { connectMQTT, subscribe } from './mqttClient';
import { useMQTTStore } from './store';

export const useMQTT = (brokerUrl, topic) => {
  const addMessage = useMQTTStore((state) => state.addMessage);

  useEffect(() => {
    const client = connectMQTT(brokerUrl);

    subscribe(topic, (message) => {
      addMessage(message);
    });

    return () => {
      client.end(); // Disconnect when the component unmounts
    };
  }, [brokerUrl, topic, addMessage]);
};
