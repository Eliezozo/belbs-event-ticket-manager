import { 
  date, 
  integer, 
  pgTable, 
  time, 
  varchar, 
  timestamp, 
  boolean,
  uuid,
  pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!);

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);
export const participationStatusEnum = pgEnum('participation_status', ['valid', 'used', 'cancelled']);

// --- TABLE UTILISATEURS ---
export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  password: varchar("password", {length: 255}).notNull(),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- TABLE ÉVÉNEMENTS ---
export const eventsTable = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description"),
  date: date("date").notNull(),
  time: time("time").notNull(),
  place: varchar("place", { length: 255 }).notNull(),
  participantsLimit: integer("participants_limit"),
  pictureUrl: varchar("picture_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- TABLE PARTICIPATIONS ---
export const participationsTable = pgTable("participations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  eventId: integer("event_id").notNull().references(() => eventsTable.id),
  qrToken: uuid("qr_token").defaultRandom().notNull().unique(),
  status: participationStatusEnum("status").default('valid').notNull(),
  scanned: boolean("scanned").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- RELATIONS ---

export const usersRelations = relations(usersTable, ({ many }) => ({
  participations: many(participationsTable),
}));

export const eventsRelations = relations(eventsTable, ({ many }) => ({
  participations: many(participationsTable),
}));

export const participationsRelations = relations(participationsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [participationsTable.userId],
    references: [usersTable.id],
  }),
  event: one(eventsTable, {
    fields: [participationsTable.eventId],
    references: [eventsTable.id],
  }),
}));

// --- TABLES REQUISES PAR BETTER-AUTH ---

export const sessionsTable = pgTable("session", {
    id: varchar("id", { length: 255 }).primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: varchar("ip_address", { length: 255 }),
    userAgent: varchar("user_agent", { length: 255 }),
    userId: integer("user_id").notNull().references(() => usersTable.id),
});

export const accountsTable = pgTable("account", {
    id: varchar("id", { length: 255 }).primaryKey(),
    accountId: varchar("account_id", { length: 255 }).notNull(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    userId: integer("user_id").notNull().references(() => usersTable.id),
    accessToken: varchar("access_token", { length: 255 }),
    refreshToken: varchar("refresh_token", { length: 255 }),
    idToken: varchar("id_token", { length: 255 }),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: varchar("scope", { length: 255 }),
    password: varchar("password", { length: 255 }),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const verificationsTable = pgTable("verification", {
    id: varchar("id", { length: 255 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: varchar("value", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

// --- DRIZZLE DATABASE INSTANCE ---
export const db = drizzle(client, { 
  schema: { 
    usersTable, 
    eventsTable, 
    participationsTable, 
    sessionsTable, 
    accountsTable, 
    verificationsTable 
  } 
});