import SchoolOnboardingForm from "@/components/forms/SchoolOnboadingForm";

const OnboardPage = () => {
  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Welcome to SchoolKit
          </h1>
          <p className="text-lg text-muted-foreground">
            Let&apos;s get your school set up in just a few steps
          </p>
        </div>
        <SchoolOnboardingForm />
      </div>
    </div>
  );
};

export default OnboardPage;
