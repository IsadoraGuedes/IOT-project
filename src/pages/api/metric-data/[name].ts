import prisma from '../../../pages/database/db';

export default async function handler(req: any, res: any) {
    if (req.method === "GET") {
        const { name } = req.query;
        console.log('name', name);

        try {
            const sessions = await prisma.patientSession.findMany({
                where: {
                    name,
                },
            });

            // Fetch metrics and include session information
            const metrics = await Promise.all(sessions.map(async (session) => {
                const sessionMetrics = await prisma.metricSession.findMany({
                    where: {
                        patientSessionId: session.id,
                    },
                });

                return sessionMetrics.map(metric => ({
                    ...metric,
                    session: session.session,
                }));
            }));

            const flattenedMetrics = metrics.flat();

            res.status(200).json(flattenedMetrics);
        } catch (error) {
            console.error('Error fetching metrics:', error);
            res.status(500).json({ error: 'Error fetching metrics' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}