import { getEventDetail } from '@/cache/event'
import { EventDetailPage } from '@/components/pages/event/EventDetailPage'

interface EventDetailPageRouteProps {
	params: Promise<{
		eventId: string
	}>
}

export const revalidate = 360 // Revalidate every 360 seconds

export default async function EventDetailPageRoute({
	params,
}: EventDetailPageRouteProps) {
	const { eventId } = await params

	try {
		// Fetch data on the server
		const event = await getEventDetail(eventId)

		// Pass data as initial prop to avoid client-side fetch
		return <EventDetailPage eventId={eventId} initialData={event} />
	} catch {
		// If not found, still render the component
		return <EventDetailPage eventId={eventId} />
	}
}
