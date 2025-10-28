import { builder } from "../builder";
import prisma from "@/lib/prisma";
import {
  createAnnouncementAction,
  createEventAction,
  updateEventAction,
} from "@/lib/actions";
import { handleGraphqlServerErrors } from "@/lib/serverUtils";
import {
  AppError,
  NotFoundError,
  UniqueConstraintError,
} from "@/lib/pothos/errors";

const EventGroupEnum = builder.enumType("EventGroupEnum", {
  values: ["PUBLIC", "STAFF"],
});

const AnnouncementInput = builder.inputType("AnnouncementInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    content: t.string({ required: true }),
    isPublished: t.boolean({ required: true }),
    classId: t.string(),
    gradeId: t.string(),
  }),
});

const EventInput = builder.inputType("EventInput", {
  fields: (t) => ({
    id: t.id(),
    title: t.string({ required: true }),
    description: t.string({ required: true }),
    startTime: t.field({ type: "DateTime", required: true }),
    endTime: t.field({ type: "DateTime", required: true }),
    gradeId: t.string(),
  }),
});

builder.prismaObject("Announcement", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    title: t.exposeString("title", { nullable: false }),
    content: t.exposeString("content", { nullable: false }),
    publishedAt: t.expose("publishedAt", { type: "DateTime" }),
    draftedAt: t.expose("publishedAt", { type: "DateTime" }),
    isPublished: t.exposeBoolean("isPublished", { nullable: false }),
  }),
});

builder.prismaObject("Event", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    title: t.exposeString("title", { nullable: false }),
    group: t.expose("group", { type: EventGroupEnum, nullable: false }),
    description: t.exposeString("description", { nullable: false }),
    startTime: t.expose("startTime", { type: "DateTime", nullable: false }),
    endTime: t.expose("endTime", { type: "DateTime", nullable: false }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    grade: t.relation("grade"),
  }),
});

builder.mutationType({
  fields: (t) => ({
    saveAnnouncementAsDraft: t.prismaField({
      type: "Announcement",
      args: {
        input: t.arg({ type: AnnouncementInput, required: true }),
      },
      resolve: async (_query, _parent, args) => {
        return createAnnouncementAction(args.input);
      },
    }),

    createEvent: t.prismaField({
      type: "Event",
      args: {
        input: t.arg({ type: EventInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) => {
        return createEventAction(args.input);
      },
    }),

    updateEvent: t.prismaField({
      type: "Event",
      args: {
        input: t.arg({ type: EventInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError, NotFoundError] },
      resolve: async (_query, _parent, args) => {
        return updateEventAction(args.input);
      },
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    announcements: t.prismaField({
      type: ["Announcement"],
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, _, args, context) =>
        await prisma.announcement.findMany({
          where: { schoolId: context.schoolId!, id: args.id },
          ...query,
        }),
    }),

    events: t.prismaField({
      type: ["Event"],
      args: {
        classId: t.arg.id({ required: false }),
      },
      resolve: async (query, _, args, context) => {
        const { userId, accessLevel, schoolId } = context;

        const roleConditions = {
          teacher: { supervisors: { some: { clerkUserId: userId! } } },
          student: { students: { some: { clerkUserId: userId! } } },
          parent: {
            students: {
              some: {
                parentStudents: {
                  some: { parent: { clerkUserId: userId! } },
                },
              },
            },
          },
        };

        try {
          return await prisma.event.findMany({
            where: {
              schoolId: schoolId!,
              OR: [
                { gradeId: null },
                {
                  grade: {
                    classes: {
                      some: {
                        ...roleConditions[
                          accessLevel as keyof typeof roleConditions
                        ],
                      },
                    },
                  },
                },
              ],
            },

            ...query,
          });
        } catch (e) {
          handleGraphqlServerErrors(e);
        }
      },
    }),
  }),
});
