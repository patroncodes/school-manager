import { PrismaClient, UserSex, Day } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

function randomSex() {
  return Math.random() > 0.5 ? UserSex.MALE : UserSex.FEMALE;
}

function randomBloodType() {
  const types = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  return types[Math.floor(Math.random() * types.length)];
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
  const client = await clerkClient();

  const users = await client.users.getUserList({ limit: 100 });

  for (const user of users.data) {
    await client.users.deleteUser(user.id);
  }

  const teachers = [];
  const students = [];
  const parents = [];

  // ADMIN
  for (let i = 1; i <= 2; i++) {
    const user = {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      username: `${faker.person.middleName().toLowerCase()}_${faker.string.uuid().slice(0, 5)}-${i}`,
    };

    const clerkUser = await client.users.createUser({
      username: user.username,
      password: `${user.name}@${user.surname}1`,
      firstName: user.name,
      lastName: user.surname,
      publicMetadata: { role: "admin" },
    });

    await prisma.admin.create({
      data: {
        id: clerkUser.id,
        ...user,
      },
    });
  }

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({ data: { level: i } });
  }

  // CLASS
  for (let i = 1; i <= 6; i++) {
    const classNames = ["A", "B", "C", "D", "E"];
    await prisma.class.create({
      data: {
        name: `${i}${classNames[Math.floor(Math.random() * classNames.length)]}`,
        gradeId: i,
        capacity: Math.floor(Math.random() * (25 - 15 + 1)) + 15,
      },
    });
  }

  // SUBJECT
  const subjectNames = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Art",
  ];

  for (const name of subjectNames) {
    await prisma.subject.create({ data: { name } });
  }

  // TEACHERS
  for (let i = 1; i <= 6; i++) {
    const user = {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      username: `${faker.person.middleName().toLowerCase()}_${faker.string.uuid().slice(0, 5)}-${i}`,
    };

    const clerkUser = await client.users.createUser({
      username: user.username,
      password: `${user.name}@${user.surname}1`,
      firstName: user.name,
      lastName: user.surname,
      publicMetadata: { role: "teacher" },
    });

    const sex = randomSex();
    const teacher = await prisma.teacher.create({
      data: {
        ...user,
        id: clerkUser.id,
        email: faker.internet.email(),
        phone: faker.phone.number({ style: "international" }),
        address: faker.location.streetAddress(),
        bloodType: randomBloodType(),
        birthday: randomBirthday(28, 50),
        sex,
        subjects: { connect: [{ id: (i % 10) + 1 }] },
        classes: { connect: [{ id: (i % 6) + 1 }] },
      },
    });

    teachers.push(teacher);
  }

  // LESSONS
  for (let i = 1; i <= 30; i++) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startTime = new Date(tomorrow);
    startTime.setHours(8 + (i % 6), 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    for (const teacher of teachers) {
      await prisma.lesson.create({
        data: {
          name: `Lesson${i}`,
          day: Object.values(Day)[i % 5],
          teacherId: teacher.id,
          startTime,
          endTime,
          subjectId: (i % 10) + 1,
          classId: (i % 6) + 1,
        },
      });
    }
  }

  // PARENTS
  for (let i = 1; i <= 15; i++) {
    const user = {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      username: `${faker.person.middleName().toLowerCase()}_${faker.string.uuid().slice(0, 5)}-${i}`,
    };

    const clerkUser = await client.users.createUser({
      username: user.username,
      password: `${user.name}@${user.surname}1`,
      firstName: user.name,
      lastName: user.surname,
      publicMetadata: { role: "parent" },
    });

    const sex = randomSex();

    const parent = await prisma.parent.create({
      data: {
        ...user,
        id: clerkUser.id,
        email: faker.internet.email(),
        phone: faker.phone.number({ style: "international" }),
        address: faker.location.streetAddress(),
        sex,
      },
    });

    parents.push(parent);
  }

  // STUDENTS
  for (let i = 1; i <= 15; i++) {
    const user = {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      username: `${faker.person.middleName().toLowerCase()}_${faker.string.uuid().slice(0, 5)}-${i}`,
    };

    const clerkUser = await client.users.createUser({
      username: user.username,
      password: `${user.name}@${user.surname}1`,
      firstName: user.name,
      lastName: user.surname,
      publicMetadata: { role: "student" },
    });

    const sex = randomSex();

    const parent = parents[Math.floor(Math.random() * parents.length)];

    const student = await prisma.student.create({
      data: {
        ...user,
        id: clerkUser.id,
        email: faker.internet.email(),
        phone: faker.phone.number({ style: "international" }),
        address: faker.location.streetAddress(),
        bloodType: randomBloodType(),
        birthday: randomBirthday(6, 12),
        sex,
        parentId: parent.id,
        gradeId: (i % 6) + 1,
        classId: (i % 6) + 1,
      },
    });

    students.push(student);
  }

  // EXAMS
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Exam ${i}`,
        startTime: new Date(Date.now() + 3600000),
        endTime: new Date(Date.now() + 7200000),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // ASSIGNMENTS
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        title: `Assignment ${i}`,
        startDate: new Date(),
        dueDate: new Date(Date.now() + 86400000),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // RESULTS
  for (let i = 1; i <= 10; i++) {
    for (const student of students) {
      await prisma.result.create({
        data: {
          score: faker.number.int({ min: 50, max: 100 }),
          studentId: student.id,
          ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
        },
      });
    }
  }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    for (const student of students) {
      await prisma.attendance.create({
        data: {
          date: new Date(),
          present: faker.datatype.boolean(),
          studentId: student.id,
          lessonId: (i % 30) + 1,
        },
      });
    }
  }

  // EVENTS
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(2),
        startTime: new Date(),
        endTime: new Date(Date.now() + 7200000),
        classId: (i % 5) + 1,
      },
    });
  }

  // ANNOUNCEMENTS
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(2),
        date: new Date(),
        classId: (i % 5) + 1,
      },
    });
  }

  await prisma.announcement.create({
    data: {
      title: "General Meeting",
      description:
        "There will be a general meeting on Tuesday. Be there on time",
      date: new Date(),
    },
  });

  // FEES
  for (let i = 1; i <= 3; i++) {
    const descriptions = [
      "Textbook fees",
      "Library fees",
      "25/26 First term school fees",
    ];
    await prisma.fee.create({
      data: {
        amount: faker.number.float({
          min: 20000,
          max: 45000,
          fractionDigits: 2,
        }),
        description:
          descriptions[Math.floor(Math.random() * descriptions.length)],
        ...(i == 1 && { classId: 2, dueDate: faker.date.soon({ days: 7 }) }),
        ...(i == 2 && {
          studentId: students[0].id,
          dueDate: faker.date.soon({ days: 14 }),
        }),
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
