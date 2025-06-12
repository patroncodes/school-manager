import ProfileOverview from "@/components/profile-sections/ProfileOverview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/serverUtils"
import { Calendar, Mail, Phone } from "lucide-react"
import dynamic from "next/dynamic"

const AdminProfile = dynamic(() => import('@/components/profile-sections/AdminProfile'), {
    loading: () => <h1>Loading...</h1>,
})
const TeacherProfile = dynamic(() => import('@/components/profile-sections/TeacherProfile'), {
    loading: () => <h1>Loading...</h1>,
})
const StudentProfile = dynamic(() => import('@/components/profile-sections/StudentProfile'), {
    loading: () => <h1>Loading...</h1>,
})
const ParentProfile = dynamic(() => import('@/components/profile-sections/ParentProfile'), {
    loading: () => <h1>Loading...</h1>,
})

const AccountPage = async () => {
    const { role, currentUserId } = await getCurrentUser()

    let query = {}

    switch (role) {
        case 'teacher':
            query = {
                id: true,
                username: true,
                name: true,
                surname: true,
                email: true,
                phone: true,
                img: true,
                createdAt: true,
                subjects: {
                    select: {
                        name: true,
                    }
                },
                classes: {
                    select: {
                        name: true,
                    }
                },
            }
            break;

        case 'student':
            query = {
                id: true,
                username: true,
                name: true,
                surname: true,
                email: true,
                phone: true,
                img: true,
                createdAt: true,
                classId: true,
                class: {
                    select: {
                        name: true
                    }
                },
                parent: {
                    select: {
                        name: true,
                        surname: true,
                        phone: true,
                        email: true
                    }
                },
                attendances: {
                    select: {
                        date: true,
                        present: true,
                        lesson: {
                            select: {
                                name: true,
                                subject: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        date: 'desc'
                    },
                    take: 5
                },
                results: {
                    select: {
                        score: true,
                        exam: {
                            select: {
                                title: true,
                                startTime: true
                            }
                        },
                        assignment: {
                            select: {
                                title: true,
                                dueDate: true
                            }
                        }
                    },
                    orderBy: [
                        { exam: { startTime: 'desc' } },
                        { assignment: { dueDate: 'desc' } }
                    ],
                    take: 5
                }
            }
            break;

        case 'parent':
            query = {
                id: true,
                username: true,
                name: true,
                surname: true,
                email: true,
                phone: true,
                createdAt: true,
                students: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        class: {
                            select: {
                                name: true,
                            }
                        },
                        attendances: {
                            select: {
                                date: true,
                                present: true,
                                lesson: {
                                    select: {
                                        name: true,
                                        subject: {
                                            select: {
                                                name: true
                                            }
                                        }
                                    }
                                }
                            },
                            orderBy: {
                                date: 'desc'
                            },
                            take: 5
                        },
                        results: {
                            select: {
                                score: true,
                                exam: {
                                    select: {
                                        title: true,
                                    }
                                },
                                assignment: {
                                    select: {
                                        title: true,
                                    }
                                }
                            },
                            take: 5
                        }
                    }
                }
            }
            break;

        case 'admin':
            query = {
                id: true,
                username: true,
                name: true,
                surname: true
            }
            break;

        default:
            break;
    }

    const user: any = await prisma[role!].findUnique({
        where: { id: currentUserId! },
        select: query
    })

    const renderRoleSpecificContent = () => {
        switch (role) {
            case "student":
                return <StudentProfile {...user} />
            case "parent":
                return <ParentProfile students={user.students} />
            case "teacher":
                return <TeacherProfile subjects={user?.subjects} classes={user?.classes} />
            case "admin":
                return <AdminProfile />
            default:
                return null
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-6 w-full">
                <Card className="flex lg:flex-row justify-between lg:w-[60%]">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user?.img} alt="profile-img" />
                                <AvatarFallback className="text-lg">
                                    {user?.name[0]}{user?.surname[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl">{user?.name} {user.surname}</CardTitle>
                                <CardDescription>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className="">{role?.toUpperCase()}</Badge>
                                    </div>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user?.email}</span>
                            </div>
                            {user?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{user?.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <ProfileOverview role={role!} data={user} />
            </div>
            {renderRoleSpecificContent()}
        </div>
    )
}

export default AccountPage