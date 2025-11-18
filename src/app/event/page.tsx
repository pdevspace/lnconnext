import { getEventsList } from '@/cache/event'
import EventListPage from '@/components/pages/event/EventListPage'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EventListPageRoute() {
	// Fetch data on the server
	const initialData = await getEventsList()

	// Pass data as initial prop to avoid client-side fetch
	return <EventListPage initialData={initialData} />
}
