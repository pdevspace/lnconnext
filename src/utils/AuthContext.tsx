'use client'

import { useCreateUser } from '@/hooks/useUser'
import { auth, provider } from '@/utils/firebaseConfig'

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

import {
	User as FirebaseUser,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
} from 'firebase/auth'

interface AuthContextType {
	user: FirebaseUser | null
	loading: boolean
	login: () => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<FirebaseUser | null>(null)
	const [loading, setLoading] = useState(true)
	const { createUser } = useCreateUser()

	// Listen to auth state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser)
			// Set loading to false when auth state is determined
			// The login function will manage its own loading state during login
			setLoading(false)
		})

		return () => unsubscribe()
	}, [])

	const login = useCallback(async () => {
		try {
			setLoading(true)
			const credential = await signInWithPopup(auth, provider)
			const token = await credential.user.getIdToken()

			// Create user immediately after login
			try {
				await createUser(token)
			} catch (createError) {
				// If createUser fails, log out the user to prevent inconsistent state
				console.error('Failed to create user, logging out:', createError)
				await signOut(auth)
				throw new Error('Failed to create user account. Please try again.')
			}
		} catch (error) {
			console.error('Login failed:', error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [createUser])

	const logout = useCallback(async () => {
		try {
			setLoading(true)
			await signOut(auth)
		} catch (error) {
			console.error('Logout failed:', error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [])

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
