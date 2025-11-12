import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { UpdateBitcoiner } from './service'

export async function POST(request: NextRequest) {
	// UpdateBitcoiner
	// console.log('/api/bitcoiner/update')
	try {
		const controller = await UpdateBitcoiner.fromRequest(request)

		const result = await controller.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
