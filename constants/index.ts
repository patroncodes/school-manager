export const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.svg",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/fee.svg",
        label: "Fees",
        href: "/list/fees",
        visible: ["admin", "teacher", "parent", "student"],
      },
      {
        icon: "/receipt.svg",
        label: "Transactions",
        href: "/list/transactions",
        visible: ["admin"],
      },
      {
        icon: "/teacher.svg",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.svg",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.svg",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.svg",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/class.svg",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.svg",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher", "parent", "student"],
      },
      {
        icon: "/exam.svg",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.svg",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.svg",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.svg",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.svg",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.svg",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.svg",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.svg",
        label: "Profile",
        href: "/account/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.svg",
        label: "Settings",
        href: "/account/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

export const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export const userSex = ["MALE", "FEMALE"];
export const dayOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];
