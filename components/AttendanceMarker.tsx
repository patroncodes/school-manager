"use client";

import { Loader2, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { toast } from "sonner";
import { AttendanceStatus } from "@prisma/client";
import { markStudentAttendance } from "@/lib/actions";

interface AttendanceMarkerProps {
  lessonId?: string;
  classId?: string;
  date: Date;
  students: { id: string; name: string; surname: string }[];
  attendanceState: { status: AttendanceStatus; studentId: string }[];
}

const AttendanceMarker = ({
  lessonId,
  classId,
  date,
  students,
  attendanceState,
}: AttendanceMarkerProps) => {
  const [attendance, setAttendance] = useState(attendanceState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAttendanceChange = (
    studentId: string,
    status: AttendanceStatus,
  ) => {
    setAttendance((prev) => {
      const student = prev.find((att) => att.studentId === studentId);

      if (student) {
        return prev.map((att) =>
          att.studentId === studentId ? { ...att, status } : att,
        );
      } else {
        return [...prev, { studentId, status }];
      }
    });
  };

  const attendanceStats = {
    present: attendance.filter(({ status }) => status === "PRESENT").length,
    absent: attendance.filter(({ status }) => status === "ABSENT").length,
    late: attendance.filter(({ status }) => status === "LATE").length,
    total: students.length,
  };

  const updateAttendance = async () => {
    try {
      setIsSubmitting(true);

      if (attendance === attendanceState) return;

      const att = await markStudentAttendance({
        lessonId,
        classId,
        date,
        records: attendance,
      });

      if (att.error) {
        if (typeof att.error === "string") {
          toast.error(att.error);
        } else {
          toast.error(`Failed to mark attendance`);
        }

        return;
      }

      toast.success("Attendance successfully saved!");
    } catch (error) {
      console.error("Failed to update attendance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-fit flex-1">
      <CardHeader>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-green-600" />
            <span className="text-sm">Present: {attendanceStats.present}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserX className="h-4 w-4 text-red-600" />
            <span className="text-sm">Absent: {attendanceStats.absent}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">
                  {student.name} {student.surname}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={
                    attendance.find((a) => a.studentId === student.id)
                      ?.status === "PRESENT"
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleAttendanceChange(student.id, "PRESENT")}
                  className="text-xs"
                >
                  Present
                </Button>
                <Button
                  size="sm"
                  variant={
                    attendance.find((a) => a.studentId === student.id)
                      ?.status === "ABSENT"
                      ? "destructive"
                      : "outline"
                  }
                  onClick={() => handleAttendanceChange(student.id, "ABSENT")}
                  className="text-xs"
                >
                  Absent
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-end">
          <Button
            disabled={attendance === attendanceState || isSubmitting}
            onClick={updateAttendance}
          >
            {isSubmitting ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceMarker;
