import { getBitcoinerDetail } from '@/cache/bitcoiner'
import { BitcoinerDetailPage } from '@/components/pages/bitcoiner/BitcoinerDetailPage'

interface BitcoinerDetailPageRouteProps {
	params: Promise<{
		bitcoinerId: string
	}>
}

export const revalidate = 360 // Revalidate every 360 seconds

export default async function BitcoinerDetailPageRoute({
	params,
}: BitcoinerDetailPageRouteProps) {
	const { bitcoinerId } = await params

	try {
		// Fetch data on the server
		const bitcoiner = await getBitcoinerDetail(bitcoinerId)

		// Pass data as initial prop to avoid client-side fetch
		return (
			<BitcoinerDetailPage bitcoinerId={bitcoinerId} initialData={bitcoiner} />
		)
	} catch {
		// If not found, still render the component
		return <BitcoinerDetailPage bitcoinerId={bitcoinerId} />
	}
}
