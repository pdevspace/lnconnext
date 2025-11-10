// Event Types

export interface EventWebsite {
	id: string
	url: string
	displayText: string
	type: string
}

export interface EventSectionParticipant {
	id: string
	bitcoinerId: string
}

export interface EventSection {
	id: string
	sectionName: string
	startTime: string | Date
	endTime: string | Date
	spot: string
	description: string
	participants: EventSectionParticipant[]
}

export interface EventLocation {
	id: string
	buildingName: string
	address: string
	city: string
	googleMapsUrl: string
}

export interface Event {
	id: string
	name: string
	description: string
	startDate: string | Date
	endDate: string | Date
	price: number
	currency: string
	images: string[]
	organizerId: string
	organizerName: string
	location: EventLocation | null
	websites: EventWebsite[]
	sections: EventSection[]
	updatedAt: string | Date
}

// Request Types
export interface CreateEventLocationItem {
	buildingName: string
	address: string
	city: string
	googleMapsUrl: string
}

export interface CreateEventRequest {
	name: string
	description: string
	startDate: Date | string
	endDate: Date | string
	price: number
	currency: string
	images: string[]
	organizerId: string
	location?: CreateEventLocationItem
	websites: CreateEventWebsiteItem[]
	sections: CreateEventSectionItem[]
}

export interface CreateEventWebsiteItem {
	url: string
	displayText: string
	type: string
}

export interface CreateEventSectionItem {
	sectionName: string
	startTime: Date | string
	endTime: Date | string
	spot: string
	description: string
	speakerIds: string[]
}

export interface UpdateEventLocationItem {
	buildingName: string
	address: string
	city: string
	googleMapsUrl: string
}

export interface UpdateEventRequest {
	id: string
	name: string
	description: string
	startDate: Date | string
	endDate: Date | string
	price: number
	currency: string
	images: string[]
	organizerId: string
	location?: UpdateEventLocationItem
	websites: UpdateEventWebsiteItem[]
	sections: UpdateEventSectionItem[]
}

export interface UpdateEventWebsiteItem {
	url: string
	displayText: string
	type: string
}

export interface UpdateEventSectionItem {
	sectionName: string
	startTime: Date | string
	endTime: Date | string
	spot: string
	description: string
	speakerIds: string[]
}

export interface GetEventRequest {
	id: string
}

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
	startDate: Date | string
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

export interface DeleteEventRequest {
	id: string
}

// Website Type Types
export type WebsiteType =
	| 'facebook'
	| 'youtube'
	| 'twitter'
	| 'linkedin'
	| 'instagram'
	| 'other'

export const WEBSITE_TYPE_OPTIONS: Array<{
	value: WebsiteType
	label: string
}> = [
	{ value: 'facebook', label: 'Facebook' },
	{ value: 'youtube', label: 'YouTube' },
	{ value: 'twitter', label: 'Twitter' },
	{ value: 'linkedin', label: 'LinkedIn' },
	{ value: 'instagram', label: 'Instagram' },
	{ value: 'other', label: 'Other' },
]
