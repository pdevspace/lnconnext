/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useEvent.ts (if request/response interfaces change)
 * - src/types/event.ts (if interfaces change)
 */
import {
	ApiController,
	CurrentUser,
	getCurrentUser,
	prisma,
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface DeleteEventRequest {
	id: string
}

export interface DeleteEventResponse {}

export class DeleteEvent extends ApiController<
	DeleteEventRequest,
	DeleteEventResponse
> {
	private constructor(payload: DeleteEventRequest, user: CurrentUser) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<DeleteEvent> {
		let payload: DeleteEventRequest
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

		return new DeleteEvent(payload, user)
	}

	async toResult(): Promise<DeleteEventResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			// Set activeFlag to 'R' (soft delete)
			await prisma.event.update({
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
