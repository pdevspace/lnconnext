'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bitcoiner, SocialMedia, BitcoinerFormData } from '@/model/bitcoiner';
import { Plus, Trash2, Share2, Loader2 } from 'lucide-react';

interface BitcoinerFormProps {
  bitcoiner?: Bitcoiner;
  onSubmit: (data: BitcoinerFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const BitcoinerForm: React.FC<BitcoinerFormProps> = ({ 
  bitcoiner, 
  onSubmit, 
  onCancel, 
  isLoading 
}) => {
  const [formData, setFormData] = useState<BitcoinerFormData>({
    name: bitcoiner?.name || '',
    socialMedia: bitcoiner?.socialMedia || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addSocialMedia = () => {
    setFormData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, {
        id: `temp-${Date.now()}`,
        displayText: '',
        username: '',
        platform: 'facebook',
        urlLink: ''
      }]
    }));
  };

  const updateSocialMedia = (index: number, field: keyof SocialMedia, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map((social, i) => 
        i === index ? { ...social, [field]: value } : social
      )
    }));
  };

  const removeSocialMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate social media links
    formData.socialMedia.forEach((social, index) => {
      if (!social.displayText.trim()) {
        newErrors[`social-${index}-displayText`] = 'Display text is required';
      }
      if (!social.username.trim()) {
        newErrors[`social-${index}-username`] = 'Username is required';
      }
      if (!social.urlLink.trim()) {
        newErrors[`social-${index}-urlLink`] = 'URL is required';
      } else if (!isValidUrl(social.urlLink)) {
        newErrors[`social-${index}-urlLink`] = 'Invalid URL format';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <Label htmlFor="name" className="text-sm font-medium">
          Name *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Enter bitcoiner name"
          required
          className="mt-1"
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name}</p>
        )}
      </div>

      {/* Social Media Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Social Media Links</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSocialMedia}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        <div className="space-y-4">
          {formData.socialMedia.map((social, index) => (
            <Card key={social.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`platform-${index}`} className="text-xs">
                    Platform
                  </Label>
                  <Select
                    value={social.platform}
                    onValueChange={(value) => updateSocialMedia(index, 'platform', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`username-${index}`} className="text-xs">
                    Username
                  </Label>
                  <Input
                    id={`username-${index}`}
                    value={social.username}
                    onChange={(e) => updateSocialMedia(index, 'username', e.target.value)}
                    placeholder="Enter username"
                    className="mt-1"
                  />
                  {errors[`social-${index}-username`] && (
                    <p className="text-xs text-destructive mt-1">{errors[`social-${index}-username`]}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`displayText-${index}`} className="text-xs">
                    Display Text
                  </Label>
                  <Input
                    id={`displayText-${index}`}
                    value={social.displayText}
                    onChange={(e) => updateSocialMedia(index, 'displayText', e.target.value)}
                    placeholder="e.g., เพจ BLC Chiang Mai"
                    className="mt-1"
                  />
                  {errors[`social-${index}-displayText`] && (
                    <p className="text-xs text-destructive mt-1">{errors[`social-${index}-displayText`]}</p>
                  )}
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`urlLink-${index}`} className="text-xs">
                      URL
                    </Label>
                    <Input
                      id={`urlLink-${index}`}
                      value={social.urlLink}
                      onChange={(e) => updateSocialMedia(index, 'urlLink', e.target.value)}
                      placeholder="https://..."
                      className="mt-1"
                    />
                    {errors[`social-${index}-urlLink`] && (
                      <p className="text-xs text-destructive mt-1">{errors[`social-${index}-urlLink`]}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSocialMedia(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {formData.socialMedia.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <Share2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No social media links added yet</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialMedia}
                className="mt-2"
              >
                Add First Link
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !formData.name.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {bitcoiner ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            bitcoiner ? 'Update Bitcoiner' : 'Create Bitcoiner'
          )}
        </Button>
      </div>
    </form>
  );
};
