import { ApiResponse } from '@/types/api'
import { auth } from '@/utils/firebaseConfig'

/**
 * Get Firebase auth token for API requests
 */
export async function getAuthToken(): Promise<string | null> {
	try {
		const user = auth.currentUser
		if (!user) {
			return null
		}
		const token = await user.getIdToken()
		return token
	} catch (error) {
		console.error('Error getting auth token:', error)
		return null
	}
}

/**
 * Make API request with optional authentication
 */
export async function apiRequest<T>(
	url: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	try {
		const token = await getAuthToken()
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			...options.headers,
		}

		if (token) {
			;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
		}

		const response = await fetch(url, {
			...options,
			headers,
		})

		const data = await response.json()

		if (!response.ok || !data.success) {
			return {
				success: false,
				error: data.error || 'Request failed',
			}
		}

		return {
			success: true,
			data: data.data,
			status: response.status,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		}
	}
}

/**
 * Make authenticated API request (requires token)
 */
export async function authenticatedApiRequest<T>(
	url: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	const token = await getAuthToken()
	if (!token) {
		return {
			success: false,
			error: 'Authentication required',
		}
	}

	return apiRequest<T>(url, options)
}

export async function apiRequestWithToken<T>(
	url: string,
	token: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	try {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			...options.headers,
		}

		if (token) {
			;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
		}

		const response = await fetch(url, {
			...options,
			headers,
		})

		const data = await response.json()

		if (!response.ok || !data.success) {
			return {
				success: false,
				error: data.error || 'Request failed',
			}
		}

		return {
			success: true,
			data: data.data,
			status: response.status,
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		}
	}
}
