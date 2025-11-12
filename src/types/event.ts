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
	bitcoinerName: string
}

export interface EventParticipant {
	id: string
	bitcoinerId: string
	bitcoinerName: string
}

export interface EventSection {
	id: string
	sectionName: string
	startTime: string | Date | null
	endTime: string | Date | null
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
	endDate: string | Date | null
	price: number
	currency: string
	images: string[]
	organizerId: string
	organizerName: string
	location: EventLocation | null
	websites: EventWebsite[]
	sections: EventSection[]
	eventParticipants: EventParticipant[]
	updatedAt: string | Date
}

// Request Types
export interface EventFormLocationItem {
	buildingName: string
	address: string
	city: string
	googleMapsUrl: string
}

export interface EventFormWebsiteItem {
	url: string
	displayText: string
	type: string
}

export interface EventFormSectionItem {
	sectionName: string
	startTime: Date | string | null
	endTime: Date | string | null
	spot: string
	description: string
	participantIds: string[]
}

export interface EventFormRequest {
	id?: string // Optional for create, required for update
	name: string
	description: string
	startDate: Date | string
	endDate: Date | string | null
	price: number | null
	currency: string | null
	images: string[]
	organizerId: string
	location?: EventFormLocationItem
	websites: EventFormWebsiteItem[]
	sections: EventFormSectionItem[]
}

// Legacy types for backward compatibility (deprecated - use EventForm* types instead)
export interface CreateEventLocationItem extends EventFormLocationItem {}
export interface CreateEventWebsiteItem extends EventFormWebsiteItem {}
export interface CreateEventSectionItem extends EventFormSectionItem {}
export interface CreateEventRequest extends Omit<EventFormRequest, 'id'> {}

export interface UpdateEventLocationItem extends EventFormLocationItem {}
export interface UpdateEventWebsiteItem extends EventFormWebsiteItem {}
export interface UpdateEventSectionItem extends EventFormSectionItem {}
export interface UpdateEventRequest extends EventFormRequest {
	id: string // Required for update
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
