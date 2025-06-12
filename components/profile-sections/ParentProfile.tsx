import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BookOpen, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface ParentProfileProps {
    students: {
        id: string;
        name: string;
        surname: string;
        class: { name: string }
        attendances: Array<{
            date: string
            present: boolean
            lesson: {
                name: string
                subject: {
                    name: string
                }
            }
        }>
        results: Array<{
            score: number;
            createdAt: Date;
            exam?: {
                title: string
            }
            assignment?: {
                title: string
            }
        }>
    }[]
}

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
                                        {student.attendances.map((attendance, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {attendance.present ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="h-5 w-5 text-red-600" />
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{attendance.lesson.subject.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {attendance.lesson.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(attendance.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                        {student.attendances.length === 0 && (
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
                                        {student.results.map((result, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <div className="font-medium">
                                                            {result.exam?.title || result.assignment?.title}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {result.exam ? 'Exam' : 'Assignment'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-lg font-bold ${getPerformanceColor(result.score)}`}>
                                                        {result.score}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {student.results.length === 0 && (
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