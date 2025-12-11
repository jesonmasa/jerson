import { LucideIcon } from "lucide-react";

interface CategoryIconProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export function CategoryIcon({ icon: Icon, label, onClick }: CategoryIconProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 min-w-[70px]"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
        <Icon className="w-7 h-7 text-foreground" />
      </div>
      <span className="text-xs text-center">{label}</span>
    </button>
  );
}
