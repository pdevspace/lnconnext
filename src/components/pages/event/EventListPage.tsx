'use client'

import { Button } from '@/components/ui/button'
import { useEvents } from '@/hooks/useEvent'
import { useIsEditor } from '@/hooks/useUser'
import { ListEventRequest } from '@/types/event'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Calendar, Plus } from 'lucide-react'

import { EventCard } from './EventCard'

export default function EventListPage() {
	const router = useRouter()
	const { isEditor } = useIsEditor()
	const [filters, setFilters] = useState<ListEventRequest['filters']>({
		searchTerm: '',
	})

	const { events, loading, error, fetchEvents } = useEvents(filters)

	if (error) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					<div className="flex items-center justify-center min-h-[400px]">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-destructive mb-4">
								Something went wrong
							</h2>
							<p className="text-muted-foreground mb-4">{error}</p>
							<Button onClick={() => fetchEvents()}>Try again</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="h-screen overflow-y-auto bg-background">
			{/* Fixed Header - follows established pattern */}
			<div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border">
				<div className="container mx-auto px-4 py-4">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
						<div>
							<h1 className="text-3xl font-bold text-foreground mb-2">
								Events
							</h1>
							<p className="text-muted-foreground">
								Discover and explore Bitcoin community events
							</p>
						</div>
						{isEditor && (
							<Button
								onClick={() => router.push('/event/create')}
								className="mt-4 sm:mt-0"
								size="lg"
							>
								<Plus className="w-4 h-4 mr-2" />
								Add New Event
							</Button>
						)}
					</div>

					{/* Search Section */}
					<div className="mt-6">
						<input
							type="text"
							placeholder="Search events..."
							value={filters?.searchTerm || ''}
							onChange={(e) =>
								setFilters((prev) => ({
									...prev,
									searchTerm: e.target.value,
								}))
							}
							className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground"
						/>
					</div>
				</div>
			</div>

			{/* Main Content - with proper navbar clearance and scrollable content */}
			<div className="px-0 py-6 mt-[264px] w-full">
				<div className="container mx-auto px-4">
					{/* Loading State */}
					{loading && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 6 }).map((_, index) => (
								<div key={index} className="animate-pulse">
									<div className="bg-muted rounded-lg h-48"></div>
								</div>
							))}
						</div>
					)}

					{/* Events Grid */}
					{!loading && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{events.map((event) => (
								<EventCard key={event.id} event={event} />
							))}
						</div>
					)}

					{/* Empty State */}
					{!loading && events.length === 0 && (
						<div className="text-center py-16">
							<Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
							<h3 className="text-xl font-semibold text-foreground mb-2">
								No events found
							</h3>
							<p className="text-muted-foreground mb-6">
								Try adjusting your search criteria, or get started by adding
								your first event.
							</p>
							{isEditor && (
								<Button onClick={() => router.push('/event/create')}>
									<Plus className="w-4 h-4 mr-2" />
									Add First Event
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
