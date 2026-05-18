import type { DogSize, PaymentMethodType, WalkStatus } from "@/types";

export interface WalkerProfile {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  serviceArea: string;
  description: string;
  tags: string[];
  verified: boolean;
  priceRange: string;
  startingPrice60Min: number;
  availability: string;
  completedWalks: number;
  responseTime: string;
  trustChecks: {
    identityVerified: boolean;
    backgroundCheck: boolean;
    firstAidCertified: boolean;
  };
  certifications: string[];
  supportedSizes: DogSize[];
  behaviorExpertise: string[];
}

export interface WalkParticipant {
  id: string;
  name: string;
  role: "client" | "walker";
}

export interface WalkTimelineEvent {
  id: string;
  label: string;
  at: string;
  state: "done" | "current" | "pending";
  note?: string;
}

export interface WalkRecord {
  id: string;
  walkerId: string;
  clientName: string;
  petNames: string[];
  status: WalkStatus;
  dateLabel: string;
  scheduledAt: string;
  durationMinutes: number;
  price: number;
  distanceKm: number;
  startAddress: string;
  endAddress?: string;
  notes?: string;
  paymentMethodId?: string;
  participants: WalkParticipant[];
  timeline: WalkTimelineEvent[];
}

export interface ManagedPaymentMethod {
  id: string;
  type: PaymentMethodType;
  brand: string;
  label: string;
  holderName: string;
  expiresAt: string;
  isDefault: boolean;
  status: "active" | "expired";
}

export interface PaymentHistoryItem {
  id: string;
  walkId: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  methodId: string;
  description: string;
}

