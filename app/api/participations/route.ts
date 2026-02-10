import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {db, participationsTable} from "@/db/schema";
import {and, eq} from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession();

        if (!session) {
            return NextResponse.json({error: "Non autorisé"}, {status: 401});
        }

        const userParticipations = await db.query.participationsTable.findMany({
            // @ts-ignore
            where: eq(participationsTable.userId, parseInt(session.user.id, 10)),
            with: {
                event: true,
            },
        });

        return NextResponse.json({ participations: userParticipations });

    } catch (error) {
        console.error("Fetch Participations API Error:", error);
        return NextResponse.json({error: "Erreur interne du serveur"}, {status: 500});
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession();
        
        if (!session) {
            return NextResponse.json({error: "Non autorisé"}, {status: 401});
        }

        const {eventId} = await req.json();

        if (!eventId) {
            return NextResponse.json({error: "eventId manquant"}, {status: 400});
        }

        const existingParticipation = await db.query.participationsTable.findFirst({
            where: and(
                // @ts-ignore
                eq(participationsTable.userId, parseInt(session.user.id, 10)),
                eq(participationsTable.eventId, eventId)
            )
        });

        if (existingParticipation) {
            return NextResponse.json({error: "Vous participez déjà à cet événement"}, {status: 409});
        }

        const newParticipation = {
            // @ts-ignore
            userId: parseInt(session.user.id),
            eventId: eventId,
        };

        await db.insert(participationsTable).values(newParticipation);

        return NextResponse.json(newParticipation, {status: 201});

    } catch (error) {
        console.error("Participation API Error:", error);
        return NextResponse.json({error: "Erreur interne du serveur"}, {status: 500});
    }
}
