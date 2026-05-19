'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { walks as mockWalks } from '@/lib/mock-data';
import { useAppStore } from '@/hooks/use-app-store';
import { DEFAULT_CLIENT_PETS } from '@/lib/pets';
import { WalkService } from '@/services/walk.service';
import { trackMetricEvent } from '@/lib/metrics';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { StepPets } from './steps/step-pets';
import { StepDateTime } from './steps/step-datetime';
import { StepLocation } from './steps/step-location';
import { StepPrice } from './steps/step-price';
import { StepPayment } from './steps/step-payment';
import { StepConfirm } from './steps/step-confirm';

// ─── Form state shape ──────────────────────────────────────────────────────
export interface WalkFormData {
	selectedPetIds: string[];
	date: string;
	time: string;
	durationMinutes: number;
	// Individual address fields (user fills these)
	addressStreet: string; // logradouro + número
	addressComplement: string; // complemento (optional)
	addressNeighborhood: string; // bairro (optional but improves geocoding)
	addressCity: string; // cidade (required)
	// Combined address derived from the fields above; used for geocoding & backend
	address: string;
	lat: number | null;
	lng: number | null;
	estimatedPrice: number | null;
	selectedMethodId: string | null;
	isFirstRide: boolean;
}

const INITIAL_DATA: WalkFormData = {
	selectedPetIds: [],
	date: '',
	time: '',
	durationMinutes: 30,
	addressStreet: '',
	addressComplement: '',
	addressNeighborhood: '',
	addressCity: '',
	address: '',
	lat: null,
	lng: null,
	estimatedPrice: null,
	selectedMethodId: null,
	isFirstRide: true,
};

function toDateAndTime(iso: string) {
	const dateTime = new Date(iso);
	const localDateTime = new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60000);
	const [date, time] = localDateTime.toISOString().split('T');
	return { date, time: time.slice(0, 5) };
}

interface LocalWalkRequest {
	id: string;
	payload: {
		petIds: string[];
		scheduledAt: string;
		durationMinutes: number;
		address: string;
		paymentMethodId: string;
	};
	createdAt: string;
}

function saveLocalRequest(request: LocalWalkRequest) {
	if (typeof window === 'undefined') return;
	const raw = window.localStorage.getItem('dogtravel.local-walk-requests');
	let current: LocalWalkRequest[] = [];
	if (raw) {
		try {
			const parsed = JSON.parse(raw);
			current = Array.isArray(parsed) ? (parsed as LocalWalkRequest[]) : [];
		} catch {
			current = [];
		}
	}
	const next = [...current, request].slice(-50);
	window.localStorage.setItem('dogtravel.local-walk-requests', JSON.stringify(next));
}

// ─── Step definitions ──────────────────────────────────────────────────────
const STEPS = [
	{ label: 'Seus cães' },
	{ label: 'Data e horário' },
	{ label: 'Local de partida' },
	{ label: 'Estimativa de preço' },
	{ label: 'Pagamento' },
	{ label: 'Confirmar pedido' },
];

// ─── Step indicator ────────────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
	return (
		<div className="space-y-3">
			{/* Step name + dot trail */}
			<div className="flex items-center justify-between">
				<div>
					<p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
						Passo {currentStep + 1} de {STEPS.length}
					</p>
					<p className="text-lg font-semibold text-foreground mt-0.5">{STEPS[currentStep].label}</p>
				</div>
			</div>

			{/* Segmented progress bar */}
			<div className="flex gap-1">
				{STEPS.map((_, i) => (
					<div
						key={i}
						className={cn(
							'h-1 flex-1 rounded-full transition-all duration-500',
							i < currentStep ? 'bg-primary' : i === currentStep ? 'bg-primary/40' : 'bg-border/60',
						)}
					/>
				))}
			</div>
		</div>
	);
}

