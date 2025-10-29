import { builder } from "@/lib/pothos/builder";
import { AppError, UniqueConstraintError } from "@/lib/pothos/errors";
import { createClubAction, updateClubAction } from "@/lib/actions/club";
import prisma from "@/lib/prisma";

const ClubInput = builder.inputType("ClubInput", {
  fields: (t) => ({
    id: t.id(),
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    foundedAt: t.field({ type: "DateTime" }),
  }),
});

const ClubFilter = builder.inputType("ClubFilter", {
  fields: (t) => ({
    staffId: t.id({ required: false }),
    studentId: t.id({ required: false }),
  }),
});

builder.prismaObject("Club", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    name: t.exposeString("name", { nullable: false }),
    description: t.exposeString("description"),
    foundedAt: t.expose("foundedAt", { type: "DateTime" }),
    createdAt: t.expose("createdAt", { type: "DateTime", nullable: false }),
    supervisors: t.relation("supervisors", { nullable: false }),
    members: t.relation("members", { nullable: false }),
  }),
});

builder.queryType({
  fields: (t) => ({
    clubs: t.prismaField({
      type: ["Club"],
      args: {
        filter: t.arg({ type: ClubFilter, required: false }),
      },
      resolve: async (query, _parent, args, context) => {
        const { staffId, studentId } = args?.filter ?? {};

        return await prisma.club.findMany({
          ...query,
          where: {
            schoolId: context.schoolId!,
            ...(staffId && { supervisors: { some: { id: staffId } } }),
            ...(studentId && { members: { some: { id: studentId } } }),
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      },
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createClub: t.prismaField({
      type: "Club",
      args: {
        input: t.arg({ type: ClubInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) =>
        await createClubAction(args.input),
    }),

    updateClub: t.prismaField({
      type: "Club",
      args: {
        input: t.arg({ type: ClubInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) =>
        await updateClubAction(args.input),
    }),
  }),
});
