import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import MetricsTable from "@/pages/metricsTable";
import { useParams, useRouter } from "next/navigation";
import mqtt from "mqtt";
import Button from "@mui/material/Button";

const Patient: React.FC = () => {
    const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";
    const topic = "topic_sensor_desconforto_nicisa";

    const [name, setName] = useState("");
    const [bodyArea, setBodyArea] = useState("");
    const [session, setSession] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const params = useParams();
    const router = useRouter();
    const client = mqtt.connect(brokerUrl);

    const searchMetrics = async (name: any) => {

        const response = await fetch(`http://localhost:3000/api/metric-data/${name}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const metrics = await response.json();
        const formattedMetrics = metrics.map((metric: any) => ({
            id: metric.id,
            value: metric.value,
            session: session,
        }));
        console.log("formattedMetrics", formattedMetrics);
        return formattedMetrics;
    };

    useEffect(() => {
        console.log("param", params.patientSessionId);
        fetch(`http://localhost:3000/api/patient-session-data/${params.sessionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(data => {
            data.json().then(sessions => {
                const session = sessions[0];
                console.log("session-data", session);
                setSession(session.session);
                setName(session.name);
                setBodyArea(session.bodyArea);
                searchMetrics(session.name).then(metrics => {
                    setData(metrics);
                });
            });
        }).catch(error => console.error("Failed to get data:", error));

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
        //TODO: avoid saving duplicated messages
        const msg = message.toString();
        console.log(`Message received on ${topic}: ${msg}`);

        const value = parseFloat(msg);

        if (isNaN(value)) {
            console.log("Invalid value:", msg);
            return;
        }

        const body = JSON.stringify({
            patientSessionId: params.sessionId,
            value: parseFloat(msg),
        });

        console.log("metric body", body);

        try {
            const response = await fetch("http://localhost:3000/api/metric-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });

            const metric = await response.json();
            const formattedMetric = {
                id: metric.id,
                value,
                session
            }

            setData((prevData) => [...prevData, formattedMetric]);
            console.log("Metric created", data);
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
            <Button fullWidth variant="contained" onClick={finish} width="50%">
                Finalizar Atendimento
            </Button>
        </div>
    );
}

export default Patient;
