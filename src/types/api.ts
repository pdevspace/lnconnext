// API Response Types

export interface ApiSuccessResponse<T> {
	success: true
	data: T
	status: number
}

export interface ApiErrorResponse {
	success: false
	error: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

