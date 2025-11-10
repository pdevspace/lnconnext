import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { GetOrganizer } from './service'

export async function POST(request: NextRequest) {
	// GetOrganizer
	console.log('/api/organizer/get')
	try {
		const handler = await GetOrganizer.fromRequest(request)

		const result = await handler.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
