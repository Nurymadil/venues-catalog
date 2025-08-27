import { supabase } from './supabaseClient';
import { Venue, Amenity } from './types';

// Fetch all venues with their primary photos
export const fetchVenuesFromSupabase = async (): Promise<Venue[]> => {
  try {
    // Check if Supabase client is available
    if (!supabase) {
      throw new Error('Supabase client not available. Please check your configuration.');
    }

    // Fetch venues from Supabase
    const { data: venuesData, error } = await supabase
      .from('venues')
      .select(`
        id,
        title,
        city,
        country,
        price_min,
        price_max,
        price_unit,
        capacity_min,
        capacity_max
      `)
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching venues from Supabase:', error);
      throw new Error(`Failed to fetch venues from Supabase: ${error.message}`);
    }

    // Fetch venue photos separately
    const venueIds = venuesData.map(venue => venue.id);
    let photosData: any[] = [];
    let photosError = null;
    
    if (venueIds.length > 0) {
      const { data, error: photoError } = await supabase
        .from('venue_photos')
        .select('venue_id, url, position')
        .in('venue_id', venueIds)
        .order('position', { ascending: true });
      
      photosData = data || [];
      photosError = photoError;
    }

    if (photosError) {
      console.error('Error fetching venue photos from Supabase:', photosError);
      throw new Error(`Failed to fetch venue photos from Supabase: ${photosError.message}`);
    }

    const venues: Venue[] = venuesData.map(venue => {
      // Get primary photo (position = 0) or first available photo
      const venuePhotos = photosData.filter(photo => photo.venue_id === venue.id);
      const primaryPhoto = venuePhotos.find(photo => photo.position === 0) || 
                          venuePhotos[0] || 
                          { url: '' };
      
      return {
        id: venue.id,
        title: venue.title,
        city: venue.city || '',
        country: venue.country || '',
        price_min: venue.price_min || 0,
        price_max: venue.price_max || 0,
        price_unit: venue.price_unit || 'per_night',
        capacity_min: venue.capacity_min || 0,
        capacity_max: venue.capacity_max || 0,
        imageUrl: primaryPhoto.url || '',
        amenities: []
      };
    });

    // Fetch amenities for each venue using a single query for all venues
    if (venueIds.length > 0) {
      const { data: amenitiesData, error: amenitiesError } = await supabase
        .from('amenities')
        .select(`
          id,
          name,
          group,
          icon_url,
          venue_amenities(venue_id)
        `)
        .in('venue_amenities.venue_id', venueIds)
        .order('name');

      if (amenitiesError) {
        console.error('Error fetching amenities from Supabase:', amenitiesError);
        throw new Error(`Failed to fetch amenities from Supabase: ${amenitiesError.message}`);
      }

      // Group amenities by venue_id
      const amenitiesByVenue: { [key: string]: Amenity[] } = {};
      
      if (amenitiesData) {
        amenitiesData.forEach(amenity => {
          // Only process amenities that have venue_amenities data
          if (amenity.venue_amenities && amenity.venue_amenities.length > 0) {
            amenity.venue_amenities.forEach((va: any) => {
              const venueId = va.venue_id;
              if (!amenitiesByVenue[venueId]) {
                amenitiesByVenue[venueId] = [];
              }
              
              amenitiesByVenue[venueId].push({
                id: amenity.id,
                name: amenity.name,
                group: amenity.group as any,
                icon_url: amenity.icon_url || undefined
              });
            });
          }
        });
      }

      // Assign amenities to venues
      venues.forEach(venue => {
        venue.amenities = amenitiesByVenue[venue.id] || [];
      });
    }

    return venues;
  } catch (error) {
    console.error('Error in fetchVenuesFromSupabase:', error);
    throw error;
  }
};

// Fetch all amenities
export const fetchAmenitiesFromSupabase = async (): Promise<Amenity[]> => {
  try {
    // Check if Supabase client is available
    if (!supabase) {
      throw new Error('Supabase client not available. Please check your configuration.');
    }

    const { data: amenitiesData, error } = await supabase
      .from('amenities')
      .select('id, name, group, icon_url')
      .order('group', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching amenities from Supabase:', error);
      throw new Error(`Failed to fetch amenities from Supabase: ${error.message}`);
    }

    return amenitiesData.map(amenity => ({
      id: amenity.id,
      name: amenity.name,
      group: amenity.group as any,
      icon_url: amenity.icon_url || undefined
    }));
  } catch (error) {
    console.error('Error in fetchAmenitiesFromSupabase:', error);
    throw error;
  }
};