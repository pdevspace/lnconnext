'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Plus, Building2 } from 'lucide-react';
import { OrganizerFilters } from '@/types/organizer';
import { useOrganizers } from '@/hooks/useOrganizer';
import { OrganizerCard } from './OrganizerCard';

export function OrganizerListPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<OrganizerFilters>({
    search: '',
    isActive: true,
    limit: 50
  });

  const { organizers, loading, error, refetch } = useOrganizers(filters);

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ 
      ...prev, 
      isActive: status === 'all' ? undefined : status === 'active'
    }));
  };

  const handleHasEventsFilter = (hasEvents: string) => {
    setFilters(prev => ({ 
      ...prev, 
      hasEvents: hasEvents === 'all' ? undefined : hasEvents === 'yes'
    }));
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="h-screen overflow-y-auto bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">
                Something went wrong
              </h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-background">
      {/* Fixed Header - follows established pattern */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Event Organizers</h1>
              <p className="text-muted-foreground">
                Discover and connect with event organizers in the Bitcoin community
              </p>
            </div>
            <Button 
              onClick={() => router.push('/organizer/create')}
              className="mt-4 sm:mt-0"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Organizer
            </Button>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search organizers..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.hasEvents === undefined ? 'all' : filters.hasEvents ? 'yes' : 'no'} onValueChange={handleHasEventsFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Has Events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizers</SelectItem>
                  <SelectItem value="yes">With Events</SelectItem>
                  <SelectItem value="no">Without Events</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground flex items-center">
                {organizers.length} organizer{organizers.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - with proper navbar clearance and scrollable content */}
      <div className="px-0 py-6 mt-[264px] w-full">
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

          {/* Organizers Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {organizers.map(organizer => (
                <OrganizerCard 
                  key={organizer.id} 
                  organizer={organizer}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && organizers.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {organizers.length === 0 ? 'No organizers yet' : 'No organizers found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {organizers.length === 0 
                  ? 'Get started by adding your first organizer to the community.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {organizers.length === 0 && (
                <Button onClick={() => router.push('/organizer/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Organizer
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}