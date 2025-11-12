/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useEvent.ts (if request/response interfaces change)
 * - src/types/event.ts (if interfaces change)
 */
import {
	ApiController,
	CurrentUser,
	getOptionalUser,
	NotFoundError,
	prisma,
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface GetEventRequest {
	id: string
}

export interface GetEventWebsiteItem {
	id: string
	url: string
	displayText: string
	type: string
}

export interface GetEventSectionParticipant {
	id: string
	bitcoinerId: string
	bitcoinerName: string
}

export interface GetEventParticipant {
	id: string
	bitcoinerId: string
	bitcoinerName: string
}

export interface GetEventSectionItem {
	id: string
	sectionName: string
	startTime: Date | null
	endTime: Date | null
	spot: string
	description: string
	participants: GetEventSectionParticipant[]
}

export interface GetEventLocationItem {
	id: string
	buildingName: string
	address: string
	city: string
	googleMapsUrl: string
}

export interface GetEventResponse {
	id: string
	name: string
	description: string
	startDate: Date
	endDate: Date | null
	price: number
	currency: string
	images: string[]
	organizerId: string
	organizerName: string
	location: GetEventLocationItem | null
	websites: GetEventWebsiteItem[]
	sections: GetEventSectionItem[]
	eventParticipants: GetEventParticipant[]
	updatedAt: Date
}

export class GetEvent extends ApiController<GetEventRequest, GetEventResponse> {
	private constructor(payload: GetEventRequest, user: CurrentUser | null) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<GetEvent> {
		let payload: GetEventRequest
		let user: CurrentUser | null

		// Parse JSON and retrieve optional user from request
		try {
			payload = await request.json()
			user = await getOptionalUser(request)
		} catch {
			throw new ValidationError('Invalid JSON format')
		}

		// validate payload
		if (!payload.id) {
			throw new ValidationError('ID is required')
		}

		return new GetEvent(payload, user)
	}

	async toResult(): Promise<GetEventResponse> {
		try {
			const event = await prisma.event.findUnique({
				where: {
					id: this.payload.id,
				},
				include: {
					organizer: true,
					location: true,
					websites: true,
					sections: {
						include: {
							participants: {
								include: {
									bitcoiner: true,
								},
							},
						},
					},
				},
			})

			if (!event) {
				throw new NotFoundError('Event not found')
			}

			if (event.activeFlag !== 'A') {
				throw new NotFoundError('Event not found')
			}

			if (!event.organizer) {
				throw new NotFoundError('Event organizer not found')
			}

			// Map sections and collect all participants
			const sections = event.sections.map((section) => ({
				id: section.id,
				sectionName: section.sectionName,
				startTime: section.startTime,
				endTime: section.endTime,
				spot: section.spot,
				description: section.description,
				participants: section.participants.map((participant) => ({
					id: participant.id,
					bitcoinerId: participant.bitcoinerId,
					bitcoinerName: participant.bitcoiner.name,
				})),
			}))

			// Create union of all participants from all sections (unique by bitcoinerId)
			const participantMap = new Map<string, GetEventParticipant>()
			for (const section of event.sections) {
				for (const participant of section.participants) {
					if (!participantMap.has(participant.bitcoinerId)) {
						participantMap.set(participant.bitcoinerId, {
							id: participant.id,
							bitcoinerId: participant.bitcoinerId,
							bitcoinerName: participant.bitcoiner.name,
						})
					}
				}
			}
			const eventParticipants = Array.from(participantMap.values())

			return {
				id: event.id,
				name: event.name,
				description: event.description,
				startDate: event.startDate,
				endDate: event.endDate,
				price: event.price,
				currency: event.currency,
				images: event.images,
				organizerId: event.organizerId,
				organizerName: event.organizer.name,
				location: event.location
					? {
							id: event.location.id,
							buildingName: event.location.buildingName,
							address: event.location.address,
							city: event.location.city,
							googleMapsUrl: event.location.googleMapsUrl,
						}
					: null,
				websites: event.websites.map((website) => ({
					id: website.id,
					url: website.url,
					displayText: website.displayText,
					type: website.type,
				})),
				sections,
				eventParticipants,
				updatedAt: event.updatedAt,
			}
		} catch (error) {
			throw error
		}
	}
}
