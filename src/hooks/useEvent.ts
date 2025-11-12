'use client'

import {
	CreateEventRequest,
	DeleteEventRequest,
	Event,
	GetEventRequest,
	ListEventItem,
	ListEventRequest,
	ListEventResponse,
	UpdateEventRequest,
} from '@/types'
import { apiRequest, authenticatedApiRequest } from '@/utils/api'

import { useCallback, useEffect, useState } from 'react'

// Helper to convert date strings to Date objects
function parseEventDates(event: Event): Event {
	return {
		...event,
		startDate: new Date(event.startDate),
		endDate: event.endDate ? new Date(event.endDate) : null,
		updatedAt: new Date(event.updatedAt),
		sections: event.sections.map((section) => ({
			...section,
			startTime: section.startTime ? new Date(section.startTime) : null,
			endTime: section.endTime ? new Date(section.endTime) : null,
		})),
	}
}

// Helper to convert list event date strings to Date objects
function parseListEventDates(event: ListEventItem): ListEventItem {
	return {
		...event,
		startDate: new Date(event.startDate),
	}
}

// Single Event Hook
export function useEvent(id?: string) {
	const [event, setEvent] = useState<Event | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchEvent = useCallback(async () => {
		if (!id) return

		setLoading(true)
		setError(null)

		try {
			const response = await apiRequest<Event>('/api/event/get', {
				method: 'POST',
				body: JSON.stringify({ id } as GetEventRequest),
			})

			if (!response.success) {
				throw new Error(response.error)
			}

			setEvent(parseEventDates(response.data))
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [id])

	const updateEvent = useCallback(
		async (data: Omit<UpdateEventRequest, 'id'>) => {
			if (!id) return

			setLoading(true)
			setError(null)

			try {
				const response = await authenticatedApiRequest<{}>(
					'/api/event/update',
					{
						method: 'POST',
						body: JSON.stringify({ id, ...data } as UpdateEventRequest),
					}
				)

				if (!response.success) {
					throw new Error(response.error)
				}

				await fetchEvent()
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error')
				throw err
			} finally {
				setLoading(false)
			}
		},
		[id, fetchEvent]
	)

	const deleteEvent = useCallback(async () => {
		if (!id) return

		setLoading(true)
		setError(null)

		try {
			const response = await authenticatedApiRequest<{}>('/api/event/delete', {
				method: 'POST',
				body: JSON.stringify({ id } as DeleteEventRequest),
			})

			if (!response.success) {
				throw new Error(response.error)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
			throw err
		} finally {
			setLoading(false)
		}
	}, [id])

	useEffect(() => {
		fetchEvent()
	}, [fetchEvent])

	return {
		event,
		loading,
		error,
		updateEvent,
		deleteEvent,
		refetch: fetchEvent,
	}
}

// Multiple Events Hook
export function useEvents(filters?: ListEventRequest['filters']) {
	const [events, setEvents] = useState<ListEventItem[]>([])
	const [total, setTotal] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchEvents = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const response = await apiRequest<ListEventResponse>('/api/event/list', {
				method: 'POST',
				body: JSON.stringify({ filters } as ListEventRequest),
			})

			if (!response.success) {
				throw new Error(response.error)
			}

			setEvents(response.data.events.map(parseListEventDates))
			setTotal(response.data.total)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [filters])

	const createEvent = useCallback(
		async (data: CreateEventRequest) => {
			setLoading(true)
			setError(null)

			try {
				const response = await authenticatedApiRequest<{}>(
					'/api/event/create',
					{
						method: 'POST',
						body: JSON.stringify(data),
					}
				)

				if (!response.success) {
					throw new Error(response.error)
				}

				await fetchEvents()
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error')
				throw err
			} finally {
				setLoading(false)
			}
		},
		[fetchEvents]
	)

	useEffect(() => {
		fetchEvents()
	}, [fetchEvents])

	return {
		events,
		total,
		loading,
		error,
		fetchEvents,
		createEvent,
	}
}
