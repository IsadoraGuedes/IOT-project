import { useState } from 'react';

type FormData = {
  nomeDoPaciente: string;
  regiaoDeMedicao: string;
  numeroDaSessao: string | number;
};


export function PatientForm({ onSubmit } : { onSubmit: (data: FormData) => void}) {
    const [formData, setFormData] = useState({
        nomeDoPaciente: '',
        regiaoDeMedicao: '',
        numeroDaSessao: ''
    });

  //   const [submittedData, setSubmittedData] = useState({
  //     nomeDoPaciente: '',
  //     regiaoDeMedicao: '',
  //     numeroDaSessao: ''
  // });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
      console.log('submit')
        e.preventDefault();
        console.log('Form Data Submitted:', formData);
        onSubmit(formData);
        // Add form submission logic here
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h1>Cadastro de Sessão</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="nomeDoPaciente" style={{ display: 'block', marginBottom: '5px' }}>Nome do Paciente</label>
                    <input
                        type="text"
                        id="nomeDoPaciente"
                        name="nomeDoPaciente"
                        value={formData.nomeDoPaciente}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="regiaoDeMedicao" style={{ display: 'block', marginBottom: '5px' }}>Região de Medição</label>
                    <input
                        type="text"
                        id="regiaoDeMedicao"
                        name="regiaoDeMedicao"
                        value={formData.regiaoDeMedicao}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="numeroDaSessao" style={{ display: 'block', marginBottom: '5px' }}>Número da Sessão</label>
                    <input
                        type="number"
                        id="numeroDaSessao"
                        name="numeroDaSessao"
                        value={formData.numeroDaSessao}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Enviar
                </button>
            </form>
        </div>
    );
}