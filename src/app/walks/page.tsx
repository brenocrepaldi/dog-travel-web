import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { walks as allWalks, getWalkerById, type WalkRecord } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { CalendarDays, Clock, Dog, History, MapPin, Plus, Search, Star } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Meus Passeios | DogTravel' };

// ── Status config ──────────────────────────────────────────────────────────
const statusMap: Record<WalkRecord['status'], { label: string; dot: string; pill: string }> = {
	pending: {
		label: 'Aguardando',
		dot: 'bg-amber-400',
		pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
	},
	accepted: {
		label: 'Agendado',
		dot: 'bg-blue-400',
		pill: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
	},
	in_progress: {
		label: 'Em andamento',
		dot: 'bg-emerald-400 animate-pulse',
		pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
	},
	completed: {
		label: 'Concluído',
		dot: 'bg-slate-400',
		pill: 'bg-secondary/60 text-muted-foreground border-border/60',
	},
	cancelled: {
		label: 'Cancelado',
		dot: 'bg-red-400',
		pill: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
	},
};

// ── StatusPill ─────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: WalkRecord['status'] }) {
	const cfg = statusMap[status];
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
				cfg.pill,
			)}
		>
			<span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
			{cfg.label}
		</span>
	);
}

// ── PetBadge ───────────────────────────────────────────────────────────────
function PetBadge({ name }: { name: string }) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide',
				'bg-primary/10 text-primary border-primary/20',
			)}
		>
			<Dog className="w-3 h-3 shrink-0" />
			<span className="truncate max-w-[6rem]">{name}</span>
		</span>
	);
}

function PetBadges({ names }: { names: string[] }) {
	return (
		<div className="flex flex-wrap items-center gap-1.5 min-w-0">
			{names.map((name, index) => (
				<PetBadge key={`${name}-${index}`} name={name} />
			))}
		</div>
	);
}

