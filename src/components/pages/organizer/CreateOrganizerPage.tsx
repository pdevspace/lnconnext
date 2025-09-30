'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { OrganizerForm } from './OrganizerForm';
import { OrganizerFormData } from '@/types/organizer';
import { useOrganizers } from '@/hooks/useOrganizer';
import { ArrowLeft } from 'lucide-react';

export const CreateOrganizerPage: React.FC = () => {
  const router = useRouter();
  const { createOrganizer } = useOrganizers();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: OrganizerFormData) => {
    setIsLoading(true);
    
    try {
      const createdOrganizer = await createOrganizer(data);
      router.push(`/organizer/${createdOrganizer.id}`);
    } catch (error) {
      console.error('Error creating organizer:', error);
      alert('Failed to create organizer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/organizer');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header - follows established pattern */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organizers
            </Button>
            
            <div>
              <h1 className="text-xl font-semibold">Create New Organizer</h1>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content - with proper navbar clearance and scrollable content */}
      <div className="px-0 py-6 mt-[130px] w-full">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Add New Organizer</CardTitle>
                <CardDescription>
                  Create a new event organizer profile for the Bitcoin community.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <OrganizerForm
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isSubmitting={isLoading}
                  submitLabel="Create Organizer"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
