'use client'

import {
	CreateOrganizerRequest,
	DeleteOrganizerRequest,
	GetOrganizerRequest,
	ListOrganizerItem,
	ListOrganizerRequest,
	ListOrganizerResponse,
	Organizer,
	UpdateOrganizerRequest,
} from '@/types'
import { apiRequest, authenticatedApiRequest } from '@/utils/api'

import { useCallback, useEffect, useState } from 'react'

// Single Organizer Hook
export function useOrganizer(id?: string) {
	const [organizer, setOrganizer] = useState<Organizer | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchOrganizer = useCallback(async () => {
		if (!id) return

		setLoading(true)
		setError(null)

		try {
			const response = await apiRequest<Organizer>('/api/organizer/get', {
				method: 'POST',
				body: JSON.stringify({ id } as GetOrganizerRequest),
			})

			if (!response.success) {
				throw new Error(response.error)
			}

			setOrganizer(response.data)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [id])

	const updateOrganizer = useCallback(
		async (data: Omit<UpdateOrganizerRequest, 'id'>) => {
			if (!id) return

			setLoading(true)
			setError(null)

			try {
				const response = await authenticatedApiRequest<{}>(
					'/api/organizer/update',
					{
						method: 'POST',
						body: JSON.stringify({ id, ...data } as UpdateOrganizerRequest),
					}
				)

				if (!response.success) {
					throw new Error(response.error)
				}

				await fetchOrganizer()
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error')
				throw err
			} finally {
				setLoading(false)
			}
		},
		[id, fetchOrganizer]
	)

	const deleteOrganizer = useCallback(async () => {
		if (!id) return

		setLoading(true)
		setError(null)

		try {
			const response = await authenticatedApiRequest<{}>(
				'/api/organizer/delete',
				{
					method: 'POST',
					body: JSON.stringify({ id } as DeleteOrganizerRequest),
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
		fetchOrganizer()
	}, [fetchOrganizer])

	return {
		organizer,
		loading,
		error,
		updateOrganizer,
		deleteOrganizer,
		refetch: fetchOrganizer,
	}
}

// Multiple Organizers Hook
export function useOrganizers(filters?: ListOrganizerRequest['filters']) {
	const [organizers, setOrganizers] = useState<ListOrganizerItem[]>([])
	const [total, setTotal] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchOrganizers = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const response = await apiRequest<ListOrganizerResponse>(
				'/api/organizer/list',
				{
					method: 'POST',
					body: JSON.stringify({ filters } as ListOrganizerRequest),
				}
			)

			if (!response.success) {
				throw new Error(response.error)
			}

			setOrganizers(response.data.organizers)
			setTotal(response.data.total)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [filters])

	const createOrganizer = useCallback(
		async (data: CreateOrganizerRequest) => {
			setLoading(true)
			setError(null)

			try {
				const response = await authenticatedApiRequest<{}>(
					'/api/organizer/create',
					{
						method: 'POST',
						body: JSON.stringify(data),
					}
				)

				if (!response.success) {
					throw new Error(response.error)
				}

				await fetchOrganizers()
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error')
				throw err
			} finally {
				setLoading(false)
			}
		},
		[fetchOrganizers]
	)

	useEffect(() => {
		fetchOrganizers()
	}, [fetchOrganizers])

	return {
		organizers,
		total,
		loading,
		error,
		fetchOrganizers,
		createOrganizer,
	}
}
