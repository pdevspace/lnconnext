import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { DeleteBitcoiner } from './service'

export async function POST(request: NextRequest) {
	// DeleteBitcoiner
	// console.log('/api/bitcoiner/delete')
	try {
		const controller = await DeleteBitcoiner.fromRequest(request)

		const result = await controller.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
