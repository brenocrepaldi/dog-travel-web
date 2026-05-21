import type {
	WalkRequest,
	WalkerProfile,
	WalkRecord,
	ManagedPaymentMethod,
	PaymentHistoryItem,
	WalkReview,
} from '@/types';

export const walkRequests: WalkRequest[] = [
	{
		id: 'req-1',
		clientId: 'client_2',
		clientName: 'Ana Silva',
		petNames: ['Rex'],
		petIds: ['pet_2'],
		durationMinutes: 30,
		price: 44,
		scheduledAt: '2026-05-21T15:00:00-03:00',
		scheduledLabel: 'Hoje às 15:00',
		startAddress: 'Rua das Flores, 120 - São Paulo',
		receivedMinutes: 3,
	},
	{
		id: 'req-2',
		clientId: 'client_3',
		clientName: 'Julia Mendes',
		petNames: ['Mel', 'Bob'],
		petIds: ['pet_3', 'pet_4'],
		durationMinutes: 45,
		price: 58,
		scheduledAt: '2026-05-22T09:00:00-03:00',
		scheduledLabel: 'Amanhã às 09:00',
		startAddress: 'Av. Paulista, 900 - São Paulo',
		receivedMinutes: 11,
	},
];

export const walkers: WalkerProfile[] = [
	{
		id: '1',
		name: 'Carlos Silva',
		rating: 4.9,
		reviews: 124,
		location: 'Zona Sul, Sao Paulo',
		serviceArea: 'Moema, Vila Mariana e Itaim Bibi',
		description:
			'Especialista em caes de grande porte e alta energia. Passeios com foco em seguranca e enriquecimento.',
		tags: ['Grande Porte', 'Energeticos', 'Adestrador'],
		verified: true,
		availability: 'Seg-Sab, 07:00-19:00',
		completedWalks: 812,
		trustChecks: {
			identityVerified: true,
			backgroundCheck: true,
		},
		certifications: [
			{ title: 'Adestramento Positivo', verified: true },
			{ title: 'Primeiros Socorros com Pets', verified: true },
			{ title: 'Manejo de Cão Reativo', verified: true },
			{ title: 'Experiência Comportamental', verified: true },
		],
		supportedSizes: ['medium', 'large', 'giant'],
		behaviorExpertise: ['agitado', 'reativo', 'multiplos-caes'],
	},
	{
		id: '2',
		name: 'Ana Lima',
		rating: 5.0,
		reviews: 89,
		location: 'Centro, Rio de Janeiro',
		serviceArea: 'Centro, Gloria e Catete',
		description:
			'Passeios tranquilos para caes idosos e com necessidades especiais. Comunicacao constante durante todo o percurso.',
		tags: ['Idosos', 'Medicacao', 'Pequeno Porte'],
		verified: true,
		availability: 'Seg-Dom, 08:00-20:00',
		completedWalks: 467,
		trustChecks: {
			identityVerified: true,
			backgroundCheck: true,
		},
		certifications: [
			{ title: 'Cuidados com Cães Idosos', verified: true },
			{ title: 'Administração de Medicação', verified: true },
			{ title: 'Primeiros Socorros com Pets', verified: true },
			{ title: 'Socialização e Comportamento', verified: false },
		],
		supportedSizes: ['small', 'medium'],
		behaviorExpertise: ['idoso', 'filhote', 'medicacao'],
	},
	{
		id: '3',
		name: 'Pedro Santos',
		rating: 4.7,
		reviews: 56,
		location: 'Zona Norte, Sao Paulo',
		serviceArea: 'Santana, Tucuruvi e Casa Verde',
		description:
			'Trabalho com caes reativos usando manejo positivo. Rotas mais calmas e progressao gradual.',
		tags: ['Reativos', 'Ansiosos'],
		verified: false,
		availability: 'Seg-Sex, 06:00-18:00',
		completedWalks: 231,
		trustChecks: {
			identityVerified: true,
			backgroundCheck: false,
		},
		certifications: [
			{ title: 'Manejo de Cão Reativo', verified: true },
			{ title: 'Passeio em Baixo Estímulo', verified: true },
			{ title: 'Primeiros Socorros com Pets', verified: false },
		],
		supportedSizes: ['small', 'medium', 'large'],
		behaviorExpertise: ['reativo', 'ansioso', 'agitado'],
	},
	{
		id: '4',
		name: 'Marcia Souza',
		rating: 4.8,
		reviews: 201,
		location: 'Vila Mariana, Sao Paulo',
		serviceArea: 'Vila Mariana, Aclimacao e Paraiso',
		description:
			'Mais de 5 anos de experiencia. Foco em previsibilidade, primeiros socorros e rotina estruturada para filhotes.',
		tags: ['Experiente', 'Primeiros Socorros'],
		verified: true,
		availability: 'Seg-Dom, 06:30-21:00',
		completedWalks: 1022,
		trustChecks: {
			identityVerified: true,
			backgroundCheck: true,
		},
		certifications: [
			{ title: 'Primeiros Socorros Veterinários', verified: true },
			{ title: 'Socialização de Filhotes', verified: true },
			{ title: 'Conduta Segura em Via Pública', verified: true },
			{ title: 'Experiência Comportamental Avançada', verified: true },
		],
		supportedSizes: ['small', 'medium', 'large', 'giant'],
		behaviorExpertise: ['filhote', 'agitado', 'multiplos-caes'],
	},
];

