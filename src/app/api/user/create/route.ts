import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { CreateUser } from './service'

export async function POST(request: NextRequest) {
	// CreateUser
	// console.log('/api/user/create')
	try {
		const controller = await CreateUser.fromRequest(request)

		const result = await controller.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
