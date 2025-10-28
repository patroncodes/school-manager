import Link from "next/link";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";

const EventCalendarContainer = async ({
  ...params
}: {
  dateParam: string;
  schoolId: string;
}) => {
  return (
    <div className="rounded-md bg-white p-4">
      <EventCalendar />

      <div className="flex items-center justify-between">
        <h1 className="my-4 text-xl font-semibold">Events</h1>
        <Link href="/list/events" className="text-xs text-gray-400">
          {" "}
          View All
        </Link>
      </div>

      <EventList {...params} />
    </div>
  );
};

export default EventCalendarContainer;