export const walks: WalkRecord[] = [
	{
		id: '1',
		walkerId: '1',
		clientName: 'Breno',
		petNames: ['Rex'],
		status: 'in_progress',
		dateLabel: 'Hoje · 14:30',
		scheduledAt: '2026-04-14T14:30:00-03:00',
		durationMinutes: 45,
		price: 44,
		distanceKm: 2.8,
		startAddress: 'Rua das Flores, 120 - Sao Paulo',
		endAddress: 'Parque Ibirapuera - Portao 3',
		notes: 'Evitar areas com muito barulho no inicio.',
		paymentMethodId: 'pm_1',
		participants: [
			{ id: 'client_1', name: 'Breno', role: 'client' },
			{ id: '1', name: 'Carlos Silva', role: 'walker' },
		],
		timeline: [
			{ id: 't1', label: 'Pedido confirmado', at: '14:02', state: 'done' },
			{ id: 't2', label: 'Passeador chegou ao local', at: '14:28', state: 'done' },
			{ id: 't3', label: 'Passeio em andamento', at: '14:35', state: 'current' },
			{ id: 't4', label: 'Passeio concluido', at: '15:15', state: 'pending' },
		],
	},
	{
		id: '2',
		walkerId: '2',
		clientName: 'Breno',
		petNames: ['Rex', 'Mel'],
		status: 'completed',
		dateLabel: '18 Mar · 09:00',
		scheduledAt: '2026-03-18T09:00:00-03:00',
		durationMinutes: 60,
		price: 53,
		distanceKm: 3.2,
		startAddress: 'Av. Paulista, 900 - Sao Paulo',
		endAddress: 'Parque Trianon',
		notes: 'Levar agua para os dois caes.',
		paymentMethodId: 'pm_2',
		participants: [
			{ id: 'client_1', name: 'Breno', role: 'client' },
			{ id: '2', name: 'Ana Lima', role: 'walker' },
		],
		timeline: [
			{ id: 't1', label: 'Pedido confirmado', at: '08:20', state: 'done' },
			{ id: 't2', label: 'Passeador chegou ao local', at: '08:55', state: 'done' },
			{ id: 't3', label: 'Passeio em andamento', at: '09:03', state: 'done' },
			{ id: 't4', label: 'Passeio concluido', at: '10:02', state: 'done' },
		],
	},
	{
		id: '3',
		walkerId: '3',
		clientName: 'Breno',
		petNames: ['Mel'],
		status: 'cancelled',
		dateLabel: '10 Mar · 16:00',
		scheduledAt: '2026-03-10T16:00:00-03:00',
		durationMinutes: 45,
		price: 44,
		distanceKm: 0,
		startAddress: 'Rua Vergueiro, 550 - Sao Paulo',
		notes: 'Cancelado por chuva forte.',
		paymentMethodId: 'pm_1',
		participants: [
			{ id: 'client_1', name: 'Breno', role: 'client' },
			{ id: '3', name: 'Pedro Santos', role: 'walker' },
		],
		timeline: [
			{ id: 't1', label: 'Pedido confirmado', at: '15:20', state: 'done' },
			{
				id: 't2',
				label: 'Passeio cancelado',
				at: '15:45',
				state: 'done',
				note: 'Condições climaticas severas.',
			},
		],
	},
	{
		id: '4',
		walkerId: '4',
		clientName: 'Breno',
		petNames: ['Rex'],
		status: 'accepted',
		dateLabel: '25 Mar · 10:00',
		scheduledAt: '2026-03-25T10:00:00-03:00',
		durationMinutes: 45,
		price: 44,
		distanceKm: 0,
		startAddress: 'Rua Joaquim Tavora, 210 - Sao Paulo',
		notes: 'Primeiro passeio com esta passeadora.',
		paymentMethodId: 'pm_1',
		participants: [
			{ id: 'client_1', name: 'Breno', role: 'client' },
			{ id: '4', name: 'Marcia Souza', role: 'walker' },
		],
		timeline: [
			{ id: 't1', label: 'Pedido confirmado', at: '09:12', state: 'done' },
			{ id: 't2', label: 'Passeio agendado', at: '10:00', state: 'current' },
			{ id: 't3', label: 'Passeio em andamento', at: '10:05', state: 'pending' },
			{ id: 't4', label: 'Passeio concluido', at: '10:50', state: 'pending' },
		],
	},
	// Passeios do passeador Carlos Silva (walkerId '1') — perspectiva do passeador
	{
		id: '5',
		walkerId: '1',
		clientName: 'Fernanda Costa',
		petNames: ['Thor'],
		status: 'accepted',
		dateLabel: 'Amanhã · 10:00',
		scheduledAt: '2026-05-22T10:00:00-03:00',
		durationMinutes: 60,
		price: 64,
		distanceKm: 0,
		startAddress: 'Rua Haddock Lobo, 595 - Sao Paulo',
		paymentMethodId: 'pm_1',
		participants: [
			{ id: 'client_4', name: 'Fernanda Costa', role: 'client' },
			{ id: '1', name: 'Carlos Silva', role: 'walker' },
		],
		timeline: [
			{ id: 't1', label: 'Pedido aceito', at: '09:20', state: 'done' },
			{ id: 't2', label: 'Aguardando passeio', at: '10:00', state: 'current' },
			{ id: 't3', label: 'Passeio em andamento', at: '10:05', state: 'pending' },
			{ id: 't4', label: 'Passeio concluido', at: '11:05', state: 'pending' },
		],
	},
	{
		id: '6',
		walkerId: '1',
		clientName: 'Roberto Lima',
		petNames: ['Bolt', 'Nina'],
		status: 'completed',
		dateLabel: '19 Mai · 07:30',
		scheduledAt: '2026-05-19T07:30:00-03:00',
		durationMinutes: 45,
		price: 52,
		distanceKm: 2.2,
		startAddress: 'Al. Santos, 800 - Sao Paulo',
		endAddress: 'Parque Trianon',
		paymentMethodId: 'pm_1',
		participants: [
			{ id: 'client_5', name: 'Roberto Lima', role: 'client' },
			{ id: '1', name: 'Carlos Silva', role: 'walker' },
		],
		timeline: [
			{ id: 't1', label: 'Pedido aceito', at: '07:10', state: 'done' },
			{ id: 't2', label: 'Passeador chegou ao local', at: '07:28', state: 'done' },
			{ id: 't3', label: 'Passeio em andamento', at: '07:35', state: 'done' },
			{ id: 't4', label: 'Passeio concluido', at: '08:20', state: 'done' },
		],
	},
];

