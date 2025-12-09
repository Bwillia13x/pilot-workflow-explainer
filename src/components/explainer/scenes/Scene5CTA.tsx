import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
      {/* Soft gradient background */}
      <div className={cn(
        "absolute inset-0 opacity-50",
        "bg-gradient-to-b from-transparent via-lavender-light/30 to-lavender-light/50"
      )} />

      {/* Logo */}
      <div className={cn(
        "mb-8 transition-all duration-700 delay-100",
        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-foreground flex items-center justify-center">
            <span className="text-xl md:text-2xl font-bold text-background">P</span>
          </div>
          <span className="text-2xl md:text-3xl font-bold text-foreground">Prairie Signal</span>
        </div>
      </div>

      {/* Text content */}
      <div className="text-center mb-10 md:mb-12 z-10 max-w-2xl">
        <h2 className={cn(
          "text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4",
          "transition-all duration-700 delay-200",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <span className="font-serif italic">Want to see if a pilot makes sense?</span>
        </h2>
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground",
          "transition-all duration-700 delay-300",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          On this call, we identify 1–2 workflows that should pay for themselves in under 90 days.
        </p>
      </div>

      {/* CTA Button */}
      <div className={cn(
        "flex flex-col items-center gap-4",
        "transition-all duration-700 delay-400",
        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        <Button
          size="lg"
          className={cn(
            "relative px-8 py-6 text-lg md:text-xl font-semibold rounded-xl",
            "bg-foreground text-background",
            "hover:bg-foreground/90",
            "transition-all duration-300",
            "group overflow-hidden shadow-lg",
            isActive && "animate-glow"
          )}
          onClick={() => window.open('https://prairiesignal.ca', '_blank')}
        >
          <span className="relative z-10 flex items-center gap-2 uppercase tracking-wide">
            Book a 30 minute strategy call
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>

        {/* Secondary link */}
        <a
          href="https://prairiesignal.ca"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-sm text-muted-foreground hover:text-foreground transition-colors",
            "flex items-center gap-1 group uppercase tracking-wide"
          )}
        >
          Or see recent builds
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* Tagline */}
      <div className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2",
        "transition-all duration-700 delay-600",
        isActive ? "opacity-100" : "opacity-0"
      )}>
        <span className="text-sm text-muted-foreground">
          Practical AI systems for Alberta businesses
        </span>
      </div>
    </div>
  );
};
