import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { UpdateEvent } from './service'

export async function POST(request: NextRequest) {
	// UpdateEvent
	console.log('/api/event/update')
	try {
		const handler = await UpdateEvent.fromRequest(request)

		const result = await handler.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}

