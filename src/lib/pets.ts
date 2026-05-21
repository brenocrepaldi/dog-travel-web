import type { DogSize, Pet } from "@/types";

export const DEFAULT_CLIENT_PETS: Pet[] = [
  {
    id: "1",
    ownerId: "client_1",
    name: "Rex",
    breed: "Golden Retriever",
    age: 3,
    size: "large",
    notes: "Brincalhao e docil.",
  },
  {
    id: "2",
    ownerId: "client_1",
    name: "Mel",
    breed: "Poodle",
    age: 1,
    size: "small",
    notes: "Agitada, puxa a coleira nos primeiros 5 minutos.",
  },
  {
    id: "3",
    ownerId: "client_4",
    name: "Thor",
    breed: "Labrador",
    age: 2,
    size: "large",
  },
  {
    id: "4",
    ownerId: "client_5",
    name: "Bolt",
    breed: "Border Collie",
    age: 4,
    size: "medium",
  },
  {
    id: "5",
    ownerId: "client_5",
    name: "Nina",
    breed: "Shih Tzu",
    age: 6,
    size: "small",
  },
];

export const DOG_SIZE_LABEL: Record<DogSize, string> = {
  small: "Pequeno",
  medium: "Médio",
  large: "Grande",
  giant: "Gigante",
};

export const DOG_SIZE_TEXT_OPTIONS: Array<{ value: DogSize; label: string }> = [
  { value: "small", label: "Pequeno (até 10kg)" },
  { value: "medium", label: "Médio (11kg a 25kg)" },
  { value: "large", label: "Grande (26kg a 40kg)" },
  { value: "giant", label: "Gigante (acima de 40kg)" },
];

export function petEmojiBySize(size: DogSize) {
  if (size === "small") return "🐩";
  if (size === "medium") return "🐕";
  if (size === "large") return "🦮";
  return "🐕‍🦺";
}
