import Image from 'next/image'
import prisma from '@/lib/prisma'

import moment from "moment";
import dynamic from 'next/dynamic';

const FinanceChart = dynamic(() => import('./FinanceChart'), {
    loading: () => <h1>Loading...</h1>,
});

const FinanceChartContainer = async () => {
    const startOfYear = moment().startOf("year").toDate();
    const endOfYear = moment().endOf("year").toDate();

    const transactions = await prisma.transaction.findMany({
        where: {
            date: {
                gte: startOfYear,
                lte: endOfYear,
            },
        },
        select: {
            amount: true,
            date: true,
            type: true
        },
    });

    const months = moment.monthsShort();
    const data = months.map(name => ({
        name,
        income: 0,
        expense: 0
    }))

    for (const tx of transactions) {
        const monthIndex = moment(tx.date).month()
        if (tx.type === 'INCOME') {
            data[monthIndex].income += tx.amount;
        } else if (tx.type === 'EXPENSE') {
            data[monthIndex].expense += tx.amount
        }
    }

    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Finance</h1>
                <Image src="/moreDark.svg" alt="more" width={20} height={20} />
            </div>

            <FinanceChart data={data} />
        </div>
    )
}

export default FinanceChartContainer