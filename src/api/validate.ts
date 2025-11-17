import { ValidationError } from './errors'

export function validateRequiredString(
	value: unknown,
	fieldName: string,
	maxLength?: number
): string {
	if (typeof value !== 'string') {
		throw new ValidationError(`${fieldName} must be a string`)
	}
	const trimmed = value.trim()
	if (trimmed.length === 0) {
		throw new ValidationError(`${fieldName} cannot be empty`)
	}
	if (maxLength !== undefined && trimmed.length > maxLength) {
		throw new ValidationError(
			`${fieldName} must be less than ${maxLength} characters`
		)
	}
	return trimmed
}

export function validateOptionalString(
	value: unknown,
	fieldName: string,
	maxLength?: number
): string {
	if (typeof value !== 'string') {
		throw new ValidationError(`${fieldName} must be a string`)
	}
	const trimmed = value.trim()
	if (maxLength !== undefined && trimmed.length > maxLength) {
		throw new ValidationError(
			`${fieldName} must be less than ${maxLength} characters`
		)
	}
	return trimmed
}

export function validateUrlString(
	value: unknown,
	fieldName: string,
	maxLength: number = 1000
): string {
	if (typeof value !== 'string') {
		throw new ValidationError(`${fieldName} must be a string`)
	}
	const trimmed = value.trim()
	if (trimmed.length === 0) {
		throw new ValidationError(`${fieldName} cannot be empty`)
	}
	try {
		new URL(trimmed)
	} catch {
		throw new ValidationError(`${fieldName} must be a valid URL`)
	}
	if (trimmed.length > maxLength) {
		throw new ValidationError(
			`${fieldName} must be less than ${maxLength} characters`
		)
	}
	return trimmed
}

export function validateOptionalUrlString(
	value: unknown,
	fieldName: string,
	maxLength: number = 1000
): string {
	if (typeof value !== 'string') {
		throw new ValidationError(`${fieldName} must be a string`)
	}
	const trimmed = value.trim()
	if (trimmed.length === 0) {
		return trimmed
	}
	try {
		new URL(trimmed)
	} catch {
		throw new ValidationError(`${fieldName} must be a valid URL`)
	}
	if (trimmed.length > maxLength) {
		throw new ValidationError(
			`${fieldName} must be less than ${maxLength} characters`
		)
	}
	return trimmed
}

export function validateOneOfString(
	value: unknown,
	validItems: string[],
	fieldName: string
): string {
	if (typeof value !== 'string') {
		throw new ValidationError(`${fieldName} must be a string`)
	}
	const trimmed = value.trim()
	if (trimmed.length === 0) {
		throw new ValidationError(`${fieldName} cannot be empty`)
	}
	const lowercased = trimmed.toLowerCase()
	if (!validItems.includes(lowercased)) {
		throw new ValidationError(
			`${fieldName} must be one of: ${validItems.join(', ')}`
		)
	}
	return lowercased
}

export function validateStartDateEndDate(
	startDate: unknown,
	endDate: unknown
): [Date, Date | null] {
	// startDate is required
	if (
		!startDate ||
		!(startDate instanceof Date || typeof startDate === 'string')
	) {
		throw new ValidationError('Start date is required and must be a valid date')
	}

	const formatStartDate = new Date(startDate)

	if (isNaN(formatStartDate.getTime())) {
		throw new ValidationError('Start date must be a valid date')
	}

	// endDate is optional (can be null)
	let formatEndDate: Date | null = null
	if (endDate !== null && endDate !== undefined) {
		if (!(endDate instanceof Date || typeof endDate === 'string')) {
			throw new ValidationError('End date must be a valid date or null')
		}
		formatEndDate = new Date(endDate)
		if (isNaN(formatEndDate.getTime())) {
			throw new ValidationError('End date must be a valid date')
		}
		if (formatEndDate <= formatStartDate) {
			throw new ValidationError('End date must be after start date')
		}
	}

	return [formatStartDate, formatEndDate]
}

export function validateStartTimeEndTime(
	startTime: unknown,
	endTime: unknown
): [Date | null, Date | null] {
	// startTime is optional (can be null)
	let formatStartTime: Date | null = null
	if (startTime !== null && startTime !== undefined) {
		if (!(startTime instanceof Date || typeof startTime === 'string')) {
			throw new ValidationError('Start time must be a valid date or null')
		}
		formatStartTime = new Date(startTime)
		if (isNaN(formatStartTime.getTime())) {
			throw new ValidationError('Start time must be a valid date')
		}
	}

	// endTime is optional (can be null)
	let formatEndTime: Date | null = null
	if (endTime !== null && endTime !== undefined) {
		if (!(endTime instanceof Date || typeof endTime === 'string')) {
			throw new ValidationError('End time must be a valid date or null')
		}
		formatEndTime = new Date(endTime)
		if (isNaN(formatEndTime.getTime())) {
			throw new ValidationError('End time must be a valid date')
		}
	}

	// Validate that endTime is after startTime if both are provided
	if (formatStartTime !== null && formatEndTime !== null) {
		if (formatEndTime <= formatStartTime) {
			throw new ValidationError('End time must be after start time')
		}
	}

	return [formatStartTime, formatEndTime]
}
