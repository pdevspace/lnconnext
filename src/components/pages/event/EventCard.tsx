'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ListEventItem } from '@/types/event'

import Image from 'next/image'
import Link from 'next/link'

import { Calendar, MapPin, Share2 } from 'lucide-react'

interface EventCardProps {
	event: ListEventItem
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
	const isUpcoming = new Date(event.startDate) > new Date()

	const handleShare = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		const url = `${window.location.origin}/event/${event.id}`
		const text = `Check out ${event.name}`

		// Facebook share
		window.open(
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			'_blank',
			'width=600,height=400'
		)
	}

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
								<div className="flex items-center gap-2 flex-shrink-0 ml-2">
									<Badge variant={isUpcoming ? 'default' : 'secondary'}>
										{isUpcoming ? 'Upcoming' : 'Past'}
									</Badge>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0"
										onClick={handleShare}
										title="Share on Facebook"
									>
										<Share2 className="w-4 h-4" />
									</Button>
								</div>
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
									<div className="flex items-center gap-1 min-w-0">
										<MapPin className="w-4 h-4 flex-shrink-0" />
										<span className="truncate max-w-[128px]">
											{event.location.buildingName}
										</span>
									</div>
								)}
							</div>

							<div className="flex items-center gap-2 text-sm">
								<span className="text-muted-foreground">Organizer:</span>
								<span className="font-medium">{event.organizerName}</span>
							</div>

							{event.register && (
								<div className="mt-2">
									<span className="text-sm font-medium">
										{event.register.price === null || event.register.price === 0
											? 'Free'
											: `${event.register.price} ${event.register.currency || ''}`}
									</span>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}
