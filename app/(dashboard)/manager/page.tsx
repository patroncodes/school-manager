import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChartContainer from "@/components/FinanceChartContainer";
import UserCard from "@/components/UserCard";
import { getCurrentUser } from "@/lib/serverUtils";
import { SearchParams } from "@/types";

const AdminPage = async ({ searchParams }: SearchParams) => {
  const { date } = await searchParams;
  const { accessLevel, currentUserId, schoolId } = await getCurrentUser();

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* LEFT */}
      <div className="flex w-full flex-col gap-8 lg:w-2/3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UserCard type="non-academic" schoolId={schoolId!} />
          <UserCard type="student" schoolId={schoolId!} />
          <UserCard type="teacher" schoolId={schoolId!} />
          <UserCard type="parent" schoolId={schoolId!} />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="h-[450px] w-full lg:w-1/3">
            <CountChartContainer schoolId={schoolId!} />
          </div>

          <div className="h-[450px] w-full lg:w-2/3">
            <AttendanceChartContainer schoolId={schoolId!} />
          </div>
        </div>

        <div className="h-[500px] w-full">
          <FinanceChartContainer schoolId={schoolId!} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full flex-col gap-8 lg:w-1/3">
        <EventCalendarContainer dateParam={date} schoolId={schoolId!} />
        <Announcements
          accessLevel={accessLevel!}
          userId={currentUserId!}
          schoolId={schoolId!}
        />
      </div>
    </div>
  );
};

export default AdminPage;
