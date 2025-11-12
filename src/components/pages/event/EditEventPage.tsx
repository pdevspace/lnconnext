'use client'

import { Button } from '@/components/ui/button'
import { useEvent } from '@/hooks/useEvent'
import { UpdateEventRequest } from '@/types/event'

import { useRouter } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { EventForm } from './EventForm'

interface EditEventPageProps {
	eventId: string
}

export const EditEventPage: React.FC<EditEventPageProps> = ({ eventId }) => {
	const router = useRouter()
	const { event, loading, error, updateEvent } = useEvent(eventId)

	const handleSubmit = async (data: Omit<UpdateEventRequest, 'id'>) => {
		try {
			await updateEvent(data)
			router.push(`/event/${eventId}`)
		} catch (error) {
			console.error('Error updating event:', error)
			alert('Failed to update event')
		}
	}

	const handleCancel = () => {
		router.push(`/event/${eventId}`)
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-4xl mx-auto">
						<div className="animate-pulse">
							<div className="h-8 bg-muted rounded w-32 mb-6"></div>
							<div className="h-8 bg-muted rounded w-64 mb-2"></div>
							<div className="h-4 bg-muted rounded w-96 mb-8"></div>
							<div className="h-96 bg-muted rounded"></div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-4xl mx-auto">
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="text-center">
								<h2 className="text-2xl font-bold text-destructive mb-4">
									Something went wrong
								</h2>
								<p className="text-muted-foreground mb-4">{error}</p>
								<Button onClick={() => router.push('/event')}>
									Back to Events
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!event) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-4xl mx-auto">
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="text-center">
								<h2 className="text-2xl font-bold text-foreground mb-4">
									Event not found
								</h2>
								<p className="text-muted-foreground mb-4">
									The event you&apos;re trying to edit doesn&apos;t exist or has
									been removed.
								</p>
								<Button onClick={() => router.push('/event')}>
									Back to Events
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 pt-20 pb-6">
				{/* Header */}
				<div className="mb-6 pb-4 border-b border-border">
					<div className="flex items-center justify-between">
						<Button
							variant="ghost"
							onClick={handleCancel}
							className="text-muted-foreground hover:text-foreground"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Event
						</Button>

						<div>
							<h1 className="text-2xl font-bold text-foreground">Edit Event</h1>
							<p className="text-sm text-muted-foreground">
								Update {event.name}&apos;s information
							</p>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<EventForm
					event={event}
					onSubmit={handleSubmit}
					onCancel={handleCancel}
					isLoading={loading}
				/>
			</div>
		</div>
	)
}
