import prisma from '@/lib/prisma';
import { formatTimeRange } from '@/lib/utils';

const EventList = async ({ dateParam }: { dateParam: string }) => {
    const date = dateParam ? new Date(dateParam) : new Date()

    const data = await prisma.event.findMany({
        where: {
            startTime: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lte: new Date(date.setHours(23, 59, 59, 999))
            }
        }
    })
    return (
        <div className="flex flex-col gap-4">
            {data.map((event) => (
                <div
                    key={event.id}
                    className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <span className="text-gray-600 text-xs">{formatTimeRange(event.startTime, event.endTime)}</span>
                    </div>
                    <p className="mt-2 text-gray-700 text-sm">{event.description}</p>
                </div>
            ))}
        </div>
    )
}

export default EventList