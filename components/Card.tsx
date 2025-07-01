import { Calendar, Droplet, Mail, Phone, Users2 } from "lucide-react";
import Image from "next/image";
import FormContainer from "./FormContainer";

export const InfoCard = ({
  data,
  table,
}: {
  data: any;
  table: "teacher" | "student";
}) => {
  const contentClassName = "w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2"

  const items = [
    {
      icon: Droplet,
      alt: 'blood type',
      value: data.bloodType
    },
    {
      icon: Calendar,
      alt: 'age',
      value: new Intl.DateTimeFormat("en-NG").format(data.birthday)
    },
    {
      icon: Mail,
      alt: 'email',
      value: data.email || "-"
    },
    {
      icon: Phone,
      alt: 'phone',
      value: data.phone || "-"
    },
    ...(table === 'student' ? [{
      icon: Users2,
      alt: 'parents',
      value: `${data.parent.name} ${data.parent.surname}`
    }] : [])
  ]

  return (
    <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
      <div className="w-32 h-32 rounded-full">
        <Image
          src={data.img || '/noAvatar.png'}
          alt="teacher"
          width={144}
          height={144}
          className="rounded-full object-cover object-center"
        />
      </div>
      <div className="w-2/3 flex flex-col justify-between gap-4 max-w-96">
        <div className="flex items-center justify-between w-full gap-4">
          <h1 className="text-xl font-semibold">
            {data.name} {data.surname}
          </h1>

          <FormContainer table={table} type="update" data={data} />
        </div>

        <p className="text-sm text-gray-500">
          Joined on {new Intl.DateTimeFormat("en-NG").format(data.createdAt)}
        </p>

        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">

          {items.map(item => (
            <div key={item.alt} className={contentClassName}>
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
  cards
}: {
  cards: {
    value: string;
    desc: string;
    img: string;
  }[];
}) => {
  return (
    <div className="flex-1 flex gap-4 justify-between flex-wrap">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[45%] xl:w-[47%] 2xl:w-[48%]"
        >
          <Image
            src={card.img}
            alt="attendance"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <div className="">
            <h2 className="text-xl font-semibold">{card.value}</h2>
            <span className="text-sm text-gray-400">{card.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
};