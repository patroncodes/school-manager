export const ITEMS_PER_PAGE = 10;

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/teacher(.*)": ["teacher"],
  "/student(.*)": ["student"],
  "/parent(.*)": ["parent"],
  "/list/teachers": ["admin", "teacher"],
  "/list/students": ["admin", "teacher"],
  "/list/parents": ["admin", "teacher"],
  "/list/subjects": ["admin"],
  "/list/classes": ["admin", "teacher"],
  "/list/exams": ["admin", "teacher", "student", "parent"],
  "/list/lessons": ["admin", "teacher", "student", "parent"],
  "/list/assignments": ["admin", "teacher", "student", "parent"],
  "/list/results": ["admin", "teacher", "student", "parent"],
  "/list/attendance": ["admin", "teacher", "student", "parent"],
  "/list/fees": ["admin", "teacher", "student", "parent"],
  "/list/transactions": ["admin"],
  "/list/events": ["admin", "teacher", "student", "parent"],
  "/list/announcements": ["admin", "teacher", "student", "parent"],
  "/account/profile": ["admin", "teacher", "student", "parent"],
  "/account/settings": ["admin", "teacher", "student", "parent"],
};

export const listCreationAccess: { [key: string]: string[] } = {
  admin: [
    "assignment",
    "event",
    "announcement",
    "exam",
    "subject",
    "class",
    "teacher",
    "student",
    "parent",
    "result",
    "lesson",
    "fee",
  ],
  teacher: ["assignment", "exam", "result"],
  student: [],
  parent: [],
};
