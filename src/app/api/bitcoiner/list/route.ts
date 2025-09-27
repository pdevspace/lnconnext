import { NextRequest, NextResponse } from 'next/server';
import { BitcoinerService } from '@/prisma/BitcoinerService';

interface ListRequest {
  search?: string;
  platform?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ListRequest = await request.json();
    
    const bitcoiners = await BitcoinerService.getAllBitcoiners({
      search: body.search,
      platform: body.platform
    });
    
    return NextResponse.json({
      success: true,
      data: bitcoiners,
      message: `Found ${bitcoiners.length} bitcoiners`
    });
  } catch (error) {
    console.error('Error listing bitcoiners:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bitcoiners',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
