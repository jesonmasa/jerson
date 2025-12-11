import { Check } from "lucide-react";

interface TimelineItem {
  title: string;
  time: string;
  completed: boolean;
}

interface DeliveryTimelineProps {
  items: TimelineItem[];
}

export function DeliveryTimeline({ items }: DeliveryTimelineProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.completed
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {item.completed ? (
                <Check className="w-4 h-4" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-current" />
              )}
            </div>
            {index < items.length - 1 && (
              <div
                className={`w-0.5 h-12 ${
                  item.completed ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
          <div className="flex-1 pt-1">
            <p className={item.completed ? "text-foreground" : "text-muted-foreground"}>
              {item.title}
            </p>
            <p className="text-muted-foreground text-sm">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
