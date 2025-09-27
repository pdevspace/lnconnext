import { NextRequest, NextResponse } from 'next/server';
import { BitcoinerService } from '@/prisma/BitcoinerService';

interface GetRequest {
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GetRequest = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID is required',
          message: 'Please provide a valid bitcoiner ID'
        },
        { status: 400 }
      );
    }
    
    const bitcoiner = await BitcoinerService.getBitcoinerById(body.id);
    
    if (!bitcoiner) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bitcoiner not found',
          message: 'No bitcoiner found with the provided ID'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: bitcoiner,
      message: 'Bitcoiner retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting bitcoiner:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bitcoiner',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
