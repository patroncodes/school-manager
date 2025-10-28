import { clerkClient } from "@clerk/nextjs/server";
import { faker } from "@faker-js/faker";
import {
  AccessLevel,
  ActiveState,
  AttendanceStatus,
  ExamType,
  LessonType,
  ParentStudentRelationship,
  Prisma,
  PrismaClient,
  StaffContractType,
  UserSex,
} from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const mockSchools = [
  {
    slug: "greenfield-academy",
    name: "Greenfield Academy",
    motto: "Knowledge is Power",
    logo: "https://images.pexels.com/photos/11459428/pexels-photo-11459428.jpeg",
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
  },
  {
    slug: "learnatffs",
    name: "Fort Foundation School",
    motto: "Belong, Learn, Excel",
    logo: "https://res.cloudinary.com/dlbkrvsrz/image/upload/v1756819311/ffs_vjyyy6.png",
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
  },
];

const subjectNames = [
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Further Mathematics",
  "Geography",
  "History",
  "Computer Science",
  "Fine Arts",
];

function randomSex() {
  return Math.random() > 0.5 ? UserSex.MALE : UserSex.FEMALE;
}

function randomBirthday(minAge: number, maxAge: number) {
  const today = new Date();
  const min = new Date(today.getFullYear() - maxAge, 0, 1);
  const max = new Date(today.getFullYear() - minAge, 11, 31);
  return new Date(
    min.getTime() + Math.random() * (max.getTime() - min.getTime()),
  );
}

