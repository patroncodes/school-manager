import ProfileOverview from "@/components/profile-sections/ProfileOverview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { prismaForSchool } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import dynamic from "next/dynamic";

const AdminProfile = dynamic(
  () => import("@/components/profile-sections/AdminProfile"),
  {
    loading: () => <h1>Loading...</h1>,
  },
);
const TeacherProfile = dynamic(
  () => import("@/components/profile-sections/TeacherProfile"),
  {
    loading: () => <h1>Loading...</h1>,
  },
);
const StudentProfile = dynamic(
  () => import("@/components/profile-sections/StudentProfile"),
  {
    loading: () => <h1>Loading...</h1>,
  },
);
const ParentProfile = dynamic(
  () => import("@/components/profile-sections/ParentProfile"),
  {
    loading: () => <h1>Loading...</h1>,
  },
);

const AccountPage = async () => {
  const { role, currentUserId, schoolId } = await getCurrentUser();

  const prisma = prismaForSchool(schoolId);

  let query = {};

  switch (role) {
    case "teacher":
      query = {
        id: true,
        username: true,
        name: true,
        surname: true,
        address: true,
        email: true,
        phone: true,
        img: true,
        createdAt: true,
        subjects: {
          select: {
            name: true,
          },
        },
        classes: {
          select: {
            name: true,
          },
        },
      };
      break;

    case "student":
      query = {
        id: true,
        username: true,
        name: true,
        surname: true,
        address: true,
        email: true,
        phone: true,
        img: true,
        createdAt: true,
        classId: true,
        class: {
          select: {
            name: true,
          },
        },
        parent: {
          select: {
            name: true,
            surname: true,
            phone: true,
            email: true,
          },
        },
        attendances: {
          select: {
            date: true,
            present: true,
            lesson: {
              select: {
                name: true,
                subject: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            date: "desc",
          },
          take: 5,
        },
        results: {
          select: {
            score: true,
            exam: {
              select: {
                title: true,
                startTime: true,
              },
            },
            assignment: {
              select: {
                title: true,
                dueDate: true,
              },
            },
          },
          orderBy: [
            { exam: { startTime: "desc" } },
            { assignment: { dueDate: "desc" } },
          ],
          take: 5,
        },
      };
      break;

    case "parent":
      query = {
        id: true,
        username: true,
        name: true,
        surname: true,
        address: true,
        email: true,
        phone: true,
        createdAt: true,
        students: {
          select: {
            id: true,
            name: true,
            surname: true,
            class: {
              select: {
                name: true,
              },
            },
            attendances: {
              select: {
                date: true,
                present: true,
                lesson: {
                  select: {
                    name: true,
                    subject: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                date: "desc",
              },
              take: 5,
            },
            results: {
              select: {
                score: true,
                exam: {
                  select: {
                    title: true,
                  },
                },
                assignment: {
                  select: {
                    title: true,
                  },
                },
              },
              take: 5,
            },
          },
        },
      };
      break;

    case "admin":
      query = {
        id: true,
        username: true,
        name: true,
        surname: true,
        role: true,
      };
      break;

    default:
      break;
  }

  const user: any = await prisma[role!].findUnique({
    where: { id: currentUserId! },
    select: query,
  });

  const renderRoleSpecificContent = () => {
    switch (role) {
      case "student":
        return <StudentProfile {...user} />;
      case "parent":
        return <ParentProfile students={user.students} />;
      case "teacher":
        return (
          <TeacherProfile subjects={user?.subjects} classes={user?.classes} />
        );
      case "admin":
        return <AdminProfile {...user} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex w-full flex-col gap-6 lg:flex-row lg:justify-between">
        <Card className="w-full lg:w-[60%]">
          <CardContent className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.img} alt="profile-img" />
                <AvatarFallback className="text-lg">
                  {user?.name[0]}
                  {user?.surname[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="line-clamp-1 text-xl">
                {user?.name} {user.surname}
              </CardTitle>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Joined {new Date(user?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <ProfileOverview role={role!} data={user} />
      </div>
      {renderRoleSpecificContent()}
    </div>
  );
};

export default AccountPage;
