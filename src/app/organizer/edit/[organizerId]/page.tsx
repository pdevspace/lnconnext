import { EditOrganizerPage } from '@/components/pages/organizer/EditOrganizerPage'

interface EditOrganizerPageProps {
	params: Promise<{
		organizerId: string
	}>
}

export default async function EditOrganizerPageRoute({
	params,
}: EditOrganizerPageProps) {
	const { organizerId } = await params
	return <EditOrganizerPage organizerId={organizerId} />
}
