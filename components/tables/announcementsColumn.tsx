import { UserRole } from "@/types";
import { Announcement } from "@prisma/client";
import FormContainer from "../FormContainer";
import MessageBoard from "@/components/MessageBoard";

type AnnouncementsList = Announcement & { class: { name: string } | null };

export const announcementsColumn = (role: UserRole) => [
  {
    accessor: "title",
    header: "Title",
    className: "min-w-40",
    cell: (item: AnnouncementsList) => (
      <span className="min-w-40">{item.title}</span>
    ),
  },
  {
    accessor: "description",
    header: "Description",
    className: "min-w-52",
    cell: (item: AnnouncementsList) => (
      <span className="min-w-52">{item.description}</span>
    ),
  },
  {
    accessor: "class",
    header: "Class",
    cell: (item: AnnouncementsList) => <span>{item.class?.name || "-"}</span>,
  },
  {
    accessor: "date",
    header: "Date",
    cell: (item: AnnouncementsList) => (
      <span>{new Intl.DateTimeFormat("en-CA").format(item.createdAt)}</span>
    ),
  },
  {
    header: "Actions",
    accessor: "action",
    cell: (item: AnnouncementsList) => {
      const isPast = new Date(item.createdAt).getTime() < Date.now();

      return (
        <div className="flex items-center gap-2">
          <MessageBoard
            type="announcement"
            title={item.title}
            description={item.description}
            date={new Intl.DateTimeFormat("en-NG").format(item.createdAt)}
          />

          <div className={role === "admin" ? "flex gap-2" : "hidden"}>
            {!isPast && (
              <FormContainer table="announcement" type="update" data={item} />
            )}

            <FormContainer table="announcement" type="delete" id={item.id} />
          </div>
        </div>
      );
    },
  },
];
