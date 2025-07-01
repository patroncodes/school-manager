import { adjustScheduleToCurrentWeek } from '@/lib/utils';
import prisma from "@/lib/prisma"
import dynamic from 'next/dynamic';

const BigCalendar = dynamic(() => import('./BigCalendar'), {
    loading: () => <h1>Loading...</h1>,
});

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