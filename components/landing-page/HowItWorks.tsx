import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    step: "A",
    title: "Admin runs Onboarding wizard",
    description: "Creates School entity with slug, logo, and basic details",
    callout: "Multi-step form with validation at each stage",
  },
  {
    step: "B",
    title: "System creates Programs & Grades",
    description:
      "Creates Program entities with IDs, maps selected grades, creates Grade rows",
    callout: "Uses Prisma transactions (tx) for referential integrity",
  },
  {
    step: "C",
    title: "Provision manager & finalize",
    description:
      "Creates manager in Clerk, creates manager profile, returns complete school setup",
    callout:
      "Transforms grades: string[] into { programName, gradeName }[] for backend",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-pretty text-muted-foreground">
            Three simple steps to get your school up and running
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="mb-8 flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      {step.step}
                    </div>
                  </div>
                  <Card className="flex-1">
                    <CardContent className="pt-6">
                      <h3 className="mb-2 text-xl font-semibold">
                        {step.title}
                      </h3>
                      <p className="mb-3 text-muted-foreground">
                        {step.description}
                      </p>
                      <div className="rounded-lg border-l-4 border-primary bg-muted/50 p-3">
                        <p className="text-sm font-medium">{step.callout}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-12 bottom-0 left-6 w-0.5 -translate-x-1/2 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
