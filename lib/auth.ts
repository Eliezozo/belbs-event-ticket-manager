import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/schema"; // Remplace par le chemin vers ton instance de connexion Drizzle
import * as schema from "../db/schema"; // Importe ton fichier schema.ts que tu m'as montré

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", 
        schema: {
            user: schema.usersTable,
            account: schema.accountsTable,
            session: schema.sessionsTable,
            verification: schema.verificationsTable,
        },
    }),
    emailAndPassword: {
        enabled: true
    }
});
