import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import { getCurrentUser } from "@/lib/serverUtils";
import { SearchParams } from "@/types";

const TeacherPage = async ({ searchParams }: SearchParams) => {
  const { date } = await searchParams;
  const { role, currentUserId, schoolId } = await getCurrentUser();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full rounded-md bg-white p-4">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendarContainer
            type="teacherId"
            id={currentUserId!}
            schoolId={schoolId}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 xl:w-1/3">
        <EventCalendarContainer dateParam={date} schoolId={schoolId} />
        <Announcements
          role={role!}
          userId={currentUserId!}
          schoolId={schoolId}
        />
      </div>
    </div>
  );
};

export default TeacherPage;
