import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { UpdateOrganizer } from './service'

export async function POST(request: NextRequest) {
	// UpdateOrganizer
	// console.log('/api/organizer/update')
	try {
		const controller = await UpdateOrganizer.fromRequest(request)

		const result = await controller.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
