'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useIsEditor } from '@/hooks/useUser'
import { Event } from '@/types/event'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
	ArrowLeft,
	Calendar,
	Clock,
	Edit,
	ExternalLink,
	Globe,
	MapPin,
	Share2,
	Users,
} from 'lucide-react'

interface EventComponentProps {
	event: Event
}

// Utility functions
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

const formatDateTime = (date: string | Date) => {
	return new Date(date).toLocaleString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export function EventComponent({ event }: EventComponentProps) {
	const router = useRouter()
	const { isEditor } = useIsEditor()
	const [activeImageIndex, setActiveImageIndex] = useState(0)

	const generateCalendarUrl = (event: Event) => {
		const startDate =
			new Date(event.startDate)
				.toISOString()
				.replace(/[-:]/g, '')
				.split('.')[0] + 'Z'
		const endDate = event.endDate
			? new Date(event.endDate)
					.toISOString()
					.replace(/[-:]/g, '')
					.split('.')[0] + 'Z'
			: startDate
		const title = encodeURIComponent(event.name)
		const details = encodeURIComponent(event.description)
		const location = event.location
			? encodeURIComponent(
					`${event.location.buildingName}, ${event.location.city}`
				)
			: ''

		return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`
	}

	const handleAddToCalendar = () => {
		const calendarUrl = generateCalendarUrl(event)
		window.open(calendarUrl, '_blank')
	}

	const handleRegister = () => {
		// First check if there's a register URL in the register object
		if (event.register?.registerUrl) {
			window.open(event.register.registerUrl, '_blank')
			return
		}
		// Fallback to finding register website
		const registerWebsite = event.websites?.find(
			(w) =>
				w.type === 'other' || w.displayText?.toLowerCase().includes('register')
		)
		if (registerWebsite) {
			window.open(registerWebsite.url, '_blank')
		}
	}

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: event.name,
					text: event.description,
					url: window.location.href,
				})
			} catch (err) {
				console.error('Error sharing:', err)
			}
		} else {
			// Fallback to clipboard
			navigator.clipboard.writeText(window.location.href)
			alert('Link copied to clipboard!')
		}
	}

	const handleShareFacebook = () => {
		const url = encodeURIComponent(window.location.href)
		window.open(
			`https://www.facebook.com/sharer/sharer.php?u=${url}`,
			'_blank',
			'width=600,height=400'
		)
	}

	const handleShareTwitter = () => {
		const url = encodeURIComponent(window.location.href)
		const text = encodeURIComponent(event.name)
		window.open(
			`https://twitter.com/intent/tweet?url=${url}&text=${text}`,
			'_blank',
			'width=600,height=400'
		)
	}

	const handleShareLinkedIn = () => {
		const url = encodeURIComponent(window.location.href)
		window.open(
			`https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
			'_blank',
			'width=600,height=400'
		)
	}

	const isEventUpcoming = (date: string | Date) => {
		return new Date(date) > new Date()
	}

	const isEventLive = (
		startDate: string | Date,
		endDate?: string | Date | null
	) => {
		const now = new Date()
		const start = new Date(startDate)
		const end = endDate
			? new Date(endDate)
			: new Date(start.getTime() + 2 * 60 * 60 * 1000) // Default 2 hours

		return now >= start && now <= end
	}

	const getEventStatus = () => {
		if (isEventLive(event.startDate, event.endDate)) return 'live'
		if (isEventUpcoming(event.startDate)) return 'upcoming'
		return 'past'
	}

	const status = getEventStatus()

	return (
		<div className="max-w-7xl mx-auto">
			{/* Back Button and Edit Button */}
			<div className="mb-6 flex items-center justify-between">
				<Link href="/event">
					<Button variant="ghost">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Events
					</Button>
				</Link>
				{isEditor && (
					<Button
						onClick={() => router.push(`/event/edit/${event.id}`)}
						variant="outline"
					>
						<Edit className="w-4 h-4 mr-2" />
						Edit Event
					</Button>
				)}
			</div>

			{/* Desktop Layout */}
			<div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
				{/* Left Column (30%) */}
				<div className="lg:col-span-4 space-y-6">
					<EventImage
						event={event}
						activeImageIndex={activeImageIndex}
						onImageChange={setActiveImageIndex}
					/>
					<EventActionButtons
						event={event}
						onAddToCalendar={handleAddToCalendar}
						onRegister={handleRegister}
						onShare={handleShare}
						onShareFacebook={handleShareFacebook}
						onShareTwitter={handleShareTwitter}
						onShareLinkedIn={handleShareLinkedIn}
					/>
					<EventOriginalLinks event={event} />
					<EventParticipants event={event} />
				</div>

				{/* Right Column (70%) */}
				<div className="lg:col-span-8 space-y-6">
					<EventHeader event={event} status={status} />
					<EventOrganizer event={event} />
					<EventDatePeriod event={event} />
					<EventLocation event={event} />
					<EventDescription event={event} />
					<EventSchedule event={event} />
				</div>
			</div>

			{/* Mobile Layout */}
			<div className="lg:hidden space-y-6">
				<EventImage
					event={event}
					activeImageIndex={activeImageIndex}
					onImageChange={setActiveImageIndex}
				/>
				<EventHeader event={event} status={status} />
				<EventActionButtons
					event={event}
					onAddToCalendar={handleAddToCalendar}
					onRegister={handleRegister}
					onShare={handleShare}
					onShareFacebook={handleShareFacebook}
					onShareTwitter={handleShareTwitter}
					onShareLinkedIn={handleShareLinkedIn}
				/>
				<EventLocation event={event} />
				<EventDescription event={event} />
				<EventSchedule event={event} />
			</div>
		</div>
	)
}

// Sub-components
interface EventImageProps {
	event: Event
	activeImageIndex: number
	onImageChange: (index: number) => void
}

function EventImage({
	event,
	activeImageIndex,
	onImageChange,
}: EventImageProps) {
	const images = event.images || []
	const currentImage = images[activeImageIndex] || '/images/default-event.jpg'

	return (
		<div className="space-y-4">
			<div className="aspect-square rounded-lg overflow-hidden">
				<Image
					src={currentImage}
					alt={event.name}
					width={400}
					height={400}
					className="w-full h-full object-cover"
					priority
				/>
			</div>
			{images.length > 1 && (
				<div className="flex gap-2 overflow-x-auto">
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => onImageChange(index)}
							className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${
								index === activeImageIndex ? 'ring-2 ring-primary' : ''
							}`}
						>
							<Image
								src={image}
								alt={`${event.name} ${index + 1}`}
								width={64}
								height={64}
								className="w-full h-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	)
}

interface EventActionButtonsProps {
	event: Event
	onAddToCalendar: () => void
	onRegister: () => void
	onShare: () => void
	onShareFacebook: () => void
	onShareTwitter: () => void
	onShareLinkedIn: () => void
}

function EventActionButtons({
	event,
	onAddToCalendar,
	onRegister,
	onShare,
	onShareFacebook,
	onShareTwitter,
	onShareLinkedIn,
}: EventActionButtonsProps) {
	const hasRegisterLink =
		event.register?.registerUrl ||
		event.websites?.some(
			(w) =>
				w.type === 'other' || w.displayText.toLowerCase().includes('register')
		)

	return (
		<div className="space-y-4">
			{/* Primary Actions */}
			<div className="flex flex-col space-y-3">
				{hasRegisterLink && (
					<Button onClick={onRegister} className="w-full">
						<ExternalLink className="w-4 h-4 mr-2" />
						Register
					</Button>
				)}
				<Button onClick={onAddToCalendar} variant="outline" className="w-full">
					<Calendar className="w-4 h-4 mr-2" />
					Add to Calendar
				</Button>
			</div>

			{/* Share Section */}
			<div className="border-t pt-4">
				<h4 className="text-sm font-semibold mb-3">Share Event</h4>
				<div className="flex flex-col space-y-2">
					<Button
						onClick={onShareFacebook}
						variant="outline"
						className="w-full justify-start"
					>
						<svg
							className="w-4 h-4 mr-2"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
						</svg>
						Share on Facebook
					</Button>
					<Button
						onClick={onShareTwitter}
						variant="outline"
						className="w-full justify-start"
					>
						<svg
							className="w-4 h-4 mr-2"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
						</svg>
						Share on Twitter
					</Button>
					<Button
						onClick={onShareLinkedIn}
						variant="outline"
						className="w-full justify-start"
					>
						<svg
							className="w-4 h-4 mr-2"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
						</svg>
						Share on LinkedIn
					</Button>
					<Button
						onClick={onShare}
						variant="outline"
						className="w-full justify-start"
					>
						<Share2 className="w-4 h-4 mr-2" />
						More Options
					</Button>
				</div>
			</div>
		</div>
	)
}

interface EventOriginalLinksProps {
	event: Event
}

function EventOriginalLinks({ event }: EventOriginalLinksProps) {
	if (!event.websites || event.websites.length === 0) return null

	return (
		<Card>
			<CardContent className="p-4">
				<h3 className="font-semibold mb-3">Original Links</h3>
				<div className="space-y-2">
					{event.websites.map((website) => (
						<Link
							key={website.id}
							href={website.url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
						>
							<Globe className="w-4 h-4" />
							{website.displayText || website.url}
							<ExternalLink className="w-3 h-3" />
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

interface EventParticipantsProps {
	event: Event
}

function EventParticipants({ event }: EventParticipantsProps) {
	if (!event.eventParticipants || event.eventParticipants.length === 0)
		return null

	return (
		<Card>
			<CardContent className="p-4">
				<h3 className="font-semibold mb-3">Event Participants</h3>
				<div className="space-y-2">
					{event.eventParticipants.map((participant) => (
						<Link
							key={participant.id}
							href={`/bitcoiner/${participant.bitcoinerId}`}
							className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm group"
						>
							<Users className="w-4 h-4" />
							<span className="flex-1">{participant.bitcoinerName}</span>
							<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

interface EventHeaderProps {
	event: Event
	status: 'upcoming' | 'live' | 'past'
}

function EventHeader({ event, status }: EventHeaderProps) {
	const getStatusBadge = () => {
		switch (status) {
			case 'live':
				return <Badge variant="destructive">Live Now</Badge>
			case 'upcoming':
				return <Badge variant="default">Upcoming</Badge>
			case 'past':
				return <Badge variant="secondary">Past Event</Badge>
		}
	}

	const priceDisplay = event.register
		? event.register.price &&
			event.register.price > 0 &&
			event.register.currency
			? `${event.register.price} ${event.register.currency}`
			: event.register.price === 0 || !event.register.price
				? 'Free'
				: null
		: null

	return (
		<div className="space-y-4">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">{getStatusBadge()}</div>
					<h1 className="text-3xl font-bold mb-2">{event.name}</h1>
					<div className="flex items-center gap-4 text-muted-foreground">
						<div className="flex items-center gap-1">
							<Calendar className="w-4 h-4" />
							{formatDate(event.startDate)}
						</div>
						<div className="flex items-center gap-1">
							<Clock className="w-4 h-4" />
							{formatTime(event.startDate)}
						</div>
						{priceDisplay && (
							<div className="text-lg font-semibold text-green-600">
								{priceDisplay}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

interface EventOrganizerProps {
	event: Event
}

function EventOrganizer({ event }: EventOrganizerProps) {
	if (!event.organizerId || !event.organizerName) return null

	return (
		<Card className="p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
						<Users className="w-5 h-5 text-gray-400" />
					</div>
					<div>
						<Link
							href={`/organizer/${event.organizerId}`}
							className="font-semibold hover:text-primary transition-colors"
						>
							{event.organizerName}
						</Link>
						<p className="text-sm text-gray-500">Event Organizer</p>
					</div>
				</div>
				<Link
					href={`/organizer/${event.organizerId}`}
					className="text-primary hover:underline"
				>
					<ExternalLink className="w-4 h-4" />
				</Link>
			</div>
		</Card>
	)
}

interface EventDatePeriodProps {
	event: Event
}

function EventDatePeriod({ event }: EventDatePeriodProps) {
	return (
		<Card className="p-4">
			<h3 className="font-semibold mb-3">Event Details</h3>
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<Calendar className="w-4 h-4 text-muted-foreground" />
					<span className="font-medium">Start:</span>
					<span>{formatDateTime(event.startDate)}</span>
				</div>
				{event.endDate && (
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-muted-foreground" />
						<span className="font-medium">End:</span>
						<span>{formatDateTime(event.endDate)}</span>
					</div>
				)}
			</div>
		</Card>
	)
}

interface EventLocationProps {
	event: Event
}

function EventLocation({ event }: EventLocationProps) {
	if (!event.location) return null

	return (
		<Card className="p-4">
			<h3 className="font-semibold mb-3">Location</h3>
			<div className="space-y-2">
				<div className="flex items-start gap-2">
					<MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
					<div>
						<div className="font-medium">{event.location.buildingName}</div>
						<div className="text-sm text-muted-foreground">
							{event.location.address}, {event.location.city}
						</div>
					</div>
				</div>
				{event.location.googleMapsUrl && (
					<Link
						href={event.location.googleMapsUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
					>
						<MapPin className="w-3 h-3" />
						View on Google Maps
						<ExternalLink className="w-3 h-3" />
					</Link>
				)}
			</div>
		</Card>
	)
}

interface EventDescriptionProps {
	event: Event
}

function EventDescription({ event }: EventDescriptionProps) {
	return (
		<Card className="p-4">
			<h3 className="font-semibold mb-3">About This Event</h3>
			<div className="prose prose-sm max-w-none">
				<p className="text-muted-foreground whitespace-pre-wrap">
					{event.description}
				</p>
			</div>
		</Card>
	)
}

interface EventScheduleProps {
	event: Event
}

function EventSchedule({ event }: EventScheduleProps) {
	if (!event.sections || event.sections.length === 0) return null

	return (
		<Card className="p-6">
			<h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
			<div className="space-y-4">
				{event.sections.map((section) => (
					<div key={section.id} className="border-l-4 border-blue-500 pl-4">
						<div className="flex items-center justify-between">
							<h3 className="font-medium">{section.sectionName}</h3>
							{section.startTime && section.endTime && (
								<span className="text-sm text-muted-foreground">
									{formatTime(section.startTime)} -{' '}
									{formatTime(section.endTime)}
								</span>
							)}
							{section.startTime && !section.endTime && (
								<span className="text-sm text-muted-foreground">
									{formatTime(section.startTime)}
								</span>
							)}
							{!section.startTime && section.endTime && (
								<span className="text-sm text-muted-foreground">
									- {formatTime(section.endTime)}
								</span>
							)}
						</div>
						{section.spot && (
							<p className="text-sm text-muted-foreground mt-1">
								📍 {section.spot}
							</p>
						)}
						{section.description && (
							<p className="text-sm text-muted-foreground mt-1">
								{section.description}
							</p>
						)}
						{section.participants && section.participants.length > 0 && (
							<div className="mt-2">
								<p className="text-xs text-muted-foreground mb-1">
									Participants:
								</p>
								<div className="flex flex-wrap gap-2">
									{section.participants.map((participant) => (
										<Link
											key={participant.id}
											href={`/bitcoiner/${participant.bitcoinerId}`}
											className="inline-flex items-center gap-1 px-2 py-1 text-xs border rounded-md hover:bg-muted transition-colors"
										>
											{participant.bitcoinerName}
											<ExternalLink className="w-3 h-3" />
										</Link>
									))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</Card>
	)
}
