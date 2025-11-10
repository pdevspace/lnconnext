/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useOrganizer.ts (if request/response interfaces change)
 * - src/types/organizer.ts (if interfaces change)
 */
import {
	ApiController,
	CurrentUser,
	getCurrentUser,
	prisma,
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface DeleteOrganizerRequest {
	id: string
}

export interface DeleteOrganizerResponse {}

export class DeleteOrganizer extends ApiController<
	DeleteOrganizerRequest,
	DeleteOrganizerResponse
> {
	private constructor(payload: DeleteOrganizerRequest, user: CurrentUser) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<DeleteOrganizer> {
		let payload: DeleteOrganizerRequest
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

		return new DeleteOrganizer(payload, user)
	}

	async toResult(): Promise<DeleteOrganizerResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			// Set activeFlag to 'R' (soft delete)
			await prisma.organizer.update({
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
