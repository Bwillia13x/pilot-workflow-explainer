import { Mail, FileSpreadsheet, MessageSquare, StickyNote, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlowingWaves } from '../visualizations/FlowingWaves';

interface Scene1Props {
  isActive: boolean;
}

const icons = [
  { Icon: Mail, label: 'Email', x: 15, y: 20 },
  { Icon: FileSpreadsheet, label: 'Spreadsheets', x: 75, y: 25 },
  { Icon: MessageSquare, label: 'Chat', x: 25, y: 70 },
  { Icon: Bot, label: 'Chatbots', x: 70, y: 65 },
  { Icon: StickyNote, label: 'Notes', x: 50, y: 45 },
];

const connections = [
  { from: 0, to: 4 },
  { from: 1, to: 4 },
  { from: 2, to: 4 },
  { from: 3, to: 4 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 3 },
];

export const Scene1MessyToday = ({ isActive }: Scene1Props) => {
  return (
    <div className={cn(
      "absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12",
      "transition-all duration-700",
      isActive ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      {/* Flowing waves background - chaotic variant */}
      <FlowingWaves isActive={isActive} variant="chaos" className="opacity-50" />

      {/* Text content */}
      <div className="text-center mb-8 md:mb-12 z-10">
        <h2 className={cn(
          "text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-premium",
          "transition-all duration-700 delay-100",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <span className="font-serif italic text-glow-lavender">Right now,</span> your team is doing this by hand.
        </h2>
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed",
          "transition-all duration-700 delay-200",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          Scattered tools, repeated steps, manual prompting.
        </p>
      </div>

      {/* Messy diagram */}
      <div className={cn(
        "relative w-full max-w-xl md:max-w-2xl h-64 md:h-80 z-10",
        "transition-all duration-700 delay-300",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {/* SVG connections with gradient */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(270, 30%, 55%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(185, 60%, 45%)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {connections.map((conn, i) => {
            const from = icons[conn.from];
            const to = icons[conn.to];
            const midX = (from.x + to.x) / 2 + (i % 2 === 0 ? 5 : -5);
            const midY = (from.y + to.y) / 2 + (i % 3 === 0 ? 8 : -8);
            return (
              <path
                key={i}
                d={`M ${from.x}% ${from.y}% Q ${midX}% ${midY}% ${to.x}% ${to.y}%`}
                fill="none"
                stroke="url(#connectionGradient)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                className={cn(
                  "transition-all duration-1000",
                  isActive ? "opacity-60" : "opacity-0"
                )}
                style={{ transitionDelay: `${400 + i * 80}ms` }}
              />
            );
          })}
        </svg>

        {/* Icons with glass cards */}
        {icons.map((item, i) => (
          <div
            key={i}
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2",
              "flex flex-col items-center gap-2",
              "transition-all duration-500",
              isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )}
            style={{ 
              left: `${item.x}%`, 
              top: `${item.y}%`,
              transitionDelay: `${300 + i * 80}ms`
            }}
          >
            <div className={cn(
              "p-3 md:p-4 rounded-xl glass-card hover-lift group cursor-default",
              "transition-all duration-300"
            )}>
              <item.Icon className={cn(
                "w-6 h-6 md:w-8 md:h-8 text-muted-foreground",
                "group-hover:text-primary transition-colors duration-300"
              )} />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap font-medium tracking-wide">
              {item.label}
            </span>
          </div>
        ))}

        {/* Standard Adopter tag - premium badge */}
        <div className={cn(
          "absolute top-0 right-0 px-4 py-2 rounded-full",
          "glass-card border-gradient",
          "text-xs font-semibold text-muted-foreground uppercase tracking-wide-premium",
          "transition-all duration-500 delay-700",
          isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}>
          <span className="relative z-10">Standard Adopter</span>
        </div>
      </div>
    </div>
  );
};
