export class AppError extends Error {
	status: number

	constructor(status: number, message: string) {
		super(message)
		this.status = status
		this.name = 'AppError'
	}
}

export function handleError(err: unknown) {
	console.error('API Error:', err)

	if (err instanceof AppError) {
		return Response.json(
			{
				success: false,
				error: err.message,
			},
			{ status: err.status }
		)
	}

	// Handle other error types
	if (err instanceof Error) {
		return Response.json(
			{
				success: false,
				error: err.message,
			},
			{ status: 500 }
		)
	}

	return Response.json(
		{
			success: false,
			error: 'Internal Server Error',
		},
		{ status: 500 }
	)
}

/**
 * Custom error classes for API endpoints
 */

export class AuthenticationError extends AppError {
	constructor(message: string = 'Authentication required') {
		super(401, message)
		this.name = 'AuthenticationError'
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(400, message)
		this.name = 'ValidationError'
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found') {
		super(404, message)
		this.name = 'NotFoundError'
	}
}

export class ConflictError extends AppError {
	constructor(message: string) {
		super(409, message)
		this.name = 'ConflictError'
	}
}
