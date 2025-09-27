import { NextRequest, NextResponse } from 'next/server';
import { BitcoinerService } from '@/prisma/BitcoinerService';

interface DeleteRequest {
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DeleteRequest = await request.json();
    
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
    
    const success = await BitcoinerService.deleteBitcoiner(body.id);
    
    if (!success) {
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
      data: { deleted: true },
      message: 'Bitcoiner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bitcoiner:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete bitcoiner',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
