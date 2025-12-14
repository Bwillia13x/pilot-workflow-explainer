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
        "bg-background noise-overlay"
      )}
      aria-label="How a Pilot Works - Prairie Signal"
    >
      {/* Soft lavender gradient overlay */}
      <div className="absolute inset-0 gradient-lavender-radial pointer-events-none" />
      
      {/* Particle background */}
      <ParticleField />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

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

      {/* Controls - Premium glass styling */}
      <div className="absolute bottom-8 right-8 flex items-center gap-3 z-30">
        {/* Pause/Play button */}
        {!isComplete && (
          <button
            onClick={togglePause}
            className={cn(
              "p-3 rounded-full",
              "glass-card hover-lift",
              "text-muted-foreground hover:text-foreground",
              "transition-all duration-300"
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
            "flex items-center gap-2.5 px-5 py-3 rounded-full",
            "glass-card hover-lift",
            "text-muted-foreground hover:text-foreground",
            "transition-all duration-300",
            isComplete && "glow-lavender animate-glow"
          )}
          aria-label="Replay animation"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wide">Replay</span>
        </button>
      </div>

      {/* Scene indicator (small dots) - Premium styling */}
      <div className="absolute bottom-8 left-8 flex items-center gap-2.5 z-30">
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
              "h-2.5 rounded-full transition-all duration-300",
              "hover:scale-110",
              currentScene === i 
                ? "bg-gradient-to-r from-primary to-secondary w-8 shadow-md shadow-primary/30" 
                : currentScene > i 
                  ? "bg-primary/50 w-2.5" 
                  : "bg-border/60 w-2.5 hover:bg-border"
            )}
            aria-label={`Go to scene ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
