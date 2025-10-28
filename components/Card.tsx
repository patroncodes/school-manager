import { Calendar, Droplet, Mail, MapPinHouse, Phone } from "lucide-react";
import Image from "next/image";
import {
  Parent,
  ParentStudentRelationship,
} from "@/lib/generated/prisma/client";
import { type ReactElement } from "react";
import FormModal from "@/components/FormModal";

export const InfoCard = ({
  data,
  table,
}: {
  data: any;
  table: "staff" | "student";
}) => {
  const items = [
    {
      icon: Calendar,
      alt: "age",
      value: new Intl.DateTimeFormat("en-NG").format(data.birthday),
    },
    {
      icon: Phone,
      alt: "phone",
      value: data.phone || "-",
    },
    {
      icon: Mail,
      alt: "email",
      value: data.email || "-",
    },
    {
      icon: MapPinHouse,
      alt: "address",
      value: data.address || "-",
    },
  ];

  return (
    <div className="flex flex-1 gap-4 rounded-md bg-lamaSky px-4 py-6">
      <Image
        src={data.img || "/noAvatar.png"}
        alt="teacher"
        width={144}
        height={144}
        className="h-24 w-24 rounded-full object-center"
      />

      <div className="flex w-2/3 max-w-96 flex-col justify-between gap-4">
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">
              {data.name} {data.surname}
            </h1>

            <p className="text-sm text-gray-500">
              Joined on{" "}
              {new Intl.DateTimeFormat("en-NG").format(data.createdAt)}
            </p>
          </div>

          <FormModal table={table} type="update" data={data} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
          {items.map((item) => (
            <div
              key={item.alt}
              className="flex w-full items-center gap-2 md:w-1/3 lg:w-full 2xl:w-1/3"
            >
              <item.icon size={14} />
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SmallCard = async ({
  cards,
}: {
  cards: {
    value: string;
    desc: string;
    img?: string;
    icon?: ReactElement;
  }[];
}) => {
  return (
    <div className="flex flex-1 flex-wrap justify-between gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex w-full gap-4 rounded-md bg-white p-6 shadow-xs md:w-[45%] xl:w-[47%] 2xl:w-[48%]"
        >
          {card.img ? (
            <Image
              src={card.img}
              height={32}
              width={32}
              alt="icon"
              className="size-8 w-fit"
            />
          ) : (
            card.icon
          )}
          <div className="">
            <h2 className="text-xl font-semibold">{card.value}</h2>
            <span className="text-sm text-gray-400">{card.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ParentInfoCard = ({
  data,
}: {
  data: { relation: ParentStudentRelationship; parent: Parent }[];
}) => {
  const getParentColumns = (parent: Parent) => [
    {
      label: "Name",
      value: `${parent.name} ${parent.surname}`,
    },
    {
      label: "Email",
      value: parent.email || "-",
    },
    {
      label: "Phone",
      value: parent.phone || "-",
    },
    {
      label: "Address",
      value: parent.address,
    },
  ];

  return (
    <div className="w-full rounded-md bg-lamaSky">
      {data.map((item) => (
        <div key={item.relation} className="flex flex-col gap-4 p-4">
          <h3 className="text-lg font-semibold">{item.relation}</h3>

          <div className="flex flex-col gap-2 text-sm font-medium">
            {getParentColumns(item.parent).map((item) => (
              <div key={item.label}>
                <span className="">{item.label}: </span>
                <span className="ml-5">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
