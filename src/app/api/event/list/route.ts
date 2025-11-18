import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { ListEvent } from './service'

export async function POST(request: NextRequest) {
	// ListEvent
	// console.log('/api/event/list')
	try {
		const controller = await ListEvent.fromRequest(request)

		const result = await controller.toResult()

		const response = createSuccessResponse(result)

		// Add caching headers for client-side requests
		// Cache for 30 seconds (shorter for list since it changes more frequently)
		// Allow stale-while-revalidate for better performance
		response.headers.set(
			'Cache-Control',
			'public, s-maxage=30, stale-while-revalidate=60'
		)

		return response
	} catch (error) {
		return handleError(error)
	}
}
