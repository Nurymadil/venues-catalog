'use client';

import { useState, useEffect, useMemo } from 'react';
import { Venue } from '../types';
import VenueCard from './VenueCard';
import SkeletonCard from './SkeletonCard';

interface VenueGridProps {
  venues: Venue[];
  onToggleFavorite: (venueId: string) => void;
  loading?: boolean;
}

export default function VenueGrid({ venues, onToggleFavorite, loading }: VenueGridProps) {
  const [animatedVenues, setAnimatedVenues] = useState<Set<string>>(new Set());

  // Track which venues have been animated
  useEffect(() => {
    if (!loading) {
      const timeouts: NodeJS.Timeout[] = [];
      const newAnimatedVenues = new Set(animatedVenues);
      let hasNewVenues = false;

      venues.forEach((venue, index) => {
        // Only animate venues that haven't been animated yet
        if (!newAnimatedVenues.has(venue.id)) {
          hasNewVenues = true;
          timeouts.push(setTimeout(() => {
            setAnimatedVenues(prev => new Set(prev).add(venue.id));
          }, index * 50)); // Stagger animations for new cards only
        }
      });

      // If there are no new venues, just update the animated venues set to match current venues
      if (!hasNewVenues && animatedVenues.size !== venues.length) {
        setAnimatedVenues(new Set(venues.map(v => v.id)));
      }

      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  }, [venues, loading]);

  // Reset animated venues when loading state changes
  useEffect(() => {
    if (loading) {
      setAnimatedVenues(new Set());
    }
  }, [loading]);

  // Show skeleton loaders when loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-0">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index} 
            className="opacity-0 animate-fade-in-slide-up"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'forwards'
            }}
          >
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-0">
      {venues.map((venue, index) => {
        const isAnimated = animatedVenues.has(venue.id);
        return (
          <div 
            key={venue.id} 
            className={isAnimated ? "animate-fade-in-slide-up" : "opacity-0"}
            style={{ 
              animationDelay: `${index * 0.05}s`,
              animationFillMode: 'forwards'
            }}
          >
            <VenueCard 
              venue={venue} 
              onToggleFavorite={onToggleFavorite} 
            />
          </div>
        );
      })}
    </div>
  );
}