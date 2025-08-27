'use client';

import { useState } from 'react';
import { Amenity } from '../types';
import { getGuestCountRanges } from '../utils';

interface FilterPanelProps {
  amenities: Amenity[];
  onGuestCountFilter: (ranges: string[]) => void;
  onPriceRangeFilter: (min: number | null, max: number | null) => void;
  onAmenitiesFilter: (amenityId: string) => void;
  selectedGuestCount: string[];
  selectedAmenities: string[];
  minPrice: number | null;
  maxPrice: number | null;
}

export default function FilterPanel({
  amenities,
  onGuestCountFilter,
  onPriceRangeFilter,
  onAmenitiesFilter,
  selectedGuestCount,
  selectedAmenities,
  minPrice,
  maxPrice
}: FilterPanelProps) {
  const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice?.toString() || '');

  const handlePriceChange = () => {
    const min = localMinPrice ? Number(localMinPrice) : null;
    const max = localMaxPrice ? Number(localMaxPrice) : null;
    onPriceRangeFilter(min, max);
  };

  const guestCountRanges = getGuestCountRanges();

  // Handle guest count filter (multiple selection)
  const handleGuestCountFilter = (rangeValue: string) => {
    const isSelected = selectedGuestCount.includes(rangeValue);
    let newSelectedGuestCount: string[];
    
    if (isSelected) {
      // Remove from selection
      newSelectedGuestCount = selectedGuestCount.filter(item => item !== rangeValue);
    } else {
      // Add to selection
      newSelectedGuestCount = [...selectedGuestCount, rangeValue];
    }
    
    // Call the parent handler with the updated array
    onGuestCountFilter(newSelectedGuestCount);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Filters</h2>
      
      {/* Guest Count Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Guests</h3>
        <div className="space-y-2">
          {guestCountRanges.map((range) => (
            <div key={range.value} className="flex items-center animate-fade-in-slide-up">
              <input
                id={`guests-${range.value}`}
                name="guests"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200 hover:scale-110"
                checked={selectedGuestCount.includes(range.value)}
                onChange={() => handleGuestCountFilter(range.value)}
              />
              <label
                htmlFor={`guests-${range.value}`}
                className="ml-3 text-sm text-gray-700 transition-all duration-200 hover:text-gray-900"
              >
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="animate-fade-in-slide-up">
            <label htmlFor="min-price" className="block text-sm text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              id="min-price"
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 text-gray-900"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              onBlur={handlePriceChange}
            />
          </div>
          <div className="animate-fade-in-slide-up">
            <label htmlFor="max-price" className="block text-sm text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              id="max-price"
              placeholder="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 text-gray-900"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              onBlur={handlePriceChange}
            />
          </div>
        </div>
      </div>
      
      {/* Amenities Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Amenities</h3>
        <div className="space-y-2">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center animate-fade-in-slide-up">
              <input
                id={`amenity-${amenity.id}`}
                name="amenities"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200 hover:scale-110"
                checked={selectedAmenities.includes(amenity.id)}
                onChange={() => onAmenitiesFilter(amenity.id)}
              />
              <label
                htmlFor={`amenity-${amenity.id}`}
                className="ml-3 text-sm text-gray-700 transition-all duration-200 hover:text-gray-900"
              >
                {amenity.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}