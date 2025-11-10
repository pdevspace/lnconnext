import { EditBitcoinerPage } from '@/components/pages/bitcoiner/EditBitcoinerPage'

interface EditBitcoinerPageRouteProps {
	params: Promise<{
		bitcoinerId: string
	}>
}

export default async function EditBitcoinerPageRoute({
	params,
}: EditBitcoinerPageRouteProps) {
	const { bitcoinerId } = await params
	return <EditBitcoinerPage bitcoinerId={bitcoinerId} />
}
