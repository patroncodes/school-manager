import {
  Hero,
  Benefits,
  Features,
  HowItWorks,
  OnboardingWalkthrough,
  Pricing,
  DeveloperSidebar,
  Security,
  FAQ,
  Footer,
} from "@/components/landing-page";

const LandingPage = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Benefits />
      <Features />
      <HowItWorks />
      <OnboardingWalkthrough />
      <DeveloperSidebar />
      <Pricing />
      <Security />
      <FAQ />
      <Footer />
    </main>
  );
};

export default LandingPage;
