import { PatientForm } from "./patientForm";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const router = useRouter();

  const handleFormSubmit = async (data: any) => {
    console.log(data);
    const { nomeDoPaciente } = data;

    try {
      const response = await fetch(`/api/patient-data/${nomeDoPaciente}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let patient = await response.json();
      console.log('Patient searched:', patient);

      if (!patient.length) {
        const createResponse = await fetch('/api/patient-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: nomeDoPaciente }),
        });

        patient = await createResponse.json();
        console.log('Patient created:', patient);
      } else {
        patient = patient[0];
      }

      router.push(`/patient/${patient.name}`);
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
