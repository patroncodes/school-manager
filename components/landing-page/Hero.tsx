import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, PlayCircle } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Run your school with fewer meetings, less paperwork
              </h1>
              <p className="max-w-xl text-lg text-pretty text-muted-foreground">
                Fast onboarding, program-aware grade management, Clerk-powered
                authentication, and robust APIs for developer s. Start a free
                trial — no credit card required.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/onboard" className="gap-2">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <PlayCircle className="h-4 w-4" />
                Request demo
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border bg-card shadow-2xl">
              <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="space-y-4 p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Code2 className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dashboard mockup
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 h-32 w-48 rounded-lg border bg-card p-4 shadow-lg">
              <p className="mb-2 text-xs font-medium">Onboarding wizard</p>
              <div className="space-y-2">
                <div className="h-2 rounded bg-primary/20" />
                <div className="h-2 w-3/4 rounded bg-primary/20" />
                <div className="h-2 w-1/2 rounded bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
