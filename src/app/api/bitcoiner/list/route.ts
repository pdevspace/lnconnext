import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { ListBitcoiner } from './service'

export async function POST(request: NextRequest) {
	// ListBitcoiner
	// console.log('/api/bitcoiner/list')
	try {
		const controller = await ListBitcoiner.fromRequest(request)

		const result = await controller.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
