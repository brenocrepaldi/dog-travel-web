import type { Metadata } from 'next';
import { WalksClient } from './_components/walks-client';

export const metadata: Metadata = { title: 'Meus Passeios | DogTravel' };

export default function WalksPage() {
	return <WalksClient />;
}
