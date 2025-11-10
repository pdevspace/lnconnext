import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { ListEvent } from './service'

export async function POST(request: NextRequest) {
	// ListEvent
	console.log('/api/event/list')
	try {
		const handler = await ListEvent.fromRequest(request)

		const result = await handler.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
