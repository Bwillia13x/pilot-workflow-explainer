import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  totalScenes: number;
  currentScene: number;
}

export const ProgressBar = ({ progress, totalScenes, currentScene }: ProgressBarProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted/30">
      {/* Progress fill */}
      <div
        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
      
      {/* Scene markers */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: totalScenes }).map((_, i) => (
          <div
            key={i}
            className="flex-1 relative"
          >
            {i > 0 && (
              <div className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full",
                currentScene >= i ? "bg-primary/50" : "bg-muted/50"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
