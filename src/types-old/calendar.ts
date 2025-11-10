import { Event } from '@/types-old/event'

export interface CalendarDay {
	date: Date
	events: Event[]
	isWeekend: boolean
	isToday: boolean
}

export type ViewMode = 'month' | 'daily'

export interface FilterState {
	search: string
	categories: string[]
	locations: string[]
	statuses: string[]
}
