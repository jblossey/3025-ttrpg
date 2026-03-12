import "dotenv/config";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const dbUrl = new URL(process.env.DATABASE_URL ?? "");

if (dbUrl.hostname === "localhost" || dbUrl.hostname === "127.0.0.1") {
  neonConfig.fetchEndpoint = `http://${dbUrl.host}/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL ?? "");
export const db = drizzle(sql);
