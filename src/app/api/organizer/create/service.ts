/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useOrganizer.ts (if request/response interfaces change)
 * - src/types/organizer.ts (if interfaces change)
 */
import {
	ApiController,
	CurrentUser,
	getCurrentUser,
	prisma,
	validateOneOfString,
	validateOptionalString,
	validateOptionalUrlString,
	validateRequiredString,
	validateUrlString,
	ValidationError,
	validPlatforms,
} from '@/api'

import { NextRequest } from 'next/server'

export interface CreateOrganizerSocialMediaItem {
	displayText: string | null
	platform: string
	urlLink: string
}

export interface CreateOrganizerRequest {
	name: string
	bio: string | null
	website: string | null
	socialMedia: CreateOrganizerSocialMediaItem[]
}

export interface CreateOrganizerResponse {}

export class CreateOrganizer extends ApiController<
	CreateOrganizerRequest,
	CreateOrganizerResponse
> {
	private constructor(payload: CreateOrganizerRequest, user: CurrentUser) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<CreateOrganizer> {
		let payload: CreateOrganizerRequest
		let user: CurrentUser

		// Parse JSON and retrieve user from request
		try {
			payload = await request.json()
			user = await getCurrentUser(request)
		} catch {
			throw new ValidationError('Invalid JSON format')
		}

		// name
		const trimmedName = validateRequiredString(payload.name, 'Name', 100)

		// bio
		const trimmedBio = validateOptionalString(payload.bio, 'Bio', 1000)

		// website
		const trimmedWebsite = validateOptionalUrlString(
			payload.website,
			'Website',
			1000
		)

		if (!Array.isArray(payload.socialMedia)) {
			throw new ValidationError('Social media must be an array')
		}
		const formatSocialMedia: CreateOrganizerSocialMediaItem[] = new Array(
			payload.socialMedia.length
		)

		for (let i = 0; i < payload.socialMedia.length; i++) {
			const social = payload.socialMedia[i]

			// socialMedia displayText
			const trimmedSocialMediaDisplayText = validateOptionalString(
				social.displayText,
				`Social media item ${i + 1}: displayText`,
				100
			)

			// socialMedia platform
			const socialMediaPlatform = validateOneOfString(
				social.platform,
				validPlatforms,
				`Social media item ${i + 1}: platform`
			)

			// socialMedia urlLink
			const socialMediaUrlLink = validateUrlString(
				social.urlLink,
				`Social media item ${i + 1}: urlLink`,
				1000
			)

			formatSocialMedia[i] = {
				displayText: trimmedSocialMediaDisplayText,
				platform: socialMediaPlatform,
				urlLink: socialMediaUrlLink,
			}
		}

		// Normalize payload
		payload.name = trimmedName
		payload.bio = trimmedBio
		payload.website = trimmedWebsite
		payload.socialMedia = formatSocialMedia

		return new CreateOrganizer(payload, user)
	}

	async toResult(): Promise<CreateOrganizerResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			await prisma.organizer.create({
				data: {
					name: this.payload.name,
					bio: this.payload.bio || null,
					website: this.payload.website || null,
					activeFlag: 'A',
					updatedByUid: this.user.uid,
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
		} catch (error) {
			throw error
		}
	}
}
