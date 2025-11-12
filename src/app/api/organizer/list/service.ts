/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useOrganizer.ts (if request/response interfaces change)
 * - src/types/organizer.ts (if interfaces change)
 */
import {
	ApiController,
	CurrentUser,
	getOptionalUser,
	prisma,
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface ListOrganizerRequest {
	filters?: {
		searchTerm?: string
		selectedPlatform?: string
		limit?: number
		offset?: number
	}
}

export interface ListOrganizerSocialMediaItem {
	id: string
	displayText: string
	platform: string
	urlLink: string
}

export interface ListOrganizerItem {
	id: string
	name: string
	socialMedia: ListOrganizerSocialMediaItem[]
}

export interface ListOrganizerResponse {
	organizers: ListOrganizerItem[]
	total: number
}

export class ListOrganizer extends ApiController<
	ListOrganizerRequest,
	ListOrganizerResponse
> {
	private constructor(payload: ListOrganizerRequest, user: CurrentUser | null) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<ListOrganizer> {
		let payload: ListOrganizerRequest
		let user: CurrentUser | null

		// Parse JSON and retrieve optional user from request
		try {
			payload = await request.json()
			user = await getOptionalUser(request)
		} catch {
			throw new ValidationError('Invalid JSON format')
		}

		return new ListOrganizer(payload, user)
	}

	async toResult(): Promise<ListOrganizerResponse> {
		try {
			const filters = this.payload.filters || {}
			const { searchTerm, selectedPlatform, limit = 100, offset = 0 } = filters

			// Build where clause
			const where: {
				activeFlag: string
				name?: { contains: string }
				socialMedia?: { some: { platform: string } }
			} = {
				activeFlag: 'A',
			}

			// Add search filter
			if (searchTerm) {
				where.name = {
					contains: searchTerm,
				}
			}

			// Add platform filter
			if (selectedPlatform) {
				where.socialMedia = {
					some: {
						platform: selectedPlatform,
					},
				}
			}

			// Get total count
			const total = await prisma.organizer.count({ where })

			// Get organizers
			const organizers = await prisma.organizer.findMany({
				where,
				include: {
					socialMedia: true,
				},
				take: limit,
				skip: offset,
				orderBy: {
					updatedAt: 'desc',
				},
			})

			return {
				organizers: organizers.map((organizer) => ({
					id: organizer.id,
					name: organizer.name,
					socialMedia: organizer.socialMedia.map((sm) => ({
						id: sm.id,
						displayText: sm.displayText,
						platform: sm.platform,
						urlLink: sm.urlLink,
					})),
				})),
				total,
			}
		} catch (error) {
			throw error
		}
	}
}
