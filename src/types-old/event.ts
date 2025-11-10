import { Organizer } from '@/app/api/services/models/organizer'

export interface Event {
	id: string
	name: string
	description: string
	organizerId: string
	organizer: Organizer
	eventSeriesName?: string
	location?: Location
	sections: EventSection[]
	startDate: Date
	endDate?: Date
	bitcoiners: Bitcoiner[]
	images: string[]
	websites: Website[]
	price: number
	register?: Website
	createdAt: Date
	updatedAt: Date
}

export interface Location {
	id: string
	buildingName: string
	address: string
	city: string
	country: string
	googleMapsUrl: string
	coordinates?: {
		lat: number
		lng: number
	}
}

export interface EventSection {
	id: string
	sectionName: string
	startTime: Date
	endTime: Date
	spot: string
	description?: string
	bitcoiners: Bitcoiner[]
}

export interface Bitcoiner {
	id: string
	name: string
	bio?: string
	avatar?: string
	expertise: string[]
	isActive: boolean
	socialMedia: SocialMedia[]
}

export interface Website {
	id: string
	url: string
	type: 'facebook' | 'youtube' | 'twitter' | 'linkedin' | 'instagram' | 'other'
	displayText?: string
}

export interface SocialMedia {
	id: string
	displayText: string
	username: string
	platform: string
	urlLink: string
	ownerId: string
	ownerType: 'bitcoiner' | 'organizer'
}
