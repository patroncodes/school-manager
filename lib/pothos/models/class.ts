import { builder } from "@/lib/pothos/builder";
import {
  AppError,
  ForeignKeyError,
  UniqueConstraintError,
} from "@/lib/pothos/errors";
import {
  assignPeriodSlotAction,
  assignTimetableAction,
  createClassAction,
  createGradeAction,
  updateClassAction,
  updateGradeAction,
} from "@/lib/actions";
import prisma from "@/lib/prisma";

const ClassInput = builder.inputType("ClassInput", {
  fields: (t) => ({
    id: t.id(),
    name: t.string({ required: true }),
    capacity: t.int({ required: true }),
    gradeId: t.string({ required: true }),
    supervisors: t.stringList(),
  }),
});

const GradeInput = builder.inputType("GradeInput", {
  fields: (t) => ({
    id: t.id(),
    name: t.string({ required: true }),
    programId: t.string({ required: true }),
  }),
});

const TimetableAssignmentInput = builder.inputType("TimetableAssignmentInput", {
  fields: (t) => ({
    periodSlotId: t.id({ required: true }),
    classId: t.id({ required: true }),
    subjectId: t.id(),
    teacherId: t.id(),
  }),
});

const TimetablePeriodInput = builder.inputType("TimetablePeriodInput", {
  fields: (t) => ({
    startTime: t.string({ required: true }),
    endTime: t.string({ required: true }),
    daysOfWeek: t.stringList({ required: true }),
  }),
});

const ClassWhereInput = builder.inputType("ClassWhereInput", {
  fields: (t) => ({
    programId: t.id({ required: false }),
    gradeId: t.id({ required: false }),
    name: t.string({ required: false }),
    supervisorId: t.string({ required: false }),
  }),
});

const GradeWhereInput = builder.inputType("GradeWhereInput", {
  fields: (t) => ({
    programId: t.id({ required: false }),
    name: t.string({ required: false }),
    supervisorId: t.string({ required: false }),
  }),
});

builder.prismaObject("Class", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    name: t.exposeString("name", { nullable: false }),
    capacity: t.int({ resolve: (class_) => class_.capacity, nullable: false }),
    grade: t.relation("grade", { nullable: false }),
    supervisors: t.relation("supervisors", { nullable: false }),
    students: t.relation("students", { nullable: false }),
    studentCount: t.relationCount("students"),
  }),
});

builder.prismaObject("Grade", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    name: t.exposeString("name", { nullable: false }),
    program: t.relation("program", { nullable: false }),
    classes: t.relation("classes", { nullable: false }),
  }),
});

builder.prismaObject("TimetableAssignment", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    periodSlot: t.relation("periodSlot", { nullable: false }),
    class: t.relation("class", { nullable: false }),
    subject: t.relation("subject"),
    teacher: t.relation("teacher"),
  }),
});

builder.prismaObject("TimetablePeriod", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    startTime: t.exposeString("startMinute", { nullable: false }),
    endTime: t.exposeString("endMinute", { nullable: false }),
    periodSlots: t.relation("periodSlots", { nullable: false }),
  }),
});

builder.prismaObject("PeriodSlot", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    dayOfWeek: t.exposeInt("dayOfWeek", { nullable: false }),
    timetableAssignments: t.relation("timetableAssignments", {
      nullable: false,
      args: { classId: t.arg.id({ required: true }) },
      query: (args) => ({
        where: {
          classId: args.classId,
        },
      }),
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    class: t.prismaField({
      type: "Class",
      args: { id: t.arg.id({ required: true }) },
      resolve: async (query, _parent, args, context) => {
        return await prisma.class.findUnique({
          where: { id: args.id, schoolId: context.schoolId! },
          ...query,
        });
      },
    }),

    classes: t.prismaField({
      type: ["Class"],
      args: {
        where: t.arg({ type: ClassWhereInput, required: false }),
      },
      resolve: async (query, _parent, args, context) => {
        const { gradeId, programId, supervisorId } = args?.where ?? {};

        return await prisma.class.findMany({
          where: {
            schoolId: context.schoolId!,
            ...(gradeId && { gradeId: gradeId }),
            ...(programId && { grade: { programId } }),
            ...(supervisorId && {
              supervisors: { some: { id: supervisorId } },
            }),
          },
          ...query,
        });
      },
    }),

    grades: t.prismaField({
      type: ["Grade"],
      args: {
        where: t.arg({ type: GradeWhereInput, required: false }),
      },
      resolve: async (query, _parent, args, ctx) => {
        const { programId, supervisorId } = args?.where ?? {};

        return prisma.grade.findMany({
          ...query,
          where: {
            schoolId: ctx.schoolId!,
            ...(programId && { programId }),
            ...(supervisorId && {
              classes: {
                some: {
                  supervisors: {
                    some: {
                      id: supervisorId,
                    },
                  },
                },
              },
            }),
          },
        });
      },
    }),

    grade: t.prismaField({
      type: "Grade",
      args: { id: t.arg.id({ required: true }) },
      resolve: async (query, _parent, args, context) => {
        return await prisma.grade.findUnique({
          where: { id: args.id, schoolId: context.schoolId! },
          ...query,
        });
      },
    }),

    timetable: t.prismaField({
      type: ["TimetablePeriod"],
      args: {
        classId: t.arg.id({ required: true }),
      },
      resolve: async (query, _parent, args, context) => {
        return await prisma.timetablePeriod.findMany({
          where: {
            schoolId: context.schoolId!,
          },
          ...query,
        });
      },
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createClass: t.prismaField({
      type: "Class",
      args: {
        input: t.arg({ type: ClassInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) =>
        await createClassAction(args.input),
    }),

    updateClass: t.prismaField({
      type: "Class",
      args: {
        input: t.arg({ type: ClassInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError, ForeignKeyError] },
      resolve: async (_query, _parent, args) =>
        await updateClassAction(args.input),
    }),

    createGrade: t.prismaField({
      type: "Grade",
      args: {
        input: t.arg({ type: GradeInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) =>
        await createGradeAction(args.input),
    }),

    updateGrade: t.prismaField({
      type: "Grade",
      args: {
        input: t.arg({ type: GradeInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) =>
        await updateGradeAction(args.input),
    }),

    updateTimetableAssignment: t.prismaField({
      type: "TimetableAssignment",
      args: {
        input: t.arg({ type: TimetableAssignmentInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) => {
        const { subjectId, teacherId, ...input } = args.input;

        return await assignTimetableAction({
          ...(teacherId && { teacherId }),
          subjectId: subjectId!,
          ...input,
        });
      },
    }),

    updatePeriodSlot: t.prismaField({
      type: "TimetablePeriod",
      args: {
        input: t.arg({ type: TimetablePeriodInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) =>
        await assignPeriodSlotAction(args.input),
    }),
  }),
});
