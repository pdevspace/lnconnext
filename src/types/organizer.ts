// Organizer Types
export interface OrganizerSocialMedia {
	id: string
	displayText: string
	platform: string
	urlLink: string
}

export interface OrganizerBitcoinerItem {
	id: string
	name: string
}

export interface Organizer {
	id: string
	name: string
	bio: string
	website: string
	socialMedia: OrganizerSocialMedia[]
	members: OrganizerBitcoinerItem[]
	updatedAt: string | Date
}

// Request Types
export interface CreateOrganizerRequest {
	name: string
	bio: string
	website: string
	socialMedia: CreateOrganizerSocialMediaItem[]
}

export interface CreateOrganizerSocialMediaItem {
	displayText: string
	platform: string
	urlLink: string
}

export interface UpdateOrganizerRequest {
	id: string
	name: string
	bio: string
	website: string
	socialMedia: UpdateOrganizerSocialMediaItem[]
}

export interface UpdateOrganizerSocialMediaItem {
	displayText: string
	platform: string
	urlLink: string
}

export interface GetOrganizerRequest {
	id: string
}

export interface ListOrganizerRequest {
	filters?: {
		searchTerm?: string
		selectedPlatform?: string
		limit?: number
		offset?: number
	}
}

export interface ListOrganizerSocialMediaItem {
	id: string
	displayText: string
	platform: string
	urlLink: string
}

export interface ListOrganizerItem {
	id: string
	name: string
	socialMedia: ListOrganizerSocialMediaItem[]
}

export interface ListOrganizerResponse {
	organizers: ListOrganizerItem[]
	total: number
}

export interface DeleteOrganizerRequest {
	id: string
}
