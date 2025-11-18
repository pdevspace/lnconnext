import {
	Event,
	GetEventRequest,
	ListEventRequest,
	ListEventResponse,
} from '@/types/event'
import { apiRequestWithToken, getBaseUrl } from '@/utils/api'

import { cache } from 'react'

export const getEventDetail = cache(async (eventId: string): Promise<Event> => {
	try {
		const baseUrl = getBaseUrl()
		const response = await apiRequestWithToken<Event>(
			`${baseUrl}/api/event/get`,
			'',
			{
				method: 'POST',
				body: JSON.stringify({ id: eventId } as GetEventRequest),
			}
		)

		if (!response.success) {
			throw new Error(response.error)
		}

		return response.data
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : 'Unknown error')
	}
})

export const getEventsList = cache(async (): Promise<ListEventResponse> => {
	try {
		const baseUrl = getBaseUrl()
		const response = await apiRequestWithToken<ListEventResponse>(
			`${baseUrl}/api/event/list`,
			'',
			{
				method: 'POST',
				body: JSON.stringify({} as ListEventRequest),
			}
		)

		if (!response.success) {
			throw new Error(response.error)
		}

		return response.data
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : 'Unknown error')
	}
})
