import { useEffect, useState, useRef, useCallback } from "react";
import Typography from "@mui/material/Typography";
import MetricsTable from "@/pages/metricsTable";
import { useParams, useRouter } from "next/navigation";
import mqtt from "mqtt";
import Button from "@mui/material/Button";
import PatientChart from "@/pages/patientChart";

const Patient: React.FC = () => {
  const brokerUrl = "wss://broker.hivemq.com:8884/mqtt";
  const topic = "topic_sensor_desconforto_nicisa";

  const [name, setName] = useState("");
  const [bodyArea, setBodyArea] = useState("");
  const [session, setSession] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const params = useParams();
  const router = useRouter();

  // Ref for processed values to persist across renders
  const processedValues = useRef(new Set<number>());

  // Ref for the MQTT client to ensure it's a singleton
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  // Debounce function to limit the rate of processing messages
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const searchMetrics = async (name: any, bodyArea: any) => {
    const response = await fetch(`/api/metric-data/${name}/${bodyArea}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const metrics = await response.json();
    const formattedMetrics = metrics.map((metric: any) => ({
      id: metric.id,
      value: metric.value,
      session: metric.session,
    }));
    console.log("formattedMetrics", formattedMetrics);
    return formattedMetrics;
  };

  useEffect(() => {
    fetch(`/api/patient-session-data/${params.sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) =>
        data.json().then((sessions) => {
          const session = sessions[0];
          console.log("session-data", session);
          setSession(session.session);
          setName(session.name);
          setBodyArea(session.bodyArea);
          searchMetrics(session.name, session.bodyArea).then((metrics) => {
            setData(metrics);
          });
        })
      )
      .catch((error) => console.error("Failed to get data:", error));
  }, []);

  // Memoized message processing function
  const processMessage = useCallback(
    debounce(async (msg: string) => {
      const value = parseFloat(msg);

      if (isNaN(value)) {
        console.log("Invalid float value:", msg);
        return;
      }

      if (processedValues.current.has(value) || session === 0) {
        console.log("Value already processed:", value);
        return;
      }

      const body = JSON.stringify({
        patientSessionId: params.sessionId,
        value,
      });

      console.log("metric body", body);

      try {
        const response = await fetch("/api/metric-data", {
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
          session,
        };

        setData((prevData) => [...prevData, formattedMetric]);
        console.log("Metric created", formattedMetric);

        processedValues.current.add(value);
      } catch (error) {
        console.error("Failed to add data:", error);
      }
    }, 1000),
    [params.sessionId, session]
  );

  useEffect(() => {
    if (!clientRef.current) {
      const client = mqtt.connect(brokerUrl);
      clientRef.current = client;

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

      client.on("message", (topic, message) => {
        const msg = message.toString();
        console.log(`Message received on ${topic}: ${msg}`);
        processMessage(msg);
      });

      client.on("error", (err) => {
        console.error("MQTT connection error:", err.message);
      });
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.end();
        clientRef.current = null;
      }
    };
  }, [processMessage]);

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
        {data.length > 0 ? (
          <div>
            <div style={{ marginTop: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Média de pressão das sessões
              </Typography>
              <PatientChart data={data} />
            </div>
            <div style={{ marginTop: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Medições realizadas
              </Typography>
              <MetricsTable data={data} />
            </div>{" "}
          </div>
        ) : (
          <Typography variant="subtitle1" gutterBottom color="red">
            Nenhum dado a ser exibido, realize uma medição.
          </Typography>
        )}
        <div style={{ marginTop: "20px" }}>
          <Button fullWidth variant="contained" onClick={finish}>
            Finalizar Atendimento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Patient;
