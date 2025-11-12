'use client'

import { CreateUserRequest, CreateUserResponse, User } from '@/types'
import { authenticatedApiRequest } from '@/utils/api'
import { useAuth } from '@/utils/AuthContext'

import { useCallback, useEffect, useState } from 'react'

import { User as FirebaseUser } from 'firebase/auth'

interface UseUserOptions {
	/**
	 * Optional Firebase user. If provided, will be used instead of fetching from AuthContext.
	 * This is useful when calling useUser from AuthProvider to avoid circular dependencies.
	 */
	firebaseUser?: FirebaseUser | null
}

export function useUser(options?: UseUserOptions) {
	// Try to get firebaseUser from options first, then fall back to useAuth
	// This allows useUser to be called from AuthProvider without circular dependency
	let firebaseUser: FirebaseUser | null | undefined
	try {
		const authContext = useAuth()
		firebaseUser = options?.firebaseUser ?? authContext.user
	} catch {
		// If useAuth fails (e.g., called from AuthProvider), use the provided firebaseUser
		firebaseUser = options?.firebaseUser ?? null
	}

	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [creating, setCreating] = useState(false)

	const fetchUser = useCallback(async () => {
		// If no Firebase user, clear the user data immediately
		if (!firebaseUser) {
			setUser(null)
			setLoading(false)
			return
		}

		setLoading(true)
		setError(null)

		try {
			const response = await authenticatedApiRequest<User>('/api/user/get', {
				method: 'POST',
				body: JSON.stringify({}),
			})

			if (!response.success) {
				// User not authenticated or not found - set user to null
				setUser(null)
				return
			}

			setUser(response.data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
			setUser(null)
		} finally {
			setLoading(false)
		}
	}, [firebaseUser])

	const createUser = useCallback(async () => {
		setCreating(true)
		setError(null)

		try {
			const response = await authenticatedApiRequest<CreateUserResponse>(
				'/api/user/create',
				{
					method: 'POST',
					body: JSON.stringify({} as CreateUserRequest),
				}
			)

			if (!response.success) {
				throw new Error(response.error)
			}

			// After creating user, fetch the user data
			await fetchUser()
			return response.data
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
			throw err
		} finally {
			setCreating(false)
		}
	}, [fetchUser])

	// Refetch user data when Firebase auth state changes
	useEffect(() => {
		fetchUser()
	}, [fetchUser])

	return {
		user,
		loading,
		creating,
		error,
		createUser,
		refetch: fetchUser,
	}
}

// Check if user has editor role
export function useIsEditor() {
	const { user, loading } = useUser()
	const isEditor = user?.role === 'editor'

	return {
		isEditor,
		loading,
		user,
	}
}
