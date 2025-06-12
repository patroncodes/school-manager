import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLastWeekMonday = () => {
  const today = new Date();
  const day = today.getDay();

  const daysSinceMonday = ((day + 6) % 7) + 7;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);
  return lastMonday;
};

export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[],
): { title: string; start: Date; end: Date }[] => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const latestMonday = today;
  latestMonday.setDate(today.getDate() - daysSinceMonday);

  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();

    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(latestMonday);

    adjustedStartDate.setDate(latestMonday.getDate() + daysFromMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds(),
    );
    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds(),
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};

export const toDatetimeLocal = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1); // Months are 0-indexed
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

export const handleServerErrors = (error: any) => {
  // CLERK ERRORS
  if (error?.errors && Array.isArray(error.errors)) {
    const primaryError = error.errors[0]; // Handle the first error for now

    switch (primaryError.code) {
      case "form_password_pwned":
        return {
          success: false,
          error:
            "Password was found in a data breach. Use a more secure password.",
        };

      case "form_password_length_too_short":
        return {
          success: false,
          error: "Password is too short. Please make it longer.",
        };

      case "form_identifier_exists":
        return {
          success: false,
          error: "An account with this username or email already exists.",
        };

      case "unexpected_error":
        return {
          success: false,
          error: "Something went wrong. Please try again later.",
        };

      case "resource_not_found":
        return {
          success: false,
          error: "User with ID does not exist",
        };

      default:
        return {
          success: false,
          error:
            primaryError.message ||
            "An unknown error occurred. Please try again.",
        };
    }
  }

  // // PRISMA ERRORS
  if (error?.code) {
    const errorCode = error.code;
    const meta = error?.meta;

    console.log({ meta });

    switch (errorCode) {
      case "P2002":
        return {
          success: false,
          error: `${meta?.target[0]} already exists. Please use another`,
        };

      case "P2003":
        return { success: false, error: "Cannot delete resource" };

      default:
        break;
    }
  }
};

export const extractImageId = (url: string) => {
  const publicId = url.split("/").pop()?.split(".")[0];

  return { id: publicId };
};
