/**
 * Backend Validation Utilities
 * 
 * This file contains validation functions for backend API routes.
 * These functions provide server-side validation for API requests
 * and ensure data integrity at the server level.
 */

import { BitcoinerFormData, SocialMediaData } from '@/models/bitcoiner';

// Type definitions for backend validation
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ApiValidationResult {
  success: boolean;
  data?: any;
  errors?: Record<string, string>;
  message?: string;
}

/**
 * Validates if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates social media platform
 */
export const isValidPlatform = (platform: string): boolean => {
  const validPlatforms = ['facebook', 'youtube', 'twitter', 'linkedin', 'instagram'];
  return validPlatforms.includes(platform.toLowerCase());
};

/**
 * Sanitizes text input by trimming whitespace
 */
export const sanitizeText = (text: string): string => {
  return text.trim();
};

/**
 * Sanitizes URL by ensuring it has proper protocol
 */
export const sanitizeUrl = (url: string): string => {
  const trimmed = url.trim();
  if (trimmed && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

/**
 * Validates social media data for API requests
 */
export const validateSocialMediaApi = (social: SocialMediaData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!social.displayText || !social.displayText.trim()) {
    errors.displayText = 'Display text is required';
  } else if (social.displayText.length > 200) {
    errors.displayText = 'Display text too long (max 200 characters)';
  }

  if (!social.username || !social.username.trim()) {
    errors.username = 'Username is required';
  } else if (social.username.length > 100) {
    errors.username = 'Username too long (max 100 characters)';
  }

  if (!social.platform || !social.platform.trim()) {
    errors.platform = 'Platform is required';
  } else if (!isValidPlatform(social.platform)) {
    errors.platform = 'Invalid platform';
  }

  if (!social.urlLink || !social.urlLink.trim()) {
    errors.urlLink = 'URL is required';
  } else if (!isValidUrl(social.urlLink)) {
    errors.urlLink = 'Invalid URL format';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates bitcoiner data for API requests
 */
export const validateBitcoinerApi = (data: BitcoinerFormData): ApiValidationResult => {
  const errors: Record<string, string> = {};

  // Validate name
  if (!data.name || !data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Name too long (max 100 characters)';
  }

  // Validate social media array
  if (!Array.isArray(data.socialMedia)) {
    errors.socialMedia = 'Social media must be an array';
  } else {
    data.socialMedia.forEach((social, index) => {
      const socialValidation = validateSocialMediaApi(social);
      if (!socialValidation.isValid) {
        Object.entries(socialValidation.errors).forEach(([field, error]) => {
          errors[`socialMedia.${index}.${field}`] = error;
        });
      }
    });
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: 'Validation failed'
    };
  }

  return {
    success: true,
    data: {
      name: sanitizeText(data.name),
      socialMedia: data.socialMedia.map(social => ({
        ...social,
        displayText: sanitizeText(social.displayText),
        username: sanitizeText(social.username),
        urlLink: sanitizeUrl(social.urlLink)
      }))
    }
  };
};

/**
 * Validates API request body structure (generic)
 */
export const validateApiRequest = (body: any): ApiValidationResult => {
  if (!body || typeof body !== 'object') {
    return {
      success: false,
      errors: { body: 'Request body must be an object' },
      message: 'Invalid request body'
    };
  }

  return {
    success: true,
    data: body
  };
};

/**
 * Validates bitcoiner-specific API request body structure
 */
export const validateBitcoinerApiRequest = (body: any): ApiValidationResult => {
  if (!body || typeof body !== 'object') {
    return {
      success: false,
      errors: { body: 'Request body must be an object' },
      message: 'Invalid request body'
    };
  }

  // Check required fields for bitcoiner
  if (!body.name) {
    return {
      success: false,
      errors: { name: 'Name is required' },
      message: 'Missing required field: name'
    };
  }

  if (!body.socialMedia) {
    return {
      success: false,
      errors: { socialMedia: 'Social media is required' },
      message: 'Missing required field: socialMedia'
    };
  }

  return validateBitcoinerApi(body as BitcoinerFormData);
};
