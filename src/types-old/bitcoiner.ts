export interface Bitcoiner {
	id: string
	name: string
	socialMedia: SocialMedia[]
}

export interface SocialMedia {
	id: string // Unique identifier (e.g., "social-1")
	displayText: string // Display text (e.g., "เพจ BLC Chiang Mai")
	username: string // Username/handle (e.g., "BLC Chiang Mai")
	platform: string // Platform name (e.g., "facebook", "youtube")
	urlLink: string // Full URL link
}

export interface BitcoinerFormData {
	name: string
	socialMedia: SocialMediaData[]
}

export interface SocialMediaData {
	id?: string
	displayText: string
	username: string
	platform: string
	urlLink: string
}

export interface BitcoinerFilters {
	searchTerm: string
	selectedPlatform: string
}

export type Platform =
	| 'facebook'
	| 'youtube'
	| 'twitter'
	| 'linkedin'
	| 'instagram'

export const PLATFORM_OPTIONS = [
	{ value: 'facebook', label: 'Facebook' },
	{ value: 'youtube', label: 'YouTube' },
	{ value: 'twitter', label: 'Twitter' },
	{ value: 'linkedin', label: 'LinkedIn' },
	{ value: 'instagram', label: 'Instagram' },
] as const
