import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET() {
	return NextResponse.json({
		tag: 'payRequest',
		callback: 'https://lates.lightningok.win/lnurlp/api/v1/lnurl/cb/HEZLVv',
		minSendable: 1000,
		maxSendable: 1000000000,
		metadata:
			'[["text/plain", "Payment to lnconnext"], ["text/identifier", "lnconnext@lates.lightningok.win"]]',
	})
}
