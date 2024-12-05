import { useState } from "react";
import mqtt from "mqtt";
import { PatientForm } from "./patientForm";
import prisma from "./database/db";
import MetricsTable from "./metricsTable";
import Typography from "@mui/material/Typography";

export async function getServerSideProps() {
  console.log("getServerSideProps executing...");

  const patientData = await prisma.patientData.findMany({
    where: {
      name: "Isadora",
    },
  });

  // Convert Date objects to ISO strings for serialization
  const serializedRecipes = patientData.map((patientData) => ({
    ...patientData,
    createdAt: patientData.createdAt.toISOString(),
    // updatedAt: recipe.updatedAt.toISOString()
  }));

  return {
    props: { patientData: serializedRecipes },
  };
}

export default function Home({ patientData }) {
  const [messages, setMessages] = useState<string[]>([]);

  // Connect and subscribe directly
  const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";
  const topic = "topic_sensor_desconforto_nicisa";

  const client = mqtt.connect(brokerUrl);

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe(topic, (err) => {
      if (err) {
        console.error("Failed to subscribe:", err.message);
      } else {
        console.log(`Subscribed to topic: ${topic}`);
      }
    });
  });

  client.on("message", async (topic, message) => {
    const msg = message.toString();
    console.log(`Message received on ${topic}: ${msg}`);
    setMessages((prevMessages) => [...prevMessages, msg]);

    console.log(
      JSON.stringify({
        name: formData.nomeDoPaciente,
        session: formData.numeroDaSessao,
        value: parseFloat(msg),
        bodyArea: formData.regiaoDeMedicao,
        createdAt: new Date().toISOString(),
      })
    );
    try {
      await fetch("http://localhost:3000/api/patient-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.nomeDoPaciente,
          session: formData.numeroDaSessao,
          value: parseFloat(msg),
          bodyArea: formData.regiaoDeMedicao,
          createdAt: new Date().toISOString(),
        }),
      });
      console.log("Data added to PatientData");
    } catch (error) {
      console.error("Failed to add data:", error);
    }
  });

  client.on("error", (err) => {
    console.error("MQTT connection error:", err.message);
  });

  const [formData, setFormData] = useState({
    nomeDoPaciente: "",
    regiaoDeMedicao: "",
    numeroDaSessao: "",
  });

  const handleFormSubmit = (data) => {
    setFormData(data); // Set the form data to display other components
  };

  return (
    <div style={{ padding: "20px" }}>
      <ul>
        {messages.map((msg: any, index: any) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <div>
        {formData?.nomeDoPaciente === "" ? (
          <PatientForm onSubmit={handleFormSubmit} />
        ) : (
          <div>
            <Typography variant="h3" gutterBottom>
              Dados das sessões
            </Typography>
            <Typography variant="h6" gutterBottom>
              Paciente: { formData.nomeDoPaciente }
            </Typography>
            <Typography variant="h6" gutterBottom>
              Região: { formData.regiaoDeMedicao }
            </Typography>
            <Typography variant="h6" gutterBottom>
              Sessão atual: { formData.numeroDaSessao }
            </Typography>
            <MetricsTable data={patientData} />
          </div>
        )}
      </div>
    </div>
  );
}
