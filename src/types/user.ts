// User Types

export interface User {
	id: string
	uid: string
	email: string
	emailVerified: boolean
	role: string
	lastLoginAt: string | Date | null
}

// Request Types
export interface CreateUserRequest {}

export interface CreateUserResponse {}

