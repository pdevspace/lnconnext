import { BitcoinerDetailPage } from '@/components/pages/bitcoiner/BitcoinerDetailPage';
import { BitcoinerService } from '@/services/BitcoinerService';
import { Metadata } from 'next';

// Revalidate every hour
export const revalidate = 3600;

interface BitcoinerDetailPageRouteProps {
  params: Promise<{
    bitcoinerId: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const bitcoiners = await BitcoinerService.getAllBitcoiners();
    return bitcoiners.map((bitcoiner) => ({
      bitcoinerId: bitcoiner.id,
    }));
  } catch (error) {
    console.error('Error generating static params for bitcoiners:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BitcoinerDetailPageRouteProps): Promise<Metadata> {
  const { bitcoinerId } = await params;
  
  try {
    const bitcoiner = await BitcoinerService.getBitcoinerById(bitcoinerId);
    
    if (!bitcoiner) {
      return {
        title: 'Bitcoiner Not Found',
        description: 'The requested bitcoiner profile could not be found.',
      };
    }

    const expertise = bitcoiner.expertise.length > 0 
      ? `Expert in ${bitcoiner.expertise.join(', ')}` 
      : 'Bitcoin community member';

    return {
      title: `${bitcoiner.name} - Bitcoin Community`,
      description: bitcoiner.bio || `${expertise}. Connect with ${bitcoiner.name} in the Bitcoin community.`,
      openGraph: {
        title: `${bitcoiner.name} - Bitcoin Community`,
        description: bitcoiner.bio || `${expertise}. Connect with ${bitcoiner.name} in the Bitcoin community.`,
        type: 'profile',
        images: bitcoiner.avatar ? [bitcoiner.avatar] : [],
      },
      twitter: {
        card: 'summary',
        title: `${bitcoiner.name} - Bitcoin Community`,
        description: bitcoiner.bio || `${expertise}. Connect with ${bitcoiner.name} in the Bitcoin community.`,
        images: bitcoiner.avatar ? [bitcoiner.avatar] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata for bitcoiner:', error);
    return {
      title: 'Bitcoiner Profile',
      description: 'Bitcoin community member profile.',
    };
  }
}

export default async function BitcoinerDetailPageRoute({ params }: BitcoinerDetailPageRouteProps) {
  const { bitcoinerId } = await params;
  return <BitcoinerDetailPage bitcoinerId={bitcoinerId} />;
}
