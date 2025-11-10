/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useEvent.ts (if request/response interfaces change)
 * - src/types/event.ts (if interfaces change)
 */
import {
	ApiController,
	CurrentUser,
	getOptionalUser,
	prisma,
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface ListEventRequest {
	filters?: {
		searchTerm?: string
		organizerId?: string
		locationId?: string
		startDateFrom?: Date | string
		startDateTo?: Date | string
		limit?: number
		offset?: number
	}
}

export interface ListEventWebsiteItem {
	id: string
	url: string
	displayText: string
	type: string
}

export interface ListEventLocationItem {
	id: string
	buildingName: string
	address: string
	city: string
	googleMapsUrl: string
}

export interface ListEventItem {
	id: string
	name: string
	startDate: Date
	price: number
	currency: string
	firstImage: string
	organizerName: string
	location: ListEventLocationItem | null
}

export interface ListEventResponse {
	events: ListEventItem[]
	total: number
}

export class ListEvent extends ApiController<
	ListEventRequest,
	ListEventResponse
> {
	private constructor(payload: ListEventRequest, user: CurrentUser | null) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<ListEvent> {
		let payload: ListEventRequest
		let user: CurrentUser | null

		// Parse JSON and retrieve optional user from request
		try {
			payload = await request.json()
			user = await getOptionalUser(request)
		} catch (error) {
			throw new ValidationError('Invalid JSON format')
		}

		return new ListEvent(payload, user)
	}

	async toResult(): Promise<ListEventResponse> {
		try {
			const filters = this.payload.filters || {}
			const {
				searchTerm,
				organizerId,
				locationId,
				startDateFrom,
				startDateTo,
				limit = 100,
				offset = 0,
			} = filters

			// Build where clause
			const where: any = {
				activeFlag: 'A',
			}

			// Add search filter
			if (searchTerm) {
				where.name = {
					contains: searchTerm,
				}
			}

			// Add organizer filter
			if (organizerId) {
				where.organizerId = organizerId
			}

			// Add location filter
			if (locationId) {
				where.locationId = locationId
			}

			// Add date range filter
			if (startDateFrom || startDateTo) {
				where.startDate = {}
				if (startDateFrom) {
					where.startDate.gte = new Date(startDateFrom)
				}
				if (startDateTo) {
					where.startDate.lte = new Date(startDateTo)
				}
			}

			// Get total count
			const total = await prisma.event.count({ where })

			// Get events
			const events = await prisma.event.findMany({
				where,
				include: {
					organizer: true,
					location: true,
				},
				take: limit,
				skip: offset,
				orderBy: {
					startDate: 'asc',
				},
			})

			return {
				events: events.map((event) => ({
					id: event.id,
					name: event.name,
					startDate: event.startDate,
					price: event.price,
					currency: event.currency,
					firstImage: event.images.length > 0 ? event.images[0] : '',
					organizerName: event.organizer?.name || '',
					location: event.location
						? {
								id: event.location.id,
								buildingName: event.location.buildingName,
								address: event.location.address,
								city: event.location.city,
								googleMapsUrl: event.location.googleMapsUrl,
							}
						: null,
				})),
				total,
			}
		} catch (error) {
			throw error
		}
	}
}
