'use client'

import { SocialMediaBox } from '@/components/pages/public/SocialMediaBox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useOrganizer } from '@/hooks/useOrganizer'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
	ArrowLeft,
	Building2,
	Calendar,
	Edit,
	Globe,
	MapPin,
	Trash2,
	Users,
} from 'lucide-react'

interface OrganizerDetailPageProps {
	organizerId: string
}

export function OrganizerDetailPage({ organizerId }: OrganizerDetailPageProps) {
	const router = useRouter()
	const { organizer, loading, error, deleteOrganizer } =
		useOrganizer(organizerId)
	const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')

	const filteredEvents =
		organizer?.events?.filter((event) => {
			const now = new Date()
			if (filter === 'upcoming') return new Date(event.startDate) > now
			if (filter === 'past') return new Date(event.startDate) <= now
			return true
		}) || []

	const handleDelete = async () => {
		if (
			confirm(
				'Are you sure you want to delete this organizer? This action cannot be undone.'
			)
		) {
			try {
				await deleteOrganizer()
				router.push('/organizer')
			} catch (error) {
				console.error('Error deleting organizer:', error)
				alert('Failed to delete organizer')
			}
		}
	}

	const formatDate = (date: string | Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	const formatTime = (date: string | Date) => {
		return new Date(date).toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<div className="max-w-6xl mx-auto px-6 py-8 h-screen overflow-y-auto mb-[130px]">
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
				<div className="max-w-6xl mx-auto px-6 py-8 h-screen overflow-y-auto mb-[130px]">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
						<p className="text-muted-foreground mb-4">{error}</p>
						<Link href="/organizer">
							<Button variant="outline">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Organizers
							</Button>
						</Link>
					</div>
				</div>
			</div>
		)
	}

	if (!organizer) {
		return (
			<div className="min-h-screen bg-background">
				<div className="max-w-6xl mx-auto px-6 py-8 h-screen overflow-y-auto mb-[130px]">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-4">Organizer Not Found</h1>
						<p className="text-muted-foreground mb-4">
							The organizer you're looking for doesn't exist.
						</p>
						<Link href="/organizer">
							<Button variant="outline">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Organizers
							</Button>
						</Link>
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
					<div className="flex items-center justify-between">
						<Link href="/organizer">
							<Button variant="ghost">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Organizers
							</Button>
						</Link>

						{/* Action Buttons */}
						<div className="flex gap-2">
							<Button
								onClick={() => router.push(`/organizer/edit/${organizer.id}`)}
								variant="outline"
							>
								<Edit className="w-4 h-4 mr-2" />
								Edit
							</Button>
							<Button variant="destructive" onClick={handleDelete}>
								<Trash2 className="w-4 h-4 mr-2" />
								Delete
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content - with proper navbar clearance and scrollable content */}
			<div className="px-0 py-6 mt-[130px] w-full">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						{/* Profile Header */}
						<div className="mb-8">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-3xl font-bold mb-2">{organizer.name}</h1>
									<p className="text-muted-foreground">
										{organizer.events?.length || 0} events
									</p>
								</div>
								<div className="flex gap-2">
									<Button
										variant={filter === 'all' ? 'default' : 'outline'}
										onClick={() => setFilter('all')}
										size="sm"
									>
										All Events
									</Button>
									<Button
										variant={filter === 'upcoming' ? 'default' : 'outline'}
										onClick={() => setFilter('upcoming')}
										size="sm"
									>
										Upcoming
									</Button>
									<Button
										variant={filter === 'past' ? 'default' : 'outline'}
										onClick={() => setFilter('past')}
										size="sm"
									>
										Past
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Organizer Info */}
					<Card className="mb-8">
						<CardContent className="p-6">
							<div className="flex items-start gap-4">
								<div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
									{organizer.avatar ? (
										<img
											src={organizer.avatar}
											alt={organizer.name}
											className="w-16 h-16 rounded-full object-cover"
										/>
									) : (
										<Building2 className="w-8 h-8 text-gray-400" />
									)}
								</div>
								<div className="flex-1">
									<h2 className="text-xl font-semibold mb-2">
										{organizer.name}
									</h2>
									{organizer.bio && (
										<p className="text-muted-foreground mb-3">
											{organizer.bio}
										</p>
									)}
									<div className="flex flex-wrap gap-4 mb-3">
										{organizer.website && (
											<a
												href={organizer.website}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
											>
												<Globe className="w-4 h-4" />
												Website
											</a>
										)}
									</div>
									<SocialMediaBox
										socialMedia={organizer.socialMedia}
										variant="compact"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Events */}
					<div className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">Events</h2>
						{filteredEvents.length === 0 ? (
							<Card>
								<CardContent className="p-8 text-center">
									<Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
									<h3 className="text-lg font-medium mb-2">No events found</h3>
									<p className="text-muted-foreground">
										{filter === 'all'
											? "This organizer hasn't created any events yet."
											: `No ${filter} events found.`}
									</p>
								</CardContent>
							</Card>
						) : (
							<div className="space-y-4">
								{filteredEvents.map((event) => (
									<Card
										key={event.id}
										className="hover:shadow-md transition-shadow"
									>
										<CardContent className="p-6">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<h3 className="text-lg font-semibold mb-2">
														{event.name}
													</h3>
													<p className="text-muted-foreground mb-3 line-clamp-2">
														{event.description}
													</p>
													<div className="flex items-center gap-4 text-sm text-muted-foreground">
														<div className="flex items-center gap-1">
															<Calendar className="w-4 h-4" />
															{formatDate(event.startDate)}
														</div>
														{event.endDate && (
															<div className="flex items-center gap-1">
																<Calendar className="w-4 h-4" />
																{formatDate(event.endDate)}
															</div>
														)}
													</div>
												</div>
												<Link href={`/event/${event.id}`}>
													<Button variant="outline" size="sm">
														View Details
													</Button>
												</Link>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