// ── WalkCard ───────────────────────────────────────────────────────────────
function WalkCard({ walk }: { walk: EnrichedWalk }) {
	const isActive = walk.status === 'in_progress';
	const isCompleted = walk.status === 'completed';

	const walkerInitials = walk.walkerName
		.split(' ')
		.map((n) => n[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();

	return (
		<div
			className={cn(
				'group relative rounded-2xl border bg-card overflow-hidden flex flex-col transition-all duration-300',
				'hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20',
				isActive
					? 'border-emerald-500/60 shadow-sm shadow-emerald-500/10'
					: 'border-border/60 hover:border-border',
			)}
		>
			{/* Header do card */}
			<div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
				<div className="flex items-start gap-3 min-w-0">
					{/* Avatar passeador */}
					<div
						className={cn(
							'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold ring-1 bg-primary/8 text-primary ring-primary/15',
						)}
					>
						{walkerInitials}
					</div>

					<div className="min-w-0">
						<p className="text-sm font-semibold text-foreground leading-tight truncate">
							{walk.walkerName}
						</p>
						<div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
							<CalendarDays className="w-3 h-3 shrink-0" />
							<span className="truncate">{walk.dateLabel}</span>
						</div>
					</div>
				</div>

				<StatusPill status={walk.status} />
			</div>

			<Separator className="opacity-50" />

			{/* Info do passeio */}
			<div className="px-5 py-4 flex-1 space-y-3">
				<div className="flex items-center justify-between gap-2">
					<PetBadges names={walk.petNames} />
					<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground shrink-0">
						<Clock className="w-3 h-3" />
						{walk.durationMinutes} min
					</div>
				</div>

				<div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
					<MapPin className="w-3.5 h-3.5 shrink-0" />
					<span className="truncate" title={walk.startAddress}>
						{walk.startAddress}
					</span>
				</div>

				<div className="flex items-center justify-between">
					<span className="text-lg font-bold text-foreground tabular-nums">
						{walk.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
					</span>
					{isCompleted && (
						<div className="flex items-center gap-0.5">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star key={star} className="w-3 h-3 text-amber-300 fill-amber-300" />
							))}
						</div>
					)}
				</div>
			</div>

			{/* Ações */}
			<div className="px-5 pb-5">
				{isActive ? (
					<Link
						href={`/walks/${walk.id}/tracking`}
						className={cn(
							buttonVariants({ size: 'lg' }),
							'w-full rounded-md gap-2 bg-emerald-500 hover:bg-emerald-600 text-white border-0',
						)}
					>
						<MapPin className="w-3.5 h-3.5" />
						Acompanhar ao vivo
					</Link>
				) : (
					<div className="grid grid-cols-2 gap-2">
						<Link
							href={`/walks/${walk.id}`}
							className={cn(
								buttonVariants({ variant: 'outline', size: 'lg' }),
								'rounded-md w-full',
							)}
						>
							Detalhes
						</Link>
						<Link
							href={isCompleted ? `/walks/${walk.id}/review` : `/walks/new?walker=${walk.walkerId}`}
							className={cn(
								buttonVariants({
									variant: isCompleted ? 'outline' : 'secondary',
									size: 'lg',
								}),
								'rounded-md w-full justify-center gap-1.5',
								isCompleted &&
									'py-0 leading-none bg-amber-400 hover:bg-amber-300 hover:border-amber-400/40 active:bg-amber-100/80 dark:bg-amber-500/12 dark:text-amber-300 dark:border-amber-500/25 dark:hover:bg-amber-500/20 dark:hover:border-amber-500/35 [&_svg]:size-3 text-white hover:text-white',
							)}
						>
							{isCompleted ? (
								<>
									<Star className="size-3 shrink-0 fill-white dark:fill-amber-300 dark:text-amber-300" />
									Avaliar
								</>
							) : (
								'Reagendar'
							)}
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}

// ── Empty state inline ─────────────────────────────────────────────────────
function WalksEmptyState({ filtered = false }: { filtered?: boolean }) {
	return (
		<div className="flex flex-col items-center justify-center py-20 px-6 text-center col-span-full">
			<div className="relative mb-5">
				<div className="w-20 h-20 rounded-3xl bg-primary/5 ring-1 ring-primary/10 flex items-center justify-center text-4xl">
					🐾
				</div>
				{!filtered && (
					<div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center ring-2 ring-background">
						<Plus className="w-4 h-4 text-primary-foreground" />
					</div>
				)}
			</div>

			<h3 className="text-base font-semibold text-foreground mb-1.5">
				{filtered ? 'Nenhum passeio encontrado' : 'Você ainda não tem passeios'}
			</h3>
			<p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
				{filtered
					? 'Tente mudar o filtro ou a busca para encontrar outros passeios.'
					: 'Solicite seu primeiro passeio e acompanhe tudo por aqui.'}
			</p>

			{!filtered && (
				<Link
					href="/walks/new"
					className={cn(buttonVariants({ size: 'default' }), 'rounded-md gap-2')}
				>
					<Plus className="w-4 h-4" />
					Solicitar passeio
				</Link>
			)}
		</div>
	);
}

type EnrichedWalk = WalkRecord & { walkerName: string };

const TAB_PANEL_CLASS = 'm-0 focus-visible:outline-none focus-visible:ring-0';

const walkTabs = [
	{
		value: 'todos',
		label: 'Todos',
		filter: (walks: EnrichedWalk[]) => walks,
	},
	{
		value: 'em_andamento',
		label: 'Em andamento',
		filter: (walks: EnrichedWalk[]) => walks.filter((w) => w.status === 'in_progress'),
	},
	{
		value: 'concluidos',
		label: 'Concluídos',
		filter: (walks: EnrichedWalk[]) => walks.filter((w) => w.status === 'completed'),
	},
	{
		value: 'agendados',
		label: 'Agendados',
		filter: (walks: EnrichedWalk[]) =>
			walks.filter((w) => w.status === 'accepted' || w.status === 'pending'),
	},
	{
		value: 'cancelados',
		label: 'Cancelados',
		filter: (walks: EnrichedWalk[]) => walks.filter((w) => w.status === 'cancelled'),
	},
] as const;

type WalkTabValue = (typeof walkTabs)[number]['value'];

// ── Grid de passeios ───────────────────────────────────────────────────────
function WalksGrid({ walks, filtered = false }: { walks: EnrichedWalk[]; filtered?: boolean }) {
	if (walks.length === 0) return <WalksEmptyState filtered={filtered} />;

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{walks.map((walk, i) => (
				<div
					key={walk.id}
					style={{ animationDelay: `${i * 50}ms` }}
					className="animate-in fade-in slide-in-from-bottom-2 duration-300"
				>
					<WalkCard walk={walk} />
				</div>
			))}
		</div>
	);
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function WalksPage() {
	const walks: EnrichedWalk[] = allWalks.map((walk) => ({
		...walk,
		walkerName: getWalkerById(walk.walkerId)?.name ?? 'Passeador',
	}));

	const defaultTab: WalkTabValue = walkTabs[0].value;

	return (
		<div className="space-y-8 pb-8">
			{/* ── Header ── */}
			<div className="space-y-1.5">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
								Meus Passeios
							</h1>
							<p className="text-sm text-muted-foreground">
								Histórico e acompanhamento de todos os passeios.
							</p>
						</div>
					</div>

					{/* Ações do header */}
					<div className="flex items-center gap-2 flex-wrap">
						<Link
							href="/walks/new"
							className={cn(buttonVariants({ variant: 'default' }), 'gap-1.5 shadow-sm')}
						>
							<Plus className="w-3.5 h-3.5" />
							Novo passeio
						</Link>
					</div>
				</div>

				<Separator className="mt-6" />
			</div>

			{/* ── Tabs + busca ── */}
			<Tabs defaultValue={defaultTab} className="w-full">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
					<div className="flex gap-4 items-center">
						<TabsList className="bg-muted/40 border border-border/60 p-1 h-auto">
							{walkTabs.map((tab) => {
								const count = tab.filter(walks).length;
								return (
									<TabsTrigger
										key={tab.value}
										value={tab.value}
										className="rounded-md min-h-[24px] px-3.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer"
									>
										<span className="text-sm">{tab.label}</span>
										{count > 0 && (
											<span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold min-w-4 h-4 px-1 leading-none">
												{count}
											</span>
										)}
									</TabsTrigger>
								);
							})}
						</TabsList>
						<Link
							href="/walks/history"
							className={cn(
								buttonVariants({ variant: 'outline', size: 'sm' }),
								'rounded-md gap-1.5',
							)}
						>
							<History className="w-3.5 h-3.5" />
							Histórico
						</Link>
					</div>

					{/* Busca */}
					<div className="relative w-full sm:w-60">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
						<Input
							type="search"
							placeholder="Pet ou passeador..."
							className="pl-9 rounded-md bg-background h-9 text-sm"
						/>
					</div>
				</div>

				{walkTabs.map((tab) => {
					const filteredWalks = tab.filter(walks);
					const isFiltered = tab.value !== 'todos';

					return (
						<TabsContent key={tab.value} value={tab.value} className={TAB_PANEL_CLASS}>
							<WalksGrid walks={filteredWalks} filtered={isFiltered} />
						</TabsContent>
					);
				})}
			</Tabs>
		</div>
	);
}
