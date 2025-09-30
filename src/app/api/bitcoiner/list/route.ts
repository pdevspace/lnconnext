import { NextRequest, NextResponse } from 'next/server';
import { BitcoinerService } from '@/service/BitcoinerService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters } = body;

    const bitcoiners = await BitcoinerService.getAllBitcoiners(filters);

    return NextResponse.json({
      success: true,
      data: bitcoiners,
      message: 'Bitcoiners retrieved successfully'
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