import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import MetricsTable from "@/pages/metricsTable";
import { useParams, useRouter } from "next/navigation";
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
        getPatientData().then(patientData => {
            fetch(`http://localhost:3000/api/session-data/${patientData.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(data => {
                data.json().then(sessions => {
                    console.log("session-data", sessions);
                    setData(sessions);
                    setSession(1);
                    setName(patientData.name);
                    setBodyArea("Região de Medição");
                });
            }).catch(error => console.error("Failed to add data:", error));
        });

    }, [params.patientId]);

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
            patientId: params.patientId,
            session,
            value: parseFloat(msg),
            bodyArea,
            createdAt: new Date().toISOString(),
        });

        console.log(body);

        try {
            await fetch("http://localhost:3000/api/session-data", {
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

    const getPatientData = async () => {
        const response = await fetch(`/api/patient-data/${params.name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
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
