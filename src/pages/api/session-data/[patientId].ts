import prisma from '../../../pages/database/db';

export default async function handler(req: any, res: any) {
    if (req.method === "GET") {
        const { patientId } = req.query;
        const data = await prisma.session.findMany({
            where: {
                patientId,
            },
        });
        res.status(200).json(data);
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
