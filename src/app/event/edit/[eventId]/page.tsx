import { EditEventPage } from '@/components/pages/event/EditEventPage'

interface EditEventPageRouteProps {
	params: Promise<{
		eventId: string
	}>
}

export default async function EditEventPageRoute({
	params,
}: EditEventPageRouteProps) {
	const { eventId } = await params
	return <EditEventPage eventId={eventId} />
}
