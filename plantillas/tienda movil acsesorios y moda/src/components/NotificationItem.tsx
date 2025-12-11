import { Badge } from "./ui/badge";
import { Package, Tag, Heart } from "lucide-react";

interface NotificationItemProps {
  type: "order" | "offer" | "wishlist";
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

export function NotificationItem({
  type,
  title,
  description,
  time,
  unread = false,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (type) {
      case "order":
        return <Package className="w-5 h-5 text-primary" />;
      case "offer":
        return <Tag className="w-5 h-5 text-destructive" />;
      case "wishlist":
        return <Heart className="w-5 h-5 text-pink-500" />;
    }
  };

  return (
    <div className={`p-4 border-b border-border ${unread ? "bg-primary/5" : ""}`}>
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="line-clamp-1">{title}</p>
            {unread && (
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-1">{description}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
    </div>
  );
}
