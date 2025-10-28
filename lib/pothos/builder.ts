import SchemaBuilder from "@pothos/core";
import ErrorsPlugin from "@pothos/plugin-errors";
import PrismaPlugin from "@pothos/plugin-prisma";

import { RoleAccessLevel } from "@/types";
import type PrismaTypes from "@/lib/generated/pothos-prisma-types";
import prisma from "@/lib/prisma";

interface GraphQlContext {
  userId: string | null;
  schoolId: string | null;
  accessLevel: RoleAccessLevel;
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  Context: GraphQlContext;
}>({
  plugins: [ErrorsPlugin, PrismaPlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: { models: true, fields: true },
    filterConnectionTotalCount: true,
    onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
  },
  errors: {
    defaultTypes: [Error],
  },
});
