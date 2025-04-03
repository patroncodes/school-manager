import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import PerformanceChart from "@/components/PerformanceChart";
import { InfoCard, SmallCard } from "@/components/Card";
import Link from "next/link";

const cards = [
  {
    value: "90%",
    desc: "Attendance",
    img: "/singleAttendance.svg",
  },
  {
    value: "6th",
    desc: "Grade",
    img: "/singleBranch.svg",
  },
  {
    value: "10",
    desc: "Lessons",
    img: "/singleLesson.svg",
  },
  {
    value: "6A",
    desc: "Class",
    img: "/singleClass.svg",
  },
];

const data = {
  id: 1,
  username: "cameronsunders",
  email: "cameronsunders@gmail.com",
  password: "password",
  firstName: "Cameron",
  lastName: "Sunder",
  phone: "+1 234 098 765",
  address: "1234 Main St, Summerville, USA",
  bloodType: "O-",
  birthday: "2014-01-01",
  sex: "female",
  img: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

const SingleStudentPage = () => {
  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          <InfoCard
            table="student"
            description=" Perferendis excepturi quaerat laborum sit nobis laudantium unde."
            data={data}
          />
          <SmallCard cards={cards} />
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h2 className="text-lg font-semibold">Student&apos;s Schedule</h2>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h2 className="text-lg font-semibold">Shortcuts</h2>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/lessons?classId=${2}`}>
              Student&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-lamaPurpleLight" href={`/list/teachers?classId=${2}`}>
              Student&apos;s Teachers
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?classId=${2}`}>
              Student&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/assignments?classId=${2}`}>
              Student&apos;s Assignments
            </Link>
            <Link className="p-3 rounded-md bg-lamaYellowLight" href={`/list/results?studentId=${"student50"}`}>
              Student&apos;s Results
            </Link>
          </div>
        </div>

        <PerformanceChart />

        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
