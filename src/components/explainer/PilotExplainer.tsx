import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ParticleField } from './ParticleField';
import { ProgressBar } from './ProgressBar';
import { Scene1MessyToday } from './scenes/Scene1MessyToday';
import { Scene2WorkingSession } from './scenes/Scene2WorkingSession';
import { Scene3Prototype } from './scenes/Scene3Prototype';
import { Scene4Decision } from './scenes/Scene4Decision';
import { Scene5CTA } from './scenes/Scene5CTA';
import { RotateCcw, Pause, Play } from 'lucide-react';

const SCENE_DURATION = 5500; // 5.5 seconds per scene
const TOTAL_SCENES = 5;
const TOTAL_DURATION = SCENE_DURATION * TOTAL_SCENES; // ~27.5 seconds total

export const PilotExplainer = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showScene4Drop, setShowScene4Drop] = useState(false);

  const resetAnimation = useCallback(() => {
    setCurrentScene(0);
    setProgress(0);
    setIsComplete(false);
    setShowScene4Drop(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (isPaused || isComplete) return;

    const startTime = Date.now() - (progress / 100) * TOTAL_DURATION;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      const newScene = Math.min(Math.floor(elapsed / SCENE_DURATION), TOTAL_SCENES - 1);
      
      setProgress(newProgress);
      setCurrentScene(newScene);

      // Trigger drop animation in Scene 4
      if (newScene === 3 && elapsed % SCENE_DURATION > 1500) {
        setShowScene4Drop(true);
      }

      if (newProgress >= 100) {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused, isComplete, progress]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <section 
      className={cn(
        "relative w-full min-h-screen overflow-hidden",
        "gradient-prairie bg-grid"
      )}
      aria-label="How a Pilot Works - Prairie Signal"
    >
      {/* Particle background */}
      <ParticleField />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20 pointer-events-none" />

      {/* Scene container */}
      <div className="relative w-full h-screen">
        <Scene1MessyToday isActive={currentScene === 0} />
        <Scene2WorkingSession isActive={currentScene === 1} />
        <Scene3Prototype isActive={currentScene === 2} />
        <Scene4Decision isActive={currentScene === 3} showDrop={showScene4Drop} />
        <Scene5CTA isActive={currentScene === 4} />
      </div>

      {/* Progress bar */}
      <ProgressBar 
        progress={progress} 
        totalScenes={TOTAL_SCENES} 
        currentScene={currentScene} 
      />

      {/* Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3">
        {/* Pause/Play button */}
        {!isComplete && (
          <button
            onClick={togglePause}
            className={cn(
              "p-2.5 rounded-full",
              "bg-card/50 backdrop-blur-sm border border-border/50",
              "text-muted-foreground hover:text-foreground",
              "transition-all duration-200 hover:scale-105"
            )}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Replay button */}
        <button
          onClick={resetAnimation}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-full",
            "bg-card/50 backdrop-blur-sm border border-border/50",
            "text-muted-foreground hover:text-foreground",
            "transition-all duration-200 hover:scale-105",
            isComplete && "animate-pulse"
          )}
          aria-label="Replay animation"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm font-medium">Replay</span>
        </button>
      </div>

      {/* Scene indicator (small dots) */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        {Array.from({ length: TOTAL_SCENES }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentScene(i);
              setProgress((i / TOTAL_SCENES) * 100);
              setIsComplete(false);
              if (i < 3) setShowScene4Drop(false);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              currentScene === i 
                ? "bg-primary w-6" 
                : currentScene > i 
                  ? "bg-primary/50" 
                  : "bg-muted/50"
            )}
            aria-label={`Go to scene ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
