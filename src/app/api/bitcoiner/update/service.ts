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
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface UpdateBitcoinerSocialMediaItem {
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

		// Parse JSON and retrieve user from request
		try {
			payload = await request.json()
			user = await getCurrentUser(request)
		} catch (error) {
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
			throw new ValidationError('Name must be less than 200 characters')
		}

		if (!payload.bio || typeof payload.bio !== 'string') {
			throw new ValidationError('Bio is required and must be a string')
		}

		const trimmedBio = payload.bio.trim()
		if (trimmedBio.length > 1000) {
			throw new ValidationError('Bio must be less than 2000 characters')
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
					`Social media item ${i + 1}: urlLink must be less than 500 characters`
				)
			}
		}

		// Validate organizerId if provided
		if (payload.organizerId !== undefined && payload.organizerId !== null) {
			if (typeof payload.organizerId !== 'string') {
				throw new ValidationError('Organizer ID must be a string')
			}
			if (payload.organizerId.trim().length === 0) {
				throw new ValidationError('Organizer ID cannot be empty')
			}

			// Verify organizer exists and is active
			const organizer = await prisma.organizer.findUnique({
				where: {
					id: payload.organizerId.trim(),
					activeFlag: 'A',
				},
			})

			if (!organizer) {
				throw new ValidationError('Organizer not found or inactive')
			}

			payload.organizerId = payload.organizerId.trim()
		}

		// Normalize payload
		payload.name = trimmedName
		payload.bio = trimmedBio
		payload.socialMedia = payload.socialMedia.map((social) => ({
			displayText: social.displayText.trim(),
			platform: social.platform.toLowerCase(),
			urlLink: social.urlLink.trim(),
		}))

		return new UpdateBitcoiner(payload, user)
	}

	async toResult(): Promise<UpdateBitcoinerResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			// Get existing bitcoiner
			const existingBitcoiner = await prisma.bitcoiner.findUnique({
				where: {
					id: this.payload.id,
					activeFlag: 'A',
				},
				include: {
					socialMedia: true,
				},
			})

			if (!existingBitcoiner) {
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
					bio: this.payload.bio,
					activeFlag: 'A',
					updatedByUid: this.user.uid,
					organizerId: this.payload.organizerId || null,
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
