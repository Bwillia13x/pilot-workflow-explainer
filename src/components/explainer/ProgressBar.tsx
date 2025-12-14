import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  totalScenes: number;
  currentScene: number;
}

export const ProgressBar = ({ progress, totalScenes, currentScene }: ProgressBarProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      {/* Glass background */}
      <div className="h-2 bg-background/50 backdrop-blur-sm border-t border-border/30">
        {/* Progress fill with gradient */}
        <div
          className={cn(
            "h-full transition-all duration-100 ease-linear",
            "bg-gradient-to-r from-primary via-secondary to-primary",
            "relative overflow-hidden"
          )}
          style={{ 
            width: `${progress}%`,
            backgroundSize: '200% 100%',
          }}
        >
          {/* Shimmer effect */}
          <div className={cn(
            "absolute inset-0",
            "bg-gradient-to-r from-transparent via-white/30 to-transparent",
            "animate-flow"
          )} />
        </div>
      </div>
      
      {/* Scene markers */}
      <div className="absolute inset-0 flex h-2">
        {Array.from({ length: totalScenes }).map((_, i) => (
          <div
            key={i}
            className="flex-1 relative"
          >
            {i > 0 && (
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-0.5",
                "transition-all duration-300",
                currentScene >= i 
                  ? "bg-primary-foreground/30" 
                  : "bg-border/50"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Glow effect under progress */}
      <div 
        className="absolute bottom-0 left-0 h-8 pointer-events-none transition-all duration-100"
        style={{ 
          width: `${progress}%`,
          background: 'linear-gradient(to top, hsl(var(--primary) / 0.15), transparent)',
        }}
      />
    </div>
  );
};
