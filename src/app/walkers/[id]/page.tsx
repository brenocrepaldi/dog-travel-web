import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
	ArrowLeft,
	CalendarClock,
	CheckCircle2,
	FileCheck2,
	HeartHandshake,
	MapPin,
	ShieldCheck,
	Target,
	Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WalkerHero } from '@/components/walkers/walker-hero';
import { InfoBlockEnhanced } from '@/components/walkers/info-block-enhanced';
import { TrustItemCard } from '@/components/walkers/trust-item-card';
import { getWalkerById } from '@/lib/mock-data';

export const metadata: Metadata = { title: 'Detalhe do Passeador | DogTravel' };

// Calculate joined date (mock for now)
const mockJoinedDate = new Date(
	Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

export default async function WalkerDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const walker = getWalkerById(id);

	if (!walker) {
		notFound();
	}

	const specialtyLabels = Array.from(
		new Set([
			...walker.tags,
			...walker.behaviorExpertise
				.filter((expertise) => expertise === 'multiplos-caes')
				.map(() => 'Passeio com mais de um cão'),
		]),
	);

	return (
		<div className="space-y-10 pb-12">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<Link
					href="/walkers"
					className={cn(
						buttonVariants({
							variant: 'ghost',
							size: 'sm',
							className: 'text-muted-foreground hover:text-foreground',
						}),
					)}
				>
					<ArrowLeft className="mr-1.5 h-4 w-4" />
					Voltar
				</Link>
				<Link
					href={`/walks/new?walker=${walker.id}`}
					className={cn(
						buttonVariants({
							variant: 'default',
							className: 'shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all',
						}),
					)}
				>
					Agendar passeio
				</Link>
			</div>

			{/* Hero Section - Enhanced Avatar & Info with Especialidades */}
			<Card className="overflow-hidden border border-border/40 relative shadow-sm hover:shadow-md transition-shadow duration-300">
				{/* Decorative blur background */}
				<div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-l from-primary/5 to-transparent blur-3xl opacity-40" />

				<CardHeader className="border-b border-border/60 pt-2 pb-8 relative z-10">
					<WalkerHero
						name={walker.name}
						description={walker.description}
						rating={walker.rating}
						reviews={walker.reviews}
						location={walker.location}
						verified={walker.verified}
						availability={walker.availability}
						joinedDate={mockJoinedDate}
					/>
				</CardHeader>

				{/* Info Grid & Especialidades - Side by Side */}
				<CardContent className="grid gap-8 pt-4 pb-4 lg:grid-cols-2 relative z-10">
					{/* Info Blocks - Left Side */}
					<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
						<InfoBlockEnhanced
							icon={MapPin}
							label="Área de atendimento"
							value={walker.serviceArea}
							color="info"
							size="sm"
						/>
						<InfoBlockEnhanced
							icon={CalendarClock}
							label="Passeios concluídos"
							value={String(walker.completedWalks)}
							color="success"
							size="sm"
						/>
					</div>

					{/* Especialidades - Right Side */}
					<div className="flex flex-col gap-1">
						<p className="mb-4 text-sm font-semibold tracking-wide text-foreground flex items-center gap-2.5">
							<Target className="h-4 w-4 text-primary/70" />
							Especialidades
						</p>
						<div className="flex flex-wrap gap-2.5">
							{specialtyLabels.map((tag) => (
								<Badge
									key={tag}
									variant="secondary"
									className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800/60 transition-all duration-200 border border-slate-200/50 dark:border-slate-800/50"
								>
									{tag}
								</Badge>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Trust & Credentials - 2 Column Layout */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Trust & Security */}
				<Card className="border border-border/30 bg-gradient-to-br from-emerald-50/60 dark:from-emerald-950/20 via-background to-background shadow-sm hover:shadow-md transition-shadow duration-300">
					<CardHeader className="pb-6">
						<CardTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2.5">
							<ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
							Confiança e Segurança
						</CardTitle>
						<CardDescription className="text-xs mt-1.5">
							Critérios usados para manter a qualidade do serviço.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<TrustItemCard
							icon={ShieldCheck}
							label="Identidade validada"
							value={
								walker.trustChecks.identityVerified
									? 'Documento e selfie confirmados'
									: 'Em revisão'
							}
							verified={walker.trustChecks.identityVerified}
						/>
						<TrustItemCard
							icon={FileCheck2}
							label="Antecedentes"
							value={
								walker.trustChecks.backgroundCheck
									? 'Checagem concluída e aprovada'
									: 'Em atualização'
							}
							verified={walker.trustChecks.backgroundCheck}
						/>
						<TrustItemCard
							icon={HeartHandshake}
							label="Experiencia no perfil do pet"
							value={
								walker.behaviorExpertise.length > 0
									? 'Atende perfis comportamentais diversos'
									: 'Perfil em atualização'
							}
							verified={walker.behaviorExpertise.length > 0}
						/>
						<TrustItemCard
							icon={CheckCircle2}
							label="Primeiros socorros pet"
							value={
								walker.trustChecks.firstAidCertified ? 'Certificação comprovada' : 'Não informado'
							}
							verified={walker.trustChecks.firstAidCertified}
						/>
					</CardContent>
				</Card>

				{/* Credentials & Certifications */}
				<Card className="border border-border/30 bg-gradient-to-br from-cyan-50/60 dark:from-cyan-950/20 via-background to-background shadow-sm hover:shadow-md transition-shadow duration-300">
					<CardHeader className="pb-6">
						<CardTitle className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2.5">
							<Award className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
							Credenciais e Certificados
						</CardTitle>
						<CardDescription className="text-xs mt-1.5">
							Formações e treinamentos apresentados por este profissional.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{walker.certifications.map((certification) => (
							<TrustItemCard
								key={certification}
								icon={Award}
								label="Certificação"
								value={certification}
								verified
								accent="cyan"
							/>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
