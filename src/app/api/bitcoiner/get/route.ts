import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { GetBitcoiner } from './service'

export async function POST(request: NextRequest) {
	// GetBitcoiner
	// console.log('/api/bitcoiner/get')
	try {
		const controller = await GetBitcoiner.fromRequest(request)

		const result = await controller.toResult()

		const response = createSuccessResponse(result)

		// Add caching headers for client-side requests
		// Cache for 60 seconds, allow stale-while-revalidate for better performance
		response.headers.set(
			'Cache-Control',
			'public, s-maxage=60, stale-while-revalidate=120'
		)

		return response
	} catch (error) {
		return handleError(error)
	}
}
