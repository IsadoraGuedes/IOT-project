import prisma from '../../pages/database/db';

export default async function handler(req: any, res: any) {
    if (req.method === "POST") {
        try {
            const { name } = req.body;

            const newPatientData = await prisma.patient.create({
                data: { name },
            });

            res.status(201).json(newPatientData);
        } catch (error) {
            console.error('Error saving data:', error);
            res.status(500).json({ error: 'Failed to save data' });
        }
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
