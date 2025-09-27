import { NextRequest, NextResponse } from 'next/server';
import { bitcoinerSchema } from '@/model/validation/bitcoiner';
import { BitcoinerService } from '@/prisma/BitcoinerService';

interface CreateRequest {
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
    const body: CreateRequest = await request.json();
    
    // Validate the request body
    const validatedData = bitcoinerSchema.parse(body);

    // Ensure all socialMedia items have an 'id' property of type string
    const fixedSocialMedia = validatedData.socialMedia.map((item, idx) => ({
      ...item,
      id: typeof item.id === 'string' ? item.id : `${idx}-${Date.now()}`
    }));

    const fixedValidatedData = {
      ...validatedData,
      socialMedia: fixedSocialMedia
    };

    const newBitcoiner = await BitcoinerService.createBitcoiner(fixedValidatedData);
    
    return NextResponse.json({
      success: true,
      data: newBitcoiner,
      message: 'Bitcoiner created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating bitcoiner:', error);
    
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
        error: 'Failed to create bitcoiner',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
