import Image from "next/image";
import prisma from "@/lib/prisma";
import { startOfYear, endOfYear, getMonth, format } from "date-fns"

import dynamic from "next/dynamic";

const FinanceChart = dynamic(() => import("./FinanceChart"), {
  loading: () => <h1>Loading...</h1>,
});

const FinanceChartContainer = async ({ schoolId }: { schoolId: string }) => {
  const startOfYearDate = startOfYear(new Date())
  const endOfYearDate = endOfYear(new Date())

  const [salary, invoice] = await prisma.$transaction([
    prisma.invoicePayment.findMany({
      where: {
        schoolId,
        paymentDate: {
          gte: startOfYearDate,
          lte: endOfYearDate,
        },
      },
      select: {
        amountPaid: true,
        paymentDate: true,
      },
    }),

    prisma.salaryPayment.findMany({
      where: {
        schoolId,
        paymentDate: {
          gte: startOfYearDate,
          lte: endOfYearDate,
        },
      },
      select: {
        amountPaid: true,
        paymentDate: true,
      },
    })
  ])


  const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(2000, i, 1), "MMM")
  )
  const data = months.map((name) => ({
    name,
    income: 0,
    expense: 0,
  }));

  for (const tx of salary) {
    const monthIndex = getMonth(tx.paymentDate)
    data[monthIndex].expense += parseInt(
      tx.amountPaid.toString().replace(/,/g, "")
    )
  }

  for (const tx of invoice) {
    const monthIndex = getMonth(tx.paymentDate)
    data[monthIndex].income += parseInt(
      tx.amountPaid.toString().replace(/,/g, ""),
    );
  }

  return (
    <div className="h-full w-full rounded-xl bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Finance</h1>
        <Image src="/moreDark.svg" alt="more" width={20} height={20} />
      </div>

      <FinanceChart data={data} />
    </div>
  );
};

export default FinanceChartContainer;
