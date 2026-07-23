import Image from 'next/image';
import { cn } from '@/lib/utils';

type BrandLogoProps = {
  markClassName?: string;
  textClassName?: string;
  className?: string;
  showText?: boolean;
  priority?: boolean;
};

export function BrandLogo({
  markClassName,
  textClassName,
  className,
  showText = true,
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className={cn('relative block h-12 w-12 shrink-0', markClassName)}>
        <Image
          src="/brand/skolaroid-logo.webp"
          alt=""
          fill
          sizes="56px"
          priority={priority}
          className="object-contain"
        />
      </span>
      {showText && (
        <span className={cn('text-lg font-bold tracking-tight font-display', textClassName)}>
          Skolaroid
        </span>
      )}
    </span>
  );
}
