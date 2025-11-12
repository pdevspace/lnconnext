'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ListEventItem } from '@/types/event'

import Image from 'next/image'
import Link from 'next/link'

import { Calendar, MapPin } from 'lucide-react'

interface EventCardProps {
	event: ListEventItem
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
	const isUpcoming = new Date(event.startDate) > new Date()

	return (
		<Link href={`/event/${event.id}`} className="block">
			<Card className="hover:shadow-lg transition-all duration-200 group cursor-pointer">
				<CardContent className="p-6">
					<div className="flex items-start gap-4">
						{/* Event Image */}
						{event.firstImage && (
							<div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
								<Image
									src={event.firstImage}
									alt={event.name}
									fill
									className="object-cover"
									sizes="96px"
								/>
							</div>
						)}

						{/* Event Details */}
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between mb-2">
								<h3 className="font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
									{event.name}
								</h3>
								<Badge variant={isUpcoming ? 'default' : 'secondary'}>
									{isUpcoming ? 'Upcoming' : 'Past'}
								</Badge>
							</div>

							<div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
								<div className="flex items-center gap-1">
									<Calendar className="w-4 h-4" />
									<span>
										{new Date(event.startDate).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric',
										})}
									</span>
								</div>
								{event.location && (
									<div className="flex items-center gap-1">
										<MapPin className="w-4 h-4" />
										<span className="truncate">
											{event.location.buildingName}
										</span>
									</div>
								)}
							</div>

							<div className="flex items-center gap-2 text-sm">
								<span className="text-muted-foreground">Organizer:</span>
								<span className="font-medium">{event.organizerName}</span>
							</div>

							<div className="mt-2">
								<span className="text-sm font-medium">
									{event.price === 0
										? 'Free'
										: `${event.price} ${event.currency}`}
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}
