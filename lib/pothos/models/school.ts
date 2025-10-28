import { builder } from "../builder";
import prisma from "@/lib/prisma";
import { DateTimeResolver } from "graphql-scalars";
import {
  createAcademicYearAction,
  createProgramAction,
  createSchoolAction,
  createStudentAction,
  createTermAction,
} from "@/lib/actions";
import {
  AppError,
  ForeignKeyError,
  UniqueConstraintError,
} from "@/lib/pothos/errors";

builder.addScalarType("DateTime", DateTimeResolver);

const ProgramEnum = builder.enumType("ProgramName", {
  values: ["CRECHE", "NURSERY", "PRIMARY", "SECONDARY"] as const,
});
const SexEnum = builder.enumType("SexEnum", {
  values: ["MALE", "FEMALE", "OTHER"] as const,
});

const ManagerInput = builder.inputType("ManagerInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    surname: t.string({ required: true }),
    email: t.string({ required: true }),
    phone: t.string({ required: true }),
    birthday: t.field({ type: "DateTime", required: true }),
    username: t.string({ required: true }),
    img: t.string(),
    password: t.string({ required: true }),
  }),
});

const SchoolGradeInput = builder.inputType("SchoolGradeInput", {
  fields: (t) => ({
    gradeName: t.string({ required: true }),
    programName: t.string({ required: true }),
  }),
});

const ProgramInput = builder.inputType("ProgramInput", {
  fields: (t) => ({
    name: t.string({ required: true }),
    grades: t.stringList({ required: true }),
  }),
});

const AcademicYearInput = builder.inputType("AcademicYearInput", {
  fields: (t) => ({
    id: t.id({ required: false }),
    year: t.string({ required: true }),
    startDate: t.field({ type: "DateTime", required: true }),
    endDate: t.field({ type: "DateTime" }),
    isCurrent: t.boolean({ required: true }),
  }),
});

const TermInput = builder.inputType("TermInput", {
  fields: (t) => ({
    id: t.id({ required: false }),
    academicYearId: t.id({ required: true }),
    term: t.string({ required: true }),
    startDate: t.field({ type: "DateTime", required: true }),
    endDate: t.field({ type: "DateTime" }),
    isCurrent: t.boolean({ required: true }),
  }),
});

const SchoolInput = builder.inputType("SchoolInput", {
  fields: (t) => ({
    slug: t.string({ required: true }),
    name: t.string({ required: true }),
    email: t.string({ required: true }),
    phone: t.string({ required: true }),
    address: t.string({ required: true }),
    motto: t.string(),
    logo: t.string(),
    programs: t.field({ type: [ProgramEnum], required: true }),
    grades: t.field({ type: [SchoolGradeInput], required: true }),
    manager: t.field({ type: ManagerInput, required: true }),
  }),
});

const StudentInput = builder.inputType("StudentInput", {
  fields: (t) => ({
    surname: t.string({ required: true }),
    name: t.string({ required: true }),
    password: t.string(),
    birthday: t.field({ type: "DateTime", required: true }),
    address: t.string({ required: true }),
    registrationNumber: t.string({ required: true }),
    img: t.string(),
    oldImg: t.string(),
    sex: t.field({ type: SexEnum, required: true }),
    primaryGuardian: t.string({ required: true }),
    secondaryGuardian: t.string(),
    primaryGuardianRelationship: t.string({ required: true }),
    medicalCondition: t.string(),
    secondaryGuardianRelationship: t.string(),
    programId: t.string(),
    gradeId: t.string(),
    classId: t.string({ required: true }),
  }),
});

builder.prismaObject("School", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    name: t.exposeString("name", { nullable: false }),
    slug: t.exposeString("slug", { nullable: false }),
    email: t.exposeString("email", { nullable: false }),
    phone: t.exposeString("phone", { nullable: false }),
    motto: t.exposeString("motto"),
    logo: t.exposeString("logo"),
    programs: t.relation("programs"),
  }),
});

