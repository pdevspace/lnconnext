// Bitcoiner Types
export interface BitcoinerSocialMedia {
	id: string
	displayText: string
	platform: string
	urlLink: string
}

export interface Bitcoiner {
	id: string
	name: string
	bio: string
	socialMedia: BitcoinerSocialMedia[]
	organizerId: string | null
	organizerName: string | null
	updatedAt: string | Date
}

// Request Types
export interface CreateBitcoinerRequest {
	name: string
	bio: string
	socialMedia: CreateBitcoinerSocialMediaItem[]
	organizerId?: string
}

export interface CreateBitcoinerSocialMediaItem {
	displayText: string
	platform: string
	urlLink: string
}

export interface UpdateBitcoinerRequest {
	id: string
	name: string
	bio: string
	socialMedia: UpdateBitcoinerSocialMediaItem[]
	organizerId?: string
}

export interface UpdateBitcoinerSocialMediaItem {
	displayText: string
	platform: string
	urlLink: string
}

export interface GetBitcoinerRequest {
	id: string
}

export interface ListBitcoinerRequest {
	filters?: {
		searchTerm?: string
		selectedPlatform?: string
		limit?: number
		offset?: number
	}
}

export interface ListBitcoinerSocialMediaItem {
	id: string
	displayText: string
	platform: string
	urlLink: string
}

export interface ListBitcoinerItem {
	id: string
	name: string
	socialMedia: ListBitcoinerSocialMediaItem[]
}

export interface ListBitcoinerResponse {
	bitcoiners: ListBitcoinerItem[]
	total: number
}

export type BitcoinerFilters = ListBitcoinerRequest['filters']

export interface DeleteBitcoinerRequest {
	id: string
}

// Platform Types
export type Platform =
	| 'facebook'
	| 'youtube'
	| 'twitter'
	| 'linkedin'
	| 'instagram'
	| 'other'

export const PLATFORM_OPTIONS: Array<{ value: Platform; label: string }> = [
	{ value: 'facebook', label: 'Facebook' },
	{ value: 'youtube', label: 'YouTube' },
	{ value: 'twitter', label: 'Twitter' },
	{ value: 'linkedin', label: 'LinkedIn' },
	{ value: 'instagram', label: 'Instagram' },
	{ value: 'other', label: 'Other' },
]
