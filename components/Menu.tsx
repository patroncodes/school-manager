import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { menuItems } from "@/constants";

const Menu = () => {
  return (
    <div className="mt-4 text-sm px-2">
      {menuItems.map(({ title, items }) => (
        <div key={title} className="flex flex-col gap-2">
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {title}
          </span>

          {items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                    title={item.label}
                  />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
