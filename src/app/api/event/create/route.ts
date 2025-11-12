import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { CreateEvent } from './service'

export async function POST(request: NextRequest) {
	// CreateEvent
	// console.log('/api/event/create')
	try {
		const controller = await CreateEvent.fromRequest(request)

		const result = await controller.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
