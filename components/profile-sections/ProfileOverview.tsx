import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { BookOpen, Users, GraduationCap, Calendar, TrendingUp, Shield, Settings, type LucideIcon } from "lucide-react"
import type { UserRole } from "@/types"

interface OverviewCard {
    title: string
    icon: LucideIcon
    value: string | number
    content: React.ReactNode
    subtitle?: string
}

interface ProfileOverviewProps {
    role: UserRole
    data: any
}

const ProfileOverview = ({ role, data }: ProfileOverviewProps) => {
    const calculateAttendanceRate = (attendances: any[]) => {
        if (!attendances || attendances.length === 0) {
            return { presentCount: 0, total: 0, rate: 0 }
        }
        const presentCount = attendances.filter((a) => a.present).length
        const total = attendances.length
        const rate = Math.round((presentCount / total) * 100)
        return { presentCount, total, rate }
    }

    const calculateAverageScore = (results: any[]) => {
        if (!results || results.length === 0) return 0
        const totalScore = results.reduce((sum, result) => sum + result.score, 0)
        return Math.round(totalScore / results.length)
    }

    const getOverviewCards = (): OverviewCard[] => {
        switch (role) {
            case "teacher":
                const totalStudents = data?.classes?.reduce((sum: number, cls: any) => sum + cls.capacity, 0) || 0

                return [
                    {
                        title: "Classes",
                        icon: Users,
                        value: data?.classes?.length || 0,
                        subtitle: `${totalStudents} total students`,
                        content: (
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                {data?.classes?.map(({ name }: { name: string }) => (
                                    <Badge key={name} variant="secondary" className="text-xs">
                                        {name}
                                    </Badge>
                                ))}
                            </div>
                        ),
                    },
                    {
                        title: "Subjects",
                        icon: BookOpen,
                        value: data?.subjects?.length || 0,
                        subtitle: "Teaching subjects",
                        content: (
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                {data?.subjects?.map(({ name }: { name: string }) => (
                                    <Badge key={name} variant="outline" className="text-xs">
                                        {name}
                                    </Badge>
                                ))}
                            </div>
                        ),
                    },
                ]

            case "student":
                const attendanceStats = calculateAttendanceRate(data?.attendances)
                const averageScore = calculateAverageScore(data?.results)

                return [
                    {
                        title: "Class",
                        icon: GraduationCap,
                        value: data?.class?.name || "N/A",
                        subtitle: "Current academic year",
                        content: (
                            <div className="flex items-center gap-2 mt-2">
                                {averageScore > 0 && (
                                    <Badge
                                        variant={averageScore >= 80 ? "default" : averageScore >= 60 ? "secondary" : "destructive"}
                                        className="text-xs"
                                    >
                                        Avg: {averageScore}%
                                    </Badge>
                                )}
                            </div>
                        ),
                    },
                    {
                        title: "Attendance",
                        icon: Calendar,
                        value: `${attendanceStats.rate}%`,
                        subtitle: "Classes attended",
                        content: (
                            <div className="flex items-center gap-2 mt-2">
                                <Badge
                                    variant={
                                        attendanceStats.rate >= 90 ? "default" : attendanceStats.rate >= 75 ? "secondary" : "destructive"
                                    }
                                    className="text-xs"
                                >
                                    {attendanceStats.presentCount}/{attendanceStats.total}
                                </Badge>
                            </div>
                        ),
                    },
                ]

            case "parent":
                const childrenCount = data?.students?.length || 0

                // Calculate overall attendance across all children
                const overallAttendance = (() => {
                    if (!data?.students || data.students.length === 0) return 0
                    let totalPresent = 0,
                        totalClasses = 0
                    data.students.forEach((student: any) => {
                        if (student.attendances) {
                            totalClasses += student.attendances.length
                            totalPresent += student.attendances.filter((a: any) => a.present).length
                        }
                    })
                    return totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0
                })()

                // Calculate overall performance across all children
                const overallPerformance = (() => {
                    if (!data?.students || data.students.length === 0) return 0
                    let totalScore = 0,
                        totalResults = 0
                    data.students.forEach((student: any) => {
                        if (student.results) {
                            student.results.forEach((result: any) => {
                                totalScore += result.score
                                totalResults++
                            })
                        }
                    })
                    return totalResults > 0 ? Math.round(totalScore / totalResults) : 0
                })()

                return [
                    {
                        title: "Children",
                        icon: Users,
                        value: childrenCount,
                        subtitle: "Enrolled students",
                        content: (
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                {data?.students?.map((student: any) => (
                                    <Badge key={`${student.name}-${student.surname}`} variant="secondary" className="text-xs">
                                        {student.name} ({student.class?.name})
                                    </Badge>
                                ))}
                            </div>
                        ),
                    },
                    {
                        title: "Overall Performance",
                        icon: TrendingUp,
                        value: `${overallPerformance}%`,
                        subtitle: "Average across all children",
                        content: (
                            <div className="flex items-center gap-2 mt-2">
                                <Badge
                                    variant={overallAttendance >= 90 ? "default" : overallAttendance >= 75 ? "secondary" : "destructive"}
                                    className="text-xs"
                                >
                                    {overallAttendance}% Attendance
                                </Badge>
                            </div>
                        ),
                    },
                ]

            case "admin":
                return [
                    {
                        title: "Admin Access",
                        icon: Shield,
                        value: "Full",
                        subtitle: "Complete system access",
                        content: (
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="default" className="text-xs">
                                    System Administrator
                                </Badge>
                            </div>
                        ),
                    },
                    {
                        title: "Management",
                        icon: Settings,
                        value: "Active",
                        subtitle: "System management status",
                        content: (
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                    @{data?.username}
                                </Badge>
                            </div>
                        ),
                    },
                ]

            default:
                return []
        }
    }

    const cards = getOverviewCards()

    return (
        <div className="flex justify-between gap-4 flex-1">
            {cards.map((card, index) => (
                <Card key={index} className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        {card.content}
                        <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default ProfileOverview
