import AttendanceMarker from "@/components/AttendanceMarker"
import FormContainer from "@/components/FormContainer"
import LessonDetails from "@/components/LessonDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/serverUtils"
import { SearchParams } from "@/types"
import {
    CalendarDays,
    Clock,
    GraduationCap,
    Users
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const LessonDetailsPage = async ({ params }: SearchParams) => {
    const { id } = await params;
    const { role, currentUserId } = await getCurrentUser()

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            subject: { select: { id: true, name: true } },
            class: {
                select: {
                    name: true,
                    students: { select: { id: true, name: true, surname: true } }
                }
            },
            teacher: { select: { id: true, name: true, surname: true } },
            attendances: { select: { present: true, studentId: true } },
            assignments: { select: { id: true, title: true, dueDate: true } }
        }
    })

    if (!lesson) {
        return notFound()
    }
    return (
        <div className="container mx-auto p-6 space-y-6 overflow-x-hidden">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex flex-col gap-6 w-full lg:w-[50%]">

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center w-full">
                                <CardTitle>{lesson.name}</CardTitle>

                                {
                                    (role === 'admin' || currentUserId === lesson.teacherId) && (
                                        <FormContainer table="lesson" type="update" data={lesson} />
                                    )
                                }
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {lesson?.day.slice(0, 3)}, {new Intl.DateTimeFormat("en-NG").format(lesson?.startTime)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {lesson?.startTime.toLocaleTimeString('en-NG', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })} - {lesson?.endTime.toLocaleTimeString('en-NG', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{lesson?.class.students.length} students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    <Link
                                        href={`/list/teachers/${lesson.teacher.id}`}
                                        className="text-sm">
                                        {lesson.teacher.name} {lesson.teacher.surname}
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <LessonDetails lesson={lesson} role={role!} userId={currentUserId!} />
                </div>

                <AttendanceMarker
                    data={{
                        lessonId: lesson.id,
                        userId: currentUserId!,
                        teacherId: lesson.teacherId,
                        role: role!
                    }}
                    students={lesson.class.students}
                    attendances={lesson.attendances}
                />
            </div>
        </div>
    )
}

export default LessonDetailsPage