import {
	GetOrganizerRequest,
	ListOrganizerRequest,
	ListOrganizerResponse,
	Organizer,
} from '@/types/organizer'
import { apiRequestWithToken, getBaseUrl } from '@/utils/api'

import { cache } from 'react'

export const getOrganizerDetail = cache(
	async (organizerId: string): Promise<Organizer> => {
		try {
			const baseUrl = getBaseUrl()
			const response = await apiRequestWithToken<Organizer>(
				`${baseUrl}/api/organizer/get`,
				'',
				{
					method: 'POST',
					body: JSON.stringify({ id: organizerId } as GetOrganizerRequest),
				}
			)

			if (!response.success) {
				throw new Error(response.error)
			}

			return response.data
		} catch (error) {
			throw new Error(error instanceof Error ? error.message : 'Unknown error')
		}
	}
)

export const getOrganizersList = cache(
	async (): Promise<ListOrganizerResponse> => {
		try {
			const baseUrl = getBaseUrl()
			const response = await apiRequestWithToken<ListOrganizerResponse>(
				`${baseUrl}/api/organizer/list`,
				'',
				{
					method: 'POST',
					body: JSON.stringify({} as ListOrganizerRequest),
				}
			)

			if (!response.success) {
				throw new Error(response.error)
			}

			return response.data
		} catch (error) {
			throw new Error(error instanceof Error ? error.message : 'Unknown error')
		}
	}
)
