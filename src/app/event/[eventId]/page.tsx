import { EventDetailPage } from '@/components/pages/event/EventDetailPage'

interface EventDetailPageRouteProps {
	params: Promise<{
		eventId: string
	}>
}

export default async function EventDetailPageRoute({
	params,
}: EventDetailPageRouteProps) {
	const { eventId } = await params
	return <EventDetailPage eventId={eventId} />
}
