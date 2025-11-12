import {
	ApiController,
	CurrentUser,
	getCurrentUser,
	NotFoundError,
	prisma,
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface GetUserRequest {
	// Empty request
}

export interface GetUserResponse {
	id: string
	uid: string
	email: string
	emailVerified: boolean
	role: string
	lastLoginAt: Date | null
}

export class GetUser extends ApiController<GetUserRequest, GetUserResponse> {
	private constructor(payload: GetUserRequest, user: CurrentUser) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<GetUser> {
		let payload: GetUserRequest
		let user: CurrentUser

		// Parse JSON and retrieve user from request
		try {
			payload = await request.json().catch(() => ({}))
			user = await getCurrentUser(request)
		} catch {
			throw new ValidationError('Invalid request or authentication failed')
		}

		return new GetUser(payload, user)
	}

	async toResult(): Promise<GetUserResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			const user = await prisma.user.findUnique({
				where: {
					uid: this.user.uid,
					activeFlag: 'A',
				},
			})

			if (!user) {
				throw new NotFoundError('User not found')
			}

			return {
				id: user.id,
				uid: user.uid,
				email: user.email,
				emailVerified: user.emailVerified,
				role: user.role,
				lastLoginAt: user.lastLoginAt,
			}
		} catch (error) {
			throw error
		}
	}
}
