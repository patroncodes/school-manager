import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import EventList from "@/components/EventList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  createServerClient,
  getCurrentUser,
  getSchool,
} from "@/lib/serverUtils";
import { SearchParams } from "@/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormModal from "@/components/FormModal";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DeleteModal from "@/components/DeleteModal";
import DropdownOptions from "@/components/DropdownOptions";
import {
  GetClassQuery,
  GetClassQueryVariables,
} from "@/lib/generated/graphql/server";
import { gql } from "@urql/core";
import { DataTable } from "@/components/tables/data-table";
import { classStudentsColumn } from "@/components/tables/classStudentsColumn";
import TimetableBoard from "@/components/TimetableBoard";

const GET_CLASS = gql`
  query GetClass($id: ID!) {
    class(id: $id) {
      id
      name
      capacity
      studentCount
      grade {
        id
        name
        program {
          id
        }
      }
      supervisors {
        id
        name
        surname
        img
      }
      students {
        id
        name
        surname
        sex
        registrationNumber
        img
        activeState
      }
    }
  }
`;

const ClassInfoPage = async ({ params }: SearchParams) => {
  const { id } = await params;
  const { schoolId, accessLevel } = await getCurrentUser();

  const school = await getSchool(schoolId ?? "");

  const { client } = await createServerClient();
  const { data } = await client.query<GetClassQuery, GetClassQueryVariables>(
    GET_CLASS,
    { id },
  );

  if (!data || !data.class) redirect("/list/classes");

  const { supervisors, ...classDetails } = data.class;

  const formattedData = {
    ...classDetails,
    gradeId: classDetails.grade?.id,
    supervisorId: supervisors[0]?.id,
    supervisor: supervisors[0],
    students: classDetails.students,
  };

  const cards = [
    {
      label: "Class",
      value: formattedData.name,
    },
    {
      label: "Grade",
      value: formattedData?.grade?.name,
    },
    {
      label: "Active Students",
      value: formattedData.studentCount,
    },
    { label: "Class Capacity", value: formattedData.capacity },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex w-full flex-col gap-8 lg:w-2/3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Class Information</CardTitle>

              {["manager", "administration"].includes(accessLevel!) && (
                <DropdownOptions>
                  <DropdownMenuItem asChild>
                    <FormModal
                      table="class"
                      type="update"
                      data={formattedData}
                      triggerTitle="Update"
                    />
                  </DropdownMenuItem>

                  <DropdownMenuItem>Deactivate</DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="text-destructive" asChild>
                    <DeleteModal id={classDetails.id!} table="class">
                      <span className="pl-2.5 text-sm text-destructive">
                        Delete
                      </span>
                    </DeleteModal>
                  </DropdownMenuItem>
                </DropdownOptions>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {cards.map((card, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span>{card.label} :</span>
                  <span>{card.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Supervisor</CardTitle>

              {["manager", "administration"].includes(accessLevel!) && (
                <DropdownOptions>
                  {formattedData?.supervisor ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/list/staffs/${formattedData.supervisor.id}`}
                        >
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Unassign</DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem>Assign</DropdownMenuItem>
                  )}
                </DropdownOptions>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {formattedData.supervisor ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={formattedData.supervisor?.img || "/placeholder.svg"}
                      alt="supervisor"
                    />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <Link
                    href={`/list/staffs/${formattedData?.supervisor?.id}`}
                    className="font-semibold"
                  >
                    {formattedData.supervisor?.name}
                  </Link>
                </div>
              ) : (
                <p>No supervisor has been assigned yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <DataTable
                columns={classStudentsColumn}
                data={formattedData?.students ?? []}
                accessLevel={accessLevel!}
                tableFor="student"
                relatedData={{
                  schoolSlug: school?.slug,
                  programId: formattedData.grade?.program?.id,
                  gradeId: formattedData.grade?.id,
                  classId: formattedData.id,
                }}
              />
            </CardContent>
          </Card>
        </div>

        <TimetableBoard classId={formattedData.id} />

        <div className="h-[450px] w-full">
          <AttendanceChartContainer
            classId={formattedData.id!}
            schoolId={schoolId!}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-8 lg:w-1/3">
        <Announcements classId={formattedData.id!} schoolId={schoolId!} />

        <div className="rounded-md bg-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="my-4 text-xl font-semibold">Upcoming Events</h1>
            <Link href="/list/events" className="text-xs text-gray-400">
              {" "}
              View All
            </Link>
          </div>

          <EventList
            gradeId={classDetails?.grade?.id ?? ""}
            schoolId={schoolId!}
          />

          {/*<FeeSummary*/}
          {/*  schoolId={schoolId}*/}
          {/*  termId={1}*/}
          {/*  gradeId={classDetails.grade.id}*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
};

export default ClassInfoPage;
