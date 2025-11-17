/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useOrganizer.ts (if request/response interfaces change)
 * - src/types/organizer.ts (if interfaces change)
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
	validateUrlString,
	ValidationError,
	validPlatforms,
} from '@/api'

import { NextRequest } from 'next/server'

export interface UpdateOrganizerSocialMediaItem {
	displayText: string | null
	platform: string
	urlLink: string
}

export interface UpdateOrganizerRequest {
	id: string
	name: string
	bio: string | null
	website: string | null
	socialMedia: UpdateOrganizerSocialMediaItem[]
}

export interface UpdateOrganizerResponse {
	// Empty response
}

export class UpdateOrganizer extends ApiController<
	UpdateOrganizerRequest,
	UpdateOrganizerResponse
> {
	private constructor(payload: UpdateOrganizerRequest, user: CurrentUser) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<UpdateOrganizer> {
		let payload: UpdateOrganizerRequest
		let user: CurrentUser

		// Parse JSON and retrieve user from request
		try {
			payload = await request.json()
			user = await getCurrentUser(request)
		} catch {
			throw new ValidationError('Invalid JSON format')
		}

		// id
		const id = validateRequiredString(payload.id, 'ID')

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
		const formatSocialMedia: UpdateOrganizerSocialMediaItem[] = new Array(
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
		payload.id = id
		payload.name = trimmedName
		payload.bio = trimmedBio
		payload.website = trimmedWebsite
		payload.socialMedia = formatSocialMedia

		return new UpdateOrganizer(payload, user)
	}

	async toResult(): Promise<UpdateOrganizerResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			// Get existing organizer
			const existingOrganizer = await prisma.organizer.findUnique({
				where: {
					id: this.payload.id,
				},
				include: {
					socialMedia: true,
				},
			})

			if (!existingOrganizer) {
				throw new NotFoundError('Organizer not found')
			}

			if (existingOrganizer.activeFlag !== 'A') {
				throw new NotFoundError('Organizer not found')
			}

			// Step 1: Duplicate old data on new item and set activeFlag 'R'
			await prisma.organizer.create({
				data: {
					name: existingOrganizer.name,
					bio: existingOrganizer.bio || null,
					website: existingOrganizer.website || null,
					activeFlag: 'R',
					updatedByUid: this.user.uid,
					socialMedia: {
						create: existingOrganizer.socialMedia.map((social) => ({
							displayText: social.displayText || null,
							platform: social.platform,
							urlLink: social.urlLink,
						})),
					},
				},
			})

			// Step 2: Edit the original item to be new details
			await prisma.organizer.update({
				where: {
					id: this.payload.id,
					activeFlag: 'A',
				},
				data: {
					name: this.payload.name,
					bio: this.payload.bio || null,
					website: this.payload.website || null,
					activeFlag: 'A',
					updatedByUid: this.user.uid,
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
