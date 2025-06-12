import prisma from "@/lib/prisma";
import { UserRole } from "@/types";
import Image from "next/image";
import { Suspense } from "react";
import Notifications from "./Notifications";
import { Skeleton } from "./ui/skeleton";

const Navbar = async ({ role, userId }: { role: UserRole, userId: string }) => {

  const user = await prisma[role].findUnique({
    where: {
      id: userId
    },
    select: {
      name: true,
      surname: true,
    }
  })

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

      <div className="flex items-center gap-6 justify-end w-full">
        <div className="navbar-user_icons">
          <Image src="/message.svg" alt="message" width={20} height={20} />
        </div>
        <div className="navbar-user_icons relative">
          <Image src="/announcement.svg" alt="message" width={20} height={20} />
          <Suspense fallback={<Skeleton className="w-10 h-10 rounded-full" />}>
            <Notifications role={role} userId={userId} />
          </Suspense>
        </div>

        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">
            {user?.name} {user?.surname}
          </span>
          <span className="text-[10px] text-gray-500 text-right capitalize">{role}</span>
        </div>

        <div className="w-9 h-9 p-0.5 rounded-full flex-center bg-lamaPurple">{user?.name[0]}{user?.surname[0]}</div>
      </div>
    </div>
  );
};

export default Navbar;