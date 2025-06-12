import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users } from "lucide-react"
import { Badge } from "../ui/badge";

interface PropType {
    name: string
}

const TeacherProfile = ({ subjects, classes }: { subjects: PropType[]; classes: PropType[] }) => {
    return (
        <div className="space-y-6 flex-1">
            {/* Teaching Overview */}
            <div className="flex justify-between gap-4 w-full">
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Classes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{classes.length}</div>

                        <div className="flex items-center gap-4">
                            {classes.map(({ name }) => (
                                <Badge key={name} className="bg-lamaPurpleLight text-gray-700 border border-lamaPurple">{name}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subjects.length}</div>

                        <div className="flex items-center gap-4">
                            {subjects.map(({ name }) => (
                                <Badge key={name}>{name}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Your recent teaching activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Graded Math Test - Class 10A</p>
                                <p className="text-sm text-muted-foreground">Completed grading for 30 students</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Attendance Marked - Class 11B</p>
                                <p className="text-sm text-muted-foreground">All students present today</p>
                                <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Lesson Plan Updated</p>
                                <p className="text-sm text-muted-foreground">Updated Calculus curriculum for next week</p>
                                <p className="text-xs text-muted-foreground">2 days ago</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default TeacherProfile