export interface WalkReview {
  walkId: string;
  walkerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const walkers: WalkerProfile[] = [
  {
    id: "1",
    name: "Carlos Silva",
    rating: 4.9,
    reviews: 124,
    location: "Zona Sul, Sao Paulo",
    serviceArea: "Moema, Vila Mariana e Itaim Bibi",
    description:
      "Especialista em caes de grande porte e alta energia. Passeios com foco em seguranca e enriquecimento.",
    tags: ["Grande Porte", "Energeticos", "Adestrador"],
    verified: true,
    priceRange: "R$ 38 - R$ 62",
    startingPrice60Min: 29,
    availability: "Seg-Sab, 07:00-19:00",
    completedWalks: 812,
    responseTime: "~5 min",
    trustChecks: {
      identityVerified: true,
      backgroundCheck: true,
      firstAidCertified: true,
    },
    certifications: ["Adestramento Positivo", "Primeiros Socorros Pet", "Manejo de Cao Reativo"],
    supportedSizes: ["medium", "large", "giant"],
    behaviorExpertise: ["agitado", "reativo", "multiplos-caes"],
  },
  {
    id: "2",
    name: "Ana Lima",
    rating: 5.0,
    reviews: 89,
    location: "Centro, Rio de Janeiro",
    serviceArea: "Centro, Gloria e Catete",
    description:
      "Passeios tranquilos para caes idosos e com necessidades especiais. Comunicacao constante durante todo o percurso.",
    tags: ["Idosos", "Medicacao", "Pequeno Porte"],
    verified: true,
    priceRange: "R$ 35 - R$ 58",
    startingPrice60Min: 28,
    availability: "Seg-Dom, 08:00-20:00",
    completedWalks: 467,
    responseTime: "~8 min",
    trustChecks: {
      identityVerified: true,
      backgroundCheck: true,
      firstAidCertified: true,
    },
    certifications: ["Cuidados com Caes Idosos", "Administracao de Medicacao", "Primeiros Socorros Pet"],
    supportedSizes: ["small", "medium"],
    behaviorExpertise: ["idoso", "filhote", "medicacao"],
  },
  {
    id: "3",
    name: "Pedro Santos",
    rating: 4.7,
    reviews: 56,
    location: "Zona Norte, Sao Paulo",
    serviceArea: "Santana, Tucuruvi e Casa Verde",
    description:
      "Trabalho com caes reativos usando manejo positivo. Rotas mais calmas e progressao gradual.",
    tags: ["Reativos", "Ansiosos"],
    verified: false,
    priceRange: "R$ 32 - R$ 54",
    startingPrice60Min: 30,
    availability: "Seg-Sex, 06:00-18:00",
    completedWalks: 231,
    responseTime: "~12 min",
    trustChecks: {
      identityVerified: true,
      backgroundCheck: false,
      firstAidCertified: false,
    },
    certifications: ["Manejo de Cao Reativo", "Passeio em Baixo Estimulo"],
    supportedSizes: ["small", "medium", "large"],
    behaviorExpertise: ["reativo", "ansioso", "agitado"],
  },
  {
    id: "4",
    name: "Marcia Souza",
    rating: 4.8,
    reviews: 201,
    location: "Vila Mariana, Sao Paulo",
    serviceArea: "Vila Mariana, Aclimacao e Paraiso",
    description:
      "Mais de 5 anos de experiencia. Foco em previsibilidade, primeiros socorros e rotina estruturada para filhotes.",
    tags: ["Experiente", "Primeiros Socorros"],
    verified: true,
    priceRange: "R$ 40 - R$ 65",
    startingPrice60Min: 31,
    availability: "Seg-Dom, 06:30-21:00",
    completedWalks: 1022,
    responseTime: "~4 min",
    trustChecks: {
      identityVerified: true,
      backgroundCheck: true,
      firstAidCertified: true,
    },
    certifications: ["Primeiros Socorros Veterinarios", "Socializacao de Filhotes", "Conduta Segura em Via Publica"],
    supportedSizes: ["small", "medium", "large", "giant"],
    behaviorExpertise: ["filhote", "agitado", "multiplos-caes"],
  },
];

export const walks: WalkRecord[] = [
  {
    id: "1",
    walkerId: "1",
    clientName: "Breno",
    petNames: ["Rex"],
    status: "in_progress",
    dateLabel: "Hoje · 14:30",
    scheduledAt: "2026-04-14T14:30:00-03:00",
    durationMinutes: 45,
    price: 44,
    distanceKm: 2.8,
    startAddress: "Rua das Flores, 120 - Sao Paulo",
    endAddress: "Parque Ibirapuera - Portao 3",
    notes: "Evitar areas com muito barulho no inicio.",
    paymentMethodId: "pm_1",
    participants: [
      { id: "client_1", name: "Breno", role: "client" },
      { id: "1", name: "Carlos Silva", role: "walker" },
    ],
    timeline: [
      { id: "t1", label: "Pedido confirmado", at: "14:02", state: "done" },
      { id: "t2", label: "Passeador chegou ao local", at: "14:28", state: "done" },
      { id: "t3", label: "Passeio em andamento", at: "14:35", state: "current" },
      { id: "t4", label: "Passeio concluido", at: "15:15", state: "pending" },
    ],
  },
  {
    id: "2",
    walkerId: "2",
    clientName: "Breno",
    petNames: ["Rex", "Mel"],
    status: "completed",
    dateLabel: "18 Mar · 09:00",
    scheduledAt: "2026-03-18T09:00:00-03:00",
    durationMinutes: 60,
    price: 53,
    distanceKm: 3.2,
    startAddress: "Av. Paulista, 900 - Sao Paulo",
    endAddress: "Parque Trianon",
    notes: "Levar agua para os dois caes.",
    paymentMethodId: "pm_2",
    participants: [
      { id: "client_1", name: "Breno", role: "client" },
      { id: "2", name: "Ana Lima", role: "walker" },
    ],
    timeline: [
      { id: "t1", label: "Pedido confirmado", at: "08:20", state: "done" },
      { id: "t2", label: "Passeador chegou ao local", at: "08:55", state: "done" },
      { id: "t3", label: "Passeio em andamento", at: "09:03", state: "done" },
      { id: "t4", label: "Passeio concluido", at: "10:02", state: "done" },
    ],
  },
  {
    id: "3",
    walkerId: "3",
    clientName: "Breno",
    petNames: ["Mel"],
    status: "cancelled",
    dateLabel: "10 Mar · 16:00",
    scheduledAt: "2026-03-10T16:00:00-03:00",
    durationMinutes: 45,
    price: 44,
    distanceKm: 0,
    startAddress: "Rua Vergueiro, 550 - Sao Paulo",
    notes: "Cancelado por chuva forte.",
    paymentMethodId: "pm_1",
    participants: [
      { id: "client_1", name: "Breno", role: "client" },
      { id: "3", name: "Pedro Santos", role: "walker" },
    ],
    timeline: [
      { id: "t1", label: "Pedido confirmado", at: "15:20", state: "done" },
      {
        id: "t2",
        label: "Passeio cancelado",
        at: "15:45",
        state: "done",
        note: "Condições climaticas severas.",
      },
    ],
  },
  {
    id: "4",
    walkerId: "4",
    clientName: "Breno",
    petNames: ["Rex"],
    status: "accepted",
    dateLabel: "25 Mar · 10:00",
    scheduledAt: "2026-03-25T10:00:00-03:00",
    durationMinutes: 45,
    price: 44,
    distanceKm: 0,
    startAddress: "Rua Joaquim Tavora, 210 - Sao Paulo",
    notes: "Primeiro passeio com esta passeadora.",
    paymentMethodId: "pm_1",
    participants: [
      { id: "client_1", name: "Breno", role: "client" },
      { id: "4", name: "Marcia Souza", role: "walker" },
    ],
    timeline: [
      { id: "t1", label: "Pedido confirmado", at: "09:12", state: "done" },
      { id: "t2", label: "Passeio agendado", at: "10:00", state: "current" },
      { id: "t3", label: "Passeio em andamento", at: "10:05", state: "pending" },
      { id: "t4", label: "Passeio concluido", at: "10:50", state: "pending" },
    ],
  },
];

export const managedPaymentMethods: ManagedPaymentMethod[] = [
  {
    id: "pm_1",
    type: "credit_card",
    brand: "Visa",
    label: "•••• 4242",
    holderName: "Breno C",
    expiresAt: "12/29",
    isDefault: true,
    status: "active",
  },
  {
    id: "pm_2",
    type: "credit_card",
    brand: "Mastercard",
    label: "•••• 8888",
    holderName: "Breno C",
    expiresAt: "03/28",
    isDefault: false,
    status: "active",
  },
  {
    id: "pm_3",
    type: "pix",
    brand: "PIX",
    label: "CPF final 1234",
    holderName: "Breno C",
    expiresAt: "--",
    isDefault: false,
    status: "active",
  },
];

export const paymentHistory: PaymentHistoryItem[] = [
  {
    id: "pay_1",
    walkId: "2",
    date: "2026-03-18",
    amount: 53,
    status: "paid",
    methodId: "pm_2",
    description: "Passeio concluido com Ana Lima",
  },
  {
    id: "pay_2",
    walkId: "3",
    date: "2026-03-10",
    amount: 44,
    status: "failed",
    methodId: "pm_1",
    description: "Passeio cancelado (sem cobranca)",
  },
  {
    id: "pay_3",
    walkId: "4",
    date: "2026-03-25",
    amount: 44,
    status: "pending",
    methodId: "pm_1",
    description: "Passeio agendado",
  },
];

export const walkReviews: WalkReview[] = [
  {
    walkId: "2",
    walkerId: "2",
    rating: 5,
    comment:
      "Passeio excelente, com atualizacoes no chat e muito cuidado com os dois caes.",
    createdAt: "2026-03-18T11:20:00-03:00",
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
