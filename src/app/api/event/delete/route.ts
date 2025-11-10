import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { DeleteEvent } from './service'

export async function POST(request: NextRequest) {
	// DeleteEvent
	console.log('/api/event/delete')
	try {
		const handler = await DeleteEvent.fromRequest(request)

		const result = await handler.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}

