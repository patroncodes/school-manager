import prisma from "@/lib/prisma";
import Image from "next/image";

type CardType = "non-academic" | "teacher" | "parent" | "student"

const UserCard = async ({
  type,
  schoolId,
}: {
  type: CardType;
  schoolId: string;
}) => {

  // const modelMap: Record<any, any> = {
  //   manager: prisma.manager,
  //   teacher: prisma.staff,
  //   student: prisma.student,
  //   parent: prisma.parent,
  // };

  const modelMap: Record<CardType, { model: any; where?: any }> = {
    teacher: {
      model: prisma.staff,
      where: { accessLevel: "TEACHER" }
    },
    "non-academic": {
      model: prisma.staff,
      where: { accessLevel: { not: "TEACHER" } }
    },
    student: {
      model: prisma.student
    },
    parent: {
      model: prisma.parent
    },
  }

  const data = await modelMap[type].model.count({ where: { schoolId, ...modelMap[type].where } });

  return (
    <div className="min-w-[130px] flex-1 rounded-2xl p-4 odd:bg-lamaPurple even:bg-lamaYellow">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white px-2 py-1 text-[10px] text-green-600">
          2024/25
        </span>
        <Image src="/more.svg" alt="more" width={20} height={20} />
      </div>

      <h1 className="my-4 text-2xl font-semibold">{data}</h1>
      <h2 className="text-sm font-medium text-gray-500 capitalize">
        {type}
        <span>s</span>
      </h2>
    </div>
  );
};

export default UserCard;
