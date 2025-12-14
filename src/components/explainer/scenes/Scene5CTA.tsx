import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ConvergingParticles } from '../visualizations/ConvergingParticles';

interface Scene5Props {
  isActive: boolean;
}

export const Scene5CTA = ({ isActive }: Scene5Props) => {
  return (
    <div className={cn(
      "absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12",
      "transition-all duration-700",
      isActive ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      {/* Converging particles visualization */}
      <ConvergingParticles isActive={isActive} className="opacity-50" />

      {/* Soft gradient background */}
      <div className={cn(
        "absolute inset-0 opacity-60 pointer-events-none",
        "bg-gradient-to-b from-transparent via-lavender-light/40 to-lavender-light/60"
      )} />

      {/* Logo with glass effect */}
      <div className={cn(
        "mb-10 transition-all duration-700 delay-100 z-10",
        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 md:w-14 md:h-14 rounded-xl",
            "bg-gradient-to-br from-foreground to-foreground/80",
            "flex items-center justify-center",
            "shadow-xl shadow-foreground/20"
          )}>
            <span className="text-2xl md:text-3xl font-bold text-background">P</span>
          </div>
          <span className="text-2xl md:text-3xl font-bold text-foreground tracking-premium">
            Prairie Signal
          </span>
        </div>
      </div>

      {/* Text content */}
      <div className="text-center mb-12 md:mb-14 z-10 max-w-2xl">
        <h2 className={cn(
          "text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 tracking-premium",
          "transition-all duration-700 delay-200",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <span className="font-serif italic text-glow-lavender">Want to see if a pilot makes sense?</span>
        </h2>
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground leading-relaxed",
          "transition-all duration-700 delay-300",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          On this call, we identify 1–2 workflows that should pay for themselves in under 90 days.
        </p>
      </div>

      {/* CTA Button - Premium Hero Style */}
      <div className={cn(
        "flex flex-col items-center gap-5 z-10",
        "transition-all duration-700 delay-400",
        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <Button
          variant="hero"
          size="xl"
          className={cn(
            "relative group shimmer",
            isActive && "animate-glow"
          )}
          onClick={() => window.open('https://prairiesignal.ca', '_blank')}
        >
          <Sparkles className="w-5 h-5 mr-1 opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="uppercase tracking-wide-premium font-bold">
            Book a 30 minute strategy call
          </span>
          <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>

        {/* Secondary link */}
        <a
          href="https://prairiesignal.ca"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-sm text-muted-foreground hover:text-foreground transition-all duration-300",
            "flex items-center gap-1.5 group",
            "uppercase tracking-wide-premium font-medium",
            "hover:tracking-widest"
          )}
        >
          Or see recent builds
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>

      {/* Tagline with glass pill */}
      <div className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 z-10",
        "transition-all duration-700 delay-600",
        isActive ? "opacity-100" : "opacity-0"
      )}>
        <span className={cn(
          "inline-block px-6 py-2.5 rounded-full",
          "glass-card text-sm text-muted-foreground font-medium tracking-wide"
        )}>
          Practical AI systems for Alberta businesses
        </span>
      </div>
    </div>
  );
};
