import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ProgressSteps = ({
  steps,
  currentStep,
}: {
  currentStep: number;
  steps: {
    id: number;
    title: string;
    description: string;
  }[];
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-1 items-center">
          <div className="flex flex-1 flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                currentStep > step.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : currentStep === step.id
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground",
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="font-semibold">{step.id}</span>
              )}
            </div>
            <div className="mt-2 hidden text-center sm:block">
              <p className="text-sm font-medium text-foreground">
                {step.title}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 flex-1 transition-colors",
                currentStep > step.id ? "bg-primary" : "bg-border",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
export default ProgressSteps;
