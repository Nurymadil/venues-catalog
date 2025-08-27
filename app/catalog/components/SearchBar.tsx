'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  onCityFilter: (city: string) => void;
  searchTerm: string;
  city: string;
}

export default function SearchBar({ onSearch, onCityFilter, searchTerm, city }: SearchBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localCity, setLocalCity] = useState(city);
  
  // Refs to track if the change was from user input or from props
  const isSearchTermChangedRef = useRef(false);
  const isCityChangedRef = useRef(false);

  // Update local state when props change, but only if it wasn't from user input
  useEffect(() => {
    if (!isSearchTermChangedRef.current) {
      setLocalSearchTerm(searchTerm);
    }
    isSearchTermChangedRef.current = false;
  }, [searchTerm]);

  useEffect(() => {
    if (!isCityChangedRef.current) {
      setLocalCity(city);
    }
    isCityChangedRef.current = false;
  }, [city]);

  // Debounce search term
  const handleSearchChange = (newSearchTerm: string) => {
    setLocalSearchTerm(newSearchTerm);
    // The actual search will be triggered by the useEffect below
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        isSearchTermChangedRef.current = true;
        onSearch(localSearchTerm);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, searchTerm, onSearch]);

  // Handle city filter immediately
  const handleCityChange = (newCity: string) => {
    setLocalCity(newCity);
    if (newCity !== city) {
      isCityChangedRef.current = true;
      onCityFilter(newCity);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="animate-fade-in-slide-up">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by name
          </label>
          <input
            type="text"
            id="search"
            placeholder="Venue name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 text-gray-900"
            value={localSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="animate-fade-in-slide-up">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by city
          </label>
          <input
            type="text"
            id="city"
            placeholder="City..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-300 text-gray-900"
            value={localCity}
            onChange={(e) => handleCityChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}