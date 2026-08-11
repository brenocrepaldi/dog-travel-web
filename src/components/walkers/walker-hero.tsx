import Image from 'next/image';
import { MapPin, ShieldCheck, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const WALKER_GRADIENTS = [
  'from-blue-400/30 to-indigo-500/30',
  'from-emerald-400/30 to-teal-500/30',
  'from-amber-400/30 to-orange-500/30',
  'from-rose-400/30 to-pink-500/30',
  'from-violet-400/30 to-purple-500/30',
  'from-cyan-400/30 to-sky-500/30',
];

export function walkerGradient(name: string) {
  return WALKER_GRADIENTS[name.charCodeAt(0) % WALKER_GRADIENTS.length];
}

export function walkerInitials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type WalkerHeroProps = {
  name: string;
  avatarUrl?: string | null;
  description: string;
  rating: number;
  reviews: number;
  location: string;
  verified: boolean;
  availability: import('@/types').AvailabilitySlot[];
  joinedDate?: string;
};

export function WalkerHero({
  name,
  avatarUrl,
  description,
  rating,
  reviews,
  location,
  verified,
  joinedDate,
}: WalkerHeroProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-6">
      {/* Avatar */}
      {avatarUrl ? (
        <div className="relative w-20 h-20 rounded-2xl shrink-0 ring-2 ring-border/30 overflow-hidden">
          <Image src={avatarUrl} alt={name} fill sizes="80px" className="object-cover" />
        </div>
      ) : (
        <div
          className={cn(
            'w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 ring-2 ring-border/30',
            walkerGradient(name)
          )}
        >
          <span className="text-2xl font-bold text-foreground/70">{walkerInitials(name)}</span>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{name}</h1>
          {verified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Verificado
              </span>
            </span>
          )}
        </div>

        {joinedDate && (
          <p className="text-xs text-muted-foreground mt-1">Membro desde {joinedDate}</p>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed mt-3">{description}</p>

        <div className="flex items-center gap-4 mt-4 flex-wrap text-sm">
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground text-xs">({reviews} avaliações)</span>
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{location}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