export const managedPaymentMethods: ManagedPaymentMethod[] = [
	{
		id: 'pm_1',
		type: 'credit_card',
		brand: 'Visa',
		label: '•••• 4242',
		holderName: 'Breno C',
		expiresAt: '12/29',
		isDefault: true,
		status: 'active',
	},
	{
		id: 'pm_2',
		type: 'credit_card',
		brand: 'Mastercard',
		label: '•••• 8888',
		holderName: 'Breno C',
		expiresAt: '03/28',
		isDefault: false,
		status: 'active',
	},
	{
		id: 'pm_3',
		type: 'pix',
		brand: 'PIX',
		label: 'CPF final 1234',
		holderName: 'Breno C',
		expiresAt: '--',
		isDefault: false,
		status: 'active',
	},
];

export const paymentHistory: PaymentHistoryItem[] = [
	{
		id: 'pay_1',
		walkId: '2',
		date: '2026-03-18',
		amount: 53,
		status: 'paid',
		methodId: 'pm_2',
		description: 'Passeio concluido com Ana Lima',
	},
	{
		id: 'pay_2',
		walkId: '3',
		date: '2026-03-10',
		amount: 44,
		status: 'failed',
		methodId: 'pm_1',
		description: 'Passeio cancelado (sem cobranca)',
	},
	{
		id: 'pay_3',
		walkId: '4',
		date: '2026-03-25',
		amount: 44,
		status: 'pending',
		methodId: 'pm_1',
		description: 'Passeio agendado',
	},
];

export const walkReviews: WalkReview[] = [
	{
		walkId: '2',
		walkerId: '2',
		rating: 5,
		comment: 'Passeio excelente, com atualizacoes no chat e muito cuidado com os dois caes.',
		createdAt: '2026-03-18T11:20:00-03:00',
	},
];

export function getWalkerById(walkerId: string) {
	return walkers.find((walker) => walker.id === walkerId);
}

export function getWalkById(walkId: string) {
	return walks.find((walk) => walk.id === walkId);
}

export function getReviewByWalkId(walkId: string) {
	return walkReviews.find((review) => review.walkId === walkId);
}

export function getWalksByWalkerId(walkerId: string) {
	return walks.filter((walk) => walk.walkerId === walkerId);
}
