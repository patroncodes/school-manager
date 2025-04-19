import { adjustScheduleToCurrentWeek } from '@/lib/utils';
import BigCalendar from './BigCalendar'
import prisma from "@/lib/prisma"

const BigCalendarContainer = async ({ type, id }: { type: "teacherId" | "classId"; id: string | number }) => {
    const resData = await prisma.lesson.findMany({
        where: {
            ...(type === 'teacherId'
                ? { teacherId: id as string }
                : { classId: id as number })
        }
    })

    const data = resData.map(lesson => (
        {
            title: lesson.name,
            start: lesson.startTime,
            end: lesson.endTime
        }))

    const adjustedData = adjustScheduleToCurrentWeek(data)

    return (
        <BigCalendar data={adjustedData} />
    )
}

export default BigCalendarContainer