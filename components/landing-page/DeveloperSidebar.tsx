"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Code2 } from "lucide-react";

const techStack = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "shadcn/ui",
  "React Hook Form",
  "Zod",
  "date-fns",
  "Prisma",
  "Pothos",
  "Clerk",
  "Cloudinary",
  "urql",
];

const codeSnippets = [
  {
    title: "Zod grade validation",
    code: `const gradeSchema = z.object({
  grades: z.array(z.string())
    .default([])
    .refine((arr) => arr.length > 0, {
      message: "Select at least one grade"
    })
})`,
  },
  {
    title: "Student schema as function",
    code: `const studentSchema = (minAge: number) => z.object({
  dateOfBirth: z.date()
    .refine((date) => 
      isAfter(date, subYears(new Date(), 18))
    )
})

type Student = z.infer<
  ReturnType<typeof studentSchema>
>`,
  },
  {
    title: "Pothos input example",
    code: `builder.inputType('GradeInput', {
  fields: (t) => ({
    programName: t.string({ required: true }),
    gradeName: t.string({ required: true })
  })
})

builder.inputType('CreateSchoolInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    grades: t.field({ 
      type: [GradeInput], 
      required: true 
    })
  })
})`,
  },
  {
    title: "Prisma transaction",
    code: `await prisma.$transaction(async (tx) => {
  const school = await tx.school.create({
    data: { name, slug }
  })
  
  const program = await tx.program.create({
    data: { name: "Elementary", schoolId: school.id }
  })
  
  await tx.grade.createMany({
    data: grades.map(g => ({
      name: g,
      programId: program.id
    }))
  })
})`,
  },
  {
    title: "useMutation with transform",
    code: `const [, createSchool] = useMutation(CREATE_SCHOOL)

const onSubmit = async (data) => {
  const transformed = {
    input: {
      ...data,
      grades: data.grades.map(g => ({
        programName: data.program,
        gradeName: g
      }))
    }
  }
  
  await createSchool(transformed)
}`,
  },
];

const DeveloperSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-5xl border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Developer Resources
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Technical implementation details and code examples
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
            </div>
          </CardHeader>

          {isExpanded && (
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Code Snippets</h3>
                {codeSnippets.map((snippet) => (
                  <div key={snippet.title} className="space-y-2">
                    <p className="text-sm font-medium text-primary">
                      {snippet.title}
                    </p>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border-l-4 border-primary bg-muted/50 p-4">
                <h3 className="mb-2 text-sm font-semibold">
                  Authentication with Clerk
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use server-side{" "}
                  <code className="rounded bg-muted px-1 py-0.5">
                    clerkClient()
                  </code>{" "}
                  for user creation. Required payload keys:{" "}
                  <code className="rounded bg-muted px-1 py-0.5">
                    emailAddress
                  </code>{" "}
                  or{" "}
                  <code className="rounded bg-muted px-1 py-0.5">
                    phoneNumber
                  </code>
                  . Store{" "}
                  <code className="rounded bg-muted px-1 py-0.5">
                    clerkUserId
                  </code>{" "}
                  in your database for user relationships.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </section>
  );
};

export default DeveloperSidebar;
