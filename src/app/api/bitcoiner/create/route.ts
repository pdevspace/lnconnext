import { createSuccessResponse, handleError } from '@/api'

import { NextRequest } from 'next/server'

import { CreateBitcoiner } from './service'

export async function POST(request: NextRequest) {
	// CreateBitcoiner
	console.log('/api/bitcoiner/create')
	try {
		const handler = await CreateBitcoiner.fromRequest(request)

		const result = await handler.toResult()

		return createSuccessResponse(result)
	} catch (error) {
		return handleError(error)
	}
}
