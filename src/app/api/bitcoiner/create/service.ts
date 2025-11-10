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
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface CreateBitcoinerSocialMediaItem {
	displayText: string
	platform: string
	urlLink: string
}

export interface CreateBitcoinerRequest {
	name: string
	bio: string
	socialMedia: CreateBitcoinerSocialMediaItem[]
	organizerId?: string
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
		} catch (error) {
			throw new ValidationError('Invalid JSON format')
		}

		// validate payload
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

		return new CreateBitcoiner(payload, user)
	}

	async toResult(): Promise<CreateBitcoinerResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			await prisma.bitcoiner.create({
				data: {
					name: this.payload.name,
					bio: this.payload.bio,
					activeFlag: 'A',
					updatedByUid: this.user.uid,
					organizerId: this.payload.organizerId || null,
					socialMedia: {
						create: this.payload.socialMedia.map((social) => ({
							displayText: social.displayText,
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
