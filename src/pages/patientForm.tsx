import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";

type FormData = {
  nomeDoPaciente: string;
  regiaoDeMedicao: string;
  numeroDaSessao: string | number;
};

export function PatientForm({
  onSubmit,
}: {
  onSubmit: (data: FormData) => void;
}) {
  const [formData, setFormData] = useState({
    nomeDoPaciente: "",
    regiaoDeMedicao: "",
    numeroDaSessao: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    console.log("submit");
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    onSubmit(formData);
    // Add form submission logic here
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Cadastro da sessão
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="nomeDoPaciente"
          name="nomeDoPaciente"
          label="Nome do paciente"
          variant="outlined"
          value={formData.nomeDoPaciente}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="regiaoDeMedicao"
          name="regiaoDeMedicao"
          label="Região de Medição"
          variant="outlined"
          value={formData.regiaoDeMedicao}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="numeroDaSessao"
          name="numeroDaSessao"
          label="Número da Sessão"
          variant="outlined"
          value={formData.numeroDaSessao}
          onChange={handleChange}
          margin="normal"
        />
        <Button fullWidth variant="contained" type="submit">
          Contained
        </Button>
      </form>
    </div>
  );
}
