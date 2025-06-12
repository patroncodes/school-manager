import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { FormContainerProps } from "@/types";
import FormModal from "./FormModal";

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
    let relatedData = {};

    const { role, currentUserId } = await getCurrentUser()

    if (type !== "delete") {
        switch (table) {
            case "subject":
                const subjectTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });
                relatedData = { teachers: subjectTeachers };
                break;
            case "class":
                const classGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });
                const classTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true },
                });
                relatedData = { teachers: classTeachers, grades: classGrades };
                break;
            case "teacher":
                const teacherSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { subjects: teacherSubjects };
                break;
            case "student":
                const studentGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });
                const studentClasses = await prisma.class.findMany({
                    select: { id: true, name: true, capacity: true, _count: { select: { students: true } } },
                });
                relatedData = { classes: studentClasses, grades: studentGrades };
                break;
            case "exam":
                const examLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
                    },
                    select: { id: true, name: true },
                });
                relatedData = { lessons: examLessons };
                break;
            case "assignment":
                const assignmentLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
                    },
                    select: { id: true, name: true },
                });
                relatedData = { lessons: assignmentLessons };
                break;
            case "lesson":
                const lessonSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true }
                })
                const lessonClasses = await prisma.class.findMany({
                    select: { id: true, name: true }
                })
                const lessonTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true, surname: true }
                })
                relatedData = { subjects: lessonSubjects, classes: lessonClasses, teachers: lessonTeachers }
                break;
            case "result":
                const resultExams = await prisma.exam.findMany({
                    where: {
                        ...(role === "teacher" ? { lesson: { teacherId: currentUserId! } } : {}),
                    },
                    select: { id: true, title: true, lessonId: true }
                })
                const resultAssignments = await prisma.assignment.findMany({
                    where: {
                        ...(role === 'teacher' ? { lesson: { teacherId: currentUserId! } } : {})
                    },
                    select: { id: true, title: true, lessonId: true }
                })
                relatedData = { exams: resultExams, assignments: resultAssignments };
                break;
            case "event":
                const eventClasses = await prisma.class.findMany({
                    select: { id: true, name: true }
                })
                relatedData = { classes: eventClasses }
                break;
            case "announcement":
                const announcementClasses = await prisma.class.findMany({
                    select: { id: true, name: true }
                })
                relatedData = { classes: announcementClasses }
                break;
            default:
                break;
        }
    }

    return (
        <div className="">
            <FormModal
                table={table}
                type={type}
                data={data}
                id={id}
                relatedData={relatedData}
            />
        </div>
    );
};

export default FormContainer;