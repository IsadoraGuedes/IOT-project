import prisma from '../../../pages/database/db';

export default async function handler(req: any, res: any) {
    if (req.method === "GET") {
        const { id } = req.query;
        const data = await prisma.patient.findMany({
            where: {
                name: id,
            },
        });
        res.status(200).json(data);
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
