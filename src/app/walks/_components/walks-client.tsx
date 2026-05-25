'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useWalks } from '@/features/walks/hooks/use-walks';
import { useCancelWalk } from '@/features/walks/hooks/use-walk-actions';
import { cn } from '@/lib/utils';
import type { WalkRecord } from '@/types';
import {
	AlertCircle,
	CalendarDays,
	Clock,
	Dog,
	MapPin,
	Plus,
	Search,
	Star,
	X,
} from 'lucide-react';
import { useReview } from '@/features/reviews/hooks/use-reviews';

// ── Status config ──────────────────────────────────────────────────────────
const statusMap: Record<WalkRecord['status'], { label: string; dot: string; pill: string }> = {
	pending: {
		label: 'Procurando',
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

function StatusPill({ status }: { status: WalkRecord['status'] }) {
	const cfg = statusMap[status];
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide shrink-0',
				cfg.pill,
			)}
		>
			{status === 'pending' ? (
				<span className="relative flex w-1.5 h-1.5 shrink-0">
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
					<span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-amber-400" />
				</span>
			) : (
				<span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
			)}
			{cfg.label}
		</span>
	);
}

function PetBadge({ name }: { name: string }) {
	return (
		<span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary tracking-wide">
			<Dog className="w-3 h-3 shrink-0" />
			<span className="truncate max-w-[6rem]">{name}</span>
		</span>
	);
}

// ── Sort order ─────────────────────────────────────────────────────────────
function walkPriority(w: WalkRecord): number {
	if (w.status === 'pending')   return 0;
	if (w.status === 'in_progress') return 1;
	if (w.status === 'accepted')  return 2;
	if (w.status === 'completed') return 3;
	return 4; // cancelled
}

function sortWalks(walks: WalkRecord[]): WalkRecord[] {
	return [...walks].sort((a, b) => {
		const pDiff = walkPriority(a) - walkPriority(b);
		if (pDiff !== 0) return pDiff;
		return new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime();
	});
}

