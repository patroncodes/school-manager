import Link from 'next/link'
import EventCalendar from './EventCalendar'
import EventList from './EventList'

const EventCalendarContainer = async ({ dateParam }: { dateParam: string }) => {
    return (
        <div className="bg-white p-4 rounded-md">
            <EventCalendar />

            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold my-4">Events</h1>
                <Link href='/list/events' className="text-xs text-gray-400"> View All</Link>
            </div>

            <EventList dateParam={dateParam} />
        </div>
    )
}

export default EventCalendarContainer