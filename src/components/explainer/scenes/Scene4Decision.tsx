import { cn } from '@/lib/utils';
import { Check, Plus, Archive } from 'lucide-react';

interface Scene4Props {
  isActive: boolean;
  showDrop: boolean;
}

const decisionCards = [
  { 
    icon: Check, 
    label: 'Keep', 
    description: 'Ship it as-is',
    selected: true
  },
  { 
    icon: Plus, 
    label: 'Expand', 
    description: 'Add more workflows',
    selected: false
  },
  { 
    icon: Archive, 
    label: 'Discard', 
    description: 'Not worth it',
    selected: false
  },
];

export const Scene4Decision = ({ isActive, showDrop }: Scene4Props) => {
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
          <span className="font-serif italic">You keep, expand, or discard.</span>
        </h2>
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto",
          "transition-all duration-700 delay-200",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          If it doesn&apos;t pay for itself, we shouldn&apos;t ship it.
        </p>
      </div>

      {/* Mini prototype flow (drops into selected card) */}
      <div className={cn(
        "mb-8 transition-all duration-700 delay-300",
        isActive ? "opacity-100" : "opacity-0",
        showDrop ? "animate-drop" : ""
      )}>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs md:text-sm text-primary font-medium">Your prototype</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          </div>
        </div>
      </div>

      {/* Decision cards */}
      <div className={cn(
        "relative w-full max-w-3xl",
        "transition-all duration-700 delay-400",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {decisionCards.map((card, i) => (
            <div
              key={i}
              className={cn(
                "relative flex flex-col items-center p-6 md:p-8 rounded-xl",
                "border-2 bg-background shadow-sm transition-all duration-500",
                card.selected 
                  ? "border-primary shadow-lg shadow-primary/10" 
                  : "border-border hover:border-muted-foreground/30",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${500 + i * 100}ms` }}
            >
              {/* Selection glow */}
              {card.selected && isActive && (
                <div className="absolute inset-0 rounded-xl animate-glow" />
              )}
              
              <div className={cn(
                "p-4 rounded-full mb-4",
                card.selected ? "bg-primary/10" : "bg-muted"
              )}>
                <card.icon className={cn(
                  "w-8 h-8 md:w-10 md:h-10",
                  card.selected ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              
              <span className={cn(
                "text-xl md:text-2xl font-bold mb-2",
                card.selected ? "text-primary" : "text-foreground"
              )}>
                {card.label}
              </span>
              
              <span className="text-sm text-muted-foreground text-center">
                {card.description}
              </span>

              {/* Selected indicator */}
              {card.selected && (
                <div className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2",
                  "px-3 py-1 rounded-full bg-primary text-primary-foreground",
                  "text-xs font-semibold uppercase tracking-wide",
                  "transition-all duration-500 delay-800",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"
                )}>
                  Client decides
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