// ── WalkCard ───────────────────────────────────────────────────────────────
function WalkCard({
	walk,
	onCancel,
}: {
	walk: WalkRecord;
	onCancel: (id: string) => void;
}) {
	const isSearching = walk.status === 'pending';
	const isActive    = walk.status === 'in_progress';
	const isCompleted = walk.status === 'completed';
	const isPending   = walk.status === 'accepted';
	const isCancelled = walk.status === 'cancelled';

	const [confirmingCancel, setConfirmingCancel] = useState(false);

	const walkerName = walk.participants.find((p) => p.role === 'walker')?.name ?? 'Passeador';
	const { data: review } = useReview(walk.id, isCompleted);
	const hasReview = review != null;

	const walkerInitials = walkerName
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
					: isSearching
						? 'border-amber-500/60 shadow-sm shadow-amber-500/10'
						: 'border-border/60 hover:border-border',
			)}
		>
			{isActive && (
				<div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400" />
			)}
			{isSearching && (
				<div className="h-1 w-full bg-gradient-to-r from-amber-400/60 via-amber-500 to-amber-400/60" />
			)}

			{/* Header */}
			<div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
				{isSearching ? (
					<div className="flex items-center gap-3 min-w-0">
						<div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-amber-500/10 ring-1 ring-amber-500/20">
							<CalendarDays className="w-4 h-4 text-amber-600 dark:text-amber-400" />
						</div>
						<div className="min-w-0">
							<p className="text-sm font-semibold text-foreground leading-tight">Procurando passeador</p>
							<div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
								<CalendarDays className="w-3 h-3 shrink-0" />
								<span className="truncate">{walk.dateLabel}</span>
							</div>
						</div>
					</div>
				) : (
					<div className="flex items-start gap-3 min-w-0">
						<div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold ring-1 bg-primary/8 text-primary ring-primary/15">
							{walkerInitials}
						</div>
						<div className="min-w-0">
							<p className="text-sm font-semibold text-foreground leading-tight truncate">
								{walkerName}
							</p>
							<div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
								<CalendarDays className="w-3 h-3 shrink-0" />
								<span className="truncate">{walk.dateLabel}</span>
							</div>
						</div>
					</div>
				)}
				{isSearching ? (
					<span className="relative flex w-2.5 h-2.5 shrink-0 mt-1">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
						<span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-amber-400" />
					</span>
				) : (
					<StatusPill status={walk.status} />
				)}
			</div>

			<Separator className="opacity-50" />

			{/* Info */}
			<div className="px-5 py-4 flex-1 space-y-3">
				<div className="flex items-center justify-between gap-2">
					<div className="flex flex-wrap items-center gap-1.5 min-w-0">
						{walk.petNames.map((name, i) => (
							<PetBadge key={`${name}-${i}`} name={name} />
						))}
					</div>
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
					{isCompleted && hasReview && (
						<div className="flex items-center gap-0.5">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star key={star} className="w-3 h-3 text-amber-400 fill-amber-400" />
							))}
						</div>
					)}
					{isCompleted && !hasReview && (
						<span className="text-[11px] text-muted-foreground">Sem avaliação</span>
					)}
				</div>
			</div>

			{/* Actions */}
			<div className="px-5 pb-5">
				{isActive && (
					<div className="grid grid-cols-2 gap-2">
						<Link
							href={`/walks/${walk.id}`}
							className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-lg w-full')}
						>
							Detalhes
						</Link>
						<Link
							href={`/walks/${walk.id}/tracking`}
							className={cn(
								buttonVariants({ size: 'lg' }),
								'rounded-lg gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white border-0',
							)}
						>
							<MapPin className="w-3.5 h-3.5" />
							Acompanhar
						</Link>
					</div>
				)}

				{isSearching && !confirmingCancel && (
					<button
						type="button"
						onClick={() => setConfirmingCancel(true)}
						className={cn(
							buttonVariants({ variant: 'outline', size: 'lg' }),
							'rounded-lg w-full gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/50 cursor-pointer',
						)}
					>
						<X className="w-3.5 h-3.5" />
						Cancelar busca
					</button>
				)}

				{isPending && !confirmingCancel && (
					<div className="grid grid-cols-2 gap-2">
						<Link
							href={`/walks/${walk.id}`}
							className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-lg w-full')}
						>
							Detalhes
						</Link>
						<button
							type="button"
							onClick={() => setConfirmingCancel(true)}
							className={cn(
								buttonVariants({ variant: 'outline', size: 'lg' }),
								'rounded-lg w-full gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/50 cursor-pointer',
							)}
						>
							<X className="w-3.5 h-3.5" />
							Cancelar
						</button>
					</div>
				)}

				{(isSearching || isPending) && confirmingCancel && (
					<div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 space-y-2.5">
						<div className="flex items-center gap-2 text-sm text-destructive">
							<AlertCircle className="w-4 h-4 shrink-0" />
							<span className="font-medium">Cancelar este passeio?</span>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => setConfirmingCancel(false)}
								className={cn(
									buttonVariants({ variant: 'outline', size: 'sm' }),
									'rounded-lg cursor-pointer',
								)}
							>
								Voltar
							</button>
							<button
								type="button"
								onClick={() => onCancel(walk.id)}
								className={cn(
									buttonVariants({ variant: 'destructive', size: 'sm' }),
									'rounded-lg cursor-pointer',
								)}
							>
								Sim, cancelar
							</button>
						</div>
					</div>
				)}

				{isCompleted && (
					<div className="grid grid-cols-2 gap-2">
						<Link
							href={`/walks/${walk.id}`}
							className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-lg w-full')}
						>
							Detalhes
						</Link>
						{hasReview ? (
							<Link
								href={`/walks/${walk.id}/review`}
								className={cn(
									buttonVariants({ variant: 'outline', size: 'lg' }),
									'rounded-lg w-full gap-1.5',
								)}
							>
								<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
								Ver avaliação
							</Link>
						) : (
							<Link
								href={`/walks/${walk.id}/review`}
								className={cn(
									buttonVariants({ variant: 'outline', size: 'lg' }),
									'rounded-lg w-full gap-1.5 bg-amber-400 hover:bg-amber-300 border-0 text-white hover:text-white',
								)}
							>
								<Star className="w-3.5 h-3.5 fill-white text-white" />
								Avaliar
							</Link>
						)}
					</div>
				)}

				{isCancelled && (
					<div className="grid grid-cols-2 gap-2">
						<Link
							href={`/walks/${walk.id}`}
							className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-lg w-full')}
						>
							Detalhes
						</Link>
						<Link
							href={`/walks/new?walker=${walk.walkerId}`}
							className={cn(
								buttonVariants({ variant: 'secondary', size: 'lg' }),
								'rounded-lg w-full',
							)}
						>
							Repetir passeio
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}

// ── Empty state ────────────────────────────────────────────────────────────
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
					className={cn(buttonVariants({ size: 'default' }), 'rounded-lg gap-2')}
				>
					<Plus className="w-4 h-4" />
					Solicitar passeio
				</Link>
			)}
		</div>
	);
}

