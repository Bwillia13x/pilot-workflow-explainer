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
  trail: { x: number; y: number; opacity: number }[];
  hue: number;
}

interface RippleEffect {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  maxRadius: number;
}

export const GravityDecision = ({ isActive, showDrop, className }: GravityDecisionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const objectsRef = useRef<FallingObject[]>([]);
  const ripplesRef = useRef<RippleEffect[]>([]);
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
      ripplesRef.current = [];
      
      // Main object (the prototype)
      objectsRef.current.push({
        x: centerX,
        y: rect.height * 0.12,
        vy: 0,
        vx: 0,
        size: 35,
        rotation: 0,
        rotationSpeed: 0.015,
        opacity: 1,
        landed: false,
        targetX: centerX - rect.width * 0.25,
        targetY: rect.height * 0.62,
        trail: [],
        hue: 185,
      });

      // Trailing particles with varied colors
      for (let i = 0; i < 15; i++) {
        objectsRef.current.push({
          x: centerX + (Math.random() - 0.5) * 50,
          y: rect.height * 0.12 + Math.random() * 30,
          vy: Math.random() * -1,
          vx: (Math.random() - 0.5) * 3,
          size: 3 + Math.random() * 8,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          opacity: 0.5 + Math.random() * 0.5,
          landed: false,
          targetX: centerX - rect.width * 0.25 + (Math.random() - 0.5) * 80,
          targetY: rect.height * 0.62 + Math.random() * 40,
          trail: [],
          hue: Math.random() > 0.5 ? 270 : 185,
        });
      }
    };

    const gravity = 0.18;
    const bounce = 0.25;
    const friction = 0.97;

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
      const cardY = rect.height * 0.52;
      const cardPositions = [
        { x: rect.width * 0.2, label: 'Keep', active: true },
        { x: rect.width * 0.5, label: 'Expand', active: false },
        { x: rect.width * 0.8, label: 'Discard', active: false },
      ];

      cardPositions.forEach((card) => {
        // Card glow
        if (card.active) {
          const cardGlow = ctx.createRadialGradient(
            card.x, cardY + cardHeight / 2, 0,
            card.x, cardY + cardHeight / 2, cardWidth * 0.8
          );
          cardGlow.addColorStop(0, 'hsla(270, 35%, 55%, 0.15)');
          cardGlow.addColorStop(1, 'hsla(270, 35%, 55%, 0)');
          ctx.fillStyle = cardGlow;
          ctx.fillRect(card.x - cardWidth, cardY - 20, cardWidth * 2, cardHeight + 40);
        }

        // Card outline
        ctx.beginPath();
        ctx.roundRect(
          card.x - cardWidth / 2, 
          cardY, 
          cardWidth, 
          cardHeight,
          16
        );
        
        if (card.active) {
          const borderGradient = ctx.createLinearGradient(
            card.x - cardWidth / 2, cardY,
            card.x + cardWidth / 2, cardY + cardHeight
          );
          borderGradient.addColorStop(0, 'hsla(270, 40%, 60%, 0.5)');
          borderGradient.addColorStop(0.5, 'hsla(185, 50%, 55%, 0.5)');
          borderGradient.addColorStop(1, 'hsla(270, 40%, 60%, 0.5)');
          ctx.strokeStyle = borderGradient;
          ctx.lineWidth = 2.5;
        } else {
          ctx.strokeStyle = 'hsla(260, 20%, 75%, 0.25)';
          ctx.lineWidth = 1.5;
        }
        ctx.stroke();
      });

      // Update and draw ripples
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += 3;
        ripple.opacity -= 0.02;
        
        if (ripple.opacity <= 0) return false;
        
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(270, 40%, 60%, ${ripple.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        return true;
      });

      // Update and draw falling objects
      objectsRef.current.forEach((obj, index) => {
        if (!obj.landed) {
          // Apply gravity
          obj.vy += gravity;
          obj.vx *= friction;

          // Guide towards target with spring force
          const dx = obj.targetX - obj.x;
          obj.vx += dx * 0.002;

          obj.x += obj.vx;
          obj.y += obj.vy;
          obj.rotation += obj.rotationSpeed;

          // Update trail
          obj.trail.unshift({ x: obj.x, y: obj.y, opacity: 1 });
          if (obj.trail.length > 15) {
            obj.trail.pop();
          }
          obj.trail.forEach((t, i) => {
            t.opacity = 1 - i / obj.trail.length;
          });

          // Check landing
          if (obj.y >= obj.targetY) {
            obj.y = obj.targetY;
            obj.vy *= -bounce;
            if (Math.abs(obj.vy) < 1.5) {
              obj.landed = true;
              obj.vy = 0;
              // Create ripple on landing
              if (index === 0) {
                ripplesRef.current.push({
                  x: obj.x,
                  y: obj.targetY + 15,
                  radius: 10,
                  opacity: 0.6,
                  maxRadius: 80,
                });
              }
            }
          }
        } else {
          // Gentle floating when landed
          obj.y = obj.targetY + Math.sin(timeRef.current * 2 + index) * 3;
          obj.rotation = Math.sin(timeRef.current * 1.5 + index) * 0.1;
        }

        // Draw trails for moving objects
        if (!obj.landed && obj.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(obj.trail[0].x, obj.trail[0].y);
          for (let i = 1; i < obj.trail.length; i++) {
            ctx.lineTo(obj.trail[i].x, obj.trail[i].y);
          }
          const trailGradient = ctx.createLinearGradient(
            obj.trail[0].x, obj.trail[0].y,
            obj.trail[obj.trail.length - 1].x, obj.trail[obj.trail.length - 1].y
          );
          trailGradient.addColorStop(0, `hsla(${obj.hue}, 55%, 60%, ${obj.opacity * 0.4})`);
          trailGradient.addColorStop(1, `hsla(${obj.hue}, 55%, 60%, 0)`);
          ctx.strokeStyle = trailGradient;
          ctx.lineWidth = obj.size * 0.3;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Draw object
        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation);

        if (index === 0) {
          // Main prototype object with enhanced glow
          const mainGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, obj.size * 2);
          mainGlow.addColorStop(0, 'hsla(185, 55%, 55%, 0.4)');
          mainGlow.addColorStop(1, 'hsla(185, 55%, 55%, 0)');
          ctx.fillStyle = mainGlow;
          ctx.fillRect(-obj.size * 2, -obj.size, obj.size * 4, obj.size * 2);

          // Main body gradient
          const gradient = ctx.createLinearGradient(-obj.size, -obj.size / 2, obj.size, obj.size / 2);
          gradient.addColorStop(0, 'hsla(270, 40%, 60%, 1)');
          gradient.addColorStop(0.5, 'hsla(185, 55%, 55%, 1)');
          gradient.addColorStop(1, 'hsla(270, 40%, 60%, 1)');

          ctx.beginPath();
          ctx.roundRect(-obj.size, -obj.size / 2, obj.size * 2, obj.size, 10);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Border with glow
          ctx.strokeStyle = 'hsla(185, 60%, 70%, 1)';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Inner shine
          ctx.beginPath();
          ctx.roundRect(-obj.size + 4, -obj.size / 2 + 4, obj.size * 2 - 8, obj.size * 0.4, 6);
          ctx.fillStyle = 'hsla(0, 0%, 100%, 0.25)';
          ctx.fill();

          // Data flow dots
          for (let i = 0; i < 4; i++) {
            const dotX = -obj.size + 14 + i * 14;
            const pulseScale = 1 + Math.sin(timeRef.current * 4 + i * 0.5) * 0.2;
            ctx.beginPath();
            ctx.arc(dotX, 0, 3 * pulseScale, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(0, 0%, 100%, ${0.5 + Math.sin(timeRef.current * 3 + i) * 0.2})`;
            ctx.fill();
          }
        } else {
          // Trailing particles with enhanced glow
          const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, obj.size * 2);
          glowGradient.addColorStop(0, `hsla(${obj.hue}, 50%, 60%, ${obj.opacity})`);
          glowGradient.addColorStop(1, `hsla(${obj.hue}, 50%, 60%, 0)`);
          ctx.beginPath();
          ctx.arc(0, 0, obj.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();

          // Particle core
          const coreGradient = ctx.createRadialGradient(-obj.size * 0.2, -obj.size * 0.2, 0, 0, 0, obj.size);
          coreGradient.addColorStop(0, `hsla(${obj.hue}, 60%, 70%, ${obj.opacity})`);
          coreGradient.addColorStop(1, `hsla(${obj.hue}, 55%, 50%, ${obj.opacity})`);
          ctx.beginPath();
          ctx.arc(0, 0, obj.size, 0, Math.PI * 2);
          ctx.fillStyle = coreGradient;
          ctx.fill();
        }

        ctx.restore();
      });

      // Impact glow when main object landed
      if (objectsRef.current[0]?.landed) {
        const mainObj = objectsRef.current[0];
        const pulseScale = 1 + Math.sin(timeRef.current * 3) * 0.08;
        
        const impactGlow = ctx.createRadialGradient(
          mainObj.x, mainObj.targetY + 15, 0,
          mainObj.x, mainObj.targetY + 15, 70 * pulseScale
        );
        impactGlow.addColorStop(0, 'hsla(270, 40%, 55%, 0.25)');
        impactGlow.addColorStop(0.5, 'hsla(185, 50%, 55%, 0.1)');
        impactGlow.addColorStop(1, 'hsla(270, 40%, 55%, 0)');
        ctx.beginPath();
        ctx.arc(mainObj.x, mainObj.targetY + 15, 70 * pulseScale, 0, Math.PI * 2);
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
      ripplesRef.current = [];
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
