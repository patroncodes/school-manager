import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, FileCheck, Server } from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "Role-based access control",
    description:
      "Granular permissions for parents, students, teachers, and administrators",
  },
  {
    icon: Lock,
    title: "Enterprise authentication",
    description:
      "Optional SAML/SSO integration with Clerk for identity management",
  },
  {
    icon: FileCheck,
    title: "Audit logs & compliance",
    description:
      "Complete audit trails for all data changes. SOC2-ready infrastructure",
  },
  {
    icon: Server,
    title: "Data security",
    description:
      "Encrypted at rest, server-side validation, automatic backups, data residency options",
  },
];

const Security = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Security & Compliance
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-pretty text-muted-foreground">
            Enterprise-grade security built in from day one
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
