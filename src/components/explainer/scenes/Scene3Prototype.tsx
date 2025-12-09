import { cn } from '@/lib/utils';
import { Zap, Bot, User, Database } from 'lucide-react';

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
      {/* Text content */}
      <div className="text-center mb-8 md:mb-12 z-10">
        <h2 className={cn(
          "text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4",
          "transition-all duration-700 delay-100",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <span className="font-serif">We turn it</span> into a running prototype.
        </h2>
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto",
          "transition-all duration-700 delay-200",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          Agentic workflows trigger on real events, not copy-paste.
        </p>
      </div>

      {/* Streamlined flow diagram */}
      <div className={cn(
        "relative w-full max-w-4xl",
        "transition-all duration-700 delay-300",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {/* Flow container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
          {flowSteps.map((step, i) => (
            <div key={i} className="flex items-center">
              {/* Step box */}
              <div
                className={cn(
                  "relative flex flex-col items-center p-4 md:p-6 rounded-xl",
                  "border-2 bg-background shadow-sm",
                  step.color === 'secondary' 
                    ? "border-secondary/50" 
                    : "border-primary/50",
                  "transition-all duration-500",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${400 + i * 150}ms` }}
              >
                <div className={cn(
                  "p-3 rounded-lg mb-2",
                  step.color === 'secondary' ? "bg-secondary/10" : "bg-primary/10"
                )}>
                  <step.icon className={cn(
                    "w-6 h-6 md:w-8 md:h-8",
                    step.color === 'secondary' ? "text-secondary" : "text-primary"
                  )} />
                </div>
                <span className={cn(
                  "text-sm md:text-base font-semibold",
                  step.color === 'secondary' ? "text-secondary" : "text-primary"
                )}>
                  {step.label}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {step.sublabel}
                </span>

                {/* Flow indicator dot */}
                {isActive && (
                  <div 
                    className={cn(
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full",
                      step.color === 'secondary' ? "bg-secondary" : "bg-primary",
                      "animate-pulse"
                    )}
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                )}
              </div>

              {/* Arrow connector */}
              {i < flowSteps.length - 1 && (
                <div className={cn(
                  "hidden md:flex items-center mx-2",
                  "transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDelay: `${500 + i * 150}ms` }}
                >
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary/40 to-primary/20 relative overflow-hidden">
                    {isActive && (
                      <div 
                        className="absolute inset-0 w-4 h-full bg-primary animate-flow"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    )}
                  </div>
                  <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Output labels */}
        <div className={cn(
          "flex flex-wrap justify-center gap-3 mt-8",
          "transition-all duration-500 delay-1000",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {outputLabels.map((label, i) => (
            <span
              key={i}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs md:text-sm font-medium",
                "bg-primary/10 border border-primary/30 text-primary",
                "transition-all duration-300"
              )}
              style={{ transitionDelay: `${1100 + i * 100}ms` }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
