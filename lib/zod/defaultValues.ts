import {
  ClassSchema,
  SchoolSchema,
  StaffSchema,
  StudentSchema,
} from "@/lib/zod/validation";

export const schoolDefaultValues: SchoolSchema = {
  slug: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  motto: null,
  programs: [],
  grades: [],
  managerEmail: "",
  managerBirthday: new Date(),
  managerName: "",
  managerSurname: "",
  managerPhone: "",
  password: "",
  managerUsername: "",
};

export const staffDefaultValues = (data?: StaffSchema) => ({
  employeeId: data?.employeeId ?? "",
  name: data?.name ?? "",
  surname: data?.surname ?? "",
  email: data?.email ?? "",
  phone: data?.phone ?? "",
  address: data?.address ?? "",
  birthday: data?.birthday ?? new Date(),
  sex: data?.sex ?? "MALE",
  contractType: data?.contractType ?? "PERMANENT",
  accessLevel: data?.accessLevel ?? "RESTRICTED",
  role: data?.role ?? "",
  isActive: true,
  programId: null,
});

export const studentDefaultValues = (
  data?: StudentSchema,
  relatedData?: any,
) => ({
  registrationNumber: data?.registrationNumber ?? "",
  name: data?.name ?? "",
  surname: data?.surname ?? "",
  address: data?.address ?? "",
  birthday: data?.birthday ? new Date(data.birthday) : new Date(),
  sex: data?.sex ?? "MALE",
  medicalCondition: data?.medicalCondition ?? "",
  programId: data?.programId ?? relatedData?.programId ?? "",
  gradeId: data?.gradeId ?? relatedData?.gradeId ?? "",
  classId: data?.classId ?? relatedData?.classId ?? "",
  primaryGuardianRelationship: "",
  secondaryGuardianRelationship: null,
  primaryGuardian: { id: "", name: "" },
  secondaryGuardian: null,
});

export const classDefaultValues = (data?: ClassSchema) => ({
  id: data?.id,
  name: data?.name ?? "",
  gradeId: data?.gradeId ?? "",
  capacity: data?.capacity ?? 0,
  supervisors: data?.supervisors ?? null,
});
