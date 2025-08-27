import { NextResponse } from 'next/server';
import { fetchAmenitiesFromSupabase } from '@/app/catalog/supabaseService';

export async function GET() {
  try {
    const amenities = await fetchAmenitiesFromSupabase();
    return NextResponse.json(amenities);
  } catch (error: any) {
    console.error('Error fetching amenities from Supabase:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch amenities from Supabase' },
      { status: 500 }
    );
  }
}