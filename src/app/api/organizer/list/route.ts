import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { ListOrganizer } from './service'

export async function POST(request: NextRequest) {
	// ListOrganizer
	// console.log('/api/organizer/list')
	try {
		const controller = await ListOrganizer.fromRequest(request)

		const result = await controller.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
