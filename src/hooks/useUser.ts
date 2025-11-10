'use client'

import { CreateUserRequest, CreateUserResponse } from '@/types'
import { apiRequestWithToken, getAuthToken } from '@/utils/api'

import { useCallback, useState } from 'react'

// Create User Hook
export function useCreateUser() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const createUser = useCallback(async (token?: string) => {
		setLoading(true)
		setError(null)

		try {
			// If token provided, use it; otherwise get from auth.currentUser
			const authToken = token || (await getAuthToken())
			if (!authToken) {
				throw new Error('Authentication required')
			}

			const response = await apiRequestWithToken<CreateUserResponse>(
				'/api/user/create',
				authToken,
				{
					method: 'POST',
					body: JSON.stringify({} as CreateUserRequest),
				}
			)

			if (!response.success) {
				throw new Error(response.error)
			}

			return response.data
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	return {
		createUser,
		loading,
		error,
	}
}
