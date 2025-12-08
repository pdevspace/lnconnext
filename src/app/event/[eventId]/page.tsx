import { getEventDetail } from '@/cache/event'
import { EventDetailPage } from '@/components/pages/event/EventDetailPage'

import type { Metadata } from 'next'

interface EventDetailPageRouteProps {
	params: Promise<{
		eventId: string
	}>
}

export const revalidate = 360 // Revalidate every 360 seconds

// Generate dynamic metadata for each event
export async function generateMetadata({
	params,
}: EventDetailPageRouteProps): Promise<Metadata> {
	const { eventId } = await params

	try {
		const event = await getEventDetail(eventId)

		const eventUrl = `https://lnconnext.vercel.app/event/${eventId}`
		const imageUrl = event.images?.[0]
			? event.images[0].startsWith('http')
				? event.images[0]
				: `https://lnconnext.vercel.app${event.images[0]}`
			: 'https://lnconnext.vercel.app/your-social-preview-image.png'

		const description =
			event.description ||
			`Join ${event.organizerName} for ${event.name} on ${new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`

		return {
			title: `${event.name} - Bitcoin Event | LNConnext`,
			description: description.slice(0, 160), // Limit to 160 chars for SEO
			openGraph: {
				type: 'website',
				url: eventUrl,
				title: event.name,
				description: description.slice(0, 160),
				images: [
					{
						url: imageUrl,
						width: 1200,
						height: 630,
						alt: event.name,
					},
				],
			},
			twitter: {
				card: 'summary_large_image',
				title: event.name,
				description: description.slice(0, 160),
				images: [imageUrl],
			},
		}
	} catch (error) {
		// Fallback metadata if event not found
		return {
			title: 'Event Not Found | LNConnext',
			description: 'Discover Bitcoin events happening this weekend.',
		}
	}
}

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
