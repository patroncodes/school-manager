import prisma from "@/lib/prisma";
import { UserRole } from "@/types";
import Image from "next/image";
import SignOutButton from "./SignOutButton";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { Skeleton } from "./ui/skeleton";

const Navbar = async ({ role, userId }: { role: UserRole, userId: string }) => {
  const sevenDaysAgo = moment().subtract(7, 'days').toDate();
  const query: Prisma.AnnouncementWhereInput = {}

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId } } },
    student: { students: { some: { id: userId } } },
    parent: { students: { some: { parentId: userId } } },
  }

  query.OR = [
    { classId: null },
    { class: roleConditions[role as keyof typeof roleConditions] || {} },
  ]

  const [user, announcements] = await prisma.$transaction([
    prisma[role].findUnique({
      where: {
        id: userId
      },
      select: {
        sex: true,
        surname: true,
        img: true
      }
    }),

    prisma.announcement.count({ where: { ...query, date: { gte: sevenDaysAgo } } })
  ])

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.svg" alt="Search" width={14} height={14} />
        <input
          type="text"
          id="search"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="navbar-user_icons">
          <Image src="/message.svg" alt="message" width={20} height={20} />
        </div>
        <div className="navbar-user_icons relative">
          <Image src="/announcement.svg" alt="message" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex-center bg-purple-500 text-white rounded-full text-xs">
            {announcements}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">
            {user?.sex === 'MALE' ? 'Mr' : 'Mrs'} {user?.surname}
          </span>
          <span className="text-[10px] text-gray-500 text-right capitalize">{role}</span>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
};

export default Navbar;

export const NavbarSkeleton = () => (
  <div className="flex items-center justify-between p-4">
    <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.svg" alt="Search" width={14} height={14} />
      <input
        type="text"
        id="search"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>

    <div className="flex items-center gap-6 justify-end w-full">
      <Skeleton className="w-10 h-10 rounded-full" />
      <Skeleton className="w-10 h-10 rounded-full" />

      <div className="flex flex-col">
        <Skeleton className="h-10 w-20 rounded-xs" />
        <Skeleton className="h-10 w-10 rounded-xs" />
      </div>

      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
  </div>
)