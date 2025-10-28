import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { PaymentStatus } from "@prisma/client";

interface FeeSummaryProps {
  schoolId: string;
  termId: string;
  feeId?: string;

  // Specific fees
  classId?: string;
  gradeId?: string;
  studentId?: string;
}

const FeeSummary = async ({
  schoolId,
  termId,
  feeId,
  classId,
  gradeId,
  studentId,
}: FeeSummaryProps) => {
  const conditions: any[] = [
    { classId: null, gradeId: null, studentId: null }, // general fees
  ];

  if (feeId) conditions.push({ id: feeId });
  if (gradeId) conditions.push({ gradeId });
  if (classId) conditions.push({ classId });
  if (studentId) conditions.push({ studentId });

  const data = await prisma.invoice.findMany({
    where: {
      schoolId,
      termId,
      OR: conditions,
    },
    select: {
      id: true,
      title: true,
      amount: true,
      payments: {
        select: {
          status: true,
          // student: {
          //   select: {
          //     id: true,
          //     name: true,
          //     surname: true,
          //   },
          // },
        },
      },
    },
  });

  const getFeeInfo = (feeId: string) => {
    const payments = data.find((e) => e.id === feeId)?.payments || [];

    const fullPayment = payments.filter(
      (e) => e.status === PaymentStatus.SUCCESS,
    );
    const partialPayment = payments.filter(
      (e) => e.status === PaymentStatus.PROCESSING,
    );
    const pendingPayment = payments.filter(
      (e) => e.status === PaymentStatus.PENDING,
    );

    return { fullPayment, partialPayment, pendingPayment };
  };

  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {data.length > 1 ? "Fees" : "Fee"} Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {data.map((fee) => (
          <div key={fee.id}>
            <div className="space-y-2">
              <div className="flex w-full items-center justify-between font-semibold">
                <span className="text-lg">{fee.title}</span>
                <span>${Number(fee.amount)}</span>
              </div>
              <Separator orientation="horizontal" className="" />
            </div>

            {/*<PaymentList label="PAID" data={getFeeInfo(fee.id).fullPayment} />*/}
            {/*<PaymentList*/}
            {/*  label="PARTIAL"*/}
            {/*  data={getFeeInfo(fee.id).partialPayment}*/}
            {/*/>*/}
            {/*<PaymentList*/}
            {/*  label="PENDING"*/}
            {/*  data={getFeeInfo(fee.id).pendingPayment}*/}
            {/*  className="text-chart-1"*/}
            {/*/>*/}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FeeSummary;

const PaymentList = ({
  label,
  data,
  className,
}: {
  label: string;
  data: {
    student: {
      id: string;
      name: string;
      surname: string;
    };
    status: PaymentStatus;
  }[];
  className?: string;
}) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger showCaret={false}>
          <div
            className={cn(
              "flex w-full items-center justify-between text-chart-2",
              className,
            )}
          >
            <span>{label}</span>
            <span className="font-semibold">{data.length}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div>
            {data.map((d, index) => (
              <div key={d.student.id} className="flex items-center gap-2">
                <span>{index + 1}.</span>

                <span>
                  {d.student.name} {d.student.surname}
                </span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
