'use client'

import { markAttendance } from "@/lib/actions/attendance"
import { Loader2, UserCheck, UserX } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { toast } from "sonner"
import { UserRole } from "@/types"

interface AttendanceMarkerProps {
    data: { lessonId: number; userId: string; teacherId: string; role: UserRole }
    students: { id: string; name: string; surname: string }[];
    attendances: { present: boolean; studentId: string }[]
}

const AttendanceMarker = ({ data, students, attendances }: AttendanceMarkerProps) => {
    const [attendance, setAttendance] = useState(attendances)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAttendanceChange = (studentId: string, status: boolean) => {
        setAttendance((prev) => {
            const index = prev.findIndex((att) => att.studentId === studentId);

            if (index !== -1) {
                return prev.map((att) =>
                    att.studentId === studentId ? { ...att, present: status } : att
                );
            } else {
                return [...prev, { studentId, present: status }];
            }
        });
    };

    const attendanceStats = {
        present: Object.values(attendance).filter((status) => status.present).length,
        absent: Object.values(attendance).filter((status) => !status.present).length,
        total: students.length,
    }

    const updateAttendance = async () => {
        try {
            setIsSubmitting(true)

            if (attendance === attendances) return;

            const att = await markAttendance(data.lessonId, attendance);

            if (att.error) {
                if (typeof att.error === 'string') {
                    toast.error(att.error)
                } else {
                    toast.error(`Failed to mark attendance`)
                }

                return;
            }

            toast.success("Attendance successfully saved!")
        } catch (error) {
            console.error("Failed to update attendance:", error);
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <Card className="flex-1 h-fit">
            <CardHeader>
                <CardTitle className="text-xl font-semibold lg:text-2xl">Attendance</CardTitle>
                <CardDescription>
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
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-medium">
                                    {student.name} {student.surname}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={
                                        attendance.find((a) => a.studentId === student.id)?.present === true
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => handleAttendanceChange(student.id, true)}
                                    className="text-xs"
                                >
                                    Present
                                </Button>
                                <Button
                                    size="sm"
                                    variant={
                                        attendance.find((a) => a.studentId === student.id)?.present === false
                                            ? 'destructive'
                                            : 'outline'
                                    }
                                    onClick={() => handleAttendanceChange(student.id, false)}
                                    className="text-xs"
                                >
                                    Absent
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {(data.role === 'admin' || data.userId === data.teacherId) && (
                    <div className="flex items-end justify-end mt-4">
                        <Button
                            disabled={attendance === attendances || isSubmitting}
                            onClick={updateAttendance}
                        >
                            {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : "Submit"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default AttendanceMarker