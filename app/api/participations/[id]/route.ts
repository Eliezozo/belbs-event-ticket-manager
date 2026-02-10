import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {db, participationsTable} from "@/db/schema";
import {eq} from "drizzle-orm";

export async function DELETE(
    req: Request,
    {params}: { params: { id: number } }
) {
    try {
        const session = await auth.api.getSession();
        
        if (!session) {
            return NextResponse.json({error: "Non autorisé"}, {status: 401});
        }

        const participationId = params.id;

        const participation = await db.query.participationsTable.findFirst({
            where: eq(participationsTable.id, participationId),
        });

        if (!participation) {
            return NextResponse.json({error: "Participation non trouvée"}, {status: 404});
        }
        
        // @ts-ignore
        if (participation.userId !== session.user.id) {
            return NextResponse.json({error: "Non autorisé à supprimer cette participation"}, {status: 403});
        }

        await db.delete(participationsTable).where(eq(participationsTable.id, participationId));

        return NextResponse.json({success: true}, {status: 200});

    } catch (error) {
        console.error("Delete Participation API Error:", error);
        return NextResponse.json({error: "Erreur interne du serveur"}, {status: 500});
    }
}
