import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { Code } from "lucide-react"; // Import Code component

const steps = [
  {
    title: "School Details",
    description: "Enter school name, slug, and upload logo",
    uxNote: "Slug auto-generated from name, editable",
  },
  {
    title: "Programs",
    description:
      "Select or create academic programs (e.g., Elementary, High School)",
    uxNote: "Multi-select with custom program creation",
  },
  {
    title: "Grade Picker",
    description: "Dynamic grade selection based on chosen programs",
    uxNote: "Only shows grades available for selected programs",
  },
  {
    title: "Manager Creation",
    description: "Provision first manager account with Clerk authentication",
    uxNote: "Email or phone required; password set via Clerk",
  },
  {
    title: "Review & Confirm",
    description: "Review all selections before final submission",
    uxNote: "Edit any step before confirming",
  },
];

const OnboardingWalkthrough = () => {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Onboarding walkthrough
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-pretty text-muted-foreground">
            A guided, multi-step process that gets schools operational in
            minutes
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step.title} className="relative">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <Badge variant="outline" className="text-xs">
                      Step {index + 1}
                    </Badge>
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  <div className="border-t pt-2">
                    <p className="mb-1 text-xs font-medium text-primary">
                      UX Note
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.uxNote}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Validation Strategy</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow empty arrays as initial defaults, refine validation
                    with{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                      .refine()
                    </code>{" "}
                    and{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                      .default([])
                    </code>{" "}
                    in Zod. Transform data before submit to match backend
                    schema.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default OnboardingWalkthrough;
