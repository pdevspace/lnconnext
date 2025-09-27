import { z } from 'zod';

export const socialMediaSchema = z.object({
  id: z.string().optional(), // Will be generated if not provided
  displayText: z.string().min(1, 'Display text is required'),
  username: z.string().min(1, 'Username is required'),
  platform: z.string().min(1, 'Platform is required'),
  urlLink: z.string().url('Invalid URL'),
});

export const bitcoinerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  socialMedia: z.array(socialMediaSchema).default([]),
});

export type BitcoinerFormData = z.infer<typeof bitcoinerSchema>;
export type SocialMediaFormData = z.infer<typeof socialMediaSchema>;
