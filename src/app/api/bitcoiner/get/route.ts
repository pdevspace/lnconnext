import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { GetBitcoiner } from './service'

export async function POST(request: NextRequest) {
	// GetBitcoiner
	// console.log('/api/bitcoiner/get')
	try {
		const controller = await GetBitcoiner.fromRequest(request)

		const result = await controller.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
