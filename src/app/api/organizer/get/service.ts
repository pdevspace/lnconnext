/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useOrganizer.ts (if request/response interfaces change)
 * - src/types/organizer.ts (if interfaces change)
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

export interface GetOrganizerRequest {
	id: string
}

export interface GetOrganizerSocialMediaItem {
	id: string
	displayText: string
	platform: string
	urlLink: string
}

export interface GetOrganizerBitcoinerItem {
	id: string
	name: string
}

export interface GetOrganizerResponse {
	id: string
	name: string
	bio: string
	website: string
	socialMedia: GetOrganizerSocialMediaItem[]
	members: GetOrganizerBitcoinerItem[]
	updatedAt: Date
}

export class GetOrganizer extends ApiController<
	GetOrganizerRequest,
	GetOrganizerResponse
> {
	private constructor(payload: GetOrganizerRequest, user: CurrentUser | null) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<GetOrganizer> {
		let payload: GetOrganizerRequest
		let user: CurrentUser | null

		// Parse JSON and retrieve optional user from request
		try {
			payload = await request.json()
			user = await getOptionalUser(request)
		} catch {
			throw new ValidationError('Invalid JSON format')
		}

		// validate payload
		if (!payload.id) {
			throw new ValidationError('ID is required')
		}

		return new GetOrganizer(payload, user)
	}

	async toResult(): Promise<GetOrganizerResponse> {
		try {
			const organizer = await prisma.organizer.findUnique({
				where: {
					id: this.payload.id,
					activeFlag: 'A',
				},
				include: {
					socialMedia: true,
					members: {
						where: {
							activeFlag: 'A',
						},
					},
				},
			})

			if (!organizer) {
				throw new NotFoundError('Organizer not found')
			}

			return {
				id: organizer.id,
				name: organizer.name,
				bio: organizer.bio,
				website: organizer.website,
				socialMedia: organizer.socialMedia.map((sm) => ({
					id: sm.id,
					displayText: sm.displayText,
					platform: sm.platform,
					urlLink: sm.urlLink,
				})),
				members: organizer.members.map((member) => ({
					id: member.id,
					name: member.name,
				})),
				updatedAt: organizer.updatedAt,
			}
		} catch (error) {
			throw error
		}
	}
}
