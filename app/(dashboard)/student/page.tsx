import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { SearchParams } from "@/types";

const StudentPage = async ({ searchParams }: SearchParams) => {
  const { date } = await searchParams
  const { role, currentUserId } = await getCurrentUser()

  const className = await prisma.class.findMany({
    where: {
      students: { some: { id: currentUserId! } }
    }
  })

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <BigCalendarContainer type="classId" id={className[0].id} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer dateParam={date} />
        <Announcements userId={currentUserId!} role={role!} />
      </div>
    </div>
  );
};

export default StudentPage;
