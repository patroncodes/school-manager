import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import PerformanceChart from "@/components/PerformanceChart";
import { InfoCard, SmallCard } from "@/components/Card";
import Link from "next/link";

const smallCards = [
  {
    value: "90%",
    desc: "Attendance",
    img: "/singleAttendance.svg",
  },
  {
    value: "2",
    desc: "Branches",
    img: "/singleBranch.svg",
  },
  {
    value: "4%",
    desc: "Lessons",
    img: "/singleLesson.svg",
  },
  {
    value: "6%",
    desc: "Classes",
    img: "/singleClass.svg",
  },
];

const data = {
  id: 1,
  username: "deanguerrero",
  email: "deanguerrero@gmail.com",
  password: "password",
  firstName: "Dean",
  lastName: "Guerrero",
  phone: "+1 234 567 890",
  address: "1234 Main St, Anytown, USA",
  bloodType: "A+",
  birthday: "2000-01-01",
  sex: "male",
  img: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

const SingleTeacherPage = () => {
  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          <InfoCard
            table="teacher"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            data={data}
          />
          <SmallCard cards={smallCards} />
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h2 className="text-lg font-semibold">Teacher&apos;s Schedule</h2>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h2 className="text-lg font-semibold">Shortcuts</h2>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/classes?supervisorId=${'teacher12'}`}>
              Teacher&apos;s Classes
            </Link>
            <Link className="p-3 rounded-md bg-lamaPurpleLight" href={`/list/students?teacherId=${'teacher2'}`}>
              Teacher&apos;s Students
            </Link>
            <Link className="p-3 rounded-md bg-lamaYellowLight" href={`/list/lessons?teacherId=${'teacher12'}`}>
              Teacher&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?teacherId=${'teacher12'}`}>
              Teacher&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/assignments?teacherId=${'teacher12'}`}>
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>

        <PerformanceChart />

        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
