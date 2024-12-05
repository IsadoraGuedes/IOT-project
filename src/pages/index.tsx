import { useState } from "react";
import mqtt from "mqtt";
import { PatientForm } from "./patientForm";
import { PatientData } from "./patientData";
import prisma from "./database/db";

export async function getServerSideProps() {
  console.log("getServerSideProps executing...");

  const recipes = await prisma.recipe.findMany();

  // Convert Date objects to ISO strings for serialization
  const serializedRecipes = recipes.map(recipe => ({
      ...recipe,
      createdAt: recipe.createdAt.toISOString(),
      updatedAt: recipe.updatedAt.toISOString()
  }));

  return {
      props: { recipes: serializedRecipes },
  };
}

export default function Home({ recipes }) {
  const [messages, setMessages] = useState<string[]>([]);

    // Connect and subscribe directly
    const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';
    const topic = 'topic_sensor_desconforto_nicisa';

    const client = mqtt.connect(brokerUrl);

    client.on('connect', () => {
        console.log('Connected to MQTT broker');
        client.subscribe(topic, (err) => {
            if (err) {
                console.error('Failed to subscribe:', err.message);
            } else {
                console.log(`Subscribed to topic: ${topic}`);
            }
        });
    });

    client.on('message', (topic, message) => {
        const msg = message.toString();
        console.log(`Message received on ${topic}: ${msg}`);
        setMessages((prevMessages) => [...prevMessages, msg]);
    });

    client.on('error', (err) => {
        console.error('MQTT connection error:', err.message);
    });

    const [formData, setFormData] = useState({
      nomeDoPaciente: '',
        regiaoDeMedicao: '',
        numeroDaSessao: ''
    });

    const handleFormSubmit = (data) => {
        setFormData(data); // Set the form data to display other components
    };

  return (
    <div style={{ padding: '20px' }}>
      <h1>MQTT Data Interface</h1>
      <ul>
        {messages.map((msg: any, index: any) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <div>
      <h1>Bem-vindo à Tela Inicial</h1>
            {!formData ? (
                <PatientForm onSubmit={handleFormSubmit} />
            ) : (
                <div>
                     <pre>{JSON.stringify(recipes, null, 2)}</pre>
                </div>
            )}
      </div>
    </div>
  );
}

