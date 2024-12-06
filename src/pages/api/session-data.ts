import prisma from '../../pages/database/db';

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        try {
            const { patientId, session, value, bodyArea, createdAt } = req.body;

            const newPatientData = await prisma.session.create({
                data: { patientId, session, value, bodyArea, createdAt: new Date(createdAt) },
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
