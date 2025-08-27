// Data service that fetches data from Supabase
import { fetchVenuesFromSupabase, fetchAmenitiesFromSupabase } from './supabaseService';

export const fetchVenues = async (): Promise<any[]> => {
  try {
    const venues = await fetchVenuesFromSupabase();
    return venues;
  } catch (error) {
    console.error('Error fetching venues from Supabase:', error);
    throw error;
  }
};

export const fetchAmenities = async (): Promise<any[]> => {
  try {
    const amenities = await fetchAmenitiesFromSupabase();
    return amenities;
  } catch (error) {
    console.error('Error fetching amenities from Supabase:', error);
    throw error;
  }
};