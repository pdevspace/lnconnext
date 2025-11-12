import { AuthenticationError } from '@/api/errors'
import { verifyIdToken } from '@/api/firebase-admin'

import { NextRequest } from 'next/server'

export interface CurrentUser {
	uid: string
	email: string
	emailVerified: boolean
}

export async function getCurrentUser(
	request: NextRequest
): Promise<CurrentUser> {
	try {
		// Get the Authorization header
		const authHeader = request.headers.get('authorization')

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new AuthenticationError('Authorization header missing or malformed')
		}

		// Extract the token
		const token = authHeader.substring(7)

		// Verify token using Firebase Admin SDK
		const decodedToken = await verifyIdToken(token)

		if (!decodedToken) {
			throw new AuthenticationError(
				'Invalid or expired token. If Firebase Admin is not configured, please set up Firebase Admin credentials.'
			)
		}

		return {
			uid: decodedToken.uid,
			email: decodedToken.email,
			emailVerified: decodedToken.emailVerified,
		}
	} catch (error) {
		if (error instanceof AuthenticationError) {
			throw error
		}
		throw new AuthenticationError('Authentication failed')
	}
}

export async function getOptionalUser(
	request: NextRequest
): Promise<CurrentUser | null> {
	try {
		// Get the Authorization header
		const authHeader = request.headers.get('authorization')

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return null
		}

		// Extract the token
		const token = authHeader.substring(7)

		// Verify token using Firebase Admin SDK
		const decodedToken = await verifyIdToken(token)

		if (!decodedToken) {
			return null
		}

		return {
			uid: decodedToken.uid,
			email: decodedToken.email,
			emailVerified: decodedToken.emailVerified,
		}
	} catch (error) {
		if (error instanceof AuthenticationError) {
			throw error
		}
		return null
	}
}

export function createSuccessResponse(data: unknown) {
	return Response.json({
		success: true,
		data,
		status: 200,
	})
}