// ─── Main form component ───────────────────────────────────────────────────
export function WalkRequestForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const storedPets = useAppStore((state) => state.pets);
	const [step, setStep] = useState(0);
	const [data, setData] = useState<WalkFormData>(INITIAL_DATA);
	const [submitting, setSubmitting] = useState(false);
	const hasPrefilledRepeat = useRef(false);
	const pets = storedPets.length > 0 ? storedPets : DEFAULT_CLIENT_PETS;

	useEffect(() => {
		if (hasPrefilledRepeat.current) return;
		const repeatWalkId = searchParams.get('repeat');
		if (!repeatWalkId) return;
		const walkToRepeat = mockWalks.find((walk) => walk.id === repeatWalkId);
		if (!walkToRepeat) return;
		hasPrefilledRepeat.current = true;
		const { date, time } = toDateAndTime(walkToRepeat.scheduledAt);
		const selectedPetIds = walkToRepeat.petNames
			.map((petName) => pets.find((pet) => pet.name.toLowerCase() === petName.toLowerCase())?.id)
			.filter((petId): petId is string => Boolean(petId));
		setData((previous) => ({
			...previous,
			selectedPetIds: selectedPetIds.length > 0 ? selectedPetIds : previous.selectedPetIds,
			durationMinutes: walkToRepeat.durationMinutes,
			date,
			time,
			address: walkToRepeat.startAddress,
			isFirstRide: false,
			estimatedPrice: null,
		}));
		toast('Dados do ultimo passeio carregados', {
			description: 'Revise os detalhes e confirme quando quiser.',
		});
		trackMetricEvent({
			name: 'walk_repeat_prefill_used',
			payload: { walkId: walkToRepeat.id },
		});
	}, [pets, searchParams]);

	function updateData(partial: Partial<WalkFormData>) {
		setData((prev) => ({ ...prev, ...partial }));
	}

	function next() {
		if (step < STEPS.length - 1) setStep((s) => s + 1);
	}

	function back() {
		if (step > 0) setStep((s) => s - 1);
	}

	async function handleSubmit() {
		setSubmitting(true);
		try {
			const scheduledAt = new Date(`${data.date}T${data.time || '00:00'}:00`).toISOString();
			const paymentMethodId = data.selectedMethodId ?? '';
			if (!paymentMethodId) {
				toast.error('Selecione uma forma de pagamento antes de concluir.');
				return;
			}
			await WalkService.create({
				petIds: data.selectedPetIds,
				scheduledAt,
				durationMinutes: data.durationMinutes,
				startLocation: {
					lat: data.lat ?? 0,
					lng: data.lng ?? 0,
					address: data.address,
				},
				paymentMethodId,
			});
			trackMetricEvent({
				name: 'walk_request_submitted',
				payload: {
					petCount: data.selectedPetIds.length,
					durationMinutes: data.durationMinutes,
					isFirstRide: data.isFirstRide,
				},
			});
			toast.success('Passeio solicitado!', {
				description: 'Aguardando aceitação de um passeador.',
			});
			router.push('/walks');
		} catch {
			const localRequest: LocalWalkRequest = {
				id: crypto.randomUUID(),
				createdAt: new Date().toISOString(),
				payload: {
					petIds: data.selectedPetIds,
					scheduledAt: `${data.date}T${data.time || '00:00'}`,
					durationMinutes: data.durationMinutes,
					address: data.address,
					paymentMethodId: data.selectedMethodId ?? '',
				},
			};
			saveLocalRequest(localRequest);
			trackMetricEvent({
				name: 'walk_request_failed',
				payload: { savedLocally: true },
			});
			toast.warning('API indisponível no momento', {
				description: 'Pedido salvo localmente no navegador para não perder os dados.',
			});
		} finally {
			setSubmitting(false);
		}
	}

	// ── Exit guard ────────────────────────────────────────────────────────────
	const [showExitModal, setShowExitModal] = useState(false);
	const [pendingUrl, setPendingUrl] = useState<string | null>(null);

	const isDirty =
		step > 0 || data.selectedPetIds.length > 0 || data.date !== '' || data.addressStreet !== '';

	// Intercept browser close / tab refresh
	useEffect(() => {
		if (!isDirty) return;
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = '';
		};
		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	}, [isDirty]);

	// Intercept browser back button
	useEffect(() => {
		if (!isDirty) return;
		window.history.pushState({ walkGuard: true }, '');
		const handler = () => {
			window.history.pushState({ walkGuard: true }, '');
			setPendingUrl(null);
			setShowExitModal(true);
		};
		window.addEventListener('popstate', handler);
		return () => window.removeEventListener('popstate', handler);
	}, [isDirty]);

	// Intercept Next.js Link clicks (sidebar + any <a> going to another route)
	useEffect(() => {
		if (!isDirty) return;

		const handleClick = (e: MouseEvent) => {
			// Let modified clicks through (Ctrl/Cmd = new tab, etc.)
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

			const anchor = (e.target as HTMLElement).closest('a');
			if (!anchor) return;

			const href = anchor.getAttribute('href');
			if (!href) return;

			try {
				const dest = new URL(href, window.location.origin);
				// Ignore external links or same-page navigation
				if (dest.origin !== window.location.origin) return;
				if (dest.pathname === window.location.pathname) return;
			} catch {
				return;
			}

			// Block the click before Next.js processes it
			e.preventDefault();
			e.stopPropagation();
			setPendingUrl(href);
			setShowExitModal(true);
		};

		// Capture phase — fires before Next.js Link's own handler
		document.addEventListener('click', handleClick, true);
		return () => document.removeEventListener('click', handleClick, true);
	}, [isDirty]);

	function confirmExit() {
		setShowExitModal(false);
		router.push(pendingUrl ?? '/walks');
		setPendingUrl(null);
	}

	const stepProps = { data, updateData, onNext: next, onBack: back };

	return (
		<div className="max-w-2xl mx-auto space-y-6 pb-10">
			{/* Page header */}
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground">Solicitar passeio</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Preencha os detalhes para encontrar o passeador ideal.
				</p>
			</div>

			{/* Step indicator */}
			<StepIndicator currentStep={step} />

			{/* Step card — key forces remount + animation on step change */}
			<Card
				key={step}
				className="overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
			>
				<div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/40" />
				<CardContent className="p-6">
					{step === 0 && <StepPets {...stepProps} onCancel={() => setShowExitModal(true)} />}
					{step === 1 && <StepDateTime {...stepProps} />}
					{step === 2 && <StepLocation {...stepProps} />}
					{step === 3 && <StepPrice {...stepProps} />}
					{step === 4 && <StepPayment {...stepProps} />}
					{step === 5 && (
						<StepConfirm {...stepProps} onSubmit={handleSubmit} submitting={submitting} />
					)}
				</CardContent>
			</Card>

			{/* Exit confirmation modal */}
			<Dialog open={showExitModal} onOpenChange={(open) => !open && setShowExitModal(false)}>
				<DialogContent showCloseButton={false} className="max-w-sm">
					<DialogHeader>
						<div className="flex items-center gap-3 mb-1">
							<div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
								<LogOut className="h-5 w-5 text-destructive" />
							</div>
							<DialogTitle className="text-base font-semibold">Sair do pedido?</DialogTitle>
						</div>
						<DialogDescription className="text-sm leading-relaxed">
							O progresso feito até aqui será perdido e o pedido não será salvo.
						</DialogDescription>
					</DialogHeader>
					{/* Custom footer — flex-col keeps safe action on top on mobile */}
					<div className="-mx-4 -mb-4 flex flex-col gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end">
						<Button
							variant="ghost"
							className="cursor-pointer"
							onClick={() => setShowExitModal(false)}
						>
							Continuar pedido
						</Button>
						<Button variant="destructive" className="cursor-pointer" onClick={confirmExit}>
							Sair sem salvar
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
