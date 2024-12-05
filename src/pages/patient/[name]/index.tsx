import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import MetricsTable from "@/pages/metricsTable";
import { useParams, useRouter } from "next/navigation";
import prisma from "../../database/db";
import mqtt from "mqtt";

const Patient: React.FC = () => {
    const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";
    const topic = "topic_sensor_desconforto_nicisa";

    const [name, setName] = useState("");
    const [bodyArea, setBodyArea] = useState("");
    const [session, setSession] = useState(0);
    const [data, setData] = useState([]);
    const params = useParams();
    const router = useRouter();
    const client = mqtt.connect(brokerUrl);

    useEffect(() => {
        console.log('params', params);
        setSession(1);
        setName("Nome do Paciente");
        setBodyArea("Região de Medição");

        prisma.patientData.findMany({
            where: {
                name: Array.isArray(params.name) ? params.name[0] : params.name,
            },
        }).then(data => {
            setData([]);
            console.log(data);
        });
    }, [params.name]);

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

        const body = JSON.stringify({
            name,
            session,
            value: parseFloat(msg),
            bodyArea,
            createdAt: new Date().toISOString(),
        });

        console.log(body);

        try {
            await fetch("http://localhost:3000/api/patient-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });
            console.log("Data added to PatientData");
        } catch (error) {
            console.error("Failed to add data:", error);
        }
    });

    client.on("error", (err) => {
        console.error("MQTT connection error:", err.message);
    });

    const finish = async () => {
        router.push("/");
    };

    return (
        <div style={{ padding: "20px" }}>
            <div>
                <Typography variant="h5" gutterBottom>
                    Dados das sessões
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Paciente: {name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Região: {bodyArea}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Sessão atual: {session}
                </Typography>
                <MetricsTable data={data} />
            </div>
        </div>
    );
}

export default Patient;
