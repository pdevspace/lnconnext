import { NextRequest, NextResponse } from 'next/server';
import { validateApiRequest } from '@/utils/backendValidators';
import { BitcoinerService } from '@/service/BitcoinerService';

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
    const validation = validateApiRequest(dataToValidate);

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

    const updatedBitcoiner = await BitcoinerService.updateBitcoiner(id, {
      ...validation.data!,
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