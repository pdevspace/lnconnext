import { BitcoinerDetailPage } from '@/components/pages/bitcoiner/BitcoinerDetailPage'

interface BitcoinerDetailPageRouteProps {
	params: Promise<{
		bitcoinerId: string
	}>
}

export default async function BitcoinerDetailPageRoute({
	params,
}: BitcoinerDetailPageRouteProps) {
	const { bitcoinerId } = await params
	return <BitcoinerDetailPage bitcoinerId={bitcoinerId} />
}
