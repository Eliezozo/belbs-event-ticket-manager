import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {db, participationsTable} from "@/db/schema";
import {eq} from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession();

        // This should be an admin-only endpoint
        // @ts-ignore
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({error: "Non autorisé"}, {status: 401});
        }

        const {participationId} = await req.json();

        if (!participationId) {
            return NextResponse.json({error: "participationId manquant"}, {status: 400});
        }

        const participation = await db.query.participationsTable.findFirst({
            where: eq(participationsTable.id, participationId),
        });

        if (!participation) {
            return NextResponse.json({error: "Participation non trouvée"}, {status: 404});
        }

        await db.update(participationsTable)
            .set({scanned: true})
            .where(eq(participationsTable.id, participationId));

        return NextResponse.json({success: true});

    } catch (error) {
        console.error("Scan API Error:", error);
        return NextResponse.json({error: "Erreur interne du serveur"}, {status: 500});
    }
}
