import prisma from '../../../pages/database/db';

export default async function handler(req: any, res: any) {
    if (req.method === "GET") {
        const { sessionId } = req.query;
        console.log('sessionId', sessionId);
        const data = await prisma.metricSession.findMany({
            where: {
                patientSessionId: sessionId,
            },
        });
        res.status(200).json(data);
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
