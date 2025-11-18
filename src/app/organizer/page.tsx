import { getOrganizersList } from '@/cache/organizer'
import { OrganizerListPage } from '@/components/pages/organizer/OrganizerListPage'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function OrganizerListPageRoute() {
	// Fetch data on the server
	const initialData = await getOrganizersList()

	// Pass data as initial prop to avoid client-side fetch
	return <OrganizerListPage initialData={initialData} />
}
