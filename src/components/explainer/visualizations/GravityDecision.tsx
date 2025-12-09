import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface GravityDecisionProps {
  isActive: boolean;
  showDrop: boolean;
  className?: string;
}

interface FallingObject {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  landed: boolean;
  targetX: number;
  targetY: number;
}

export const GravityDecision = ({ isActive, showDrop, className }: GravityDecisionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const objectsRef = useRef<FallingObject[]>([]);
  const timeRef = useRef(0);
  const hasDroppedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    const rect = canvas.getBoundingClientRect();

    // Initialize falling objects when drop is triggered
    const initObjects = () => {
      const centerX = rect.width / 2;
      objectsRef.current = [];
      
      // Main object (the prototype)
      objectsRef.current.push({
        x: centerX,
        y: rect.height * 0.15,
        vy: 0,
        vx: 0,
        size: 30,
        rotation: 0,
        rotationSpeed: 0.02,
        opacity: 1,
        landed: false,
        targetX: centerX - rect.width * 0.25, // First card position
        targetY: rect.height * 0.65,
      });

      // Trailing particles
      for (let i = 0; i < 8; i++) {
        objectsRef.current.push({
          x: centerX + (Math.random() - 0.5) * 40,
          y: rect.height * 0.15 + Math.random() * 20,
          vy: 0,
          vx: (Math.random() - 0.5) * 2,
          size: 4 + Math.random() * 6,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          opacity: 0.6 + Math.random() * 0.4,
          landed: false,
          targetX: centerX - rect.width * 0.25 + (Math.random() - 0.5) * 60,
          targetY: rect.height * 0.65 + Math.random() * 30,
        });
      }
    };

    const gravity = 0.15;
    const bounce = 0.3;
    const friction = 0.98;

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      timeRef.current += 0.016;

      // Initialize objects when drop starts
      if (showDrop && !hasDroppedRef.current) {
        hasDroppedRef.current = true;
        initObjects();
      }

      // Draw target zones (card outlines)
      const cardWidth = rect.width * 0.22;
      const cardHeight = rect.height * 0.35;
      const cardY = rect.height * 0.55;
      const cardPositions = [
        { x: rect.width * 0.2, label: 'Keep', active: true },
        { x: rect.width * 0.5, label: 'Expand', active: false },
        { x: rect.width * 0.8, label: 'Discard', active: false },
      ];

      cardPositions.forEach((card) => {
        ctx.beginPath();
        ctx.roundRect(
          card.x - cardWidth / 2, 
          cardY, 
          cardWidth, 
          cardHeight,
          12
        );
        ctx.strokeStyle = card.active 
          ? 'hsla(270, 30%, 55%, 0.4)' 
          : 'hsla(260, 20%, 80%, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (card.active) {
          // Active card glow
          const glowGradient = ctx.createRadialGradient(
            card.x, cardY + cardHeight / 2, 0,
            card.x, cardY + cardHeight / 2, cardWidth
          );
          glowGradient.addColorStop(0, 'hsla(270, 30%, 55%, 0.1)');
          glowGradient.addColorStop(1, 'hsla(270, 30%, 55%, 0)');
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }
      });

      // Update and draw falling objects
      objectsRef.current.forEach((obj, index) => {
        if (!obj.landed) {
          // Apply gravity
          obj.vy += gravity;
          obj.vx *= friction;

          // Guide towards target
          const dx = obj.targetX - obj.x;
          obj.vx += dx * 0.001;

          obj.x += obj.vx;
          obj.y += obj.vy;
          obj.rotation += obj.rotationSpeed;

          // Check landing
          if (obj.y >= obj.targetY) {
            obj.y = obj.targetY;
            obj.vy *= -bounce;
            if (Math.abs(obj.vy) < 1) {
              obj.landed = true;
              obj.vy = 0;
            }
          }
        } else {
          // Gentle floating when landed
          obj.y = obj.targetY + Math.sin(timeRef.current * 2 + index) * 2;
        }

        // Draw object
        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation);

        if (index === 0) {
          // Main prototype object
          const gradient = ctx.createLinearGradient(-obj.size, -obj.size, obj.size, obj.size);
          gradient.addColorStop(0, 'hsla(270, 35%, 55%, 0.9)');
          gradient.addColorStop(1, 'hsla(185, 50%, 50%, 0.9)');

          ctx.beginPath();
          ctx.roundRect(-obj.size, -obj.size / 2, obj.size * 2, obj.size, 8);
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.strokeStyle = 'hsla(270, 30%, 65%, 1)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Inner details
          ctx.fillStyle = 'hsla(0, 0%, 100%, 0.3)';
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(-obj.size + 12 + i * 12, 0, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Trailing particles
          const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, obj.size * 1.5);
          glowGradient.addColorStop(0, `hsla(270, 40%, 60%, ${obj.opacity})`);
          glowGradient.addColorStop(1, `hsla(270, 40%, 60%, 0)`);
          ctx.beginPath();
          ctx.arc(0, 0, obj.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, obj.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(185, 55%, 55%, ${obj.opacity})`;
          ctx.fill();
        }

        ctx.restore();

        // Trail effect for main object
        if (index === 0 && !obj.landed && obj.vy > 0) {
          ctx.beginPath();
          ctx.moveTo(obj.x, obj.y - obj.size);
          ctx.lineTo(obj.x - 15, obj.y - obj.size - obj.vy * 3);
          ctx.lineTo(obj.x + 15, obj.y - obj.size - obj.vy * 3);
          ctx.closePath();
          const trailGradient = ctx.createLinearGradient(
            obj.x, obj.y - obj.size,
            obj.x, obj.y - obj.size - obj.vy * 3
          );
          trailGradient.addColorStop(0, 'hsla(270, 35%, 60%, 0.4)');
          trailGradient.addColorStop(1, 'hsla(270, 35%, 60%, 0)');
          ctx.fillStyle = trailGradient;
          ctx.fill();
        }
      });

      // Impact particles when landed
      if (objectsRef.current[0]?.landed) {
        const mainObj = objectsRef.current[0];
        const pulseScale = 1 + Math.sin(timeRef.current * 4) * 0.05;
        
        ctx.beginPath();
        ctx.arc(mainObj.x, mainObj.targetY + 10, 50 * pulseScale, 0, Math.PI * 2);
        const impactGlow = ctx.createRadialGradient(
          mainObj.x, mainObj.targetY + 10, 0,
          mainObj.x, mainObj.targetY + 10, 50 * pulseScale
        );
        impactGlow.addColorStop(0, 'hsla(270, 30%, 55%, 0.2)');
        impactGlow.addColorStop(1, 'hsla(270, 30%, 55%, 0)');
        ctx.fillStyle = impactGlow;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, showDrop]);

  // Reset when scene becomes inactive
  useEffect(() => {
    if (!isActive) {
      hasDroppedRef.current = false;
      objectsRef.current = [];
    }
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        "transition-opacity duration-700",
        isActive ? "opacity-100" : "opacity-0",
        className
      )}
    />
  );
};