// ── Filters ────────────────────────────────────────────────────────────────
type FilterValue = 'todos' | 'pendentes' | 'em_andamento' | 'concluidos' | 'cancelados';

const FILTERS: { value: FilterValue; label: string; match: (w: WalkRecord) => boolean }[] = [
	{ value: 'todos',        label: 'Todos',        match: () => true },
	{ value: 'pendentes',    label: 'Agendados',    match: (w) => w.status === 'accepted' || w.status === 'pending' },
	{ value: 'em_andamento', label: 'Em andamento', match: (w) => w.status === 'in_progress' },
	{ value: 'concluidos',   label: 'Concluídos',   match: (w) => w.status === 'completed' },
	{ value: 'cancelados',   label: 'Cancelados',   match: (w) => w.status === 'cancelled' },
];

// ── Main client component ──────────────────────────────────────────────────
export function WalksClient() {
	const { data: rawWalks = [], isLoading } = useWalks('client');
	const { mutate: cancelWalk } = useCancelWalk();
	const [activeFilter, setActiveFilter] = useState<FilterValue>('todos');
	const [search, setSearch] = useState('');

	const allWalks = useMemo(() => sortWalks(rawWalks), [rawWalks]);

	const filtered = useMemo(() => {
		const filterFn = FILTERS.find((f) => f.value === activeFilter)?.match ?? (() => true);
		const byStatus = allWalks.filter(filterFn);
		if (!search.trim()) return byStatus;
		const q = search.toLowerCase();
		return byStatus.filter(
			(w) =>
				w.petNames.some((n) => n.toLowerCase().includes(q)) ||
				(w.participants.find((p) => p.role === 'walker')?.name ?? '').toLowerCase().includes(q) ||
				w.startAddress.toLowerCase().includes(q),
		);
	}, [allWalks, activeFilter, search]);

	const counts = useMemo(
		() => Object.fromEntries(FILTERS.map((f) => [f.value, allWalks.filter(f.match).length])),
		[allWalks],
	);

	function handleCancel(id: string) {
		cancelWalk(id, {
			onSuccess: () => toast.success('Passeio cancelado.'),
		});
	}

	if (isLoading) {
		return (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-8">
				{[1, 2, 3].map((i) => (
					<div key={i} className="rounded-2xl border bg-card h-64 animate-pulse" />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-8 pb-8">
			{/* Header */}
			<div className="space-y-1.5">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
							Meus Passeios
						</h1>
						<p className="text-sm text-muted-foreground">
							Histórico e acompanhamento de todos os passeios.
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Link
							href="/walks/new"
							className={cn(buttonVariants({ variant: 'default' }), 'gap-1.5 shadow-sm rounded-lg')}
						>
							<Plus className="w-3.5 h-3.5" />
							Novo passeio
						</Link>
					</div>
				</div>
				<Separator className="mt-6" />
			</div>

			{/* Filters + search */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-2">
					{FILTERS.map((f) => {
						const count    = counts[f.value] ?? 0;
						const isActive = activeFilter === f.value;
						return (
							<button
								key={f.value}
								type="button"
								onClick={() => setActiveFilter(f.value)}
								className={cn(
									'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer border',
									isActive
										? 'bg-primary text-primary-foreground border-primary shadow-sm'
										: 'bg-background text-muted-foreground border-border/60 hover:border-border hover:text-foreground hover:bg-muted/40',
								)}
							>
								{f.label}
								{count > 0 && (
									<span
										className={cn(
											'inline-flex items-center justify-center rounded-full text-[10px] font-bold min-w-4 h-4 px-1 leading-none',
											isActive
												? 'bg-primary-foreground/20 text-primary-foreground'
												: 'bg-primary/10 text-primary',
										)}
									>
										{count}
									</span>
								)}
							</button>
						);
					})}

				</div>

				<div className="relative w-full sm:w-64">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
					<Input
						type="search"
						placeholder="Pet, passeador ou endereço..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9 rounded-lg bg-background h-9 text-sm"
					/>
				</div>
			</div>

			{/* Grid */}
			{filtered.length === 0 ? (
				<WalksEmptyState filtered={activeFilter !== 'todos' || search.length > 0} />
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((walk, i) => (
						<div
							key={walk.id}
							style={{ animationDelay: `${i * 40}ms` }}
							className="animate-in fade-in slide-in-from-bottom-2 duration-300"
						>
							<WalkCard
								walk={walk}
								onCancel={handleCancel}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
