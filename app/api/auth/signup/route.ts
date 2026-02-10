import {NextResponse} from "next/server";
import {db, usersTable} from "@/db/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const password = formData.get('password') as string;

        if (!firstName || !lastName || !email || !phoneNumber || !password) {
            return NextResponse.json({error: "Champs requis manquants"}, {status: 400});
        }

        const existingUser = await db.query.usersTable.findFirst({
            where: eq(usersTable.email, email),
        });

        if (existingUser) {
            return NextResponse.json({error: "L'utilisateur existe déjà"}, {status: 409});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(usersTable).values({
            firstName,
            lastName,
            email,
            phoneNumber,
            // @ts-ignore
            password: hashedPassword,
        });

        return NextResponse.json({success: true});

    } catch (error) {
        console.error("Signup API Error:", error);
        return NextResponse.json({error: "Erreur interne du serveur"}, {status: 500});
    }
}
