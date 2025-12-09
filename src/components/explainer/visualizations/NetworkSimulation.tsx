import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface NetworkSimulationProps {
  isActive: boolean;
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  highlighted: boolean;
  targetX: number;
  targetY: number;
}

interface Connection {
  from: number;
  to: number;
  strength: number;
}

export const NetworkSimulation = ({ isActive, className }: NetworkSimulationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const timeRef = useRef(0);

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
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Initialize nodes in a grid pattern
    const cols = 4;
    const rows = 3;
    const spacing = Math.min(rect.width, rect.height) * 0.18;
    const offsetX = centerX - (cols - 1) * spacing / 2;
    const offsetY = centerY - (rows - 1) * spacing / 2;

    nodesRef.current = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const targetX = offsetX + col * spacing;
        const targetY = offsetY + row * spacing;
        nodesRef.current.push({
          x: targetX + (Math.random() - 0.5) * 100,
          y: targetY + (Math.random() - 0.5) * 100,
          vx: 0,
          vy: 0,
          radius: 6 + Math.random() * 4,
          highlighted: [1, 4, 5, 9].includes(row * cols + col),
          targetX,
          targetY,
        });
      }
    }

    // Create connections
    connectionsRef.current = [];
    nodesRef.current.forEach((_, i) => {
      // Connect to neighbors
      if (i % cols < cols - 1) {
        connectionsRef.current.push({ from: i, to: i + 1, strength: 0.5 + Math.random() * 0.5 });
      }
      if (i < nodesRef.current.length - cols) {
        connectionsRef.current.push({ from: i, to: i + cols, strength: 0.5 + Math.random() * 0.5 });
      }
      // Some diagonal connections
      if (Math.random() > 0.6 && i % cols < cols - 1 && i < nodesRef.current.length - cols) {
        connectionsRef.current.push({ from: i, to: i + cols + 1, strength: 0.3 });
      }
    });

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      timeRef.current += 0.016;

      // Update node positions with spring physics
      nodesRef.current.forEach((node) => {
        // Spring force towards target
        const dx = node.targetX - node.x;
        const dy = node.targetY - node.y;
        const springForce = 0.02;
        node.vx += dx * springForce;
        node.vy += dy * springForce;

        // Add gentle floating motion
        node.vx += Math.sin(timeRef.current * 2 + node.targetX * 0.01) * 0.1;
        node.vy += Math.cos(timeRef.current * 1.5 + node.targetY * 0.01) * 0.08;

        // Damping
        node.vx *= 0.92;
        node.vy *= 0.92;

        // Update position
        node.x += node.vx;
        node.y += node.vy;
      });

      // Draw connections
      connectionsRef.current.forEach((conn) => {
        const from = nodesRef.current[conn.from];
        const to = nodesRef.current[conn.to];

        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        const fromHighlight = from.highlighted;
        const toHighlight = to.highlighted;

        if (fromHighlight || toHighlight) {
          gradient.addColorStop(0, fromHighlight ? 'hsla(185, 60%, 45%, 0.6)' : 'hsla(270, 30%, 55%, 0.3)');
          gradient.addColorStop(1, toHighlight ? 'hsla(185, 60%, 45%, 0.6)' : 'hsla(270, 30%, 55%, 0.3)');
        } else {
          gradient.addColorStop(0, 'hsla(270, 20%, 70%, 0.2)');
          gradient.addColorStop(1, 'hsla(270, 20%, 70%, 0.2)');
        }

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = conn.strength * 2;
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        // Animated pulse along highlighted connections
        if ((fromHighlight || toHighlight) && isActive) {
          const pulsePos = (Math.sin(timeRef.current * 3 + conn.from * 0.5) + 1) / 2;
          const pulseX = from.x + (to.x - from.x) * pulsePos;
          const pulseY = from.y + (to.y - from.y) * pulsePos;

          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'hsla(185, 60%, 55%, 0.8)';
          ctx.fill();
        }
      });

      // Draw nodes
      nodesRef.current.forEach((node) => {
        // Glow for highlighted nodes
        if (node.highlighted) {
          const glowGradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.radius * 3
          );
          glowGradient.addColorStop(0, 'hsla(185, 60%, 50%, 0.4)');
          glowGradient.addColorStop(1, 'hsla(185, 60%, 50%, 0)');
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.highlighted 
          ? 'hsla(185, 60%, 45%, 0.9)' 
          : 'hsla(270, 25%, 65%, 0.6)';
        ctx.fill();

        // Node border
        ctx.strokeStyle = node.highlighted 
          ? 'hsla(185, 60%, 55%, 1)' 
          : 'hsla(270, 20%, 75%, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

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
