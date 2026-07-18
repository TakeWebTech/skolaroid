import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider',
            light
              ? 'border-white/20 bg-white/5 text-white/70'
              : 'border-primary/20 bg-primary/5 text-primary'
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'mt-4 text-3xl font-bold tracking-tight font-display sm:text-4xl lg:text-5xl',
          light ? 'text-white' : 'text-foreground'
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-base leading-relaxed sm:text-lg',
            light ? 'text-white/70' : 'text-muted-foreground'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
