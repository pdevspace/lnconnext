/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useEvent.ts (if request/response interfaces change)
 * - src/types/event.ts (if interfaces change)
 */
import {
	ApiController,
	CurrentUser,
	getCurrentUser,
	NotFoundError,
	prisma,
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface UpdateEventWebsiteItem {
	url: string
	displayText: string
	type: string
}

export interface UpdateEventSectionItem {
	sectionName: string
	startTime: Date
	endTime: Date
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
	startDate: Date
	endDate: Date
	price: number
	currency: string
	images: string[]
	organizerId: string
	location?: UpdateEventLocationItem
	websites: UpdateEventWebsiteItem[]
	sections: UpdateEventSectionItem[]
}

export interface UpdateEventResponse {}

export class UpdateEvent extends ApiController<
	UpdateEventRequest,
	UpdateEventResponse
> {
	private constructor(payload: UpdateEventRequest, user: CurrentUser) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<UpdateEvent> {
		let payload: UpdateEventRequest
		let user: CurrentUser

		// Parse JSON and retrieve user from request
		try {
			payload = await request.json()
			user = await getCurrentUser(request)
		} catch (error) {
			throw new ValidationError('Invalid JSON format')
		}

		// validate payload (same as create)
		if (!payload.id) {
			throw new ValidationError('ID is required')
		}

		if (!payload.name || typeof payload.name !== 'string') {
			throw new ValidationError('Name is required and must be a string')
		}

		const trimmedName = payload.name.trim()

		if (trimmedName.length > 200) {
			throw new ValidationError('Name must be less than 200 characters')
		}

		if (!payload.description || typeof payload.description !== 'string') {
			throw new ValidationError('Description is required and must be a string')
		}

		const trimmedDescription = payload.description.trim()
		if (trimmedDescription.length > 5000) {
			throw new ValidationError('Description must be less than 5000 characters')
		}

		if (
			!payload.startDate ||
			!(
				payload.startDate instanceof Date ||
				typeof payload.startDate === 'string'
			)
		) {
			throw new ValidationError(
				'Start date is required and must be a valid date'
			)
		}

		if (
			!payload.endDate ||
			!(payload.endDate instanceof Date || typeof payload.endDate === 'string')
		) {
			throw new ValidationError('End date is required and must be a valid date')
		}

		const startDate = new Date(payload.startDate)
		const endDate = new Date(payload.endDate)

		if (isNaN(startDate.getTime())) {
			throw new ValidationError('Start date must be a valid date')
		}

		if (isNaN(endDate.getTime())) {
			throw new ValidationError('End date must be a valid date')
		}

		if (endDate <= startDate) {
			throw new ValidationError('End date must be after start date')
		}

		if (typeof payload.price !== 'number' || payload.price < 0) {
			throw new ValidationError('Price must be a non-negative number')
		}

		if (!payload.currency || typeof payload.currency !== 'string') {
			throw new ValidationError('Currency is required and must be a string')
		}

		if (payload.currency.length > 10) {
			throw new ValidationError('Currency must be less than 10 characters')
		}

		if (!Array.isArray(payload.images)) {
			throw new ValidationError('Images must be an array')
		}

		for (let i = 0; i < payload.images.length; i++) {
			const image = payload.images[i]
			if (typeof image !== 'string') {
				throw new ValidationError(`Image ${i + 1} must be a string`)
			}
			try {
				new URL(image)
			} catch {
				throw new ValidationError(`Image ${i + 1} must be a valid URL`)
			}
		}

		if (!payload.organizerId || typeof payload.organizerId !== 'string') {
			throw new ValidationError('Organizer ID is required and must be a string')
		}

		// Validate location if provided
		if (payload.location !== undefined && payload.location !== null) {
			if (typeof payload.location !== 'object') {
				throw new ValidationError('Location must be an object')
			}

			if (
				!payload.location.buildingName ||
				typeof payload.location.buildingName !== 'string'
			) {
				throw new ValidationError(
					'Location buildingName is required and must be a string'
				)
			}
			if (payload.location.buildingName.trim().length === 0) {
				throw new ValidationError('Location buildingName cannot be empty')
			}
			if (payload.location.buildingName.length > 200) {
				throw new ValidationError(
					'Location buildingName must be less than 200 characters'
				)
			}

			if (
				!payload.location.address ||
				typeof payload.location.address !== 'string'
			) {
				throw new ValidationError(
					'Location address is required and must be a string'
				)
			}
			if (payload.location.address.trim().length === 0) {
				throw new ValidationError('Location address cannot be empty')
			}
			if (payload.location.address.length > 500) {
				throw new ValidationError(
					'Location address must be less than 500 characters'
				)
			}

			if (!payload.location.city || typeof payload.location.city !== 'string') {
				throw new ValidationError(
					'Location city is required and must be a string'
				)
			}
			if (payload.location.city.trim().length === 0) {
				throw new ValidationError('Location city cannot be empty')
			}
			if (payload.location.city.length > 100) {
				throw new ValidationError(
					'Location city must be less than 100 characters'
				)
			}

			if (
				!payload.location.googleMapsUrl ||
				typeof payload.location.googleMapsUrl !== 'string'
			) {
				throw new ValidationError(
					'Location googleMapsUrl is required and must be a string'
				)
			}
			if (payload.location.googleMapsUrl.trim().length === 0) {
				throw new ValidationError('Location googleMapsUrl cannot be empty')
			}
			try {
				new URL(payload.location.googleMapsUrl)
			} catch {
				throw new ValidationError('Location googleMapsUrl must be a valid URL')
			}
			if (payload.location.googleMapsUrl.length > 1000) {
				throw new ValidationError(
					'Location googleMapsUrl must be less than 1000 characters'
				)
			}

			// Normalize location
			payload.location = {
				buildingName: payload.location.buildingName.trim(),
				address: payload.location.address.trim(),
				city: payload.location.city.trim(),
				googleMapsUrl: payload.location.googleMapsUrl.trim(),
			}
		}

		if (!Array.isArray(payload.websites)) {
			throw new ValidationError('Websites must be an array')
		}

		const validWebsiteTypes = [
			'facebook',
			'youtube',
			'twitter',
			'linkedin',
			'instagram',
			'other',
		]

		for (let i = 0; i < payload.websites.length; i++) {
			const website = payload.websites[i]

			if (!website.url || typeof website.url !== 'string') {
				throw new ValidationError(
					`Website item ${i + 1}: url is required and must be a string`
				)
			}

			try {
				new URL(website.url)
			} catch {
				throw new ValidationError(
					`Website item ${i + 1}: url must be a valid URL`
				)
			}

			if (website.url.length > 1000) {
				throw new ValidationError(
					`Website item ${i + 1}: url must be less than 1000 characters`
				)
			}

			if (!website.displayText || typeof website.displayText !== 'string') {
				throw new ValidationError(
					`Website item ${i + 1}: displayText is required and must be a string`
				)
			}

			if (website.displayText.trim().length === 0) {
				throw new ValidationError(
					`Website item ${i + 1}: displayText cannot be empty`
				)
			}

			if (website.displayText.length > 200) {
				throw new ValidationError(
					`Website item ${i + 1}: displayText must be less than 200 characters`
				)
			}

			if (!website.type || typeof website.type !== 'string') {
				throw new ValidationError(
					`Website item ${i + 1}: type is required and must be a string`
				)
			}

			if (!validWebsiteTypes.includes(website.type.toLowerCase())) {
				throw new ValidationError(
					`Website item ${i + 1}: type must be one of: ${validWebsiteTypes.join(', ')}`
				)
			}
		}

		if (!Array.isArray(payload.sections)) {
			throw new ValidationError('Sections must be an array')
		}

		for (let i = 0; i < payload.sections.length; i++) {
			const section = payload.sections[i]

			if (!section.sectionName || typeof section.sectionName !== 'string') {
				throw new ValidationError(
					`Section ${i + 1}: sectionName is required and must be a string`
				)
			}

			if (section.sectionName.trim().length === 0) {
				throw new ValidationError(
					`Section ${i + 1}: sectionName cannot be empty`
				)
			}

			if (section.sectionName.length > 200) {
				throw new ValidationError(
					`Section ${i + 1}: sectionName must be less than 200 characters`
				)
			}

			if (
				!section.startTime ||
				!(
					section.startTime instanceof Date ||
					typeof section.startTime === 'string'
				)
			) {
				throw new ValidationError(
					`Section ${i + 1}: startTime is required and must be a valid date`
				)
			}

			if (
				!section.endTime ||
				!(
					section.endTime instanceof Date || typeof section.endTime === 'string'
				)
			) {
				throw new ValidationError(
					`Section ${i + 1}: endTime is required and must be a valid date`
				)
			}

			const sectionStartTime = new Date(section.startTime)
			const sectionEndTime = new Date(section.endTime)

			if (isNaN(sectionStartTime.getTime())) {
				throw new ValidationError(
					`Section ${i + 1}: startTime must be a valid date`
				)
			}

			if (isNaN(sectionEndTime.getTime())) {
				throw new ValidationError(
					`Section ${i + 1}: endTime must be a valid date`
				)
			}

			if (sectionEndTime <= sectionStartTime) {
				throw new ValidationError(
					`Section ${i + 1}: endTime must be after startTime`
				)
			}

			if (!section.spot || typeof section.spot !== 'string') {
				throw new ValidationError(
					`Section ${i + 1}: spot is required and must be a string`
				)
			}

			if (section.spot.trim().length === 0) {
				throw new ValidationError(`Section ${i + 1}: spot cannot be empty`)
			}

			if (section.spot.length > 200) {
				throw new ValidationError(
					`Section ${i + 1}: spot must be less than 200 characters`
				)
			}

			if (!section.description || typeof section.description !== 'string') {
				throw new ValidationError(
					`Section ${i + 1}: description is required and must be a string`
				)
			}

			if (section.description.length > 2000) {
				throw new ValidationError(
					`Section ${i + 1}: description must be less than 2000 characters`
				)
			}

			if (!Array.isArray(section.speakerIds)) {
				throw new ValidationError(
					`Section ${i + 1}: speakerIds must be an array`
				)
			}

			for (let j = 0; j < section.speakerIds.length; j++) {
				if (typeof section.speakerIds[j] !== 'string') {
					throw new ValidationError(
						`Section ${i + 1}, speaker ${j + 1}: speakerId must be a string`
					)
				}
			}
		}

		// Normalize payload
		payload.name = trimmedName
		payload.description = trimmedDescription
		payload.startDate = startDate
		payload.endDate = endDate
		payload.currency = payload.currency.trim().toUpperCase()
		payload.websites = payload.websites.map((website) => ({
			url: website.url.trim(),
			displayText: website.displayText.trim(),
			type: website.type.toLowerCase(),
		}))
		payload.sections = payload.sections.map((section) => ({
			sectionName: section.sectionName.trim(),
			startTime: new Date(section.startTime),
			endTime: new Date(section.endTime),
			spot: section.spot.trim(),
			description: section.description.trim(),
			speakerIds: section.speakerIds,
		}))

		return new UpdateEvent(payload, user)
	}

	async toResult(): Promise<UpdateEventResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			// Get existing event
			const existingEvent = await prisma.event.findUnique({
				where: {
					id: this.payload.id,
					activeFlag: 'A',
				},
				include: {
					websites: true,
					sections: {
						include: {
							participants: true,
						},
					},
				},
			})

			if (!existingEvent) {
				throw new NotFoundError('Event not found')
			}

			// Create location first if provided
			let locationId: string | null = existingEvent.locationId
			if (this.payload.location) {
				const location = await prisma.location.create({
					data: {
						buildingName: this.payload.location.buildingName,
						address: this.payload.location.address,
						city: this.payload.location.city,
						googleMapsUrl: this.payload.location.googleMapsUrl,
						activeFlag: 'A',
						updatedByUid: this.user.uid,
					},
				})
				locationId = location.id
			}

			// Step 1: Duplicate old data on new item and set activeFlag 'R'
			await prisma.event.create({
				data: {
					name: existingEvent.name,
					description: existingEvent.description,
					startDate: existingEvent.startDate,
					endDate: existingEvent.endDate,
					price: existingEvent.price,
					currency: existingEvent.currency,
					images: existingEvent.images,
					organizerId: existingEvent.organizerId,
					locationId: existingEvent.locationId,
					activeFlag: 'R',
					updatedByUid: this.user.uid,
					websites: {
						create: existingEvent.websites.map((website) => ({
							url: website.url,
							displayText: website.displayText,
							type: website.type,
						})),
					},
					sections: {
						create: existingEvent.sections.map((section) => ({
							sectionName: section.sectionName,
							startTime: section.startTime,
							endTime: section.endTime,
							spot: section.spot,
							description: section.description,
							participants: {
								create: section.participants.map((participant) => ({
									bitcoinerId: participant.bitcoinerId,
								})),
							},
						})),
					},
				},
			})

			// Step 2: Edit the original item to be new details
			await prisma.event.update({
				where: {
					id: this.payload.id,
					activeFlag: 'A',
				},
				data: {
					name: this.payload.name,
					description: this.payload.description,
					startDate: this.payload.startDate,
					endDate: this.payload.endDate,
					price: this.payload.price,
					currency: this.payload.currency,
					images: this.payload.images,
					organizerId: this.payload.organizerId,
					locationId,
					activeFlag: 'A',
					updatedByUid: this.user.uid,
					websites: {
						deleteMany: {},
						create: this.payload.websites.map((website) => ({
							url: website.url,
							displayText: website.displayText,
							type: website.type,
						})),
					},
					sections: {
						deleteMany: {},
						create: this.payload.sections.map((section) => ({
							sectionName: section.sectionName,
							startTime: section.startTime,
							endTime: section.endTime,
							spot: section.spot,
							description: section.description,
							participants: {
								create: section.speakerIds.map((bitcoinerId) => ({
									bitcoinerId,
								})),
							},
						})),
					},
				},
			})

			return {}
		} catch (error) {
			throw error
		}
	}
}
