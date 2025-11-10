'use client'

import {
	Bitcoiner,
	CreateBitcoinerRequest,
	DeleteBitcoinerRequest,
	GetBitcoinerRequest,
	ListBitcoinerItem,
	ListBitcoinerRequest,
	ListBitcoinerResponse,
	UpdateBitcoinerRequest,
} from '@/types'
import { apiRequest, authenticatedApiRequest } from '@/utils/api'

import { useCallback, useEffect, useState } from 'react'

// Single Bitcoiner Hook
export function useBitcoiner(id?: string) {
	const [bitcoiner, setBitcoiner] = useState<Bitcoiner | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchBitcoiner = useCallback(async () => {
		if (!id) return

		setLoading(true)
		setError(null)

		try {
			const response = await apiRequest<Bitcoiner>('/api/bitcoiner/get', {
				method: 'POST',
				body: JSON.stringify({ id } as GetBitcoinerRequest),
			})

			if (!response.success) {
				throw new Error(response.error)
			}

			setBitcoiner(response.data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [id])

	const updateBitcoiner = useCallback(
		async (data: Omit<UpdateBitcoinerRequest, 'id'>) => {
			if (!id) return

			setLoading(true)
			setError(null)

			try {
				const response = await authenticatedApiRequest<{}>(
					'/api/bitcoiner/update',
					{
						method: 'POST',
						body: JSON.stringify({ id, ...data } as UpdateBitcoinerRequest),
					}
				)

				if (!response.success) {
					throw new Error(response.error)
				}

				await fetchBitcoiner()
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error')
				throw err
			} finally {
				setLoading(false)
			}
		},
		[id, fetchBitcoiner]
	)

	const deleteBitcoiner = useCallback(async () => {
		if (!id) return

		setLoading(true)
		setError(null)

		try {
			const response = await authenticatedApiRequest<{}>(
				'/api/bitcoiner/delete',
				{
					method: 'POST',
					body: JSON.stringify({ id } as DeleteBitcoinerRequest),
				}
			)

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
		fetchBitcoiner()
	}, [fetchBitcoiner])

	return {
		bitcoiner,
		loading,
		error,
		updateBitcoiner,
		deleteBitcoiner,
		refetch: fetchBitcoiner,
	}
}

// Multiple Bitcoiners Hook
export function useBitcoiners(filters?: ListBitcoinerRequest['filters']) {
	const [bitcoiners, setBitcoiners] = useState<ListBitcoinerItem[]>([])
	const [total, setTotal] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchBitcoiners = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const response = await apiRequest<ListBitcoinerResponse>(
				'/api/bitcoiner/list',
				{
					method: 'POST',
					body: JSON.stringify({ filters } as ListBitcoinerRequest),
				}
			)

			if (!response.success) {
				throw new Error(response.error)
			}

			setBitcoiners(response.data.bitcoiners)
			setTotal(response.data.total)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [filters])

	const createBitcoiner = useCallback(
		async (data: CreateBitcoinerRequest) => {
			setLoading(true)
			setError(null)

			try {
				const response = await authenticatedApiRequest<{}>(
					'/api/bitcoiner/create',
					{
						method: 'POST',
						body: JSON.stringify(data),
					}
				)

				if (!response.success) {
					throw new Error(response.error)
				}

				await fetchBitcoiners()
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error')
				throw err
			} finally {
				setLoading(false)
			}
		},
		[fetchBitcoiners]
	)

	useEffect(() => {
		fetchBitcoiners()
	}, [fetchBitcoiners])

	return {
		bitcoiners,
		total,
		loading,
		error,
		fetchBitcoiners,
		createBitcoiner,
	}
}
