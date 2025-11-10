import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { DeleteOrganizer } from './service'

export async function POST(request: NextRequest) {
	// DeleteOrganizer
	console.log('/api/organizer/delete')
	try {
		const handler = await DeleteOrganizer.fromRequest(request)

		const result = await handler.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
