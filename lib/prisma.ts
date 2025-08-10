import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Connection pooling for production
    ...(process.env.NODE_ENV === "production" && {
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Graceful shutdown - only run if process.on is available (not in Edge Runtime)
if (typeof process !== "undefined" && process.on) {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
