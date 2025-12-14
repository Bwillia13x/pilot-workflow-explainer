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
  pulsePhase: number;
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  pulseOffset: number;
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
          x: targetX + (Math.random() - 0.5) * 150,
          y: targetY + (Math.random() - 0.5) * 150,
          vx: 0,
          vy: 0,
          radius: 8 + Math.random() * 6,
          highlighted: [1, 4, 5, 9].includes(row * cols + col),
          targetX,
          targetY,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    // Create connections
    connectionsRef.current = [];
    nodesRef.current.forEach((_, i) => {
      // Connect to neighbors
      if (i % cols < cols - 1) {
        connectionsRef.current.push({ from: i, to: i + 1, strength: 0.6 + Math.random() * 0.4, pulseOffset: Math.random() * Math.PI * 2 });
      }
      if (i < nodesRef.current.length - cols) {
        connectionsRef.current.push({ from: i, to: i + cols, strength: 0.6 + Math.random() * 0.4, pulseOffset: Math.random() * Math.PI * 2 });
      }
      // Diagonal connections
      if (Math.random() > 0.5 && i % cols < cols - 1 && i < nodesRef.current.length - cols) {
        connectionsRef.current.push({ from: i, to: i + cols + 1, strength: 0.4, pulseOffset: Math.random() * Math.PI * 2 });
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
        const springForce = 0.025;
        node.vx += dx * springForce;
        node.vy += dy * springForce;

        // Add gentle floating motion
        node.vx += Math.sin(timeRef.current * 1.5 + node.targetX * 0.01 + node.pulsePhase) * 0.15;
        node.vy += Math.cos(timeRef.current * 1.2 + node.targetY * 0.01 + node.pulsePhase) * 0.12;

        // Damping
        node.vx *= 0.9;
        node.vy *= 0.9;

        // Update position
        node.x += node.vx;
        node.y += node.vy;
      });

      // Draw connections with animated pulses
      connectionsRef.current.forEach((conn) => {
        const from = nodesRef.current[conn.from];
        const to = nodesRef.current[conn.to];
        const fromHighlight = from.highlighted;
        const toHighlight = to.highlighted;
        const isHighlightedConn = fromHighlight || toHighlight;

        // Connection line with gradient
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        if (isHighlightedConn) {
          gradient.addColorStop(0, fromHighlight ? 'hsla(185, 60%, 50%, 0.7)' : 'hsla(270, 35%, 60%, 0.4)');
          gradient.addColorStop(1, toHighlight ? 'hsla(185, 60%, 50%, 0.7)' : 'hsla(270, 35%, 60%, 0.4)');
        } else {
          gradient.addColorStop(0, 'hsla(270, 25%, 70%, 0.25)');
          gradient.addColorStop(1, 'hsla(270, 25%, 70%, 0.25)');
        }

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = isHighlightedConn ? conn.strength * 2.5 : conn.strength * 1.5;
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        // Animated pulses along connections
        if (isHighlightedConn && isActive) {
          const numPulses = 2;
          for (let p = 0; p < numPulses; p++) {
            const pulsePos = ((timeRef.current * 0.5 + conn.pulseOffset + p * 0.5) % 1);
            const pulseX = from.x + (to.x - from.x) * pulsePos;
            const pulseY = from.y + (to.y - from.y) * pulsePos;
            const pulseSize = 3 + Math.sin(timeRef.current * 4 + p) * 1;

            // Pulse glow
            const pulseGlow = ctx.createRadialGradient(
              pulseX, pulseY, 0,
              pulseX, pulseY, pulseSize * 3
            );
            pulseGlow.addColorStop(0, 'hsla(185, 65%, 60%, 0.8)');
            pulseGlow.addColorStop(1, 'hsla(185, 65%, 60%, 0)');
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, pulseSize * 3, 0, Math.PI * 2);
            ctx.fillStyle = pulseGlow;
            ctx.fill();

            // Pulse core
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = 'hsla(185, 70%, 65%, 1)';
            ctx.fill();
          }
        }
      });

      // Draw nodes with enhanced effects
      nodesRef.current.forEach((node) => {
        const pulseScale = 1 + Math.sin(timeRef.current * 2.5 + node.pulsePhase) * 0.15;

        // Outer glow for all nodes
        const outerGlow = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 4 * pulseScale
        );
        if (node.highlighted) {
          outerGlow.addColorStop(0, 'hsla(185, 60%, 55%, 0.35)');
          outerGlow.addColorStop(0.5, 'hsla(185, 60%, 55%, 0.1)');
          outerGlow.addColorStop(1, 'hsla(185, 60%, 55%, 0)');
        } else {
          outerGlow.addColorStop(0, 'hsla(270, 30%, 60%, 0.2)');
          outerGlow.addColorStop(1, 'hsla(270, 30%, 60%, 0)');
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 4 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();

        // Inner glow for highlighted nodes
        if (node.highlighted) {
          const innerGlow = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.radius * 2.5
          );
          innerGlow.addColorStop(0, 'hsla(185, 65%, 60%, 0.6)');
          innerGlow.addColorStop(1, 'hsla(185, 65%, 60%, 0)');
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = innerGlow;
          ctx.fill();
        }

        // Node body with gradient
        const nodeGradient = ctx.createRadialGradient(
          node.x - node.radius * 0.3, node.y - node.radius * 0.3, 0,
          node.x, node.y, node.radius
        );
        if (node.highlighted) {
          nodeGradient.addColorStop(0, 'hsla(185, 65%, 65%, 1)');
          nodeGradient.addColorStop(1, 'hsla(185, 60%, 45%, 1)');
        } else {
          nodeGradient.addColorStop(0, 'hsla(270, 30%, 75%, 0.9)');
          nodeGradient.addColorStop(1, 'hsla(270, 25%, 55%, 0.7)');
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeGradient;
        ctx.fill();

        // Node border with highlight
        ctx.strokeStyle = node.highlighted 
          ? 'hsla(185, 70%, 70%, 1)' 
          : 'hsla(270, 25%, 80%, 0.9)';
        ctx.lineWidth = node.highlighted ? 2.5 : 1.5;
        ctx.stroke();

        // Shine effect
        ctx.beginPath();
        ctx.arc(node.x - node.radius * 0.3, node.y - node.radius * 0.3, node.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(0, 0%, 100%, 0.4)';
        ctx.fill();
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
