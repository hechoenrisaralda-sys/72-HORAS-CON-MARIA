import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function resolveDatasourceUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url?.startsWith("file:")) {
    const rest = url.slice(5);
    if (path.isAbsolute(rest)) return url;
    return `file:${path.resolve(/*turbopackIgnore: true*/ process.cwd(), rest)}`;
  }
  if (process.env.NODE_ENV === "development") {
    return `file:${path.join(process.cwd(), "dev.db")}`;
  }
  if (!url) {
    throw new Error("DATABASE_URL no está configurada");
  }
  return url;
}

const datasourceUrl = resolveDatasourceUrl();
process.env.DATABASE_URL = datasourceUrl;

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ datasourceUrl });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
