import { BitcoinerDetailPage } from '@/components/pages/bitcoiner/BitcoinerDetailPage';

interface BitcoinerDetailPageRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BitcoinerDetailPageRoute({ params }: BitcoinerDetailPageRouteProps) {
  const { id } = await params;
  return <BitcoinerDetailPage bitcoinerId={id} />;
}
