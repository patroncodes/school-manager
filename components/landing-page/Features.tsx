import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Workflow,
  GraduationCap,
  Users,
  UserPlus,
  Baby,
  Upload,
  Code,
} from "lucide-react";

const features = [
  {
    icon: Workflow,
    title: "Onboarding Wizard",
    description:
      "Multi-step form for school details, programs, and grade selection with review & confirm step.",
    devNote:
      "Uses React Hook Form + Zod; server-side validation mirrors client",
  },
  {
    icon: GraduationCap,
    title: "Programs & Grade Management",
    description:
      "Map programs to available grades with gradeMap. Prevent duplicate grade assignments across programs.",
    devNote: "Compute availableGrades by selectedPrograms.flatMap(...)",
  },
  {
    icon: Users,
    title: "Staff & Manager Provisioning",
    description:
      "Create Clerk users, store clerkUserId, and run manager onboarding flow with transactional integrity.",
    devNote:
      "Transactional creation (Prisma tx) + Clerk user; pass emailAddress or phoneNumber",
  },
  {
    icon: UserPlus,
    title: "Parent & Guardian Accounts",
    description:
      "Separate parent accounts with primary vs secondary guardian relationships. Per-ward access control.",
    devNote:
      "Primary guardian default, secondary optional with explicit approval flow",
  },
  {
    icon: Baby,
    title: "Student Lifecycle",
    description:
      "Seed students with DOB validation (18+ for staff, age rules for students). Automatic grade assignment.",
    devNote: "Zod date checks with date-fns subYears + isAfter/isBefore",
  },
  {
    icon: Upload,
    title: "File & Media",
    description:
      "Cloudinary uploader for school logos and manager photos. Controller-backed React Hook Form integration.",
    devNote: "Use CldUploadWidget, Controller and field.onChange(result.info)",
  },
  {
    icon: Code,
    title: "APIs & Integrations",
    description:
      "GraphQL with Pothos, Prisma ORM, Clerk auth, and urql client for frontend queries and mutations.",
    devNote:
      "useMutation(CREATE_SCHOOL) with correct variable shape { input: { ... } }",
  },
];

const Features = () => {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Powerful features for modern schools
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-pretty text-muted-foreground">
            From onboarding to daily operations, every feature is designed for
            efficiency and developer experience
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <div className="border-t pt-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    Dev note
                  </Badge>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {feature.devNote}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
