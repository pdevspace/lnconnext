import { EditBitcoinerPage } from '@/components/pages/bitcoiner/EditBitcoinerPage';

interface EditBitcoinerPageRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBitcoinerPageRoute({ params }: EditBitcoinerPageRouteProps) {
  const { id } = await params;
  return <EditBitcoinerPage bitcoinerId={id} />;
}
