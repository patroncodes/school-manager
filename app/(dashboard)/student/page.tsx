import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import { prismaForSchool } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { SearchParams } from "@/types";

const StudentPage = async ({ searchParams }: SearchParams) => {
  const { date } = await searchParams;
  const { role, currentUserId, schoolId } = await getCurrentUser();

  const prisma = prismaForSchool(schoolId);

  const className = await prisma.class.findMany({
    where: {
      students: { some: { id: currentUserId! } },
    },
  });

  return (
    <div className="flex flex-col gap-4 p-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full rounded-md bg-white p-4">
          <h1 className="text-xl font-semibold">Schedule {className[0].arm}</h1>
          <BigCalendarContainer
            type="classId"
            id={className[0].id}
            schoolId={schoolId}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 xl:w-1/3">
        <EventCalendarContainer dateParam={date} schoolId={schoolId} />
        <Announcements
          userId={currentUserId!}
          role={role!}
          schoolId={schoolId}
        />
      </div>
    </div>
  );
};

export default StudentPage;
