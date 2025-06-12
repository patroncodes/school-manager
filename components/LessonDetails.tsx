import { UserRole } from '@/types'
import { Lesson } from '@prisma/client'
import { FileText } from 'lucide-react'
import { ReactNode } from 'react'
import FormContainer from './FormContainer'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface LessonDetailsProps {
    lesson: {
        teacher: {
            id: string;
            name: string;
            surname: string;
        };
        class: {
            name: string;
            students: {
                id: string;
                name: string;
                surname: string;
            }[];
        };
        subject: {
            id: number;
            name: string;
        };
        attendances: {
            present: boolean;
            studentId: string;
        }[];
        assignments: {
            id: number;
            title: string;
            dueDate: Date;
        }[];
    } & Lesson

    role: UserRole;
    userId: string;
}

const LessonDetails = ({ lesson, role, userId }: LessonDetailsProps) => {
    return (
        <div>
            <Tabs defaultValue="details" className="space-y-4 rounded-lg">
                <TabsList className="flex w-full gap-4">
                    <TabsTrigger value="details">Lesson Details</TabsTrigger>
                    <TabsTrigger value="materials">Materials</TabsTrigger>
                </TabsList>

                {/* Lesson Details Tab */}
                <TabsContent value="details" className=" space-y-4">

                    <div className="grid gap-4 md:grid-cols-2">
                        <InfoCard
                            header="Lesson Description"
                            cardContent={
                                <p className="text-sm text-muted-foreground">{lesson.description || "N/A"}</p>
                            }
                        />

                        <InfoCard
                            header="Learning Objectives"
                            cardContent={
                                <ul className="space-y-2">
                                    {lesson.objectives.map((objective, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            <span>{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                            }
                        />
                    </div>

                    <InfoCard
                        header="Assignments"
                        headerComponent={
                            role === 'admin' || userId === lesson.teacherId && (
                                <div>
                                    {lesson.assignments.length < 1 ? (
                                        <FormContainer table="assignment" type="create"
                                            data={{
                                                lessonId: lesson.id
                                            }}
                                        />
                                    ) : (
                                        <FormContainer table="assignment" type="update"
                                            data={lesson}
                                        />
                                    )}
                                </div>
                            )}
                        cardContent={
                            <p className="text-sm text-muted-foreground">{lesson.assignments[0]?.title || "N/A"}</p>
                        }
                    />
                </TabsContent>

                {/* Materials Tab */}
                <TabsContent value="materials" className="">
                    <InfoCard
                        header='Required Materials'
                        cardContent={
                            <div className="grid gap-3">
                                {lesson.materials.map((material, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{material}</span>
                                    </div>
                                ))}
                            </div>
                        }
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default LessonDetails

const InfoCard = async ({ header, headerComponent, cardContent }: { header: string; headerComponent?: ReactNode; cardContent: ReactNode }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center w-full">
                    <CardTitle>{header}</CardTitle>

                    {headerComponent}
                </div>
            </CardHeader>
            <CardContent>
                {cardContent}
            </CardContent>
        </Card>
    )
}