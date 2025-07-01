import { Transaction } from "@prisma/client";

interface TransactionList extends Transaction {
    student: { name: string; surname: string };
    fee: { description: string; }
}

export const transactionsColumn = () => [
    {
        accessor: "student",
        header: 'Student',
        className: "min-w-44",
        cell: (item: TransactionList) => <div className="min-w-44" >{item?.student?.name ? `${item.student.name} ${item.student.surname}` : '-'}</div>
    },
    {
        accessor: "amount",
        header: "Amount",
        cell: (item: TransactionList) => <div>₦{item?.amount}</div>
    },
    {
        accessor: "description",
        header: "Description",
        className: "min-w-52",
        cell: (item: TransactionList) => <div className="min-w-52">{item?.fee.description}</div>
    },
    {
        accessor: "date",
        header: "Date",
        className: 'min-w-56',
        cell: (item: TransactionList) => <div className="min-w-52">{new Intl.DateTimeFormat("en-NG").format(item?.date)}, {item.date.toLocaleTimeString('en-NG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })}</div>
    },
    {
        accessor: "reference",
        header: 'Reference',
        cell: (item: TransactionList) => <div>{item?.reference}</div>
    }
]
