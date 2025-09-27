import { NextRequest, NextResponse } from 'next/server';
import { bitcoinerSchema } from '@/model/validation/bitcoiner';
import { BitcoinerService } from '@/prisma/BitcoinerService';

interface UpdateRequest {
  id: string;
  name: string;
  socialMedia: Array<{
    id?: string;
    displayText: string;
    username: string;
    platform: string;
    urlLink: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdateRequest = await request.json();
    
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
    
    // Validate the request body (excluding id for validation)
    const { id, ...dataToValidate } = body;
    const validatedData = bitcoinerSchema.parse(dataToValidate);

    // Ensure all socialMedia items have an 'id' property of type string
    const fixedSocialMedia = validatedData.socialMedia.map((item) => ({
      ...item,
      id: item.id ?? '',
    }));

    const updatedBitcoiner = await BitcoinerService.updateBitcoiner(id, {
      ...validatedData,
      socialMedia: fixedSocialMedia,
    });

    if (!updatedBitcoiner) {
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
      data: updatedBitcoiner,
      message: 'Bitcoiner updated successfully'
    });
  } catch (error) {
    console.error('Error updating bitcoiner:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.message
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update bitcoiner',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
