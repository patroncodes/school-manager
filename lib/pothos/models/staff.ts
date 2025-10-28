import { builder } from "../builder";
import prisma from "@/lib/prisma";
import {
  createStaffAction,
  createSubjectAction,
  updateSubjectAction,
} from "@/lib/actions";
import { AppError, UniqueConstraintError } from "@/lib/pothos/errors";

const AccessLevel = builder.enumType("AccessLevel", {
  values: ["FINANCE", "ACADEMICS", "ADMINISTRATION", "TEACHER", "RESTRICTED"],
});

const ContractType = builder.enumType("ContractType", {
  values: ["CONTRACT", "PART_TIME", "PERMANENT"],
});

const Sex = builder.enumType("Sex", {
  values: ["MALE", "FEMALE", "OTHER"],
});

const StaffFilterInput = builder.inputType("StaffFilterInput", {
  fields: (t) => ({
    isFormTeacher: t.boolean({ required: false }),
    isActive: t.boolean({ required: true }),
    accessLevel: t.field({ type: AccessLevel }),
    classId: t.string(),
  }),
});

const SubjectInput = builder.inputType("SubjectInput", {
  fields: (t) => ({
    id: t.string(),
    name: t.string({ required: true }),
    relationId: t.string(),
    teachers: t.stringList({ required: true }),
  }),
});

const StaffInput = builder.inputType("StaffInput", {
  fields: (t) => ({
    id: t.string(),
    clerkUserId: t.string(),
    employeeId: t.string({ required: true }),
    name: t.string({ required: true }),
    surname: t.string({ required: true }),
    email: t.string(),
    phone: t.string({ required: true }),
    password: t.string(),
    address: t.string({ required: true }),
    birthday: t.field({ type: "DateTime", required: true }),
    hireDate: t.field({ type: "DateTime" }),
    sex: t.field({ type: Sex, required: true }),
    img: t.string(),
    oldImg: t.string(),
    accessLevel: t.field({ type: AccessLevel, required: true }),
    contractType: t.field({ type: ContractType, required: true }),
    role: t.string({ required: true }),
    isActive: t.boolean({ required: true, defaultValue: true }),
    position: t.string(),
    classId: t.string(),
    subjects: t.stringList(),
    grades: t.stringList(),
  }),
});

builder.prismaObject("Parent", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    primaryId: t.exposeString("primaryId"),
    clerkUserId: t.exposeString("clerkUserId"),
    name: t.exposeString("name", { nullable: false }),
    surname: t.exposeString("surname", { nullable: false }),
    phone: t.exposeString("phone", { nullable: false }),
  }),
});

builder.prismaObject("Staff", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    employeeId: t.exposeString("employeeId", { nullable: false }),
    name: t.exposeString("name", { nullable: false }),
    surname: t.exposeString("surname", { nullable: false }),
    role: t.exposeString("role", { nullable: false }),
    phone: t.exposeString("phone", { nullable: false }),
    email: t.exposeString("email"),
    address: t.exposeString("address", { nullable: false }),
    img: t.exposeString("img"),
    clerkUserId: t.exposeString("clerkUserId"),
    accessLevel: t.exposeString("accessLevel", { nullable: false }),
    subjects: t.relation("teacherSubjectAssignments"),
    class: t.relation("class"),
  }),
});

builder.prismaObject("Subject", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    name: t.exposeString("name", { nullable: false }),
    teachers: t.relation("teacherSubjectAssignments", { nullable: false }),
  }),
});

builder.prismaObject("TeacherSubjectAssignment", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    subject: t.relation("subject", { nullable: false }),
    teacher: t.relation("teacher", { nullable: false }),
  }),
});

builder.queryType({
  fields: (t) => ({
    staffs: t.prismaField({
      type: ["Staff"],
      args: {
        filter: t.arg({ type: StaffFilterInput, required: false }),
      },
      resolve: async (query, _parent, args, ctx) => {
        const { isFormTeacher, isActive, accessLevel, classId } =
          args?.filter ?? {};

        return prisma.staff.findMany({
          ...query,
          where: {
            schoolId: ctx.schoolId!,
            isActive,
            classId,
            ...(accessLevel && { accessLevel }),
            ...(isFormTeacher && { isFormTeacher }),
          },
        });
      },
    }),

    staff: t.prismaField({
      type: "Staff",
      args: {
        id: t.arg.id({ required: false }),
        clerkUserId: t.arg.string({ required: false }),
      },
      resolve: async (query, _parent, args, ctx) => {
        return prisma.staff.findUnique({
          ...query,
          where: {
            schoolId: ctx.schoolId!,
            ...(args.id
              ? { id: args.id! }
              : { clerkUserId: args.clerkUserId! }),
          },
        });
      },
    }),

    parents: t.prismaField({
      type: ["Parent"],
      args: {
        searchTerm: t.arg.string({ required: false }),
      },
      resolve: async (query, _parent, args, ctx) =>
        prisma.parent.findMany({
          ...query,
          where: {
            schoolId: ctx.schoolId!,
            ...(args.searchTerm && {
              OR: [
                { name: { contains: args.searchTerm, mode: "insensitive" } },
                { surname: { contains: args.searchTerm, mode: "insensitive" } },
              ],
            }),
          },
        }),
    }),

    parent: t.prismaField({
      type: "Parent",
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, _parent, args, ctx) =>
        prisma.parent.findUnique({
          ...query,
          where: {
            id: args.id,
            schoolId: ctx.schoolId!,
          },
        }),
    }),

    subjects: t.prismaField({
      type: ["Subject"],
      args: {
        teacherId: t.arg.id({ required: false }),
      },
      resolve: async (query, _parent, args, ctx) =>
        prisma.subject.findMany({
          ...query,
          where: { schoolId: ctx.schoolId! },
        }),
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createStaff: t.prismaField({
      type: "Staff",
      args: { input: t.arg({ type: StaffInput, required: true }) },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) => {
        return await createStaffAction(args.input);
      },
    }),

    createSubject: t.prismaField({
      type: "Subject",
      args: { input: t.arg({ type: SubjectInput, required: true }) },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) =>
        await createSubjectAction(args.input),
    }),

    updateSubject: t.prismaField({
      type: "Subject",
      args: { input: t.arg({ type: SubjectInput, required: true }) },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) =>
        await updateSubjectAction(args.input),
    }),
  }),
});
