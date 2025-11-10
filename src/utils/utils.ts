import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(date)
}

export function formatTime(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	}).format(date)
}

export function formatDateTime(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	}).format(date)
}

export function getTimeRange(startDate: Date, endDate: Date): string {
	const startTime = formatTime(startDate)
	const endTime = formatTime(endDate)
	return `${startTime} - ${endTime}`
}

export function isEventLive(startDate: Date, endDate: Date): boolean {
	const now = new Date()
	return now >= startDate && now <= endDate
}

export function isEventUpcoming(startDate: Date): boolean {
	const now = new Date()
	return now < startDate
}

export function isEventPast(endDate: Date): boolean {
	const now = new Date()
	return now > endDate
}
