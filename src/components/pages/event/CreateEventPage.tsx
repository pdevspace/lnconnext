'use client'

import { Button } from '@/components/ui/button'
import { useEvents } from '@/hooks/useEvent'
import { CreateEventRequest } from '@/types/event'

import { useRouter } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { EventForm } from './EventForm'

export const CreateEventPage: React.FC = () => {
	const router = useRouter()
	const { createEvent, loading } = useEvents()

	const handleSubmit = async (data: CreateEventRequest) => {
		try {
			await createEvent(data)
			// After creation, the list will refresh and we can navigate
			router.push('/event')
		} catch (error) {
			console.error('Error creating event:', error)
			alert('Failed to create event')
		}
	}

	const handleCancel = () => {
		router.push('/event')
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
							Back to Events
						</Button>

						<div>
							<h1 className="text-2xl font-bold text-foreground">
								Add New Event
							</h1>
							<p className="text-sm text-muted-foreground">
								Create a new event profile
							</p>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<EventForm
					onSubmit={handleSubmit}
					onCancel={handleCancel}
					isLoading={loading}
				/>
			</div>
		</div>
	)
}
