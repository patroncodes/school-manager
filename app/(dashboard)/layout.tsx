import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/serverUtils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { role, currentUserId } = await getCurrentUser()

  if (!role || !currentUserId) redirect('/')

  return (
    <div className="flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]">
        <div className="fixed left-0 h-screen overflow-scroll">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2 p-4"
          >
            <Image src="/logo.svg" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">School Lama</span>
          </Link>

          <Menu role={role} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] flex flex-col overflow-x-hidden">
        <Navbar role={role} userId={currentUserId} />

        {children}
      </div>
    </div>
  );
}
