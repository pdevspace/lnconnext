/**
 * Frontend Validation Utilities
 * 
 * This file contains validation helper functions for frontend forms.
 * These are lightweight validation functions that run on the client side
 * for real-time form validation and user feedback.
 */

import { BitcoinerFormData, SocialMediaData } from '@/types/bitcoiner';

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
 * Validates if a string is not empty and within length limits
 */
export const isValidText = (text: string, minLength: number = 1, maxLength: number = 100): boolean => {
  return text.trim().length >= minLength && text.trim().length <= maxLength;
};

/**
 * Validates social media platform
 */
export const isValidPlatform = (platform: string): boolean => {
  const validPlatforms = ['facebook', 'youtube', 'twitter', 'linkedin', 'instagram'];
  return validPlatforms.includes(platform.toLowerCase());
};

/**
 * Validates bitcoiner name
 */
export const validateBitcoinerName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  if (name.length > 100) {
    return { isValid: false, error: 'Name too long (max 100 characters)' };
  }
  return { isValid: true };
};

/**
 * Validates social media link
 */
export const validateSocialMediaLink = (social: SocialMediaData): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!social.displayText.trim()) {
    errors.displayText = 'Display text is required';
  }

  if (!social.username.trim()) {
    errors.username = 'Username is required';
  }

  if (!social.platform.trim()) {
    errors.platform = 'Platform is required';
  } else if (!isValidPlatform(social.platform)) {
    errors.platform = 'Invalid platform';
  }

  if (!social.urlLink.trim()) {
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
 * Validates entire bitcoiner form data
 */
export const validateBitcoinerForm = (formData: BitcoinerFormData): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate name
  const nameValidation = validateBitcoinerName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }

  // Validate social media links
  formData.socialMedia.forEach((social, index) => {
    const socialValidation = validateSocialMediaLink(social);
    if (!socialValidation.isValid) {
      Object.entries(socialValidation.errors).forEach(([field, error]) => {
        errors[`social-${index}-${field}`] = error;
      });
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
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
 * Validates organizer form data
 */
export function validateOrganizerForm(data: any): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (data.name.length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }

  if (data.bio && data.bio.length > 500) {
    errors.bio = 'Bio must be less than 500 characters';
  }

  if (data.website && !isValidUrl(data.website)) {
    errors.website = 'Please enter a valid URL';
  }

  if (data.avatar && !isValidUrl(data.avatar)) {
    errors.avatar = 'Please enter a valid URL';
  }

  return errors;
}
