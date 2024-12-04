import { useMQTTStore } from "./utils/store";
import { useMQTT } from "./utils/useMqtt";


export default function Home() {
  const messages = useMQTTStore((state: any) => state.messages);

  // Replace with your broker's URL and topic
  useMQTT('broker.hivemq.com', 'mvk_temperature');

  return (
    <div style={{ padding: '20px' }}>
      <h1>MQTT Data Interface</h1>
      <ul>
        {messages.map((msg: any, index: any) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
