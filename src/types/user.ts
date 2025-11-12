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
export interface CreateUserRequest {
	// Empty request
}

export interface CreateUserResponse {
	// Empty response
}

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
