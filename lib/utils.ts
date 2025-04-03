import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const splitName = (name: string) => {
//   const [firstName, ...lastName] = name.trim().split(" ");

//   return {
//     firstName: firstName || "",
//     lastName: lastName.join(" ") || "",
//   };
// };

export const formatTimeRange = (start: Date, end: Date): string => {
  return `${moment(start).format("DD-MM-YYYY, h:mmA")} - ${moment(end).format("h:mmA")}`;
};
