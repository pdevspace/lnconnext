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
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface UpdateOrganizerSocialMediaItem {
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

		// validate payload
		if (!payload.id) {
			throw new ValidationError('ID is required')
		}

		if (!payload.name || typeof payload.name !== 'string') {
			throw new ValidationError('Name is required and must be a string')
		}

		const trimmedName = payload.name.trim()

		if (trimmedName.length > 100) {
			throw new ValidationError('Name must be less than 100 characters')
		}

		if (!payload.bio || typeof payload.bio !== 'string') {
			throw new ValidationError('Bio is required and must be a string')
		}

		const trimmedBio = payload.bio.trim()
		if (trimmedBio.length > 1000) {
			throw new ValidationError('Bio must be less than 1000 characters')
		}

		if (!payload.website || typeof payload.website !== 'string') {
			throw new ValidationError('Website is required and must be a string')
		}

		const trimmedWebsite = payload.website.trim()

		// Validate URL format
		try {
			new URL(trimmedWebsite)
		} catch {
			throw new ValidationError('Website must be a valid URL')
		}

		if (trimmedWebsite.length > 1000) {
			throw new ValidationError('Website must be less than 1000 characters')
		}

		if (!Array.isArray(payload.socialMedia)) {
			throw new ValidationError('Social media must be an array')
		}

		// Validate each social media item
		const validPlatforms = [
			'facebook',
			'youtube',
			'twitter',
			'linkedin',
			'instagram',
			'other',
		]

		for (let i = 0; i < payload.socialMedia.length; i++) {
			const social = payload.socialMedia[i]

			if (!social.displayText || typeof social.displayText !== 'string') {
				throw new ValidationError(
					`Social media item ${i + 1}: displayText is required and must be a string`
				)
			}

			if (social.displayText.trim().length === 0) {
				throw new ValidationError(
					`Social media item ${i + 1}: displayText cannot be empty`
				)
			}

			if (social.displayText.length > 200) {
				throw new ValidationError(
					`Social media item ${i + 1}: displayText must be less than 200 characters`
				)
			}

			if (!social.platform || typeof social.platform !== 'string') {
				throw new ValidationError(
					`Social media item ${i + 1}: platform is required and must be a string`
				)
			}

			if (!validPlatforms.includes(social.platform.toLowerCase())) {
				throw new ValidationError(
					`Social media item ${i + 1}: platform must be one of: ${validPlatforms.join(', ')}`
				)
			}

			if (!social.urlLink || typeof social.urlLink !== 'string') {
				throw new ValidationError(
					`Social media item ${i + 1}: urlLink is required and must be a string`
				)
			}

			// Validate URL format
			try {
				new URL(social.urlLink)
			} catch {
				throw new ValidationError(
					`Social media item ${i + 1}: urlLink must be a valid URL`
				)
			}

			if (social.urlLink.length > 1000) {
				throw new ValidationError(
					`Social media item ${i + 1}: urlLink must be less than 1000 characters`
				)
			}
		}

		// Normalize payload
		payload.name = trimmedName
		payload.bio = trimmedBio
		payload.website = trimmedWebsite
		payload.socialMedia = payload.socialMedia.map((social) => ({
			displayText: social.displayText.trim(),
			platform: social.platform.toLowerCase(),
			urlLink: social.urlLink.trim(),
		}))

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
					bio: existingOrganizer.bio,
					website: existingOrganizer.website,
					activeFlag: 'R',
					updatedByUid: this.user.uid,
					socialMedia: {
						create: existingOrganizer.socialMedia.map((social) => ({
							displayText: social.displayText,
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
					bio: this.payload.bio,
					website: this.payload.website,
					activeFlag: 'A',
					updatedByUid: this.user.uid,
					socialMedia: {
						deleteMany: {},
						create: this.payload.socialMedia.map((social) => ({
							displayText: social.displayText,
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
