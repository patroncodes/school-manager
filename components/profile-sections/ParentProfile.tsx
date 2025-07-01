import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BookOpen, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { type ParentProfileProps, type TabItemProps } from "@/types";
import { cn } from "@/lib/utils";

const StudentProfile = ({ students }: ParentProfileProps) => {
    const getPerformanceColor = (score: number) => {
        if (score >= 70) return 'text-green-600'
        if (score >= 45) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <div className="space-y-6 flex-1 flex flex-col gap-6 lg:flex-row lg:justify-between">
            <div className="bg-gray-50 shadow px-5 py-4 rounded-md lg:w-1/2">
                <h2 className="flex items-center gap-1 py-3">
                    <Calendar />
                    <span>Attendance Records</span>
                </h2>
                <Tabs defaultValue={students[0].id} className="space-y-4">
                    <TabsList className="flex items-center gap-5 w-full">
                        {students.map(student => (
                            <TabsTrigger key={student.id} value={student.id}>
                                {student.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {students.map(student => (
                        <TabsContent key={student.id} value={student.id} className="space-y-4">
                            <Card>
                                <CardContent>
                                    <div className="space-y-3">
                                        {student.attendances.length !== 0 ? student.attendances.map((attendance, index) => (
                                            <TabItem
                                                key={index}
                                                icon={attendance.present
                                                    ? <CheckCircle className="h-5 w-5 text-green-600" />
                                                    : <XCircle className="h-5 w-5 text-red-600" />
                                                }
                                                label={attendance.lesson.subject.name}
                                                subLabel={attendance.lesson.name}
                                                value={new Date(attendance.date).toLocaleDateString()}
                                            />
                                        )) : (
                                            <p className="text-center text-muted-foreground py-8">
                                                No attendance records available
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            <div className="bg-gray-50 shadow px-5 py-4 rounded-md lg:w-1/2">
                <h2 className="flex items-center gap-1 py-3">
                    <Award />
                    <span>Performance Records</span>
                </h2>
                <Tabs defaultValue={students[0].id} className="space-y-4">
                    <TabsList className="flex items-center gap-5 w-full">
                        {students.map(student => (
                            <TabsTrigger key={student.id} value={student.id}>
                                {student.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {students.map(student => (
                        <TabsContent key={student.id} value={student.id} className="space-y-4">
                            <Card>
                                <CardContent>
                                    <div className="space-y-3">
                                        {student.results.length !== 0 ? student.results.map((result, index) => (
                                            <TabItem
                                                key={index}
                                                icon={<BookOpen className="h-5 w-5 text-blue-600" />}
                                                label={result.exam?.title || result.assignment?.title || "NA"}
                                                subLabel={result.exam ? 'Exam' : 'Assignment'}
                                                value={`${result.score}%`}
                                                className={`text-lg font-bold ${getPerformanceColor(result.score)}`}
                                            />
                                        )) : (
                                            <p className="text-center text-muted-foreground py-8">
                                                No results available
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    )
}

export default StudentProfile

const TabItem = ({ icon, label, subLabel, value, className }: TabItemProps) => {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
                {icon}
                <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-sm text-muted-foreground">
                        {subLabel}
                    </div>
                </div>
            </div>
            <div className={cn("text-sm text-muted-foreground", className)}>
                {value}
            </div>
        </div>
    )
}