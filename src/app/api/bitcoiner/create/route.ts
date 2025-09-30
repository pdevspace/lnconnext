import { NextRequest, NextResponse } from 'next/server';
import { validateBitcoinerApiRequest } from '@/utils/backendValidators';
import { BitcoinerService } from '@/services/BitcoinerService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body using custom validators
    const validation = validateBitcoinerApiRequest(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: validation.message,
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    // Ensure all socialMedia items have an 'id' property
    const fixedSocialMedia = validation.data!.socialMedia.map((item: any, idx: number) => ({
      ...item,
      id: item.id || `${idx}-${Date.now()}`
    }));

    const finalData = {
      ...validation.data!,
      socialMedia: fixedSocialMedia
    };

    const newBitcoiner = await BitcoinerService.createBitcoiner(finalData);

    return NextResponse.json({
      success: true,
      data: newBitcoiner,
      message: 'Bitcoiner created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating bitcoiner:', error);

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