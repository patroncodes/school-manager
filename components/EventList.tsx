import prisma from "@/lib/prisma";
import { endOfDay, format, startOfDay } from "date-fns";

interface EventListProps {
  dateParam?: string;
  schoolId: string;
  gradeId?: string;
  classId?: string;
}

const EventList = async ({
  dateParam,
  schoolId,
  gradeId,
  classId,
}: EventListProps) => {
  const targetDate = dateParam
    ? new Date(`${dateParam}T08:12:00Z`)
    : new Date();

  const start = startOfDay(targetDate);
  const end = endOfDay(targetDate);

  const data = await prisma.event.findMany({
    where: {
      schoolId,
      startTime: {
        gte: start,
        lte: end,
      },
      ...(gradeId && { gradeId }),
      ...(classId && { classId }),
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {data.map((event) => (
        <div
          key={event.id}
          className="rounded-md border-2 border-t-4 border-gray-100 p-5 odd:border-t-lamaSky even:border-t-lamaPurple"
        >
          <div className="flex items-center justify-between">
            <h3 className="line-clamp-1 w-[60%] font-semibold text-gray-900">
              {event.title}
            </h3>
            <span className="text-xs text-gray-600">
              {format(event.startTime, "h:mmA")} -{" "}
              {format(event.endTime, "h:mmA")}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-700">{event.description}</p>
        </div>
      ))}

      {data.length === 0 && (
        <div className="flex-center h-16 text-sm font-light text-gray-600">
          No events found
        </div>
      )}
    </div>
  );
};

export default EventList;
