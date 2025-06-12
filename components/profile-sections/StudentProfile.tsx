
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BookOpen, Calendar, CheckCircle, Mail, Phone, User, XCircle } from 'lucide-react';

interface StudentProfileProps {
    parent: {
        name: string;
        surname: string;
        phone: string;
        email: string;
    }
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
}

export default function StudentProfile({ results, attendances, parent }: StudentProfileProps) {

    const getPerformanceColor = (score: number) => {
        if (score >= 70) return 'text-green-600'
        if (score >= 45) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <div className="space-y-6 flex-1">
            <Tabs defaultValue="academic" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="academic">Academic Performance</TabsTrigger>
                    <TabsTrigger value="parent">Parent Contact</TabsTrigger>
                </TabsList>

                {/* Academic Performance Tab */}
                <TabsContent value="academic" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Attendance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Recent Attendance
                                </CardTitle>
                                <CardDescription>
                                    Your attendance record for the last 10 classes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {attendances.map((attendance, index) => (
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
                                    {attendances.length === 0 && (
                                        <p className="text-center text-muted-foreground py-8">
                                            No attendance records available
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Results */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    Recent Results
                                </CardTitle>
                                <CardDescription>
                                    Your latest exam and assignment scores
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {results.map((result, index) => (
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
                                    {results.length === 0 && (
                                        <p className="text-center text-muted-foreground py-8">
                                            No results available
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* TODO: PERFORMANCE OVERVIEW */}
                </TabsContent>

                {/* Parent Contact Tab */}
                <TabsContent value="parent">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Parent/Guardian Contact
                            </CardTitle>
                            <CardDescription>
                                Emergency contact information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Name</div>
                                    <div className="font-medium text-lg">
                                        {parent.name} {parent.surname}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm text-muted-foreground">Phone</div>
                                            <div className="font-medium">{parent.phone}</div>
                                        </div>
                                    </div>
                                    {parent.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">Email</div>
                                                <div className="font-medium">{parent.email}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
