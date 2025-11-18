import {
	Bitcoiner,
	GetBitcoinerRequest,
	ListBitcoinerRequest,
	ListBitcoinerResponse,
} from '@/types/bitcoiner'
import { apiRequestWithToken, getBaseUrl } from '@/utils/api'

import { cache } from 'react'

export const getBitcoinerDetail = cache(
	async (bitcoinerId: string): Promise<Bitcoiner> => {
		try {
			const baseUrl = getBaseUrl()
			const response = await apiRequestWithToken<Bitcoiner>(
				`${baseUrl}/api/bitcoiner/get`,
				'',
				{
					method: 'POST',
					body: JSON.stringify({ id: bitcoinerId } as GetBitcoinerRequest),
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

export const getBitcoinersList = cache(
	async (userToken?: string | null): Promise<ListBitcoinerResponse> => {
		try {
			const baseUrl = getBaseUrl()
			const response = await apiRequestWithToken<ListBitcoinerResponse>(
				`${baseUrl}/api/bitcoiner/list`,
				userToken || '',
				{
					method: 'POST',
					body: JSON.stringify({} as ListBitcoinerRequest),
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
