import { cn } from '@/lib/utils';
import { NetworkSimulation } from '../visualizations/NetworkSimulation';

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
      {/* Network simulation background */}
      <NetworkSimulation isActive={isActive} className="opacity-35" />

      {/* Text content */}
      <div className="text-center mb-8 md:mb-12 z-10">
        <h2 className={cn(
          "text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-premium",
          "transition-all duration-700 delay-100",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <span className="font-serif italic text-glow-lavender">We sit down</span> for a working session.
        </h2>
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed",
          "transition-all duration-700 delay-200",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          In 60 minutes, we map the one workflow that actually hurts.
        </p>
      </div>

      {/* Whiteboard-style diagram with glass effect */}
      <div className={cn(
        "relative w-full max-w-4xl z-10",
        "transition-all duration-700 delay-300",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {/* Main whiteboard container */}
        <div className="glass-card-elevated rounded-2xl p-6 md:p-8">
          {/* Grid of workflow steps */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {workflowSteps.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "relative px-3 py-2.5 md:px-4 md:py-3 rounded-xl border text-center",
                  "transition-all duration-500 hover-lift",
                  step.highlighted 
                    ? "glass border-secondary/40 text-secondary shadow-lg shadow-secondary/10" 
                    : "bg-muted/40 border-border/50 text-muted-foreground",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${400 + i * 40}ms` }}
              >
                <span className="text-xs md:text-sm font-medium tracking-wide">{step.label}</span>
                {step.highlighted && (
                  <span className={cn(
                    "absolute -top-2.5 -right-2 px-2 py-0.5",
                    "bg-gradient-to-r from-secondary to-teal-glow",
                    "text-secondary-foreground text-[9px] md:text-[10px] font-bold rounded-full",
                    "uppercase tracking-wider shadow-md shadow-secondary/20"
                  )}>
                    High friction
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Target caption - premium badge */}
        <div className={cn(
          "mt-5 md:mt-6 text-right",
          "transition-all duration-500 delay-1000",
          isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}>
          <span className={cn(
            "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full",
            "glass-card border-gradient shadow-lg shadow-secondary/10"
          )}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
            </span>
            <span className="text-sm font-semibold text-secondary tracking-wide">
              Target: pays for itself in &lt; 90 days
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
