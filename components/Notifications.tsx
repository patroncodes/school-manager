import prisma from '@/lib/prisma'
import { UserRole } from '@/types';
import { Prisma } from '@prisma/client';
import moment from 'moment';

const Notifications = async ({ role, userId }: { role: UserRole; userId: string }) => {
    const sevenDaysAgo = moment().subtract(7, 'days').toDate();
    const query: Prisma.AnnouncementWhereInput = {}

    const roleConditions = {
        teacher: { lessons: { some: { teacherId: userId } } },
        student: { students: { some: { id: userId } } },
        parent: { students: { some: { parentId: userId } } },
    }

    query.OR = [
        { classId: null },
        { class: roleConditions[role as keyof typeof roleConditions] || {} },
    ]

    const announcements = await prisma.announcement.count({ where: { ...query, date: { gte: sevenDaysAgo } } })

    return (
        <div className="absolute -top-3 -right-3 w-5 h-5 flex-center bg-purple-500 text-white rounded-full text-xs">
            {announcements}
        </div>
    )
}

export default Notifications