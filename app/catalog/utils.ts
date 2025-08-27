import { Venue, Filters, SortOption } from './types';

export const filterVenues = (venues: Venue[], filters: Filters): Venue[] => {
  return venues.filter(venue => {
    // Search by title and city
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      if (
        !venue.title.toLowerCase().includes(searchTerm) &&
        !venue.city.toLowerCase().includes(searchTerm)
      ) {
        return false;
      }
    }

    // Filter by city
    if (filters.city && !venue.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }

    // Filter by guest count range (multiple selections)
    if (filters.guestCountRange.length > 0) {
      const capacity = venue.capacity_max;
      let matchesAnyRange = false;
      
      for (const range of filters.guestCountRange) {
        switch (range) {
          case '1-10':
            if (capacity >= 1 && capacity <= 10) {
              matchesAnyRange = true;
              break;
            }
            break;
          case '11-20':
            if (capacity >= 11 && capacity <= 20) {
              matchesAnyRange = true;
              break;
            }
            break;
          case '21-35':
            if (capacity >= 21 && capacity <= 35) {
              matchesAnyRange = true;
              break;
            }
            break;
          case '36-50':
            if (capacity >= 36 && capacity <= 50) {
              matchesAnyRange = true;
              break;
            }
            break;
          case '50+':
            if (capacity > 50) {
              matchesAnyRange = true;
              break;
            }
            break;
        }
        
        if (matchesAnyRange) break;
      }
      
      if (!matchesAnyRange) return false;
    }

    // Filter by price range
    if (filters.minPrice !== null && venue.price_min < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== null && venue.price_max > filters.maxPrice) {
      return false;
    }

    // Filter by amenities
    if (filters.amenities.length > 0) {
      const venueAmenityIds = venue.amenities.map(amenity => amenity.id);
      const hasAllAmenities = filters.amenities.every(amenityId => 
        venueAmenityIds.includes(amenityId)
      );
      if (!hasAllAmenities) return false;
    }

    return true;
  });
};

export const sortVenues = (venues: Venue[], sortOption: SortOption): Venue[] => {
  const sortedVenues = [...venues];
  
  switch (sortOption) {
    case 'price-asc':
      return sortedVenues.sort((a, b) => a.price_min - b.price_min);
    case 'price-desc':
      return sortedVenues.sort((a, b) => b.price_min - a.price_min);
    default:
      return sortedVenues;
  }
};

export const paginateVenues = (venues: Venue[], currentPage: number, itemsPerPage: number): Venue[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return venues.slice(startIndex, endIndex);
};

export const getTotalPages = (totalItems: number, itemsPerPage: number): number => {
  return Math.ceil(totalItems / itemsPerPage);
};

export const getGuestCountRanges = () => [
  { label: '1-10 guests', value: '1-10' },
  { label: '11-20 guests', value: '11-20' },
  { label: '21-35 guests', value: '21-35' },
  { label: '36-50 guests', value: '36-50' },
  { label: '50+ guests', value: '50+' },
];

export const getPriceUnits = () => ({
  weekend: 'weekend',
  per_night: 'night',
  per_person: 'person',
  week: 'week',
  custom: 'custom',
});