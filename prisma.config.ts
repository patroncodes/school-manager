import path from "node:path";
import "dotenv/config";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
} satisfies PrismaConfig;
