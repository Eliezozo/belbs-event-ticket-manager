import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {db, usersTable} from "@/db/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return NextResponse.json({error: "Champs requis manquants"}, {status: 400});
        }

        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.email, email),
        });

        if (!user) {
            return NextResponse.json({error: "Identifiants invalides"}, {status: 401});
        }

        // @ts-ignore
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({error: "Identifiants invalides"}, {status: 401});
        }

        const result = await auth.api.signInEmail({
            body: {
                email: user.email,
                password: password,
                rememberMe: true
            }
        });
        
        return NextResponse.json(result);

    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json({error: "Erreur interne du serveur"}, {status: 500});
    }
}
