import { getOrganizerDetail } from '@/cache/organizer'
import { OrganizerDetailPage } from '@/components/pages/organizer/OrganizerDetailPage'

interface OrganizerDetailPageRouteProps {
	params: Promise<{
		organizerId: string
	}>
}

export const revalidate = 360 // Revalidate every 360 seconds

export default async function OrganizerDetailPageRoute({
	params,
}: OrganizerDetailPageRouteProps) {
	const { organizerId } = await params

	try {
		// Fetch data on the server
		const organizer = await getOrganizerDetail(organizerId)

		// Pass data as initial prop to avoid client-side fetch
		return (
			<OrganizerDetailPage organizerId={organizerId} initialData={organizer} />
		)
	} catch {
		// If not found, still render the component
		return <OrganizerDetailPage organizerId={organizerId} />
	}
}
