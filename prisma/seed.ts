import { PrismaClient, UserSex, Day } from "@prisma/client";
import { faker } from "@faker-js/faker";

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
  // ADMIN
  for (let i = 1; i <= 2; i++) {
    await prisma.admin.create({
      data: {
        id: `admin${i}`,
        username: `admin${i}`,
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
      },
    });
  }

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({ data: { level: i } });
  }

  // CLASS
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i}${faker.string.alpha({ length: 1 }).toUpperCase()}`,
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
  for (let i = 1; i <= 15; i++) {
    const sex = randomSex();
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: faker.person.firstName(sex === UserSex.MALE ? "male" : "female"),
        surname: faker.person.lastName(),
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
  }

  // LESSONS
  for (let i = 1; i <= 30; i++) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startTime = new Date(tomorrow);
    startTime.setHours(8 + (i % 6), 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    await prisma.lesson.create({
      data: {
        name: `Lesson${i}`,
        day: Object.values(Day)[i % 5],
        startTime,
        endTime,
        subjectId: (i % 10) + 1,
        classId: (i % 6) + 1,
        teacherId: `teacher${(i % 15) + 1}`,
      },
    });
  }

  // PARENTS
  for (let i = 1; i <= 25; i++) {
    const sex = randomSex();
    await prisma.parent.create({
      data: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        name: faker.person.firstName(sex === UserSex.MALE ? "male" : "female"),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: "international" }),
        address: faker.location.streetAddress(),
        sex,
      },
    });
  }

  // STUDENTS
  for (let i = 1; i <= 50; i++) {
    const sex = randomSex();
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `student${i}`,
        name: faker.person.firstName(sex === UserSex.MALE ? "male" : "female"),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: "international" }),
        address: faker.location.streetAddress(),
        bloodType: randomBloodType(),
        birthday: randomBirthday(6, 12),
        sex,
        parentId: `parentId${(i % 25) + 1}`,
        gradeId: (i % 6) + 1,
        classId: (i % 6) + 1,
      },
    });
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
    await prisma.result.create({
      data: {
        score: faker.number.int({ min: 50, max: 100 }),
        studentId: `student${i}`,
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
      },
    });
  }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(),
        present: faker.datatype.boolean(),
        studentId: `student${i}`,
        lessonId: (i % 30) + 1,
      },
    });
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
