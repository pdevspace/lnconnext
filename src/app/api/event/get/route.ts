import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { GetEvent } from './service'

export async function POST(request: NextRequest) {
	// GetEvent
	console.log('/api/event/get')
	try {
		const handler = await GetEvent.fromRequest(request)

		const result = await handler.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
