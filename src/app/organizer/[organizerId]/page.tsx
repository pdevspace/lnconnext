import { OrganizerDetailPage } from '@/components/pages/organizer/OrganizerDetailPage'

interface OrganizerDetailPageRouteProps {
	params: Promise<{
		organizerId: string
	}>
}

export default async function OrganizerDetailPageRoute({
	params,
}: OrganizerDetailPageRouteProps) {
	const { organizerId } = await params
	return <OrganizerDetailPage organizerId={organizerId} />
}
