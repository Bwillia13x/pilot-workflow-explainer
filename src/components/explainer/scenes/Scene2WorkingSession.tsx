import { cn } from '@/lib/utils';

interface Scene2Props {
  isActive: boolean;
}

const workflowSteps = [
  { label: 'Lead inquiry', highlighted: false },
  { label: 'Manual triage', highlighted: true },
  { label: 'CRM lookup', highlighted: false },
  { label: 'Route to rep', highlighted: true },
  { label: 'Draft reply', highlighted: true },
  { label: 'Schedule call', highlighted: false },
  { label: 'Send confirmation', highlighted: false },
  { label: 'Update status', highlighted: false },
  { label: 'Log activity', highlighted: true },
  { label: 'Follow-up reminder', highlighted: false },
  { label: 'Report entry', highlighted: false },
  { label: 'Manager review', highlighted: false },
];

export const Scene2WorkingSession = ({ isActive }: Scene2Props) => {
  return (
    <div className={cn(
      "absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12",
      "transition-all duration-700",
      isActive ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      {/* Text content */}
      <div className="text-center mb-8 md:mb-12 z-10">
        <h2 className={cn(
          "text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4",
          "transition-all duration-700 delay-100",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <span className="font-serif">We sit down</span> for a working session.
        </h2>
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto",
          "transition-all duration-700 delay-200",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          In 60 minutes, we map the one workflow that actually hurts.
        </p>
      </div>

      {/* Whiteboard-style diagram */}
      <div className={cn(
        "relative w-full max-w-4xl",
        "transition-all duration-700 delay-300",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {/* Main whiteboard container */}
        <div className="bg-background/80 border border-border rounded-xl p-6 md:p-8 shadow-sm backdrop-blur-sm">
          {/* Grid of workflow steps */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {workflowSteps.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "relative px-3 py-2 md:px-4 md:py-3 rounded-lg border text-center",
                  "transition-all duration-500",
                  step.highlighted 
                    ? "bg-secondary/10 border-secondary text-secondary animate-highlight" 
                    : "bg-muted/30 border-border text-muted-foreground",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${400 + i * 50}ms` }}
              >
                <span className="text-xs md:text-sm font-medium">{step.label}</span>
                {step.highlighted && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded uppercase tracking-wide">
                    High friction
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Target caption */}
        <div className={cn(
          "mt-4 md:mt-6 text-right",
          "transition-all duration-500 delay-1000",
          isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm font-medium text-secondary">
              Target: pays for itself in &lt; 90 days
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
