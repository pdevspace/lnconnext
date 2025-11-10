import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { UpdateOrganizer } from './service'

export async function POST(request: NextRequest) {
	// UpdateOrganizer
	console.log('/api/organizer/update')
	try {
		const handler = await UpdateOrganizer.fromRequest(request)

		const result = await handler.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