async function main() {
  console.log("Deleting users...");

  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 100 });
  for (const user of users.data) {
    await client.users.deleteUser(user.id);
  }
  console.log("Users deleted!");

  console.log("🌱 Seeding database...");

  for (const mockSchool of mockSchools) {
    const school = await prisma.school.create({ data: mockSchool });
    const schoolId = school.id;

    const primaryProgram = await prisma.program.create({
      data: {
        name: "PRIMARY",
        schoolId,
      },
    });

    const secondaryProgram = await prisma.program.create({
      data: {
        name: "SECONDARY",
        schoolId,
      },
    });

    const academicYear = await prisma.academicYear.create({
      data: {
        year: "2024-2025",
        startDate: new Date("2024-09-01"),
        endDate: new Date("2025-07-31"),
        isCurrent: true,
        schoolId,
      },
    });

    const terms = await prisma.term.createManyAndReturn({
      data: [
        {
          term: 1,
          startDate: new Date("2024-09-01"),
          endDate: new Date("2024-12-15"),
          isCurrent: true,
          schoolId,
          academicYearId: academicYear.id,
        },
        {
          term: 2,
          startDate: new Date("2025-01-15"),
          endDate: new Date("2025-04-15"),
          isCurrent: false,
          schoolId,
          academicYearId: academicYear.id,
        },
        {
          term: 3,
          startDate: new Date("2025-04-30"),
          endDate: new Date("2025-07-31"),
          isCurrent: false,
          schoolId,
          academicYearId: academicYear.id,
        },
      ],
    });
    console.log("Academic Year and Terms seeding complete");

    const grades = [];

    // Primary grades (Primary 1-6)
    for (let i = 1; i <= 6; i++) {
      const grade = await prisma.grade.create({
        data: {
          name: `Primary ${i}`,
          schoolId,
          programId: primaryProgram.id,
        },
      });
      grades.push(grade);

      await prisma.class.create({
        data: {
          name: `${grade.name}A`,
          capacity: faker.number.int({ min: 20, max: 30 }),
          gradeId: grade.id,
          schoolId,
        },
      });
    }

    // Secondary grades (JSS1-3, SS1-3)
    const secondaryGrades = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
    for (const gradeName of secondaryGrades) {
      const grade = await prisma.grade.create({
        data: {
          name: gradeName,
          schoolId,
          programId: secondaryProgram.id,
        },
      });
      grades.push(grade);

      // Create multiple classes per secondary grade
      for (const section of ["A", "B"]) {
        await prisma.class.create({
          data: {
            name: `${gradeName}${section}`,
            capacity: faker.number.int({ min: 25, max: 40 }),
            gradeId: grade.id,
            schoolId,
          },
        });
      }
    }
    console.log("Grades and classes seeding complete");

    // Subjects
    const subjects = await Promise.all(
      subjectNames.map((name) =>
        prisma.subject.create({
          data: {
            name,
            schoolId,
          },
        }),
      ),
    );
    console.log("Subjects seeding complete");

    for (let i = 0; i < 2; i++) {
      const name = faker.person.firstName();
      const surname = faker.person.lastName();
      const username = `${name.toLowerCase()}_${faker.string.uuid().slice(0, 5)}`;

      const clerkUser = await client.users.createUser({
        username,
        password: `${name}@${surname}1010`,
        firstName: name,
        lastName: surname,
        publicMetadata: { accessLevel: "manager", schoolId },
      });

      await prisma.manager.create({
        data: {
          clerkUserId: clerkUser.id,
          name,
          surname,
          username,
          schoolId,
          email: faker.internet.email(),
          phone: faker.phone.number(),
          birthday: randomBirthday(35, 65),
        },
      });
    }

    const teachers = [];
    for (let i = 0; i < 8; i++) {
      const name = faker.person.firstName();
      const surname = faker.person.lastName();
      const employeeId = `${school.name.split(" ")[0].toLowerCase()}_${String(i + 1).padStart(3, "0")}`;
      const accessLevel = i == 6 ? AccessLevel.FINANCE : AccessLevel.TEACHER;

      let user;

      if (i !== 7) {
        const clerkUser = await client.users.createUser({
          username: employeeId,
          password: `${name}@${surname}1010`,
          firstName: name,
          lastName: surname,
          publicMetadata: { accessLevel: accessLevel.toLowerCase(), schoolId },
        });

        user = clerkUser;
      }

      const teacher = await prisma.staff.create({
        data: {
          clerkUserId: user?.id,
          employeeId,
          name,
          surname,
          email: faker.internet.email(),
          phone: faker.phone.number(),
          birthday: randomBirthday(25, 55),
          address: faker.location.streetAddress(),
          sex: randomSex(),
          contractType: StaffContractType.PERMANENT,
          ...(i !== 7 && { accessLevel }),
          role: i == 7 ? "Cleaner" : i == 6 ? "Bursar" : "Teacher",
          isActive: true,
          schoolId,
        },
      });

      const subject = subjects[i % subjects.length];

      const assignedGrades = await prisma.grade.findMany({
        where: { program: { schoolId, name: "SECONDARY" } },
        select: { id: true },
        take: 3,
      });

      for (const grade of assignedGrades) {
        await prisma.teacherSubjectAssignment.create({
          data: {
            schoolId,
            teacherId: teacher.id,
            subjectId: subject.id,
            gradeId: grade.id,
          },
        });
      }

      teachers.push(teacher);
    }
    console.log("Staff seeding complete");

    const parents = [];
    for (let i = 0; i < 10; i++) {
      const name = faker.person.firstName();
      const surname = faker.person.lastName();
      const username = `${name.toLowerCase()}_${faker.string.uuid().slice(0, 5)}`;

      const clerkUser = await client.users.createUser({
        username,
        password: `${name}@${surname}1010`,
        firstName: name,
        lastName: surname,
        publicMetadata: { accessLevel: "parent", schoolId },
      });

      const parent = await prisma.parent.create({
        data: {
          clerkUserId: clerkUser.id,
          name,
          surname,
          username,
          email: faker.internet.email(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          schoolId,
        },
      });

      parents.push(parent);
    }
    console.log("Parents seeding complete");

    const classes = await prisma.class.findMany({ where: { schoolId } });

    // Students
    for (let i = 0; i < 25; i++) {
      const name = faker.person.firstName();
      const surname = faker.person.lastName();
      const cls = classes[i % classes.length];
      const regNo = `${school.name.split(" ")[0].toLowerCase()}_${String(i + 1).padStart(4, "0")}`;

      const clerkUser = await client.users.createUser({
        username: regNo,
        password: `${name}@${surname}1010`,
        firstName: name,
        lastName: surname,
        publicMetadata: { accessLevel: "student", schoolId },
      });

      const student = await prisma.student.create({
        data: {
          clerkUserId: clerkUser.id,
          registrationNumber: regNo,
          name,
          surname,
          address: faker.location.streetAddress(),
          birthday: randomBirthday(5, 18),
          sex: randomSex(),
          activeState: ActiveState.ACTIVE,
          schoolId,
          classId: cls.id,
        },
      });

      // Link student to parent
      await prisma.parentStudent.create({
        data: {
          parentId: parents[i % parents.length].id,
          studentId: student.id,
          relation:
            i % 2 === 0
              ? ParentStudentRelationship.FATHER
              : ParentStudentRelationship.MOTHER,
        },
      });
    }
    console.log("Students and parent links seeding complete");

    const lessons = [];
    for (let i = 0; i < 10; i++) {
      const teacher = teachers[i % teachers.length];
      const subj = subjects[i % subjects.length];
      const cls = classes[i % classes.length];

      const startTime = new Date();
      startTime.setHours(8 + (i % 6), 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);

      const lesson = await prisma.lesson.create({
        data: {
          name: `${subj.name} - ${cls.name}`,
          description: faker.lorem.sentence(),
          startTime,
          endTime,
          type: LessonType.REGULAR,
          schoolId,
          subjectId: subj.id,
          classId: cls.id,
          teacherId: teacher.id,
        },
      });

      lessons.push(lesson);
    }
    console.log("Lessons seeding complete");

    const students = await prisma.student.findMany({ where: { schoolId } });
    for (let i = 0; i < 20; i++) {
      const random = Math.random();
      const term = terms[i % terms.length];
      const student = students[i % students.length];
      const teacher = teachers[i % teachers.length];

      await prisma.studentAttendance.create({
        data: {
          date: faker.date.recent({ days: 30 }),
          status:
            random > 0.8 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT,
          schoolId,
          termId: term.id,
          studentId: student.id,
          ...(random > 0.7
            ? { lessonId: lessons[i % lessons.length].id }
            : { classId: student.classId }),
        },
      });

      await prisma.staffAttendance.create({
        data: {
          schoolId,
          date: faker.date.recent({ days: 3 }),
          termId: term.id,
          staffId: teacher.id,
        },
      });
    }
    console.log("Attendance seeding complete");

    for (let i = 0; i < 8; i++) {
      const subj = subjects[i % subjects.length];
      const term = terms[i % terms.length];
      const grade = grades[i % grades.length];

      await prisma.exam.create({
        data: {
          title: `${subj.name} ${term.term === 1 ? "First" : term.term === 2 ? "Second" : "Third"} Term Exam`,
          startTime: faker.date.future(),
          endTime: faker.date.future(),
          maxScore: 100,
          type: ExamType.FINAL,
          schoolId,
          subjectId: subj.id,
          gradeId: grade.id,
          termId: term.id,
        },
      });
    }
    console.log("Exams seeding complete");

    for (let i = 0; i < 10; i++) {
      const subj = subjects[i % subjects.length];
      const cls = classes[i % classes.length];
      const term = terms[i % terms.length];

      await prisma.assignment.create({
        data: {
          title: `${subj.name} Assignment ${i + 1}`,
          startDate: faker.date.recent(),
          dueDate: faker.date.soon(),
          maxScore: 30,
          schoolId,
          termId: term.id,
          subjectId: subj.id,
          classId: cls.id,
        },
      });
    }
    console.log("Assignments seeding complete");

    for (let i = 0; i < 5; i++) {
      const term = terms[i % terms.length];

      await prisma.event.create({
        data: {
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          startTime: faker.date.future(),
          endTime: faker.date.future(),
          location: faker.location.streetAddress(),
          isPublic: true,
          schoolId,
          termId: term.id,
        },
      });
    }
    console.log("Events seeding complete");

    for (let i = 0; i < 5; i++) {
      const term = terms[i % terms.length];
      const cls = i % 2 === 0 ? classes[i % classes.length] : null;

      await prisma.announcement.create({
        data: {
          title: faker.lorem.words(4),
          content: faker.lorem.paragraph(),
          isPublished: true,
          publishedAt: new Date(),
          schoolId,
          termId: term.id,
          ...(cls && { classId: cls.id }),
        },
      });
    }
    console.log("Announcements seeding complete");

    for (let i = 0; i < 8; i++) {
      const term = terms[i % terms.length];
      const student = students[i % students.length];
      const grade = await prisma.grade.findFirst({
        where: { id: student.classId },
      });

      const invoice = await prisma.invoice.create({
        data: {
          number: `INV${String(i + 1).padStart(4, "0")}`,
          title: `${term.term === 1 ? "First" : term.term === 2 ? "Second" : "Third"} Term School Fees`,
          amount: new Prisma.Decimal(
            faker.number.int({ min: 50000, max: 200000 }),
          ),
          dueDate: faker.date.future(),
          status: "PUBLISHED",
          schoolId,
          termId: term.id,
          studentId: student.id,
          gradeId: grade?.id,
          classId: student.classId,
        },
      });

      // Add invoice lines
      await prisma.invoiceLine.create({
        data: {
          description: "Tuition Fee",
          amount: new Prisma.Decimal(
            faker.number.int({ min: 40000, max: 150000 }),
          ),
          invoiceId: invoice.id,
        },
      });

      await prisma.invoiceLine.create({
        data: {
          description: "Development Levy",
          amount: new Prisma.Decimal(
            faker.number.int({ min: 5000, max: 25000 }),
          ),
          invoiceId: invoice.id,
        },
      });
    }
    console.log("Invoices seeding complete");
  }

  console.log("✅ Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
