/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useBitcoiner.ts (if request/response interfaces change)
 * - src/types/bitcoiner.ts (if interfaces change)
 */
import {
	ApiController,
	CurrentUser,
	getCurrentUser,
	NotFoundError,
	prisma,
	validateOneOfString,
	validateOptionalString,
	validateRequiredString,
	validateUrlString,
	ValidationError,
	validPlatforms,
} from '@/api'

import { NextRequest } from 'next/server'

export interface UpdateBitcoinerSocialMediaItem {
	displayText: string | null
	platform: string
	urlLink: string
}

export interface UpdateBitcoinerRequest {
	id: string
	name: string
	bio: string | null
	socialMedia: UpdateBitcoinerSocialMediaItem[]
	organizerId: string | null
}

export interface UpdateBitcoinerResponse {}

export class UpdateBitcoiner extends ApiController<
	UpdateBitcoinerRequest,
	UpdateBitcoinerResponse
> {
	private constructor(payload: UpdateBitcoinerRequest, user: CurrentUser) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<UpdateBitcoiner> {
		let payload: UpdateBitcoinerRequest
		let user: CurrentUser

		// Parse JSON and retrieve optional user from request
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
		const trimmedName = validateRequiredString(payload.name, 'Name', 100)

		// bio
		const trimmedBio = validateOptionalString(payload.bio, 'Bio', 1000)

		// socialMedia
		if (!Array.isArray(payload.socialMedia)) {
			throw new ValidationError('Social media must be an array')
		}
		const formatSocialMedia: UpdateBitcoinerSocialMediaItem[] = new Array(
			payload.socialMedia.length
		)

		for (let i = 0; i < payload.socialMedia.length; i++) {
			const social = payload.socialMedia[i]

			const socialMediaDisplayText = validateOptionalString(
				social.displayText,
				`Social media item ${i + 1}: displayText`,
				100
			)

			const socialMediaPlatform = validateOneOfString(
				social.platform,
				validPlatforms,
				`Social media item ${i + 1}: platform`
			)

			const socialMediaUrlLink = validateUrlString(
				social.urlLink,
				`Social media item ${i + 1}: urlLink`
			)

			formatSocialMedia[i] = {
				displayText: socialMediaDisplayText,
				platform: socialMediaPlatform,
				urlLink: socialMediaUrlLink,
			}
		}

		// organizerId
		const trimmedOrganizerId = validateOptionalString(
			payload.organizerId,
			'Organizer ID',
			100
		)

		// Normalize payload
		payload.id = id
		payload.name = trimmedName
		payload.bio = trimmedBio
		payload.socialMedia = formatSocialMedia
		payload.organizerId = trimmedOrganizerId

		return new UpdateBitcoiner(payload, user)
	}

	async toResult(): Promise<UpdateBitcoinerResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			if (this.payload.organizerId) {
				const organizerExists = await prisma.organizer.findUnique({
					where: { id: this.payload.organizerId, activeFlag: 'A' },
					select: { id: true },
				})
				if (!organizerExists) {
					throw new ValidationError('Organizer not found')
				}
			}

			// Get existing bitcoiner
			const existingBitcoiner = await prisma.bitcoiner.findUnique({
				where: {
					id: this.payload.id,
				},
				include: {
					socialMedia: true,
				},
			})

			if (!existingBitcoiner) {
				throw new NotFoundError('Bitcoiner not found')
			}

			if (existingBitcoiner.activeFlag !== 'A') {
				throw new NotFoundError('Bitcoiner not found')
			}

			// Step 1: Duplicate old data on new item and set activeFlag 'R'
			await prisma.bitcoiner.create({
				data: {
					name: existingBitcoiner.name,
					bio: existingBitcoiner.bio,
					activeFlag: 'R',
					updatedByUid: this.user.uid,
					organizerId: existingBitcoiner.organizerId,
					socialMedia: {
						create: existingBitcoiner.socialMedia.map((social) => ({
							displayText: social.displayText,
							platform: social.platform,
							urlLink: social.urlLink,
						})),
					},
				},
			})

			// Step 2: Edit the original item to be new details
			await prisma.bitcoiner.update({
				where: {
					id: this.payload.id,
					activeFlag: 'A',
				},
				data: {
					name: this.payload.name,
					bio: this.payload.bio || null,
					activeFlag: 'A',
					updatedByUid: this.user.uid,
					organizerId: this.payload.organizerId || null,
					socialMedia: {
						deleteMany: {},
						create: this.payload.socialMedia.map((social) => ({
							displayText: social.displayText || null,
							platform: social.platform,
							urlLink: social.urlLink,
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
