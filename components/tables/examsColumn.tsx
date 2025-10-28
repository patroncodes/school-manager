import { UserRole } from "@/types";
import { Class, Exam, Subject, Staff } from "@prisma/client";
import FormContainer from "../FormContainer";

type ExamsList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Staff;
  };
};

export const examsColumn = (role: UserRole) => [
  {
    accessor: "subject",
    header: "Subject",
    cell: (item: ExamsList) => <span>{item.lesson.subject.name}</span>,
  },
  {
    accessor: "class",
    header: "Class",
    cell: (item: ExamsList) => <span>{item.lesson.class.arm}</span>,
  },
  {
    accessor: "teacher",
    header: "Teacher",
    cell: (item: ExamsList) => (
      <span>
        {item.lesson.teacher.name + " " + item.lesson.teacher.surname}
      </span>
    ),
  },
  {
    accessor: "date",
    header: "Date",
    cell: (item: ExamsList) => (
      <span>{new Intl.DateTimeFormat("en-NG").format(item.startTime)}</span>
    ),
  },
  ...(role === "admin" || role === "teacher"
    ? [
        {
          header: "Actions",
          accessor: "action",
          cell: (item: ExamsList) => (
            <div>
              <div className="flex items-center gap-2">
                <FormContainer table="exam" type="update" data={item} />
                <FormContainer table="exam" type="delete" id={item.id} />
              </div>
            </div>
          ),
        },
      ]
    : []),
];
