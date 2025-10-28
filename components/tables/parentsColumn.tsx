import { UserRole } from "@/types";
import { Parent } from "@prisma/client";
import FormContainer from "../FormContainer";

type ParentsList = Parent & {
  ParentStudent: {
    student: {
      id: string;
      name: string;
      surname: string;
      class: {
        grade: {
          name: string;
        };
      };
    };
  }[];
};

export const parentsColumn = (role: UserRole) => [
  {
    accessor: "surname",
    header: "Info",
    className: "min-w-40",
    cell: (item: ParentsList) => (
      <div className="min-w-40 font-semibold">
        {item.name} {item.surname}
      </div>
    ),
  },
  {
    accessor: "students",
    header: "Children",
    className: "min-w-56",
    cell: (item: ParentsList) => (
      <div className="min-w-56">
        {item.ParentStudent.map(
          (p) => `${p.student.name} (${p.student.class.grade.name})`,
        ).join(",")}
      </div>
    ),
  },
  {
    accessor: "phone",
    header: "Phone",
    className: "min-w-40",
    cell: (item: ParentsList) => <span className="min-w-40">{item.phone}</span>,
  },
  {
    accessor: "email",
    header: "Email",
    cell: (item: ParentsList) => <span>{item.email}</span>,
  },
  {
    accessor: "address",
    header: "Address",
    className: "min-w-40",
    cell: (item: ParentsList) => (
      <span className="min-w-40">{item.address}</span>
    ),
  },
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
          cell: (item: ParentsList) => (
            <div>
              <div className="flex items-center gap-2">
                <FormContainer table="parent" type="update" data={item} />
                <FormContainer table="parent" type="delete" id={item.id} />
              </div>
            </div>
          ),
        },
      ]
    : []),
];
