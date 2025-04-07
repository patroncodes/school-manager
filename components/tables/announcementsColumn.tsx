import { Announcement } from "@prisma/client"
import FormModal from "../FormModal"
import { UserRole } from "@/types"

type AnnouncementsList = Announcement & { class: { name: string } | null }

export const announcementsColumn = (role: UserRole) => [
    {
        accessor: "title",
        header: "Title",
        cell: (item: AnnouncementsList) => <span>{item.title}</span>
    },
    {
        accessor: "description",
        header: "Description",
        cell: (item: AnnouncementsList) => <span>{item.description}</span>
    },
    {
        accessor: 'class',
        header: "Class",
        cell: (item: AnnouncementsList) => <span>{item.class?.name || "-"}</span>
    },
    {
        accessor: "date",
        header: "Date",
        cell: (item: AnnouncementsList) => <span>{new Intl.DateTimeFormat("en-NG").format(item.date)}</span>
    },
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: AnnouncementsList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <FormModal table="announcement" type="update" data={item} />
                            <FormModal table="announcement" type="delete" id={item.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]
