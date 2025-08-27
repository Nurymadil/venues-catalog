export interface Venue {
  id: string;
  title: string;
  city: string;
  country: string;
  price_min: number;
  price_max: number;
  price_unit: 'weekend' | 'per_night' | 'per_person' | 'week' | 'custom';
  capacity_min: number;
  capacity_max: number;
  imageUrl: string;
  amenities: Amenity[];
  isFavorite?: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  group: 'core' | 'general' | 'food_dining' | 'wellness' | 'outdoor' | 'indoor' | 'tech' | 'other';
  icon_url?: string;
}

export interface Filters {
  searchTerm: string;
  city: string;
  guestCountRange: string[]; // Changed to array
  minPrice: number | null;
  maxPrice: number | null;
  amenities: string[]; // amenity IDs
}

export type SortOption = "price-asc" | "price-desc";

// Supabase specific types
export interface SupabaseVenue {
  id: string;
  title: string;
  city: string;
  country: string;
  price_min: number;
  price_max: number;
  price_unit: 'weekend' | 'per_night' | 'per_person' | 'week' | 'custom';
  capacity_min: number;
  capacity_max: number;
  venue_photos: {
    url: string;
    position: number;
  }[];
}

export interface SupabaseAmenity {
  id: string;
  name: string;
  group: 'core' | 'general' | 'food_dining' | 'wellness' | 'outdoor' | 'indoor' | 'tech' | 'other';
  icon_url: string | null;
}

export interface VenueAmenity {
  venue_id: string;
  amenity_id: string;
}