"use client";

import { useModalContext } from "@/context/ModalContext";
import { FormModalProps } from "@/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useUser } from "@clerk/nextjs";

// This approach is used if you want to make your client components dynamic || lazing loading. This will help with optimization
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("./forms/LessonForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => React.JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  parent: (type, data) => <ParentForm type={type} data={data} />,
  class: (type, data) => <ClassForm type={type} data={data} />,
  subject: (type, data) => <SubjectForm type={type} data={data} />,
  lesson: (type, data) => <LessonForm type={type} data={data} />,
  exam: (type, data) => <ExamForm type={type} data={data} />,
  assignment: (type, data) => <AssignmentForm type={type} data={data} />,
  result: (type, data) => <ResultForm type={type} data={data} />,
};

const FormModal = ({ table, type, data, id }: FormModalProps) => {
  const { modalToOpen, setModalToOpen } = useModalContext()
  const { user } = useUser()
  const isAdmin = (user?.publicMetadata.role as string) === "admin"

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
        ? "bg-lamaSky"
        : "bg-lamaPurple";

  const Form = () => {
    return modalToOpen?.type === "delete" ? (
      <div className="flex flex-col gap-4">
        <AlertDialogHeader>
          <AlertDialogTitle className="capitalize text-center font-semibold text-xl text-gray-700">
            {type} {table}
          </AlertDialogTitle>

          <AlertDialogDescription className="font-medium">
            All data will be removed permanently. Are you sure you want to delete this {table}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </div>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
    ) : (
      "Form Not Found"
    );
  };

  return (
    <>
      {isAdmin && (
        <button
          className="cursor-pointer"
          onClick={() => setModalToOpen({
            type: type as typeof type,
            id: id?.toString()
          })}
        >
          <div className={`${size} flex-center rounded-full ${bgColor}`}>
            <Image src={`/${type}.svg`} alt={type} width={16} height={16} />
          </div>
        </button>
      )}

      {!!modalToOpen && (modalToOpen.id === id) && (
        <AlertDialog
          open={!!modalToOpen?.type}
          onOpenChange={() => {
            if (modalToOpen.type === type) {
              setModalToOpen(null)
            } else {
              setModalToOpen({ type, id })
            }
          }}>
          <AlertDialogContent>
            <AlertDialogTitle className="hidden">Subject Information</AlertDialogTitle>
            <Form />
          </AlertDialogContent>
        </AlertDialog>

      )}
    </>
  );
};

export default FormModal;