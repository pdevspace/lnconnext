import { getBitcoinersList } from '@/cache/bitcoiner'
import { BitcoinerListPage } from '@/components/pages/bitcoiner/BitcoinerListPage'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BitcoinerPageRoute() {
	// Fetch data on the server
	const initialData = await getBitcoinersList()

	// Pass data as initial prop to avoid client-side fetch
	return <BitcoinerListPage initialData={initialData} />
}
