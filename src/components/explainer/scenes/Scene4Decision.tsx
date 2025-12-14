import { cn } from '@/lib/utils';
import { Check, Plus, Archive } from 'lucide-react';
import { GravityDecision } from '../visualizations/GravityDecision';

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
      {/* Gravity physics visualization */}
      <GravityDecision isActive={isActive} showDrop={showDrop} className="opacity-45" />

      {/* Text content */}
      <div className="text-center mb-8 md:mb-12 z-10">
        <h2 className={cn(
          "text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-premium",
          "transition-all duration-700 delay-100",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <span className="font-serif italic text-glow-lavender">You keep, expand, or discard.</span>
        </h2>
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed",
          "transition-all duration-700 delay-200",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          If it doesn&apos;t pay for itself, we shouldn&apos;t ship it.
        </p>
      </div>

      {/* Mini prototype flow (drops into selected card) */}
      <div className={cn(
        "mb-8 transition-all duration-700 delay-300 z-10",
        isActive ? "opacity-100" : "opacity-0",
        showDrop ? "animate-drop" : ""
      )}>
        <div className={cn(
          "flex items-center gap-2.5 px-5 py-2.5 rounded-xl",
          "glass-card border-gradient shadow-lg shadow-primary/10"
        )}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <span className="text-xs md:text-sm text-primary font-semibold tracking-wide">Your prototype</span>
          <div className="flex gap-1.5 ml-1">
            <div className="w-2 h-2 rounded-full bg-primary/50" />
            <div className="w-2 h-2 rounded-full bg-secondary/50" />
            <div className="w-2 h-2 rounded-full bg-primary/50" />
          </div>
        </div>
      </div>

      {/* Decision cards with premium styling */}
      <div className={cn(
        "relative w-full max-w-3xl z-10",
        "transition-all duration-700 delay-400",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {decisionCards.map((card, i) => (
            <div
              key={i}
              className={cn(
                "relative flex flex-col items-center p-7 md:p-8 rounded-2xl",
                "transition-all duration-500 hover-lift",
                card.selected 
                  ? "glass-card-elevated border-primary/40 shadow-xl shadow-primary/15 glow-lavender" 
                  : "glass-card border-border/40 hover:border-muted-foreground/30",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${500 + i * 80}ms` }}
            >
              {/* Selection glow ring */}
              {card.selected && isActive && (
                <div className="absolute inset-0 rounded-2xl animate-glow opacity-50" />
              )}
              
              {/* Icon with gradient background */}
              <div className={cn(
                "p-4 rounded-2xl mb-4",
                card.selected 
                  ? "bg-gradient-to-br from-primary/15 to-secondary/10" 
                  : "bg-muted/50"
              )}>
                <card.icon className={cn(
                  "w-8 h-8 md:w-10 md:h-10",
                  card.selected ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              
              <span className={cn(
                "text-xl md:text-2xl font-bold mb-2 tracking-wide",
                card.selected ? "text-primary text-glow-lavender" : "text-foreground"
              )}>
                {card.label}
              </span>
              
              <span className="text-sm text-muted-foreground text-center tracking-wide">
                {card.description}
              </span>

              {/* Selected indicator - premium badge */}
              {card.selected && (
                <div className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2",
                  "px-4 py-1.5 rounded-full",
                  "bg-gradient-to-r from-primary via-primary to-secondary",
                  "text-primary-foreground",
                  "text-xs font-bold uppercase tracking-wider",
                  "shadow-lg shadow-primary/30",
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
