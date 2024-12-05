import { PatientForm } from "./patientForm";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const router = useRouter();

  const handleFormSubmit = (data: any) => {
    console.log(data);
    //TODO call api to create patient and then redirects -- Another entity to store session
    router.push(`/patient/${data.nomeDoPaciente}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <PatientForm onSubmit={handleFormSubmit} />
    </div>
  );
}

export default Home;
