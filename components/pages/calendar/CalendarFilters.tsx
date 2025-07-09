"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUniqueCategories, getUniqueLocations } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";
import { CalendarEvent, FilterState } from "@/types/calendar";
import {
  Calendar,
  Clock,
  Filter,
  Heart,
  MapPin,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";

interface CalendarFiltersProps {
  events: CalendarEvent[];
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

const statusOptions: {
  value: CalendarEvent["userStatus"];
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "available", label: "Available", icon: Star },
  { value: "going", label: "Going", icon: Heart },
  { value: "maybe", label: "Maybe", icon: Clock },
  { value: "blocked", label: "Blocked", icon: Clock },
];

export default function CalendarFilters({
  events,
  onFiltersChange,
  className,
}: CalendarFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    locations: [],
    statuses: [],
  });

  const [showFilters, setShowFilters] = useState(false);

  const categories = getUniqueCategories(events);
  const locations = getUniqueLocations(events);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];

    handleFilterChange({ categories: newCategories });
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location];

    handleFilterChange({ locations: newLocations });
  };

  const handleStatusToggle = (status: CalendarEvent["userStatus"]) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];

    handleFilterChange({ statuses: newStatuses });
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      categories: [],
      locations: [],
      statuses: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.categories.length > 0 ||
    filters.locations.length > 0 ||
    filters.statuses.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar and Filter Button Row */}
      <div className="flex items-center gap-2 w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="default" className="ml-1 h-5 w-5 p-0 text-xs">
              {filters.categories.length +
                filters.locations.length +
                filters.statuses.length}
            </Badge>
          )}
        </Button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, speakers, or locations..."
            value={filters.search}
            onChange={e => handleFilterChange({ search: e.target.value })}
            className="pl-10 pr-4 w-full"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange({ search: "" })}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          {/* Categories */}
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={
                    filters.categories.includes(category)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Locations
            </h4>
            <div className="flex flex-wrap gap-2">
              {locations.map(location => (
                <Badge
                  key={location}
                  variant={
                    filters.locations.includes(location) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => handleLocationToggle(location)}
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              My Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(({ value, label, icon: Icon }) => (
                <Badge
                  key={value}
                  variant={
                    filters.statuses.includes(value) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/10 transition-colors flex items-center gap-1"
                  onClick={() => handleStatusToggle(value)}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map(category => (
            <Badge
              key={`cat-${category}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              Category: {category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleCategoryToggle(category)}
              />
            </Badge>
          ))}

          {filters.locations.map(location => (
            <Badge
              key={`loc-${location}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              Location: {location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleLocationToggle(location)}
              />
            </Badge>
          ))}

          {filters.statuses.map(status => (
            <Badge
              key={`status-${status}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              Status: {statusOptions.find(s => s.value === status)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  handleStatusToggle(status as CalendarEvent["userStatus"])
                }
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
