'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BitcoinerCard } from './BitcoinerCard';
import { BitcoinerFilters } from './BitcoinerFilters';
import { useBitcoiners } from '@/model/service/useBitcoiner';
import { Bitcoiner, BitcoinerFilters as FilterState } from '@/model/bitcoiner';
import { Plus, Share2 } from 'lucide-react';

export const BitcoinerListPage: React.FC = () => {
  const router = useRouter();
  const { bitcoiners, loading, error, fetchBitcoiners } = useBitcoiners();
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedPlatform: ''
  });

  const [filteredBitcoiners, setFilteredBitcoiners] = useState<Bitcoiner[]>([]);

  // Apply filters
  useEffect(() => {
    let filtered = [...bitcoiners];

    if (filters.searchTerm) {
      filtered = filtered.filter(bitcoiner =>
        bitcoiner.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.selectedPlatform) {
      filtered = filtered.filter(bitcoiner =>
        bitcoiner.socialMedia.some(social => social.platform === filters.selectedPlatform)
      );
    }

    setFilteredBitcoiners(filtered);
  }, [bitcoiners, filters]);

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const handlePlatformChange = (selectedPlatform: string) => {
    setFilters(prev => ({ ...prev, selectedPlatform }));
  };

  const handleClearFilters = () => {
    setFilters({ searchTerm: '', selectedPlatform: '' });
  };

  const handleEdit = (id: string) => {
    router.push(`/bitcoiner/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this bitcoiner?')) {
      try {
        const response = await fetch(`/api/bitcoiner/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Refresh the list
          fetchBitcoiners();
        } else {
          alert('Failed to delete bitcoiner');
        }
      } catch (error) {
        console.error('Error deleting bitcoiner:', error);
        alert('Failed to delete bitcoiner');
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">
                Something went wrong
              </h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => fetchBitcoiners()}>
                Try again
              </Button>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Bitcoiners</h1>
              <p className="text-muted-foreground">
                Discover and connect with Bitcoin community members
              </p>
            </div>
            <Button 
              onClick={() => router.push('/bitcoiner/create')}
              className="mt-4 sm:mt-0"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Bitcoiner
            </Button>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mt-6">
            <BitcoinerFilters
              searchTerm={filters.searchTerm}
              onSearchChange={handleSearchChange}
              selectedPlatform={filters.selectedPlatform}
              onPlatformChange={handlePlatformChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </div>

      {/* Main Content - with proper navbar clearance and scrollable content */}
      <div className="h-screen overflow-y-auto px-0 py-6 mt-[264px] w-full">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-48"></div>
                </div>
              ))}
            </div>
          )}

          {/* Bitcoiners Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBitcoiners.map(bitcoiner => (
                <BitcoinerCard 
                  key={bitcoiner.id} 
                  bitcoiner={bitcoiner}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showActions={true}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredBitcoiners.length === 0 && (
            <div className="text-center py-16">
              <Share2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {bitcoiners.length === 0 ? 'No bitcoiners yet' : 'No bitcoiners found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {bitcoiners.length === 0 
                  ? 'Get started by adding your first bitcoiner to the community.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {bitcoiners.length === 0 && (
                <Button onClick={() => router.push('/bitcoiner/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Bitcoiner
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
