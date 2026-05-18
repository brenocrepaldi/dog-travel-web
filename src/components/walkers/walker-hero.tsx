import { ShieldCheck, MapPin, Star, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

type WalkerHeroProps = {
	name: string;
	description: string;
	rating: number;
	reviews: number;
	location: string;
	verified: boolean;
	availability: string;
	joinedDate?: string;
};

export function WalkerHero({
	name,
	description,
	rating,
	reviews,
	location,
	verified,
	availability,
	joinedDate,
}: WalkerHeroProps) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
			<div className="flex items-start gap-5">
				{/* Avatar com gradiente e efeito visual */}
				<div className="relative flex-shrink-0">
					{/* Glow background */}
					<div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent opacity-60 blur-md" />

					<div
						className={cn(
							'relative flex h-24 w-24 items-center justify-center rounded-full',
							'border-2 border-primary/30 font-bold text-2xl',
							'bg-gradient-to-br from-primary/25 via-primary/15 to-primary/10 text-primary',
							'shadow-lg',
						)}
					>
						{name
							.split(' ')
							.map((chunk) => chunk[0])
							.join('')
							.slice(0, 2)
							.toUpperCase()}
					</div>
				</div>

				{/* Text Content */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<h1 className="text-3xl font-bold tracking-tight text-foreground">{name}</h1>
						{verified && (
							<div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
								<ShieldCheck
									className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
									aria-label="Verificado"
								/>
								<span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
									Verificado
								</span>
							</div>
						)}
					</div>

					{joinedDate && (
						<div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-950/50 dark:to-slate-950/30 border border-slate-200 dark:border-slate-800/50">
							<Calendar className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
							<span className="text-xs font-medium text-slate-600 dark:text-slate-400">
								Membro desde {joinedDate}
							</span>
						</div>
					)}
					<p className="mt-3 text-base text-muted-foreground leading-relaxed">{description}</p>

					{/* Rating + Location + Joined Date */}
					<div className="mt-4 flex flex-col gap-3 text-sm">
						<div className="flex items-center gap-4 flex-wrap">
							<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
								<Star className="h-4 w-4 fill-amber-400 text-amber-400" />
								<span className="font-semibold text-amber-900 dark:text-amber-200">
									{rating.toFixed(1)}
								</span>
								<span className="text-xs text-amber-700 dark:text-amber-300">({reviews})</span>
							</span>

							<span className="flex items-center gap-1.5 text-foreground">
								<MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" />
								<span className="font-medium">{location}</span>
							</span>
						</div>
					</div>
				</div>
			</div>
			{/* Availability Badge */}
			<div className="w-1/6 inline-flex justify-center items-center gap-2 px-3 py-1 rounded-sm bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-950/50 dark:to-slate-950/30 border border-slate-200 dark:border-slate-800/50">
				<Calendar className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
				<span className="text-xs font-medium text-slate-700 dark:text-slate-300">
					{availability}
				</span>
			</div>
		</div>
	);
}
