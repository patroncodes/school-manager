import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getCurrentUser, getSchool } from "@/lib/serverUtils";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const { schoolId } = await getCurrentUser();
  const school = await getSchool(schoolId || "");

  if (!school)
    return {
      title: "Schoolkit",
      description: "Manage your school efficiently with advanced analytics",
    };

  return {
    title: school.name,
    description: school.motto,
    icons: school.logo
      ? [{ url: school.logo, rel: "icon" }]
      : [{ url: "/logo.svg", rel: "icon" }],
    openGraph: {
      title: school.name,
      description: school.motto || "",
      images: school.logo ? [school.logo] : [],
    },
    twitter: {
      card: "summary",
      title: school.name,
      description: school.motto || "",
      images: school.logo ? [school.logo] : [],
    },
  };
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { accessLevel, currentUserId, schoolId } = await getCurrentUser();
  if (!accessLevel || !currentUserId) redirect("/sign-in");

  const school = await getSchool(schoolId!);
  if (!school) notFound();

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <main className="flex w-full">
        <Menu accessLevel={accessLevel} school={school} />

        <div className="flex w-full flex-col overflow-x-hidden bg-[#F7F8FA]">
          <Navbar
            accessLevel={accessLevel}
            userId={currentUserId}
            school={school}
          />

          <div className="flex-1 p-4">{children}</div>
          {/*<TermProvider currentTerm={currentTerm}>*/}
          {/*</TermProvider>*/}
        </div>
      </main>
    </SidebarProvider>
  );
}