builder.prismaObject("Program", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    name: t.expose("name", { type: ProgramEnum, nullable: false }),
    grades: t.relation("grades", { nullable: false }),
  }),
});

builder.prismaObject("AcademicYear", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    year: t.exposeString("year", { nullable: false }),
    startDate: t.expose("startDate", { type: "DateTime", nullable: false }),
    endDate: t.expose("endDate", { type: "DateTime" }),
    isCurrent: t.exposeBoolean("isCurrent", { nullable: false }),
    terms: t.relation("terms", { nullable: false }),
  }),
});

builder.prismaObject("Term", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    term: t.exposeInt("term", { nullable: false }),
    startDate: t.expose("startDate", { type: "DateTime", nullable: false }),
    endDate: t.expose("endDate", { type: "DateTime" }),
    isCurrent: t.exposeBoolean("isCurrent", { nullable: false }),
    academicYear: t.relation("academicYear", { nullable: false }),
  }),
});

builder.prismaObject("Student", {
  fields: (t) => ({
    id: t.exposeID("id", { nullable: false }),
    name: t.exposeString("name", { nullable: false }),
    surname: t.exposeString("surname", { nullable: false }),
    img: t.exposeString("img"),
    sex: t.exposeString("sex", { nullable: false }),
    registrationNumber: t.exposeString("registrationNumber", {
      nullable: false,
    }),
    activeState: t.exposeString("activeState", { nullable: false }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createSchool: t.prismaField({
      type: "School",
      args: {
        input: t.arg({ type: SchoolInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) => {
        return createSchoolAction(args.input);
      },
    }),

    createProgram: t.prismaField({
      type: "Program",
      args: {
        input: t.arg({ type: ProgramInput, required: true }),
      },
      errors: { types: [AppError] },
      resolve: async (_query, _parent, args) => {
        return createProgramAction(args.input);
      },
    }),

    createStudent: t.prismaField({
      type: "Student",
      args: {
        input: t.arg({ type: StudentInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError, ForeignKeyError] },
      resolve: async (_query, _parent, args) => {
        const formattedInput = {
          ...args.input,
          primaryGuardian: { id: args.input.primaryGuardian, name: "" },
          secondaryGuardian: { id: args.input.secondaryGuardian, name: "" },
        };

        return await createStudentAction(formattedInput);
      },
    }),

    mutateAcademicYear: t.prismaField({
      type: "AcademicYear",
      args: {
        input: t.arg({ type: AcademicYearInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) =>
        await createAcademicYearAction(args.input),
    }),

    mutateTerm: t.prismaField({
      type: "Term",
      args: {
        input: t.arg({ type: TermInput, required: true }),
      },
      errors: { types: [AppError, UniqueConstraintError] },
      resolve: async (_query, _parent, args) =>
        await createTermAction(args.input),
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    school: t.prismaField({
      type: "School",
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, _, args) =>
        await prisma.school.findUnique({ where: { id: args.id }, ...query }),
    }),

    schools: t.prismaField({
      type: ["School"],
      resolve: (query) => prisma.school.findMany({ ...query }),
    }),

    programs: t.prismaField({
      type: ["Program"],
      resolve: async (query, _parent, _args, ctx) =>
        prisma.program.findMany({
          ...query,
          where: { schoolId: ctx.schoolId! },
        }),
    }),

    students: t.prismaField({
      type: ["Student"],
      args: {
        searchTerm: t.arg.string({ required: false }),
      },
      resolve: async (query, _parent, args, ctx) =>
        prisma.student.findMany({
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

    academicYears: t.prismaField({
      type: ["AcademicYear"],
      resolve: async (query, _parent, _args, ctx) =>
        prisma.academicYear.findMany({
          ...query,
          where: {
            schoolId: ctx.schoolId!,
          },
        }),
    }),

    terms: t.prismaField({
      type: ["Term"],
      resolve: async (query, _parent, _args, ctx) =>
        prisma.term.findMany({
          ...query,
          where: {
            schoolId: ctx.schoolId!,
          },
        }),
    }),
  }),
});
