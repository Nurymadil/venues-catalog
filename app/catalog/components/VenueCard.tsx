'use client';

import { useState, useEffect } from 'react';
import { Venue } from '../types';
import { getPriceUnits } from '../utils';

interface VenueCardProps {
  venue: Venue;
  onToggleFavorite: (venueId: string) => void;
}

export default function VenueCard({ venue, onToggleFavorite }: VenueCardProps) {
  const [isFavorite, setIsFavorite] = useState(venue.isFavorite || false);
  const [isAnimating, setIsAnimating] = useState(false);
  const priceUnits = getPriceUnits();
  const priceUnitLabel = priceUnits[venue.price_unit] || venue.price_unit;

  // Update local favorite state when prop changes
  useEffect(() => {
    setIsFavorite(venue.isFavorite || false);
  }, [venue.isFavorite]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    setIsFavorite(!isFavorite);
    onToggleFavorite(venue.id);
    
    // Reset animation state after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative top-0 hover:top-[-4px]">
      {/* Venue Image */}
      <div className="relative h-48 bg-gray-200">
        {venue.imageUrl ? (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center transition-all duration-300 hover:opacity-90">
            <span className="text-gray-500">Venue Image</span>
          </div>
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center transition-all duration-300 hover:opacity-90">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <svg
              className={`w-5 h-5 text-red-500 transition-all duration-200 ${isAnimating ? 'animate-pulse' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className={`w-5 h-5 text-gray-400 transition-all duration-200 ${isAnimating ? 'animate-pulse' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
        </button>
      </div>
      
      {/* Venue Details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{venue.title}</h3>
        </div>
        
        <p className="text-gray-600 text-sm mt-1">
          {venue.city}, {venue.country}
        </p>
        
        <div className="mt-3">
          <p className="text-lg font-bold text-gray-900">
            ${venue.price_min} - ${venue.price_max}
            <span className="text-sm font-normal text-gray-600"> / {priceUnitLabel}</span>
          </p>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Capacity: {venue.capacity_min} - {venue.capacity_max} guests
          </p>
        </div>
        
        {/* Amenities */}
        {venue.amenities && venue.amenities.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {venue.amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 transition-all duration-200 hover:bg-blue-200"
                >
                  {amenity.name}
                </span>
              ))}
              {venue.amenities.length > 4 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 transition-all duration-200 hover:bg-gray-200">
                  +{venue.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}