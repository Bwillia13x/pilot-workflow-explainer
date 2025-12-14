import { cn } from '@/lib/utils';
import { Zap, Bot, User, Database } from 'lucide-react';
import { DataFlowPipeline } from '../visualizations/DataFlowPipeline';

interface Scene3Props {
  isActive: boolean;
}

const flowSteps = [
  { 
    icon: Zap, 
    label: 'Trigger', 
    sublabel: 'New lead arrives',
    color: 'primary'
  },
  { 
    icon: Bot, 
    label: 'AI Step(s)', 
    sublabel: 'Qualify + draft',
    color: 'primary'
  },
  { 
    icon: User, 
    label: 'Human Decision', 
    sublabel: 'Approve or edit',
    color: 'secondary'
  },
  { 
    icon: Database, 
    label: 'System Update', 
    sublabel: 'CRM + calendar',
    color: 'primary'
  },
];

const outputLabels = [
  'CRM update',
  'Booking created',
  'Summary sent'
];

export const Scene3Prototype = ({ isActive }: Scene3Props) => {
  return (
    <div className={cn(
      "absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12",
      "transition-all duration-700",
      isActive ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      {/* Data flow pipeline visualization */}
      <DataFlowPipeline isActive={isActive} className="opacity-40" />

      {/* Text content */}
      <div className="text-center mb-8 md:mb-12 z-10">
        <h2 className={cn(
          "text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-premium",
          "transition-all duration-700 delay-100",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <span className="font-serif italic text-glow-lavender">We turn it</span> into a running prototype.
        </h2>
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed",
          "transition-all duration-700 delay-200",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          Agentic workflows trigger on real events, not copy-paste.
        </p>
      </div>

      {/* Streamlined flow diagram */}
      <div className={cn(
        "relative w-full max-w-4xl z-10",
        "transition-all duration-700 delay-300",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {/* Flow container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-3">
          {flowSteps.map((step, i) => (
            <div key={i} className="flex items-center">
              {/* Step box with glass effect */}
              <div
                className={cn(
                  "relative flex flex-col items-center p-5 md:p-6 rounded-2xl",
                  "glass-card-elevated hover-lift",
                  step.color === 'secondary' 
                    ? "border-secondary/30 shadow-lg shadow-secondary/10" 
                    : "border-primary/30 shadow-lg shadow-primary/10",
                  "transition-all duration-500",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${400 + i * 120}ms` }}
              >
                {/* Icon container with gradient background */}
                <div className={cn(
                  "p-3.5 rounded-xl mb-3",
                  step.color === 'secondary' 
                    ? "bg-gradient-to-br from-secondary/15 to-secondary/5" 
                    : "bg-gradient-to-br from-primary/15 to-primary/5"
                )}>
                  <step.icon className={cn(
                    "w-6 h-6 md:w-7 md:h-7",
                    step.color === 'secondary' ? "text-secondary" : "text-primary"
                  )} />
                </div>
                <span className={cn(
                  "text-sm md:text-base font-semibold tracking-wide",
                  step.color === 'secondary' ? "text-secondary" : "text-primary"
                )}>
                  {step.label}
                </span>
                <span className="text-xs text-muted-foreground mt-1 tracking-wide">
                  {step.sublabel}
                </span>

                {/* Flow indicator dot with pulse */}
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2">
                    <span className="relative flex h-3 w-3">
                      <span className={cn(
                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                        step.color === 'secondary' ? "bg-secondary" : "bg-primary"
                      )} style={{ animationDelay: `${i * 0.4}s` }} />
                      <span className={cn(
                        "relative inline-flex rounded-full h-3 w-3",
                        step.color === 'secondary' ? "bg-secondary" : "bg-primary"
                      )} />
                    </span>
                  </div>
                )}
              </div>

              {/* Arrow connector with animated flow */}
              {i < flowSteps.length - 1 && (
                <div className={cn(
                  "hidden md:flex items-center mx-3",
                  "transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDelay: `${500 + i * 120}ms` }}
                >
                  <div className="w-10 h-1 rounded-full bg-gradient-to-r from-primary/30 to-primary/10 relative overflow-hidden">
                    {isActive && (
                      <div 
                        className="absolute inset-0 w-5 h-full bg-gradient-to-r from-transparent via-primary to-transparent animate-flow"
                        style={{ animationDelay: `${i * 0.25}s` }}
                      />
                    )}
                  </div>
                  <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[7px] border-t-transparent border-b-transparent border-l-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Output labels - premium pills */}
        <div className={cn(
          "flex flex-wrap justify-center gap-3 mt-10",
          "transition-all duration-500 delay-1000",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {outputLabels.map((label, i) => (
            <span
              key={i}
              className={cn(
                "px-4 py-2 rounded-full text-xs md:text-sm font-semibold",
                "glass-card border-gradient",
                "text-primary tracking-wide",
                "transition-all duration-300 hover-lift"
              )}
              style={{ transitionDelay: `${1100 + i * 80}ms` }}
            >
              <span className="relative z-10">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
