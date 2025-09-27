'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BitcoinerForm } from './BitcoinerForm';
import { useBitcoiner } from '@/model/service/useBitcoiner';
import { BitcoinerFormData } from '@/model/bitcoiner';
import { ArrowLeft } from 'lucide-react';

interface EditBitcoinerPageProps {
  bitcoinerId: string;
}

export const EditBitcoinerPage: React.FC<EditBitcoinerPageProps> = ({ bitcoinerId }) => {
  const router = useRouter();
  const { bitcoiner, loading, error, updateBitcoiner } = useBitcoiner(bitcoinerId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: BitcoinerFormData) => {
    setIsSubmitting(true);
    
    try {
      await updateBitcoiner(data);
      router.push(`/bitcoiner/${bitcoinerId}`);
    } catch (error) {
      console.error('Error updating bitcoiner:', error);
      alert('Failed to update bitcoiner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/bitcoiner/${bitcoinerId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-32 mb-6"></div>
              <div className="h-8 bg-muted rounded w-64 mb-2"></div>
              <div className="h-4 bg-muted rounded w-96 mb-8"></div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-destructive mb-4">
                  Something went wrong
                </h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => router.push('/bitcoiner')}>
                  Back to Bitcoiners
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bitcoiner) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Bitcoiner not found
                </h2>
                <p className="text-muted-foreground mb-4">
                  The bitcoiner you're trying to edit doesn't exist or has been removed.
                </p>
                <Button onClick={() => router.push('/bitcoiner')}>
                  Back to Bitcoiners
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Back to Profile
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-foreground">Edit Bitcoiner</h1>
              <p className="text-sm text-muted-foreground">
                Update {bitcoiner.name}'s information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - with proper navbar clearance and scrollable content */}
      <div className="h-screen overflow-y-auto px-0 py-6 mt-[130px] w-full">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Form */}
            <Card>
              <CardContent className="p-6">
                <BitcoinerForm 
                  bitcoiner={bitcoiner}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isLoading={isSubmitting}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
