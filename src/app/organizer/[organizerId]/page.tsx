import { OrganizerService } from '@/app/api/services/OrganizerService'
import { OrganizerDetailPage } from '@/components/pages/organizer/OrganizerDetailPage'

import { Metadata } from 'next'

// Revalidate every hour
export const revalidate = 3600

interface OrganizerPageProps {
	params: Promise<{
		organizerId: string
	}>
}

export async function generateStaticParams() {
	try {
		const organizers = await OrganizerService.getAllOrganizers()
		return organizers.map((organizer) => ({
			organizerId: organizer.id,
		}))
	} catch (error) {
		console.error('Error generating static params for organizers:', error)
		return []
	}
}

export async function generateMetadata({
	params,
}: OrganizerPageProps): Promise<Metadata> {
	const { organizerId } = await params

	try {
		const organizer = await OrganizerService.getOrganizerById(organizerId)

		if (!organizer) {
			return {
				title: 'Organizer Not Found',
				description: 'The requested organizer could not be found.',
			}
		}

		return {
			title: `${organizer.name} - Event Organizer`,
			description:
				organizer.bio ||
				`Learn more about ${organizer.name}, an event organizer in the Bitcoin community.`,
			openGraph: {
				title: `${organizer.name} - Event Organizer`,
				description:
					organizer.bio ||
					`Learn more about ${organizer.name}, an event organizer in the Bitcoin community.`,
				type: 'profile',
				images: organizer.avatar ? [organizer.avatar] : [],
			},
			twitter: {
				card: 'summary',
				title: `${organizer.name} - Event Organizer`,
				description:
					organizer.bio ||
					`Learn more about ${organizer.name}, an event organizer in the Bitcoin community.`,
				images: organizer.avatar ? [organizer.avatar] : [],
			},
		}
	} catch (error) {
		console.error('Error generating metadata for organizer:', error)
		return {
			title: 'Organizer',
			description: 'Event organizer profile page.',
		}
	}
}

export default async function OrganizerDetailPageRoute({
	params,
}: OrganizerPageProps) {
	const { organizerId } = await params
	return <OrganizerDetailPage organizerId={organizerId} />
}
