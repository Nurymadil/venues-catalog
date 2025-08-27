'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchVenues, fetchAmenities } from '../dataService';
import { filterVenues, sortVenues, paginateVenues, getTotalPages } from '../utils';
import { Venue, Filters, SortOption } from '../types';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SortButtons from './SortButtons';
import VenueGrid from './VenueGrid';
import EmptyState from './EmptyState';
import Pagination from './Pagination';

interface CatalogClientProps {
  initialPage?: number;
}

export default function CatalogClient({ initialPage = 1 }: CatalogClientProps) {
  // Get page from URL params
  const searchParams = useSearchParams();
  const urlPage = searchParams.get('page');
  const currentPageFromUrl = urlPage ? parseInt(urlPage, 10) : initialPage;

  // State management
  const [venues, setVenues] = useState<Venue[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [paginatedVenues, setPaginatedVenues] = useState<Venue[]>([]);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    city: '',
    guestCountRange: [],
    minPrice: null,
    maxPrice: null,
    amenities: [],
  });
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(currentPageFromUrl);
  const [itemsPerPage] = useState<number>(6); // Show 6 items per page
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data using API routes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch venues and amenities in parallel
        const [fetchedVenues, fetchedAmenities] = await Promise.all([
          fetchVenues(),
          fetchAmenities()
        ]);
        
        setVenues(fetchedVenues);
        setAmenities(fetchedAmenities);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data from Supabase. Please check your configuration and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and sorting when they change
  useEffect(() => {
    let result = filterVenues(venues, filters);
    result = sortVenues(result, sortOption);
    setFilteredVenues(result);
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filters.searchTerm, filters.city, filters.guestCountRange.length, filters.minPrice, filters.maxPrice, filters.amenities.length, sortOption, venues.length]);

  // Apply pagination when filtered venues or current page changes
  useEffect(() => {
    const paginated = paginateVenues(filteredVenues, currentPage, itemsPerPage);
    setPaginatedVenues(paginated);
    setTotalPages(getTotalPages(filteredVenues.length, itemsPerPage));
  }, [filteredVenues.length, currentPage, itemsPerPage]);

  // Update venues with favorite status when venues or favorites change
  useEffect(() => {
    setVenues(prev => 
      prev.map(venue => ({
        ...venue,
        isFavorite: favorites.has(venue.id)
      }))
    );
  }, [venues.length, favorites.size]);

  // Update filteredVenues with favorite status when filteredVenues or favorites change
  useEffect(() => {
    setFilteredVenues(prev => 
      prev.map(venue => ({
        ...venue,
        isFavorite: favorites.has(venue.id)
      }))
    );
  }, [filteredVenues.length, favorites.size]);

  // Update paginatedVenues with favorite status when paginatedVenues or favorites change
  useEffect(() => {
    setPaginatedVenues(prev => 
      prev.map(venue => ({
        ...venue,
        isFavorite: favorites.has(venue.id)
      }))
    );
  }, [paginatedVenues.length, favorites.size]);

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  // Handle city filter
  const handleCityFilter = (city: string) => {
    setFilters(prev => ({ ...prev, city }));
  };

  // Handle guest count filter (multiple selection)
  const handleGuestCountFilter = (ranges: string[]) => {
    setFilters(prev => ({ ...prev, guestCountRange: ranges }));
  };

  // Handle price range filter
  const handlePriceRangeFilter = (min: number | null, max: number | null) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  // Handle amenities filter
  const handleAmenitiesFilter = (amenityId: string) => {
    setFilters(prev => {
      const newAmenities = [...prev.amenities];
      const index = newAmenities.indexOf(amenityId);
      
      if (index >= 0) {
        newAmenities.splice(index, 1);
      } else {
        newAmenities.push(amenityId);
      }
      
      return { ...prev, amenities: newAmenities };
    });
  };

  // Handle sort change
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite
  const toggleFavorite = (venueId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(venueId)) {
        newFavorites.delete(venueId);
      } else {
        newFavorites.add(venueId);
      }
      return newFavorites;
    });
  };

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('venueFavorites');
      if (savedFavorites) {
        try {
          const favoriteIds = JSON.parse(savedFavorites);
          setFavorites(new Set(favoriteIds));
        } catch (e) {
          console.error('Failed to parse favorites from localStorage', e);
        }
      }
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('venueFavorites', JSON.stringify(Array.from(favorites)));
    }
  }, [favorites.size]);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in">Venue Catalog</h1>
        
        {/* Search and Filters */}
        <div className="mb-8 animate-fade-in-slide-up">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className="w-full md:w-1/4 animate-fade-in-slide-up">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              
              <div className="mb-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6 animate-fade-in-slide-up">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                    {/* Image placeholder */}
                    <div className="h-48 bg-gray-200"></div>
                    
                    {/* Content placeholder */}
                    <div className="p-4">
                      {/* Title placeholder */}
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                      
                      {/* Location placeholder */}
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      
                      {/* Price placeholder */}
                      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                      
                      {/* Capacity placeholder */}
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      
                      {/* Amenities placeholder */}
                      <div className="flex flex-wrap gap-2">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in">Venue Catalog</h1>
        
        {/* Search and Filters */}
        <div className="mb-8 animate-fade-in-slide-up">
          <SearchBar 
            onSearch={handleSearch}
            onCityFilter={handleCityFilter}
            searchTerm={filters.searchTerm}
            city={filters.city}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-0">
          {/* Filters */}
          <div className="w-full md:w-1/4 animate-fade-in-slide-up">
            <FilterPanel 
              amenities={amenities}
              onGuestCountFilter={handleGuestCountFilter}
              onPriceRangeFilter={handlePriceRangeFilter}
              onAmenitiesFilter={handleAmenitiesFilter}
              selectedGuestCount={filters.guestCountRange}
              selectedAmenities={filters.amenities}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
            />
          </div>
          
          {/* Results */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6 animate-fade-in-slide-up relative">
              <p className="text-gray-600">
                {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
              </p>
              <SortButtons 
                currentSort={sortOption}
                onSortChange={handleSortChange}
              />
            </div>
            
            {paginatedVenues.length > 0 ? (
              <>
                <div className="animate-fade-in z-0">
                  <VenueGrid 
                    venues={paginatedVenues}
                    onToggleFavorite={toggleFavorite}
                    loading={false}
                  />
                </div>
                <div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredVenues.length}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <div className="animate-fade-in">
                <EmptyState onClearFilters={() => setFilters({
                  searchTerm: '',
                  city: '',
                  guestCountRange: [],
                  minPrice: null,
                  maxPrice: null,
                  amenities: [],
                })} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}