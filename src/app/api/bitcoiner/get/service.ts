/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useBitcoiner.ts (if request/response interfaces change)
 * - src/types/bitcoiner.ts (if interfaces change)
 */
import {
	ApiController,
	CurrentUser,
	getOptionalUser,
	NotFoundError,
	prisma,
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface GetBitcoinerRequest {
	id: string
}

export interface GetBitcoinerSocialMediaItem {
	id: string
	displayText: string
	platform: string
	urlLink: string
}

export interface GetBitcoinerResponse {
	id: string
	name: string
	bio: string
	socialMedia: GetBitcoinerSocialMediaItem[]
	organizerId: string | null
	organizerName: string | null
	updatedAt: Date
}

export class GetBitcoiner extends ApiController<
	GetBitcoinerRequest,
	GetBitcoinerResponse
> {
	private constructor(payload: GetBitcoinerRequest, user: CurrentUser | null) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<GetBitcoiner> {
		let payload: GetBitcoinerRequest
		let user: CurrentUser | null

		// Parse JSON and retrieve optional user from request
		try {
			payload = await request.json()
			user = await getOptionalUser(request)
		} catch (error) {
			throw new ValidationError('Invalid JSON format')
		}

		// validate payload
		if (!payload.id) {
			throw new ValidationError('ID is required')
		}

		return new GetBitcoiner(payload, user)
	}

	async toResult(): Promise<GetBitcoinerResponse> {
		try {
			// TODO: record who get for tracking
			const bitcoiner = await prisma.bitcoiner.findUnique({
				where: {
					id: this.payload.id,
					activeFlag: 'A',
				},
				include: {
					socialMedia: true,
					organizer: true,
				},
			})

			if (!bitcoiner) {
				throw new NotFoundError('Bitcoiner not found')
			}

			return {
				id: bitcoiner.id,
				name: bitcoiner.name,
				bio: bitcoiner.bio,
				socialMedia: bitcoiner.socialMedia.map((sm) => ({
					id: sm.id,
					displayText: sm.displayText,
					platform: sm.platform,
					urlLink: sm.urlLink,
				})),
				organizerId: bitcoiner.organizerId,
				organizerName: bitcoiner.organizer?.name || null,
				updatedAt: bitcoiner.updatedAt,
			}
		} catch (error) {
			throw error
		}
	}
}
