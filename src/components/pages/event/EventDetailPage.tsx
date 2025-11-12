'use client'

import { useEvent } from '@/hooks/useEvent'

import { EventComponent } from './EventComponent'

interface EventDetailPageProps {
	eventId: string
}

export function EventDetailPage({ eventId }: EventDetailPageProps) {
	const { event, loading, error } = useEvent(eventId)

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 pt-20 pb-8">
					<div className="flex items-center justify-center h-64">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 pt-20 pb-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
						<p className="text-muted-foreground mb-4">{error}</p>
						<button
							onClick={() => window.history.back()}
							className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		)
	}

	if (!event) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 pt-20 pb-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
						<p className="text-muted-foreground mb-4">
							The event you&apos;re looking for doesn&apos;t exist.
						</p>
						<button
							onClick={() => window.history.back()}
							className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 pt-20 pb-8">
				<EventComponent event={event} />
			</div>
		</div>
	)
}
