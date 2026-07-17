import * as Lucide from "lucide-react";

export interface IconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

// Renders a lucide icon by name, with a safe fallback.
export function Icon({ name, className, strokeWidth = 2 }: IconProps) {
  const Cmp = (Lucide as unknown as Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>>)[name];
  const Fallback = Lucide.Circle;
  const C = Cmp ?? Fallback;
  return <C className={className} strokeWidth={strokeWidth} />;
}
