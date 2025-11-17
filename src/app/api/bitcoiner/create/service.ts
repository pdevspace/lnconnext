/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useBitcoiner.ts (if request/response interfaces change)
 * - src/types/bitcoiner.ts (if interfaces change)
 */
import {
	ApiController,
	CurrentUser,
	getCurrentUser,
	prisma,
	validateOneOfString,
	validateOptionalString,
	validateRequiredString,
	validateUrlString,
	ValidationError,
	validPlatforms,
} from '@/api'

import { NextRequest } from 'next/server'

export interface CreateBitcoinerSocialMediaItem {
	displayText: string | null
	platform: string
	urlLink: string
}

export interface CreateBitcoinerRequest {
	name: string
	bio: string | null
	socialMedia: CreateBitcoinerSocialMediaItem[]
	organizerId: string | null
}

export interface CreateBitcoinerResponse {}

export class CreateBitcoiner extends ApiController<
	CreateBitcoinerRequest,
	CreateBitcoinerResponse
> {
	private constructor(payload: CreateBitcoinerRequest, user: CurrentUser) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<CreateBitcoiner> {
		let payload: CreateBitcoinerRequest
		let user: CurrentUser

		// Parse JSON and retrieve optional user from request
		try {
			payload = await request.json()
			user = await getCurrentUser(request)
		} catch {
			throw new ValidationError('Invalid JSON format')
		}

		// validate payload

		// name
		const trimmedName = validateRequiredString(payload.name, 'Name', 100)

		// bio
		const trimmedBio = validateOptionalString(payload.bio, 'Bio', 1000)

		// socialMedia
		if (!Array.isArray(payload.socialMedia)) {
			throw new ValidationError('Social media must be an array')
		}
		const formatSocialMedia: CreateBitcoinerSocialMediaItem[] = new Array(
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
		payload.name = trimmedName
		payload.bio = trimmedBio
		payload.socialMedia = formatSocialMedia
		payload.organizerId = trimmedOrganizerId
		return new CreateBitcoiner(payload, user)
	}

	async toResult(): Promise<CreateBitcoinerResponse> {
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

			await prisma.bitcoiner.create({
				data: {
					name: this.payload.name,
					bio: this.payload.bio || null,
					activeFlag: 'A',
					updatedByUid: this.user.uid,
					organizerId: this.payload.organizerId || null,
					socialMedia: {
						create: this.payload.socialMedia.map((social) => ({
							displayText: social.displayText || null,
							platform: social.platform,
							urlLink: social.urlLink,
						})),
					},
				},
				include: {
					socialMedia: true,
				},
			})

			return {}
		} catch {
			throw new ValidationError('Failed to create bitcoiner')
		}
	}
}
