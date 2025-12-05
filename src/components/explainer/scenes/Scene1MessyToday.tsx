import { Mail, FileSpreadsheet, MessageSquare, StickyNote, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      {/* Text content */}
      <div className="text-center mb-8 md:mb-12 z-10">
        <h2 className={cn(
          "text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4",
          "transition-all duration-700 delay-100",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          Right now, your team is doing this by hand.
        </h2>
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto",
          "transition-all duration-700 delay-200",
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          Scattered tools, repeated steps, manual prompting.
        </p>
      </div>

      {/* Messy diagram */}
      <div className={cn(
        "relative w-full max-w-xl md:max-w-2xl h-64 md:h-80",
        "transition-all duration-700 delay-300",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {/* SVG connections */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          {connections.map((conn, i) => {
            const from = icons[conn.from];
            const to = icons[conn.to];
            // Create wavy paths
            const midX = (from.x + to.x) / 2 + (Math.random() - 0.5) * 10;
            const midY = (from.y + to.y) / 2 + (Math.random() - 0.5) * 10;
            return (
              <path
                key={i}
                d={`M ${from.x}% ${from.y}% Q ${midX}% ${midY}% ${to.x}% ${to.y}%`}
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                strokeDasharray="4 4"
                className={cn(
                  "transition-all duration-1000",
                  isActive ? "opacity-40" : "opacity-0"
                )}
                style={{ transitionDelay: `${400 + i * 100}ms` }}
              />
            );
          })}
        </svg>

        {/* Icons */}
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
              transitionDelay: `${300 + i * 100}ms`
            }}
          >
            <div className="p-3 md:p-4 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
              <item.Icon className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}

        {/* Standard Adopter tag */}
        <div className={cn(
          "absolute top-0 right-0 px-3 py-1.5 rounded-full",
          "bg-muted/50 border border-border/50",
          "text-xs font-medium text-muted-foreground",
          "transition-all duration-500 delay-700",
          isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}>
          Standard Adopter
        </div>
      </div>
    </div>
  );
};
