/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useBitcoiner.ts (if request/response interfaces change)
 * - src/types/bitcoiner.ts (if interfaces change)
 */
import {
	ApiController,
	CurrentUser,
	getOptionalUser,
	prisma,
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface ListBitcoinerRequest {
	filters?: {
		searchTerm?: string
		selectedPlatform?: string
		limit?: number
		offset?: number
	}
}

export interface ListBitcoinerSocialMediaItem {
	id: string
	displayText: string
	platform: string
	urlLink: string
}

export interface ListBitcoinerItem {
	id: string
	name: string
	socialMedia: ListBitcoinerSocialMediaItem[]
}

export interface ListBitcoinerResponse {
	bitcoiners: ListBitcoinerItem[]
	total: number
}

export class ListBitcoiner extends ApiController<
	ListBitcoinerRequest,
	ListBitcoinerResponse
> {
	private constructor(payload: ListBitcoinerRequest, user: CurrentUser | null) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<ListBitcoiner> {
		let payload: ListBitcoinerRequest
		let user: CurrentUser | null

		// Parse JSON and retrieve optional user from request
		try {
			payload = await request.json()
			user = await getOptionalUser(request)
		} catch (error) {
			throw new ValidationError('Invalid JSON format')
		}

		return new ListBitcoiner(payload, user)
	}

	async toResult(): Promise<ListBitcoinerResponse> {
		try {
			const filters = this.payload.filters || {}
			const { searchTerm, selectedPlatform, limit = 100, offset = 0 } = filters

			// Build where clause
			const where: any = {
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
			const total = await prisma.bitcoiner.count({ where })

			// Get bitcoiners
			const bitcoiners = await prisma.bitcoiner.findMany({
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
				bitcoiners: bitcoiners.map((bitcoiner) => ({
					id: bitcoiner.id,
					name: bitcoiner.name,
					socialMedia: bitcoiner.socialMedia.map((sm) => ({
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
