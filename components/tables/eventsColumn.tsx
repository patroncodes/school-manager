import { UserRole } from "@/types"
import { Event } from "@prisma/client"
import FormContainer from "../FormContainer"

type EventsList = Event & { class: { name: string } | null }

export const eventsColumn = (role: UserRole) => [
    {
        accessor: "title",
        header: "Title",
        cell: (item: EventsList) => <span>{item.title}</span>
    },
    {
        accessor: "class",
        header: "Class",
        cell: (item: EventsList) => <span>{item.class?.name || "-"}</span>
    },
    {
        accessor: "date",
        header: "Date",
        cell: (item: EventsList) => <span>{new Intl.DateTimeFormat("en-NG").format(item.startTime)}</span>
    },
    {
        accessor: "startTime",
        header: "Start Time",
        cell: (item: EventsList) => <span>{item.startTime.toLocaleTimeString('en-NG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })}</span>
    },
    {
        accessor: "endTime",
        header: "End Time",
        cell: (item: EventsList) => <span>{item.endTime.toLocaleTimeString('en-NG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })}</span>
    },
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: EventsList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <FormContainer table="event" type="update" data={item} />
                            <FormContainer table="event" type="delete" id={item.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]
