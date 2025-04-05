import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { ModalProvider } from "@/context/ModalContext";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  const role = user?.publicMetadata.role as string

  return (
    <ModalProvider>
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
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] flex flex-col ">
          <Navbar role={role} />

          {children}
        </div>
      </div>
    </ModalProvider>
  );
}
