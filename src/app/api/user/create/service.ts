/**
 * AI NOTE: When editing this file, you MUST also update:
 * - src/hooks/useUser.ts (if request/response interfaces change)
 * - src/types/user.ts (if interfaces change)
 */
import {
	ApiController,
	ConflictError,
	CurrentUser,
	getCurrentUser,
	prisma,
	ValidationError,
} from '@/api'

import { NextRequest } from 'next/server'

export interface CreateUserRequest {
	// Empty request
}

export interface CreateUserResponse {
	// Empty response
}

export class CreateUser extends ApiController<
	CreateUserRequest,
	CreateUserResponse
> {
	private constructor(payload: CreateUserRequest, user: CurrentUser) {
		super(payload, user)
	}

	static async fromRequest(request: NextRequest): Promise<CreateUser> {
		let payload: CreateUserRequest
		let user: CurrentUser

		// Parse JSON and retrieve user from request
		try {
			payload = await request.json().catch(() => ({}))
			user = await getCurrentUser(request)
		} catch {
			throw new ValidationError('Invalid request or authentication failed')
		}

		// Validate user data from Firebase token
		if (!user.uid) {
			throw new ValidationError('User UID is required')
		}

		if (!user.email) {
			throw new ValidationError('User email is required')
		}

		return new CreateUser(payload, user)
	}

	async toResult(): Promise<CreateUserResponse> {
		if (!this.user) {
			throw new ValidationError('User is required')
		}

		try {
			// Check if user already exists
			const existingUser = await prisma.user.findUnique({
				where: {
					uid: this.user.uid,
				},
			})

			if (existingUser) {
				// User already exists, update lastLoginAt
				await prisma.user.update({
					where: {
						uid: this.user.uid,
					},
					data: {
						lastLoginAt: new Date(),
						emailVerified: this.user.emailVerified,
					},
				})

				return {}
			}

			// Create new user
			await prisma.user.create({
				data: {
					uid: this.user.uid,
					email: this.user.email,
					emailVerified: this.user.emailVerified,
					role: 'editor',
					lastLoginAt: new Date(),
				},
			})

			return {}
		} catch (error) {
			// Handle unique constraint violation (uid already exists)
			if (
				error instanceof Error &&
				error.message.includes('Unique constraint')
			) {
				throw new ConflictError('User already exists')
			}
			throw error
		}
	}
}
