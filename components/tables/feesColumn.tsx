import { type FeeWithRelations } from "@/app/(dashboard)/list/fees/page";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import FormContainer from "../FormContainer";
import { Badge } from "../ui/badge";

interface FeesList extends FeeWithRelations {
    hasPaid: boolean
}

export const feesColumn = (role: UserRole) => [
    {
        accessor: "description",
        header: "Description",
        className: "min-w-52",
        cell: (item: FeesList) => <div className="min-w-52">{item?.description}</div>
    },
    {
        accessor: "amount",
        header: "Amount",
        cell: (item: FeesList) => <div>₦{item?.amount}</div>
    },
    {
        accessor: "dueDate",
        header: "Due Date",
        cell: (item: FeesList) => <div>{item.dueDate ? new Intl.DateTimeFormat("en-NG").format(item?.dueDate) : "-"}</div>
    },
    ...(role !== 'student' ? [
        {
            accessor: "student",
            header: 'Student',
            cell: (item: FeesList) => <div>{item?.student?.name ? `${item.student.name} ${item.student.surname}` : '-'}</div>
        },
    ] : []),
    {
        accessor: "class",
        header: 'Class',
        cell: (item: FeesList) => <div>{item?.class?.name ? `${item.class.name}` : '-'}</div>
    },
    ...(role !== 'teacher' ? [
        {
            accessor: "status",
            header: 'Status',
            className: `${role === 'admin' ? "hidden" : "text-center"}`,
            cell: (item: FeesList) => (
                <div className="flex-center">
                    <Badge className={cn("text-black", item?.hasPaid ? 'bg-green-400' : 'bg-red-400', role === 'admin' && "hidden")}>{item?.hasPaid ? 'PAID' : 'NOT PAID'}</Badge>
                </div>
            )
        },
        {
            accessor: "actions",
            header: 'Actions',
            cell: (item: FeesList) => (
                <div>
                    <div className={cn("", role === 'admin' && 'hidden')}>
                        {!item.hasPaid && (
                            <FormContainer table="transaction" type="create" id={item.id} />
                        )}
                    </div>
                    <div className={cn("flex items-center gap-2", role !== 'admin' && 'hidden')}>
                        <FormContainer table="fee" type="update" data={item} />
                        <FormContainer table="fee" type="delete" id={item.id} />
                    </div>
                </div>
            )
        },
    ] : []),
]
