import { SearchParams } from "@/types";
import { getCurrentUser } from "@/lib/serverUtils";
import prisma from "@/lib/prisma";
import { SmallCard } from "@/components/Card";
import { classStudentsColumn } from "@/components/tables/classStudentsColumn";
import Link from "next/link";
import EventList from "@/components/EventList";
import { redirect } from "next/navigation";
import DeleteModal from "@/components/DeleteModal";
import DropdownOptions from "@/components/DropdownOptions";
import FormModal from "@/components/FormModal";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/tables/data-table";
import Announcements from "@/components/Announcements";
import React from "react";

const ClassInfoPage = async ({ params }: SearchParams) => {
  const { id } = await params;
  const { accessLevel, schoolId } = await getCurrentUser();

  const grade = await prisma.grade.findUnique({
    where: { id, schoolId },
    select: {
      id: true,
      name: true,
      classes: {
        select: {
          id: true,
          name: true,
          formTeacher: {
            select: {
              id: true,
              name: true,
              surname: true,
              img: true,
            },
          },
          classTeacher: {
            select: {
              id: true,
              name: true,
              surname: true,
              img: true,
            },
          },
          students: {
            select: {
              id: true,
              name: true,
              surname: true,
              img: true,
              sex: true,
              registrationNumber: true,
            },
          },
        },
      },
    },
  });

  if (!grade) redirect("/list/grades");

  const genders = grade.classes
    .flatMap((doc) => doc.students)
    .map((doc) => doc.sex);

  const boys = genders.filter((b) => b === "MALE").length;
  const girls = genders.filter((g) => g === "FEMALE").length;

  const cards = [
    {
      value: `${genders.length}`,
      desc: "Enrolled",
      img: "/singleAttendance.svg",
    },
    {
      value: `${boys}`,
      desc: `${20 > 1 ? "Boy" : "Boys"}`,
      img: "/boy.svg",
    },
    {
      value: `${girls}`,
      desc: `${20 < 1 ? "Girl" : "Girls"}`,
      img: "/girl.svg",
    },
  ];

  const gradeStudents = grade.classes.flatMap((doc) => {
    return doc.students.map((student) => ({
      className: doc.name,
      classId: doc.id,
      student: {
        ...student,
        name: `${student.name} ${student.surname}`,
      },
    }));
  });

  //  supervisor: {
  //       id: doc?.formTeacher?.id || doc?.classTeacher?.id,
  //       img: doc?.formTeacher?.img || doc?.classTeacher?.img,
  //       name: doc?.formTeacher?.name
  //         ? `${doc.formTeacher.name} ${doc.formTeacher.surname}`
  //         : doc?.classTeacher?.name
  //           ? `${doc.classTeacher.name} ${doc.classTeacher.surname}`
  //           : "-",
  //     },

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">{grade.name}</h1>

        <div className="flex items-center gap-3">
          <DropdownOptions>
            <div className="flex w-full cursor-pointer items-center">
              <FormModal table="grade" type="update" data={grade} />
              <span className="px-2 py-1 text-sm font-medium">Update</span>
            </div>

            <DropdownMenuItem>Deactivate</DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <DeleteModal id={grade.id} table="grade">
                <span className="pl-2.5 text-sm text-destructive">Delete</span>
              </DeleteModal>
            </DropdownMenuItem>
          </DropdownOptions>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full space-y-6 xl:w-[60%]">
          <SmallCard cards={cards} />

          {/*  Class Members*/}
          <div className="flex-1 space-y-5">
            <h3 className="my-4 text-xl font-semibold">Students</h3>

            <div className="w-full flex-1">
              <DataTable
                columns={classStudentsColumn}
                data={gradeStudents}
                accessLevel={accessLevel!}
                tableFor="student"
                filters={{ listCreation: false, selectCount: false }}
              />
            </div>
          </div>
        </div>

        <div className="w-full space-y-6 xl:w-[40%]">
          {/*<FeeSummary schoolId={schoolId} termId={"1"} gradeId={grade.id} />*/}

          {/*<Announcements classId={grade.id} schoolId={schoolId} />*/}

          <div className="rounded-md bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="my-4 text-xl font-semibold">Upcoming Events</h3>
              <Link href="/list/events" className="text-xs text-gray-400">
                {" "}
                View All
              </Link>
            </div>

            <EventList gradeId={grade.id} schoolId={schoolId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassInfoPage;
