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
	validateOneOfString,
	validateOptionalString,
	validateOptionalUrlString,
	validateRequiredString,
	validateStartDateEndDate,
	validateStartTimeEndTime,
	validateUrlString,
	ValidationError,
	validWebsiteTypes,
} from '@/api'

import { NextRequest } from 'next/server'

export interface UpdateEventWebsiteItem {
	url: string
	displayText: string | null
	type: string
}

export interface UpdateEventSectionItem {
	sectionName: string
	startTime: Date | null
	endTime: Date | null
	spot: string | null
	description: string | null
	participantIds: string[]
}

export interface UpdateEventLocationItem {
	buildingName: string
	address: string | null
	city: string | null
	googleMapsUrl: string
}

export interface UpdateEventRegisterItem {
	price: number | null
	currency: string | null
	registerUrl: string | null
}

export interface UpdateEventRequest {
	id: string
	name: string
	description: string | null
	startDate: Date
	endDate: Date | null
	images: string[]
	organizerId: string
	location: UpdateEventLocationItem | null
	register: UpdateEventRegisterItem | null
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
		} catch {
			throw new ValidationError('Invalid JSON format')
		}

		// validate payload

		// id
		const id = validateRequiredString(payload.id, 'ID')

		// name
		const trimmedName = validateRequiredString(payload.name, 'Name', 200)

		// description
		const trimmedDescription = validateOptionalString(
			payload.description,
			'Description',
			1000
		)

		// start date and end date
		const [startDate, endDate] = validateStartDateEndDate(
			payload.startDate,
			payload.endDate
		)

		// register
		let formatRegister: UpdateEventRegisterItem | null = null
		if (payload.register !== undefined && payload.register !== null) {
			if (typeof payload.register !== 'object') {
				throw new ValidationError('Register must be an object')
			}

			// register price
			const price = payload.register.price ?? 0
			if (typeof payload.register.price !== 'number' || price < 0) {
				throw new ValidationError(
					'Register price must be a non-negative number or null'
				)
			}

			// register currency
			const trimmedCurrency = validateOptionalString(
				payload.register.currency,
				'Register currency',
				10
			)

			// register urrl
			const trimmedRegisterUrl = validateOptionalUrlString(
				payload.register.registerUrl,
				'Register URL',
				1000
			)

			formatRegister = {
				price: price || null,
				currency: trimmedCurrency || null,
				registerUrl: trimmedRegisterUrl || null,
			}
		}

		// image
		if (!Array.isArray(payload.images)) {
			throw new ValidationError('Images must be an array')
		}
		const formatImages: string[] = new Array(payload.images.length)
		for (let i = 0; i < payload.images.length; i++) {
			const image = payload.images[i]
			const trimmedImage = validateUrlString(image, `Image ${i + 1}`)
			formatImages[i] = trimmedImage
		}

		// location
		let formatLocation: UpdateEventLocationItem | null = null
		if (payload.location !== undefined && payload.location !== null) {
			if (typeof payload.location !== 'object') {
				throw new ValidationError('Location must be an object')
			}

			// location buildingName
			const trimmedBuildingName = validateRequiredString(
				payload.location.buildingName,
				'Location buildingName',
				200
			)

			// location address
			const trimmedAddress = validateOptionalString(
				payload.location.address,
				'Location address',
				500
			)

			// location city
			const trimmedCity = validateOptionalString(
				payload.location.city,
				'Location city',
				100
			)

			// location googleMapsUrl
			const trimmedGoogleMapsUrl = validateUrlString(
				payload.location.googleMapsUrl,
				'Location googleMapsUrl',
				1000
			)

			// Normalize location
			formatLocation = {
				buildingName: trimmedBuildingName,
				address: trimmedAddress,
				city: trimmedCity,
				googleMapsUrl: trimmedGoogleMapsUrl,
			}
		}

		// website
		if (!Array.isArray(payload.websites)) {
			throw new ValidationError('Websites must be an array')
		}
		const formatWebsites: UpdateEventWebsiteItem[] = new Array(
			payload.websites.length
		)

		for (let i = 0; i < payload.websites.length; i++) {
			const website = payload.websites[i]

			// website url
			const websiteUrl = validateUrlString(
				website.url,
				`Website item ${i + 1}: url`,
				1000
			)

			// website display text
			const trimmedWebsiteDisplayText = validateOptionalString(
				website.displayText,
				`Website item ${i + 1}: displayText`,
				100
			)

			// website type
			const websiteType = validateOneOfString(
				website.type,
				validWebsiteTypes,
				`Website item ${i + 1}: type`
			)

			formatWebsites[i] = {
				url: websiteUrl,
				displayText: trimmedWebsiteDisplayText,
				type: websiteType,
			}
		}

		// section
		if (!Array.isArray(payload.sections)) {
			throw new ValidationError('Sections must be an array')
		}
		const formatSections: UpdateEventSectionItem[] = new Array(
			payload.sections.length
		)

		for (let i = 0; i < payload.sections.length; i++) {
			const section = payload.sections[i]

			// section sectionName
			const trimmedSectionName = validateRequiredString(
				section.sectionName,
				`Section ${i + 1}: sectionName`,
				200
			)

			// section startTime and endTime
			const [sectionStartTime, sectionEndTime] = validateStartTimeEndTime(
				section.startTime,
				section.endTime
			)

			// section spot
			const trimmedSectionSpot = validateOptionalString(
				section.spot,
				`Section ${i + 1}: spot`,
				200
			)

			// section description
			const trimmedSectionDescription = validateOptionalString(
				section.description,
				`Section ${i + 1}: description`,
				2000
			)

			// section participants
			const sectionParticipantIds: string[] = []
			if (!Array.isArray(section.participantIds)) {
				throw new ValidationError(
					`Section ${trimmedSectionName}: participantIds must be an array`
				)
			}

			for (let j = 0; j < section.participantIds.length; j++) {
				sectionParticipantIds[j] = validateRequiredString(
					section.participantIds[j],
					`Section ${trimmedSectionName}, participant ${j + 1}`,
					100
				)
			}

			formatSections[i] = {
				sectionName: trimmedSectionName,
				startTime: sectionStartTime,
				endTime: sectionEndTime,
				spot: trimmedSectionSpot,
				description: trimmedSectionDescription,
				participantIds: sectionParticipantIds,
			}
		}

		// organizerId
		const trimmedOrganizerId = validateRequiredString(
			payload.organizerId,
			'Organizer ID',
			100
		)

		// Normalize payload
		payload.id = id
		payload.name = trimmedName
		payload.description = trimmedDescription
		payload.startDate = startDate
		payload.endDate = endDate
		payload.images = formatImages
		payload.organizerId = trimmedOrganizerId
		payload.register = formatRegister
		payload.location = formatLocation
		payload.websites = formatWebsites
		payload.sections = formatSections

		return new UpdateEvent(payload, user)
	}

	async toResult(): Promise<UpdateEventResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			// Validate ID
			if (!this.payload.id || typeof this.payload.id !== 'string') {
				throw new ValidationError('ID is required and must be a string')
			}

			// Validate organizerId
			if (
				!this.payload.organizerId ||
				typeof this.payload.organizerId !== 'string'
			) {
				throw new ValidationError(
					'Organizer ID is required and must be a string'
				)
			}
			const organizerExists = await prisma.organizer.findUnique({
				where: { id: this.payload.organizerId, activeFlag: 'A' },
				select: { id: true },
			})
			if (!organizerExists) {
				throw new ValidationError('Organizer not found')
			}

			// Get existing event
			const existingEvent = await prisma.event.findUnique({
				where: {
					id: this.payload.id,
				},
				include: {
					register: true,
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

			if (existingEvent.activeFlag !== 'A') {
				throw new NotFoundError('Event not found')
			}

			// Update location first if provided
			let locationId: string | null = existingEvent.locationId
			if (this.payload.location) {
				const location = await prisma.location.create({
					data: {
						buildingName: this.payload.location.buildingName,
						address: this.payload.location.address || null,
						city: this.payload.location.city || null,
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
					images: existingEvent.images,
					organizerId: existingEvent.organizerId,
					locationId: existingEvent.locationId,
					activeFlag: 'R',
					updatedByUid: this.user.uid,
					register: existingEvent.register
						? {
								create: {
									price: existingEvent.register.price,
									currency: existingEvent.register.currency,
									registerUrl: existingEvent.register.registerUrl,
								},
							}
						: undefined,
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
					endDate: this.payload.endDate || null,
					images: this.payload.images,
					organizerId: this.payload.organizerId,
					locationId,
					activeFlag: 'A',
					updatedByUid: this.user.uid,
					register: this.payload.register
						? {
								create: {
									price: this.payload.register.price || null,
									currency: this.payload.register.currency || null,
									registerUrl: this.payload.register.registerUrl || null,
								},
							}
						: undefined,
					websites: {
						deleteMany: {},
						create: this.payload.websites.map((website) => ({
							url: website.url,
							displayText: website.displayText || null,
							type: website.type,
						})),
					},
					sections: {
						deleteMany: {},
						create: this.payload.sections.map((section) => ({
							sectionName: section.sectionName,
							startTime: section.startTime || null,
							endTime: section.endTime || null,
							spot: section.spot || null,
							description: section.description || null,
							participants: {
								create: section.participantIds.map((bitcoinerId) => ({
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
