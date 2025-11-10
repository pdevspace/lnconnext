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

export interface DeleteBitcoinerRequest {
	id: string
}

export interface DeleteBitcoinerResponse {}

export class DeleteBitcoiner extends ApiController<
	DeleteBitcoinerRequest,
	DeleteBitcoinerResponse
> {
	private constructor(payload: DeleteBitcoinerRequest, user: CurrentUser) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<DeleteBitcoiner> {
		let payload: DeleteBitcoinerRequest
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

		return new DeleteBitcoiner(payload, user)
	}

	async toResult(): Promise<DeleteBitcoinerResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			// Set activeFlag to 'R' (soft delete)
			await prisma.bitcoiner.update({
				where: {
					id: this.payload.id,
					activeFlag: 'A',
				},
				data: {
					activeFlag: 'R',
					updatedByUid: this.user.uid,
				},
			})

			return {}
		} catch (error) {
			throw error
		}
	}
}
