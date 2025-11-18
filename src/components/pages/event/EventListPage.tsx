'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/ToastContext'
import { useEvents } from '@/hooks/useEvent'
import { useIsEditor } from '@/hooks/useUser'
import { ListEventRequest, ListEventResponse } from '@/types/event'

import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Calendar, Plus } from 'lucide-react'

import { EventCard } from './EventCard'

interface EventListPageProps {
	initialData?: ListEventResponse
}

export default function EventListPage({ initialData }: EventListPageProps) {
	const router = useRouter()
	const { isEditor } = useIsEditor()
	const { showError } = useToast()
	const [filters, setFilters] = useState<ListEventRequest['filters']>({
		searchTerm: '',
	})

	// Check if initialData is empty or doesn't exist
	const shouldUseHook = !initialData || initialData.events.length === 0

	// Only call hook when initialData is missing or empty
	// Pass enabled=false when initialData exists to prevent API calls
	const {
		events: hookEvents,
		loading,
		error,
	} = useEvents(filters, shouldUseHook)

	useEffect(() => {
		if (error) {
			showError(error)
		}
	}, [error, showError])

	// Frontend filtering - filter the initialData on the client side
	const filteredEvents = useMemo(() => {
		// If using hook, return hook data directly (hook handles filtering server-side)
		if (shouldUseHook) {
			return hookEvents
		}

		// Otherwise, filter initialData on client side
		if (!initialData?.events) {
			return []
		}

		let filtered = [...initialData.events]

		// Filter by search term (name)
		if (filters?.searchTerm) {
			const searchLower = filters.searchTerm.toLowerCase()
			filtered = filtered.filter((event) =>
				event.name.toLowerCase().includes(searchLower)
			)
		}

		return filtered
	}, [shouldUseHook, hookEvents, initialData?.events, filters?.searchTerm])

	const events = filteredEvents

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
					{!loading && events.length > 0 && (
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
