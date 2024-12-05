import prisma from '../../pages/database/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { name, session, value, bodyArea, createdAt } = req.body;

            // Save data to the PatientData model
            const newPatientData = await prisma.patientData.create({
                data: { name, session, value, bodyArea, createdAt: new Date(createdAt) },
            });

            res.status(201).json(newPatientData);
        } catch (error) {
            console.error('Error saving data:', error);
            res.status(500).json({ error: 'Failed to save data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
