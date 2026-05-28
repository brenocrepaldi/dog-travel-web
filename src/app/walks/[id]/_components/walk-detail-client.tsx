'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  Navigation,
  PawPrint,
  Route,
  ShieldCheck,
  Star,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import { useWalkById } from '@/features/walks/hooks/use-walks';
import { useWalkerById } from '@/features/walkers/hooks/use-walkers';
import { useReview } from '@/features/reviews/hooks/use-reviews';
import { usePaymentMethods } from '@/features/payments/hooks/use-payments';
import { useCompleteWalk } from '@/features/walks/hooks/use-walk-actions';
import { WalkRouteMapClient } from './walk-route-map-client';
import { WalkPets } from './walk-pets';
import { WalkStartSection } from './walk-start-section';
import { ClientCodeBanner } from './client-code-banner';
import type { WalkRecord, WalkerProfile, WalkTimelineEvent, WalkStatus } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toMoney(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const STATUS_CONFIG: Record<
  WalkStatus,
  { label: string; variant: 'warning' | 'info' | 'default' | 'success' | 'destructive' }
> = {
  pending: { label: 'Aguardando', variant: 'warning' },
  accepted: { label: 'Confirmado', variant: 'info' },
  in_progress: { label: 'Em andamento', variant: 'default' },
  completed: { label: 'Concluído', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function WalkDetailSkeleton() {
  return (
    <div className="space-y-6 pb-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-36 rounded-lg bg-muted" />
        <div className="h-8 w-56 rounded-lg bg-muted" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="h-64 rounded-2xl bg-muted" />
          <div className="h-48 rounded-2xl bg-muted" />
        </div>
        <div className="space-y-5">
          <div className="h-48 rounded-2xl bg-muted" />
          <div className="h-32 rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimelineCard({
  timeline,
  isLive = false,
}: {
  timeline: WalkTimelineEvent[];
  isLive?: boolean;
}) {
  return (
    <Card className={cn('overflow-hidden py-0 gap-0', isLive && 'ring-1 ring-emerald-500/25')}>
      {isLive && (
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400" />
      )}
      <div className="border-b border-border/60 px-5 py-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">Linha do tempo</h2>
        {isLive && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Ao vivo
          </span>
        )}
      </div>
      <CardContent className="px-5 py-5">
        {timeline.map((event, i) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'relative z-10 mt-0.5 h-3 w-3 shrink-0 rounded-full ring-2 ring-background',
                  event.state === 'done' && 'bg-emerald-500',
                  event.state === 'current' && 'bg-primary',
                  event.state === 'pending' && 'bg-muted-foreground/25',
                )}
              >
                {event.state === 'current' && (
                  <span className="absolute inset-0 -m-0.5 animate-ping rounded-full bg-primary/40" />
                )}
              </div>
              {i < timeline.length - 1 && (
                <div
                  className={cn(
                    'mt-1.5 min-h-[2rem] w-px flex-1',
                    event.state === 'done' ? 'bg-emerald-500/30' : 'bg-border/50',
                  )}
                />
              )}
            </div>
            <div className={cn('flex-1', i < timeline.length - 1 ? 'pb-5' : 'pb-0')}>
              <div className="flex items-start justify-between gap-3">
                <p
                  className={cn(
                    'text-sm font-medium',
                    event.state === 'pending' ? 'text-muted-foreground/60' : 'text-foreground',
                  )}
                >
                  {event.label}
                </p>
                <span
                  className={cn(
                    'shrink-0 text-xs',
                    event.state === 'pending' ? 'text-muted-foreground/40' : 'text-muted-foreground',
                  )}
                >
                  {event.at}
                </span>
              </div>
              {event.note && <p className="mt-0.5 text-xs text-muted-foreground">{event.note}</p>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 px-5 py-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function WalkerCard({
  walker,
  compact = false,
}: {
  walker: WalkerProfile;
  compact?: boolean;
}) {
  return (
    <Card className="overflow-hidden py-0 gap-0">
      <div className="border-b border-border/60 px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">Passeador</h2>
      </div>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary',
              compact ? 'h-12 w-12' : 'h-14 w-14',
            )}
          >
            {initials(walker.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-semibold text-foreground">{walker.name}</p>
              {walker.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < Math.round(walker.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted-foreground/30',
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {walker.rating.toFixed(1)} · {walker.reviews} aval.
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          {walker.trustChecks.identityVerified && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              Identidade verificada
            </div>
          )}
          {walker.trustChecks.backgroundCheck && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              Antecedentes verificados
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
            {walker.completedWalks} passeios concluídos
          </div>
        </div>
        <Separator className="opacity-60" />
        <Link
          href={`/walkers/${walker.id}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
        >
          Ver perfil completo
        </Link>
      </CardContent>
    </Card>
  );
}

function ClientCard({
  walkId,
  clientName,
  petNames,
  address,
  showChat,
}: {
  walkId: string;
  clientName: string;
  petNames: string[];
  address: string;
  showChat: boolean;
}) {
  return (
    <Card className="overflow-hidden py-0 gap-0">
      <div className="border-b border-border/60 px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">Cliente</h2>
      </div>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
            {initials(clientName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{clientName}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {petNames.length} {petNames.length === 1 ? 'cão' : 'cães'} neste passeio
            </p>
          </div>
        </div>
        <div className="space-y-1.5">
          {petNames.map((name) => (
            <div key={name} className="flex items-center gap-2 text-xs text-muted-foreground">
              <PawPrint className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span className="font-medium text-foreground">{name}</span>
            </div>
          ))}
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MapPin className="mt-px h-3.5 w-3.5 shrink-0" />
            <span className="leading-relaxed">{address}</span>
          </div>
        </div>
        <Separator className="opacity-60" />
        {showChat ? (
          <Link
            href={`/walks/${walkId}/chat`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full gap-1.5')}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Abrir chat com cliente
          </Link>
        ) : (
          <p className="text-center text-[11px] text-muted-foreground/60">
            Chat disponível apenas durante o passeio
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentCard({
  price,
  paymentMethod,
}: {
  price: number;
  paymentMethod?: { brand: string; label: string };
}) {
  return (
    <Card className="overflow-hidden py-0 gap-0">
      <div className="border-b border-border/60 px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">Pagamento</h2>
      </div>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5">
          <span className="text-sm font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-primary">{toMoney(price)}</span>
        </div>
        {paymentMethod && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Forma de pagamento
              </p>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                {paymentMethod.brand} {paymentMethod.label}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EarningCard({ price, status }: { price: number; status: WalkStatus }) {
  const isConfirmed = status === 'completed';
  const isActive = status === 'in_progress';
  const isPending = status === 'accepted' || status === 'pending';
  const isCancelled = status === 'cancelled';

  return (
    <Card className="overflow-hidden py-0 gap-0">
      <div className="border-b border-border/60 px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">Ganho</h2>
      </div>
      <CardContent className="p-5 space-y-4">
        <div
          className={cn(
            'rounded-xl border px-5 py-4 space-y-0.5',
            isConfirmed
              ? 'border-emerald-500/20 bg-emerald-500/[0.07]'
              : isActive
                ? 'border-primary/20 bg-primary/[0.05]'
                : isCancelled
                  ? 'border-border/60 bg-muted/40'
                  : 'border-border/60 bg-muted/30',
          )}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {isConfirmed ? 'Valor recebido' : isCancelled ? 'Valor previsto' : 'Seu ganho'}
          </p>
          <p
            className={cn(
              'text-3xl font-bold tracking-tight',
              isConfirmed
                ? 'text-emerald-600 dark:text-emerald-400'
                : isActive
                  ? 'text-primary'
                  : 'text-foreground',
            )}
          >
            {toMoney(price)}
          </p>
          <div className="flex items-center gap-1.5 pt-0.5">
            <TrendingUp
              className={cn('h-3 w-3', isConfirmed ? 'text-emerald-500' : 'text-muted-foreground')}
            />
            <p className="text-[11px] text-muted-foreground">valor bruto do passeio</p>
          </div>
        </div>

        {isConfirmed && (
          <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.07] px-3.5 py-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Pagamento confirmado
              </p>
              <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">
                Creditado na sua conta
              </p>
            </div>
          </div>
        )}

        {isActive && (
          <div className="flex items-center gap-2.5 rounded-lg border border-primary/15 bg-primary/[0.06] px-3.5 py-2.5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <p className="text-xs font-semibold text-primary">Passeio em andamento</p>
          </div>
        )}

        {isPending && (
          <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/40 px-3.5 py-2.5">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Creditado ao concluir o passeio</p>
          </div>
        )}

        {isCancelled && (
          <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/40 px-3.5 py-2.5">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Cancelado — sem cobrança ao cliente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

export function WalkDetailClient({ walkId }: { walkId: string }) {
  const { data: session } = useSession();
  const isWalker = session?.user?.role === 'walker';

  const { data: walk, isLoading: walkLoading } = useWalkById(walkId);
  const { data: walker } = useWalkerById(walk?.walkerId ?? '', { enabled: !!walk?.walkerId });
  const { data: review } = useReview(walkId);
  const { data: paymentMethods = [] } = usePaymentMethods();
  const { mutate: completeWalk, isPending: completing } = useCompleteWalk();

  if (walkLoading) return <WalkDetailSkeleton />;

  if (!walk) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-sm text-muted-foreground">Passeio não encontrado.</p>
        <Link
          href="/walks"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Voltar para meus passeios
        </Link>
      </div>
    );
  }

  const paymentMethod = paymentMethods.find((m) => m.id === walk.paymentMethodId);
  const statusCfg = STATUS_CONFIG[walk.status] ?? STATUS_CONFIG.pending;

  const isInProgress = walk.status === 'in_progress';
  const isCompleted = walk.status === 'completed';
  const isCancelled = walk.status === 'cancelled';
  const isAccepted = walk.status === 'accepted';
  const hasRoute = walk.distanceKm > 0;

  return (
    <div className="space-y-6 pb-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/walks"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              '-ml-2 text-muted-foreground hover:text-foreground',
            )}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Meus passeios
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-foreground">Passeio #{walk.id}</h1>
            <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {isWalker
              ? `${walk.clientName} · ${walk.dateLabel}`
              : `${walk.petNames.join(' & ')} · ${walk.dateLabel}`}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {isWalker ? (
            <>
              {(isInProgress || isAccepted) && (
                <Link
                  href={`/walks/${walk.id}/chat`}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                >
                  <MessageSquare className="mr-1.5 h-4 w-4" />
                  Chat com cliente
                </Link>
              )}
              {isInProgress && (
                <Link
                  href={`/walks/${walk.id}/tracking`}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                >
                  <Navigation className="mr-1.5 h-4 w-4" />
                  Acompanhar
                </Link>
              )}
              {isInProgress && (
                <Button
                  size="sm"
                  disabled={completing}
                  onClick={() => completeWalk(walk.id)}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {completing
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <CheckCircle2 className="h-4 w-4" />}
                  Concluir passeio
                </Button>
              )}
            </>
          ) : (
            <>
              {isInProgress && (
                <>
                  <Link
                    href={`/walks/${walk.id}/chat`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                  >
                    <MessageSquare className="mr-1.5 h-4 w-4" />
                    Chat
                  </Link>
                  <Link
                    href={`/walks/${walk.id}/tracking`}
                    className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
                  >
                    <Navigation className="mr-1.5 h-4 w-4" />
                    Acompanhar
                  </Link>
                </>
              )}
              {isCompleted && !review && (
                <Link
                  href={`/walks/${walk.id}/review`}
                  className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
                >
                  <Star className="mr-1.5 h-4 w-4" />
                  Avaliar passeio
                </Link>
              )}
              {isCancelled && (
                <Link
                  href="/walks/new"
                  className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
                >
                  Solicitar novo passeio
                </Link>
              )}
              {(isAccepted || walk.status === 'pending') && (
                <Link
                  href={`/walks/${walk.id}/chat`}
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                >
                  <MessageSquare className="mr-1.5 h-4 w-4" />
                  Abrir chat
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Banners ────────────────────────────────────────────────────────── */}

      {isInProgress && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Passeio em andamento agora
              </p>
              <p className="mt-0.5 text-xs text-emerald-600/70 dark:text-emerald-400/70">
                {isWalker
                  ? `Você está passeando com ${walk.petNames.join(' & ')} · cliente ${walk.clientName}`
                  : `${walk.petNames.join(' & ')} está${walk.petNames.length > 1 ? 'o' : ''} com ${walker?.name ?? 'o passeador'}`}
              </p>
            </div>
          </div>
          <Link
            href={`/walks/${walk.id}/tracking`}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'shrink-0 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10',
            )}
          >
            <Navigation className="mr-1.5 h-3.5 w-3.5" />
            Acompanhar
          </Link>
        </div>
      )}

      {!isWalker && isCompleted && !review && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.08] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <Star className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Como foi o passeio?
              </p>
              <p className="mt-0.5 text-xs text-amber-600/70 dark:text-amber-400/70">
                Sua avaliação ajuda outros tutores a escolherem o melhor passeador
              </p>
            </div>
          </div>
          <Link
            href={`/walks/${walk.id}/review`}
            className={cn(
              buttonVariants({ size: 'sm' }),
              'shrink-0 border-0 bg-amber-500 text-white hover:bg-amber-600',
            )}
          >
            Avaliar
          </Link>
        </div>
      )}

      {!isWalker && isCompleted && review && (
        <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 px-5 py-4">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Sua avaliação</p>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3.5 w-3.5',
                      i < review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted-foreground/30',
                    )}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="mt-0.5 text-sm text-muted-foreground">&quot;{review.comment}&quot;</p>
            )}
          </div>
        </div>
      )}

      {isWalker && isCompleted && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/[0.10] to-emerald-500/[0.03] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Passeio concluído com sucesso
              </p>
              <p className="mt-0.5 text-xs text-emerald-600/70 dark:text-emerald-400/70">
                {toMoney(walk.price)} creditado
                {hasRoute ? ` · ${walk.distanceKm.toFixed(1)} km percorridos` : ''}
                {` · ${walk.durationMinutes} min`}
              </p>
            </div>
          </div>
          {review && (
            <div className="shrink-0 flex flex-col items-end gap-1">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3.5 w-3.5',
                      i < review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted-foreground/30',
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] text-emerald-600/60 dark:text-emerald-400/60">
                avaliação do cliente
              </p>
            </div>
          )}
        </div>
      )}

      {isCancelled && (
        <div className="rounded-xl border border-border bg-muted/40 px-5 py-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Passeio cancelado</span>
            {walk.notes ? ` — ${walk.notes}` : '.'}
          </p>
        </div>
      )}

      {isWalker && isAccepted && (
        <WalkStartSection
          walkId={walk.id}
          scheduledAt={walk.scheduledAt}
          startLat={walk.startLat}
          startLng={walk.startLng}
        />
      )}

      {!isWalker && isAccepted && walk.startCode && (
        <ClientCodeBanner code={walk.startCode} />
      )}

      {/* ── Layout A — com trajeto GPS ──────────────────────────────────── */}
      {hasRoute ? (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card className="overflow-hidden py-0 gap-0">
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Trajeto percorrido</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {walk.distanceKm.toFixed(1)} km · {walk.startAddress}
                    {walk.endAddress ? ` → ${walk.endAddress}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Início
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    Fim
                  </span>
                </div>
              </div>
              <div className="relative h-[280px] sm:h-[340px]">
                <WalkRouteMapClient walkId={walk.id} />
              </div>
            </Card>

            <Card className="overflow-hidden py-0 gap-0">
              <div className="border-b border-border/60 px-5 py-3.5">
                <h2 className="text-sm font-semibold text-foreground">Informações</h2>
              </div>
              <CardContent className="divide-y divide-border/60 p-0">
                <InfoRow icon={Calendar} label="Data e horário" value={walk.dateLabel} />
                <InfoRow icon={Timer} label="Duração" value={`${walk.durationMinutes} minutos`} />
                <InfoRow
                  icon={Route}
                  label="Distância"
                  value={`${walk.distanceKm.toFixed(1)} km`}
                />
                <InfoRow icon={MapPin} label="Saída" value={walk.startAddress} />
                {walk.endAddress && (
                  <InfoRow icon={MapPin} label="Destino" value={walk.endAddress} />
                )}
                {walk.petNames.length > 0 && (
                  <div className="flex items-start gap-3 px-5 py-4">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <PawPrint className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Cães
                      </p>
                      <div className="mt-3">
                        <WalkPets petNames={walk.petNames} />
                      </div>
                    </div>
                  </div>
                )}
                {walk.notes && !isCancelled && (
                  <div className="flex items-start gap-3 px-5 py-4">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Observações
                      </p>
                      <p className="mt-0.5 text-sm text-foreground">{walk.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <TimelineCard timeline={walk.timeline} isLive={isWalker && isInProgress} />
          </div>

          <div className="space-y-5">
            {isWalker ? (
              <ClientCard
                walkId={walk.id}
                clientName={walk.clientName}
                petNames={walk.petNames}
                address={walk.startAddress}
                showChat={isInProgress || isAccepted}
              />
            ) : (
              walker && <WalkerCard walker={walker} compact />
            )}
            {isWalker ? (
              <EarningCard price={walk.price} status={walk.status} />
            ) : (
              <PaymentCard price={walk.price} paymentMethod={paymentMethod} />
            )}
          </div>
        </div>
      ) : (
        /* ── Layout B — sem trajeto GPS ──────────────────────────────────── */
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card className="overflow-hidden py-0 gap-0">
              <div className="border-b border-border/60 px-5 py-4">
                <h2 className="text-sm font-semibold text-foreground">Detalhes do passeio</h2>
              </div>
              <CardContent className="divide-y divide-border/60 p-0">
                <InfoRow icon={Calendar} label="Data e horário" value={walk.dateLabel} />
                <InfoRow icon={Timer} label="Duração" value={`${walk.durationMinutes} minutos`} />
                <InfoRow icon={MapPin} label="Local de partida" value={walk.startAddress} />
                {walk.notes && !isCancelled && (
                  <div className="flex items-start gap-3 px-5 py-4">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Observações
                      </p>
                      <p className="mt-0.5 text-sm text-foreground">{walk.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <TimelineCard timeline={walk.timeline} isLive={isWalker && isInProgress} />
          </div>

          <div className="space-y-5">
            {isWalker ? (
              <ClientCard
                walkId={walk.id}
                clientName={walk.clientName}
                petNames={walk.petNames}
                address={walk.startAddress}
                showChat={isInProgress || isAccepted}
              />
            ) : (
              walker && <WalkerCard walker={walker} />
            )}

            <Card className="overflow-hidden py-0 gap-0">
              <div className="border-b border-border/60 px-5 py-4">
                <h2 className="text-sm font-semibold text-foreground">Cães</h2>
              </div>
              <CardContent className="p-5">
                <WalkPets petNames={walk.petNames} />
              </CardContent>
            </Card>

            {isWalker ? (
              <EarningCard price={walk.price} status={walk.status} />
            ) : (
              <PaymentCard price={walk.price} paymentMethod={paymentMethod} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
