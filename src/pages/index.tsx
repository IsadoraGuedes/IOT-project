import { PatientForm } from "./patientForm";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const router = useRouter();

  const handleFormSubmit = async (data: any) => {
    try {
      const session = await createSession(data);
      router.push(`/patient/${session.id}`);
    } catch (error) {
      console.error('Error checking or creating patient', error);
    }
  };

  const createSession = async (data: any) => {

    console.log('data', data);

    try {
      const body = {
        name: data.nomeDoPaciente,
        bodyArea: data.regiaoDeMedicao,
        session: data.numeroDaSessao
      };

      const response = await fetch("/api/patient-session-data", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      return await response.json();
    } catch (error) {
      console.error('Error checking or creating patient', error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <PatientForm onSubmit={handleFormSubmit} />
    </div>
  );
}

export default Home;
