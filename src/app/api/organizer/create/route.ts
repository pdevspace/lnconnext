import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { CreateOrganizer } from './service'

export async function POST(request: NextRequest) {
	// CreateOrganizer
	console.log('/api/organizer/create')
	try {
		const handler = await CreateOrganizer.fromRequest(request)

		const result = await handler.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
