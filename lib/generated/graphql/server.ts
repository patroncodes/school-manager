export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
};

export type AcademicYear = {
  __typename?: 'AcademicYear';
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isCurrent: Scalars['Boolean']['output'];
  startDate: Scalars['DateTime']['output'];
  terms: Array<Term>;
  year: Scalars['String']['output'];
};

export type AcademicYearInput = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isCurrent: Scalars['Boolean']['input'];
  startDate: Scalars['DateTime']['input'];
  year: Scalars['String']['input'];
};

export enum AccessLevel {
  Academics = 'ACADEMICS',
  Administration = 'ADMINISTRATION',
  Finance = 'FINANCE',
  Restricted = 'RESTRICTED',
  Teacher = 'TEACHER'
}

export type Announcement = {
  __typename?: 'Announcement';
  content: Scalars['String']['output'];
  draftedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isPublished: Scalars['Boolean']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
};

export type AnnouncementInput = {
  classId?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  gradeId?: InputMaybe<Scalars['String']['input']>;
  isPublished: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type AppError = {
  code?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Assignment = {
  __typename?: 'Assignment';
  class: Class;
  dueDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  maxScore?: Maybe<Scalars['Int']['output']>;
  startDate: Scalars['DateTime']['output'];
  subject: Subject;
  term: Term;
};

export type AssignmentFilter = {
  classId?: InputMaybe<Scalars['ID']['input']>;
  teacherId?: InputMaybe<Scalars['ID']['input']>;
};

export type AssignmentInput = {
  classId: Scalars['String']['input'];
  dueDate: Scalars['DateTime']['input'];
  files?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  maxScore: Scalars['Int']['input'];
  startDate: Scalars['DateTime']['input'];
  subjectId: Scalars['String']['input'];
  termId: Scalars['String']['input'];
};

export type BaseAppError = AppError & Error & {
  __typename?: 'BaseAppError';
  code?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type BaseError = Error & {
  __typename?: 'BaseError';
  message?: Maybe<Scalars['String']['output']>;
};

export type Class = {
  __typename?: 'Class';
  capacity: Scalars['Int']['output'];
  grade: Grade;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  studentCount: Scalars['Int']['output'];
  students: Array<Student>;
  supervisors: Array<Staff>;
};

export type ClassInput = {
  capacity: Scalars['Int']['input'];
  gradeId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  supervisors?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ClassWhereInput = {
  gradeId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  programId?: InputMaybe<Scalars['ID']['input']>;
  supervisorId?: InputMaybe<Scalars['String']['input']>;
};

export type Club = {
  __typename?: 'Club';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  foundedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  members: Array<Student>;
  name: Scalars['String']['output'];
  supervisors: Array<Staff>;
};

export type ClubFilter = {
  staffId?: InputMaybe<Scalars['ID']['input']>;
  studentId?: InputMaybe<Scalars['ID']['input']>;
};

export type ClubInput = {
  description: Scalars['String']['input'];
  foundedAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export enum ContractType {
  Contract = 'CONTRACT',
  PartTime = 'PART_TIME',
  Permanent = 'PERMANENT'
}

export type Error = {
  message?: Maybe<Scalars['String']['output']>;
};

export type Event = {
  __typename?: 'Event';
  description: Scalars['String']['output'];
  endTime: Scalars['DateTime']['output'];
  grade?: Maybe<Grade>;
  group: EventGroupEnum;
  id: Scalars['ID']['output'];
  startTime: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum EventGroupEnum {
  Public = 'PUBLIC',
  Staff = 'STAFF'
}

export type EventInput = {
  description: Scalars['String']['input'];
  endTime: Scalars['DateTime']['input'];
  gradeId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  startTime: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
};

export type Exam = {
  __typename?: 'Exam';
  date: Scalars['DateTime']['output'];
  endTime?: Maybe<Scalars['String']['output']>;
  grade: Grade;
  id: Scalars['ID']['output'];
  maxScore?: Maybe<Scalars['Int']['output']>;
  startTime: Scalars['String']['output'];
  subject: Subject;
  term: Term;
  type: ExamType;
};

export type ExamFilter = {
  classId?: InputMaybe<Scalars['ID']['input']>;
  teacherId?: InputMaybe<Scalars['ID']['input']>;
};

export type ExamInput = {
  date: Scalars['DateTime']['input'];
  endTime?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<Array<Scalars['String']['input']>>;
  gradeId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  maxScore: Scalars['Int']['input'];
  startTime: Scalars['String']['input'];
  subjectId: Scalars['String']['input'];
  termId: Scalars['String']['input'];
  type: ExamType;
};

export enum ExamType {
  Final = 'FINAL',
  Midterm = 'MIDTERM',
  Practical = 'PRACTICAL',
  Quiz = 'QUIZ',
  Test = 'TEST'
}

export type ForeignKeyError = AppError & Error & {
  __typename?: 'ForeignKeyError';
  code?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Grade = {
  __typename?: 'Grade';
  classes: Array<Class>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  program: Program;
};

export type GradeInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  programId: Scalars['String']['input'];
};

export type GradeWhereInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  programId?: InputMaybe<Scalars['ID']['input']>;
  supervisorId?: InputMaybe<Scalars['String']['input']>;
};

export type IdentifierExistsError = AppError & Error & {
  __typename?: 'IdentifierExistsError';
  code?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type ManagerInput = {
  birthday: Scalars['DateTime']['input'];
  email: Scalars['String']['input'];
  img?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  surname: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAssignment?: Maybe<MutationCreateAssignmentResult>;
  createClass?: Maybe<MutationCreateClassResult>;
  createClub?: Maybe<MutationCreateClubResult>;
  createEvent?: Maybe<MutationCreateEventResult>;
  createExam?: Maybe<MutationCreateExamResult>;
  createGrade?: Maybe<MutationCreateGradeResult>;
  createProgram?: Maybe<MutationCreateProgramResult>;
  createSchool?: Maybe<MutationCreateSchoolResult>;
  createStaff?: Maybe<MutationCreateStaffResult>;
  createStudent?: Maybe<MutationCreateStudentResult>;
  createSubject?: Maybe<MutationCreateSubjectResult>;
  mutateAcademicYear?: Maybe<MutationMutateAcademicYearResult>;
  mutateTerm?: Maybe<MutationMutateTermResult>;
  saveAnnouncementAsDraft?: Maybe<Announcement>;
  updateAssignment?: Maybe<MutationUpdateAssignmentResult>;
  updateClass?: Maybe<MutationUpdateClassResult>;
  updateClub?: Maybe<MutationUpdateClubResult>;
  updateEvent?: Maybe<MutationUpdateEventResult>;
  updateExam?: Maybe<MutationUpdateExamResult>;
  updateGrade?: Maybe<MutationUpdateGradeResult>;
  updatePeriodSlot?: Maybe<MutationUpdatePeriodSlotResult>;
  updateSubject?: Maybe<MutationUpdateSubjectResult>;
  updateTimetableAssignment?: Maybe<MutationUpdateTimetableAssignmentResult>;
};


export type MutationCreateAssignmentArgs = {
  input: AssignmentInput;
};


export type MutationCreateClassArgs = {
  input: ClassInput;
};


export type MutationCreateClubArgs = {
  input: ClubInput;
};


export type MutationCreateEventArgs = {
  input: EventInput;
};


export type MutationCreateExamArgs = {
  input: ExamInput;
};


export type MutationCreateGradeArgs = {
  input: GradeInput;
};


export type MutationCreateProgramArgs = {
  input: ProgramInput;
};


export type MutationCreateSchoolArgs = {
  input: SchoolInput;
};


export type MutationCreateStaffArgs = {
  input: StaffInput;
};


export type MutationCreateStudentArgs = {
  input: StudentInput;
};


export type MutationCreateSubjectArgs = {
  input: SubjectInput;
};


export type MutationMutateAcademicYearArgs = {
  input: AcademicYearInput;
};


export type MutationMutateTermArgs = {
  input: TermInput;
};


export type MutationSaveAnnouncementAsDraftArgs = {
  input: AnnouncementInput;
};


export type MutationUpdateAssignmentArgs = {
  input: AssignmentInput;
};


export type MutationUpdateClassArgs = {
  input: ClassInput;
};


export type MutationUpdateClubArgs = {
  input: ClubInput;
};


export type MutationUpdateEventArgs = {
  input: EventInput;
};


export type MutationUpdateExamArgs = {
  input: ExamInput;
};


export type MutationUpdateGradeArgs = {
  input: GradeInput;
};


export type MutationUpdatePeriodSlotArgs = {
  input: TimetablePeriodInput;
};


export type MutationUpdateSubjectArgs = {
  input: SubjectInput;
};


export type MutationUpdateTimetableAssignmentArgs = {
  input: TimetableAssignmentInput;
};

export type MutationCreateAssignmentResult = BaseAppError | BaseError | MutationCreateAssignmentSuccess | UniqueConstraintError;

export type MutationCreateAssignmentSuccess = {
  __typename?: 'MutationCreateAssignmentSuccess';
  data: Assignment;
};

export type MutationCreateClassResult = BaseAppError | BaseError | MutationCreateClassSuccess | UniqueConstraintError;

export type MutationCreateClassSuccess = {
  __typename?: 'MutationCreateClassSuccess';
  data: Class;
};

export type MutationCreateClubResult = BaseAppError | BaseError | MutationCreateClubSuccess | UniqueConstraintError;

export type MutationCreateClubSuccess = {
  __typename?: 'MutationCreateClubSuccess';
  data: Club;
};

export type MutationCreateEventResult = BaseAppError | BaseError | MutationCreateEventSuccess | UniqueConstraintError;

export type MutationCreateEventSuccess = {
  __typename?: 'MutationCreateEventSuccess';
  data: Event;
};

export type MutationCreateExamResult = BaseAppError | BaseError | MutationCreateExamSuccess | UniqueConstraintError;

export type MutationCreateExamSuccess = {
  __typename?: 'MutationCreateExamSuccess';
  data: Exam;
};

export type MutationCreateGradeResult = BaseAppError | BaseError | MutationCreateGradeSuccess | UniqueConstraintError;

export type MutationCreateGradeSuccess = {
  __typename?: 'MutationCreateGradeSuccess';
  data: Grade;
};

export type MutationCreateProgramResult = BaseAppError | BaseError | MutationCreateProgramSuccess;

export type MutationCreateProgramSuccess = {
  __typename?: 'MutationCreateProgramSuccess';
  data: Program;
};

export type MutationCreateSchoolResult = BaseAppError | BaseError | MutationCreateSchoolSuccess | UniqueConstraintError;

export type MutationCreateSchoolSuccess = {
  __typename?: 'MutationCreateSchoolSuccess';
  data: School;
};

export type MutationCreateStaffResult = BaseAppError | BaseError | MutationCreateStaffSuccess | UniqueConstraintError;

export type MutationCreateStaffSuccess = {
  __typename?: 'MutationCreateStaffSuccess';
  data: Staff;
};

export type MutationCreateStudentResult = BaseAppError | BaseError | ForeignKeyError | MutationCreateStudentSuccess | UniqueConstraintError;

export type MutationCreateStudentSuccess = {
  __typename?: 'MutationCreateStudentSuccess';
  data: Student;
};

export type MutationCreateSubjectResult = BaseAppError | BaseError | MutationCreateSubjectSuccess | UniqueConstraintError;

export type MutationCreateSubjectSuccess = {
  __typename?: 'MutationCreateSubjectSuccess';
  data: Subject;
};

export type MutationMutateAcademicYearResult = BaseAppError | BaseError | MutationMutateAcademicYearSuccess | UniqueConstraintError;

export type MutationMutateAcademicYearSuccess = {
  __typename?: 'MutationMutateAcademicYearSuccess';
  data: AcademicYear;
};

export type MutationMutateTermResult = BaseAppError | BaseError | MutationMutateTermSuccess | UniqueConstraintError;

export type MutationMutateTermSuccess = {
  __typename?: 'MutationMutateTermSuccess';
  data: Term;
};

export type MutationUpdateAssignmentResult = BaseAppError | BaseError | MutationUpdateAssignmentSuccess | NotFoundError | UniqueConstraintError;

export type MutationUpdateAssignmentSuccess = {
  __typename?: 'MutationUpdateAssignmentSuccess';
  data: Assignment;
};

export type MutationUpdateClassResult = BaseAppError | BaseError | ForeignKeyError | MutationUpdateClassSuccess | UniqueConstraintError;

export type MutationUpdateClassSuccess = {
  __typename?: 'MutationUpdateClassSuccess';
  data: Class;
};

export type MutationUpdateClubResult = BaseAppError | BaseError | MutationUpdateClubSuccess | UniqueConstraintError;

export type MutationUpdateClubSuccess = {
  __typename?: 'MutationUpdateClubSuccess';
  data: Club;
};

export type MutationUpdateEventResult = BaseAppError | BaseError | MutationUpdateEventSuccess | NotFoundError | UniqueConstraintError;

export type MutationUpdateEventSuccess = {
  __typename?: 'MutationUpdateEventSuccess';
  data: Event;
};

export type MutationUpdateExamResult = BaseAppError | BaseError | MutationUpdateExamSuccess | NotFoundError | UniqueConstraintError;

export type MutationUpdateExamSuccess = {
  __typename?: 'MutationUpdateExamSuccess';
  data: Exam;
};

export type MutationUpdateGradeResult = BaseAppError | BaseError | MutationUpdateGradeSuccess | UniqueConstraintError;

export type MutationUpdateGradeSuccess = {
  __typename?: 'MutationUpdateGradeSuccess';
  data: Grade;
};

export type MutationUpdatePeriodSlotResult = BaseAppError | BaseError | MutationUpdatePeriodSlotSuccess | UniqueConstraintError;

export type MutationUpdatePeriodSlotSuccess = {
  __typename?: 'MutationUpdatePeriodSlotSuccess';
  data: TimetablePeriod;
};

export type MutationUpdateSubjectResult = BaseAppError | BaseError | MutationUpdateSubjectSuccess | UniqueConstraintError;

export type MutationUpdateSubjectSuccess = {
  __typename?: 'MutationUpdateSubjectSuccess';
  data: Subject;
};

export type MutationUpdateTimetableAssignmentResult = BaseAppError | BaseError | MutationUpdateTimetableAssignmentSuccess | UniqueConstraintError;

export type MutationUpdateTimetableAssignmentSuccess = {
  __typename?: 'MutationUpdateTimetableAssignmentSuccess';
  data: TimetableAssignment;
};

export type NotFoundError = AppError & Error & {
  __typename?: 'NotFoundError';
  code?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type Parent = {
  __typename?: 'Parent';
  clerkUserId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  primaryId?: Maybe<Scalars['String']['output']>;
  surname: Scalars['String']['output'];
};

export type PasswordPwnedError = AppError & Error & {
  __typename?: 'PasswordPwnedError';
  code?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type PasswordTooShortError = AppError & Error & {
  __typename?: 'PasswordTooShortError';
  code?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type PeriodSlot = {
  __typename?: 'PeriodSlot';
  dayOfWeek: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  timetableAssignments: Array<TimetableAssignment>;
};


export type PeriodSlotTimetableAssignmentsArgs = {
  classId: Scalars['ID']['input'];
};

export type Program = {
  __typename?: 'Program';
  grades: Array<Grade>;
  id: Scalars['ID']['output'];
  name: ProgramName;
};

export type ProgramInput = {
  grades: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export enum ProgramName {
  Creche = 'CRECHE',
  Nursery = 'NURSERY',
  Primary = 'PRIMARY',
  Secondary = 'SECONDARY'
}

export type Query = {
  __typename?: 'Query';
  academicYears?: Maybe<Array<AcademicYear>>;
  announcements?: Maybe<Array<Announcement>>;
  assignments?: Maybe<Array<Assignment>>;
  class?: Maybe<Class>;
  classes?: Maybe<Array<Class>>;
  clubs?: Maybe<Array<Club>>;
  events?: Maybe<Array<Event>>;
  exams?: Maybe<Array<Exam>>;
  grade?: Maybe<Grade>;
  grades?: Maybe<Array<Grade>>;
  parent?: Maybe<Parent>;
  parents?: Maybe<Array<Parent>>;
  programs?: Maybe<Array<Program>>;
  school?: Maybe<School>;
  schools?: Maybe<Array<School>>;
  staff?: Maybe<Staff>;
  staffs?: Maybe<Array<Staff>>;
  students?: Maybe<Array<Student>>;
  subjects?: Maybe<Array<Subject>>;
  terms?: Maybe<Array<Term>>;
  timetable?: Maybe<Array<TimetablePeriod>>;
};


export type QueryAnnouncementsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAssignmentsArgs = {
  filter?: InputMaybe<AssignmentFilter>;
};


export type QueryClassArgs = {
  id: Scalars['ID']['input'];
};


export type QueryClassesArgs = {
  where?: InputMaybe<ClassWhereInput>;
};


export type QueryClubsArgs = {
  filter?: InputMaybe<ClubFilter>;
};


export type QueryEventsArgs = {
  classId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryExamsArgs = {
  filter?: InputMaybe<ExamFilter>;
};


export type QueryGradeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGradesArgs = {
  where?: InputMaybe<GradeWhereInput>;
};


export type QueryParentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryParentsArgs = {
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySchoolArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStaffArgs = {
  clerkUserId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryStaffsArgs = {
  filter?: InputMaybe<StaffFilterInput>;
};


export type QueryStudentsArgs = {
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySubjectsArgs = {
  teacherId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryTermsArgs = {
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTimetableArgs = {
  classId: Scalars['ID']['input'];
};

export type School = {
  __typename?: 'School';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  motto?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  programs?: Maybe<Array<Program>>;
  slug: Scalars['String']['output'];
};

export type SchoolGradeInput = {
  gradeName: Scalars['String']['input'];
  programName: Scalars['String']['input'];
};

export type SchoolInput = {
  address: Scalars['String']['input'];
  email: Scalars['String']['input'];
  grades: Array<SchoolGradeInput>;
  logo?: InputMaybe<Scalars['String']['input']>;
  manager: ManagerInput;
  motto?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  programs: Array<ProgramName>;
  slug: Scalars['String']['input'];
};

export enum Sex {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export type Staff = {
  __typename?: 'Staff';
  accessLevel: Scalars['String']['output'];
  address: Scalars['String']['output'];
  class?: Maybe<Class>;
  clerkUserId?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  employeeId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  img?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  role: Scalars['String']['output'];
  subjects?: Maybe<Array<TeacherSubjectAssignment>>;
  surname: Scalars['String']['output'];
};

export type StaffFilterInput = {
  accessLevel?: InputMaybe<AccessLevel>;
  classId?: InputMaybe<Scalars['String']['input']>;
  isActive: Scalars['Boolean']['input'];
  isFormTeacher?: InputMaybe<Scalars['Boolean']['input']>;
};

export type StaffInput = {
  accessLevel: AccessLevel;
  address: Scalars['String']['input'];
  birthday: Scalars['DateTime']['input'];
  classId?: InputMaybe<Scalars['String']['input']>;
  clerkUserId?: InputMaybe<Scalars['String']['input']>;
  contractType: ContractType;
  email?: InputMaybe<Scalars['String']['input']>;
  employeeId: Scalars['String']['input'];
  grades?: InputMaybe<Array<Scalars['String']['input']>>;
  hireDate?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  img?: InputMaybe<Scalars['String']['input']>;
  isActive?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  oldImg?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
  position?: InputMaybe<Scalars['String']['input']>;
  role: Scalars['String']['input'];
  sex: Sex;
  subjects?: InputMaybe<Array<Scalars['String']['input']>>;
  surname: Scalars['String']['input'];
};

export type Student = {
  __typename?: 'Student';
  activeState: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  img?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  registrationNumber: Scalars['String']['output'];
  sex: Scalars['String']['output'];
  surname: Scalars['String']['output'];
};

export type StudentInput = {
  address: Scalars['String']['input'];
  birthday: Scalars['DateTime']['input'];
  classId: Scalars['String']['input'];
  gradeId?: InputMaybe<Scalars['String']['input']>;
  img?: InputMaybe<Scalars['String']['input']>;
  medicalCondition?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  oldImg?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  primaryGuardian: Scalars['String']['input'];
  primaryGuardianRelationship: Scalars['String']['input'];
  programId?: InputMaybe<Scalars['String']['input']>;
  registrationNumber: Scalars['String']['input'];
  secondaryGuardian?: InputMaybe<Scalars['String']['input']>;
  secondaryGuardianRelationship?: InputMaybe<Scalars['String']['input']>;
  sex: Sex;
  surname: Scalars['String']['input'];
};

export type Subject = {
  __typename?: 'Subject';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  teachers: Array<TeacherSubjectAssignment>;
};

export type SubjectInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  relationId?: InputMaybe<Scalars['String']['input']>;
  teachers: Array<Scalars['String']['input']>;
};

export type TeacherSubjectAssignment = {
  __typename?: 'TeacherSubjectAssignment';
  id: Scalars['ID']['output'];
  subject: Subject;
  teacher: Staff;
};

export type Term = {
  __typename?: 'Term';
  academicYear: AcademicYear;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isCurrent: Scalars['Boolean']['output'];
  startDate: Scalars['DateTime']['output'];
  term: Scalars['Int']['output'];
};

export type TermInput = {
  academicYearId: Scalars['ID']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isCurrent: Scalars['Boolean']['input'];
  startDate: Scalars['DateTime']['input'];
  term: Scalars['String']['input'];
};

export type TimetableAssignment = {
  __typename?: 'TimetableAssignment';
  class: Class;
  id: Scalars['ID']['output'];
  periodSlot: PeriodSlot;
  subject?: Maybe<Subject>;
  teacher?: Maybe<Staff>;
};

export type TimetableAssignmentInput = {
  classId: Scalars['ID']['input'];
  periodSlotId: Scalars['ID']['input'];
  subjectId?: InputMaybe<Scalars['ID']['input']>;
  teacherId?: InputMaybe<Scalars['ID']['input']>;
};

export type TimetablePeriod = {
  __typename?: 'TimetablePeriod';
  endTime: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  periodSlots: Array<PeriodSlot>;
  startTime: Scalars['String']['output'];
};

export type TimetablePeriodInput = {
  daysOfWeek: Array<Scalars['String']['input']>;
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
};

export type UniqueConstraintError = AppError & Error & {
  __typename?: 'UniqueConstraintError';
  code?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
};

export type GetAcademicYearsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAcademicYearsQuery = { __typename?: 'Query', academicYears?: Array<{ __typename?: 'AcademicYear', id: string, year: string, startDate: any, endDate?: any | null, isCurrent: boolean }> | null };

export type GetAssignmentsQueryVariables = Exact<{
  filter?: InputMaybe<AssignmentFilter>;
}>;


export type GetAssignmentsQuery = { __typename?: 'Query', assignments?: Array<{ __typename?: 'Assignment', id: string, startDate: any, dueDate: any, maxScore?: number | null, term: { __typename?: 'Term', id: string, term: number }, class: { __typename?: 'Class', id: string, name: string, grade: { __typename?: 'Grade', id: string, name: string } }, subject: { __typename?: 'Subject', id: string, name: string } }> | null };

export type GetClassQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetClassQuery = { __typename?: 'Query', class?: { __typename?: 'Class', id: string, name: string, capacity: number, studentCount: number, grade: { __typename?: 'Grade', id: string, name: string, program: { __typename?: 'Program', id: string } }, supervisors: Array<{ __typename?: 'Staff', id: string, name: string, surname: string, img?: string | null }>, students: Array<{ __typename?: 'Student', id: string, name: string, surname: string, sex: string, registrationNumber: string, img?: string | null, activeState: string }> } | null };

export type GetClassesQueryVariables = Exact<{
  where?: InputMaybe<ClassWhereInput>;
}>;


export type GetClassesQuery = { __typename?: 'Query', classes?: Array<{ __typename?: 'Class', id: string, name: string, studentCount: number, capacity: number, supervisors: Array<{ __typename?: 'Staff', name: string, surname: string }>, grade: { __typename?: 'Grade', name: string } }> | null };

export type GetClubsQueryVariables = Exact<{
  filter?: InputMaybe<ClubFilter>;
}>;


export type GetClubsQuery = { __typename?: 'Query', clubs?: Array<{ __typename?: 'Club', id: string, name: string, description?: string | null, foundedAt?: any | null }> | null };

export type GetEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventsQuery = { __typename?: 'Query', events?: Array<{ __typename?: 'Event', id: string, title: string, description: string, startTime: any, endTime: any, updatedAt?: any | null, grade?: { __typename?: 'Grade', name: string } | null }> | null };

export type GetExamsQueryVariables = Exact<{
  filter?: InputMaybe<ExamFilter>;
}>;


export type GetExamsQuery = { __typename?: 'Query', exams?: Array<{ __typename?: 'Exam', id: string, date: any, startTime: string, endTime?: string | null, type: ExamType, maxScore?: number | null, term: { __typename?: 'Term', id: string, term: number }, grade: { __typename?: 'Grade', id: string, name: string }, subject: { __typename?: 'Subject', id: string, name: string } }> | null };

export type GetGradesQueryVariables = Exact<{
  where?: InputMaybe<GradeWhereInput>;
}>;


export type GetGradesQuery = { __typename?: 'Query', grades?: Array<{ __typename?: 'Grade', id: string, name: string, classes: Array<{ __typename?: 'Class', id: string, name: string, studentCount: number }> }> | null };

export type GetProgramsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProgramsQuery = { __typename?: 'Query', programs?: Array<{ __typename?: 'Program', id: string, name: ProgramName, grades: Array<{ __typename?: 'Grade', name: string, classes: Array<{ __typename?: 'Class', studentCount: number }> }> }> | null };

export type GetStaffQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetStaffQuery = { __typename?: 'Query', staff?: { __typename?: 'Staff', id: string, name: string, surname: string, role: string, phone: string, email?: string | null, address: string, img?: string | null, employeeId: string, accessLevel: string, class?: { __typename?: 'Class', id: string, name: string, grade: { __typename?: 'Grade', name: string, program: { __typename?: 'Program', id: string } } } | null } | null };

export type GetStaffsQueryVariables = Exact<{
  filter?: InputMaybe<StaffFilterInput>;
}>;


export type GetStaffsQuery = { __typename?: 'Query', staffs?: Array<{ __typename?: 'Staff', id: string, name: string, surname: string, role: string, phone: string, email?: string | null, address: string, img?: string | null, class?: { __typename?: 'Class', name: string, grade: { __typename?: 'Grade', name: string } } | null }> | null };

export type GetSubjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSubjectsQuery = { __typename?: 'Query', subjects?: Array<{ __typename?: 'Subject', id: string, name: string, teachers: Array<{ __typename?: 'TeacherSubjectAssignment', id: string, teacher: { __typename?: 'Staff', name: string, surname: string } }> }> | null };

export type GetTermsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTermsQuery = { __typename?: 'Query', terms?: Array<{ __typename?: 'Term', id: string, term: number, startDate: any, endDate?: any | null, isCurrent: boolean }> | null };

export type GetTimetableQueryVariables = Exact<{
  classId: Scalars['ID']['input'];
}>;


export type GetTimetableQuery = { __typename?: 'Query', timetable?: Array<{ __typename?: 'TimetablePeriod', id: string, startTime: string, endTime: string, periodSlots: Array<{ __typename?: 'PeriodSlot', id: string, dayOfWeek: number, timetableAssignments: Array<{ __typename?: 'TimetableAssignment', id: string, teacher?: { __typename?: 'Staff', id: string, name: string, surname: string } | null, subject?: { __typename?: 'Subject', id: string, name: string } | null }> }> }> | null };
