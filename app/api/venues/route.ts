import { NextResponse } from 'next/server';
import { fetchVenuesFromSupabase } from '@/app/catalog/supabaseService';

export async function GET() {
  try {
    const venues = await fetchVenuesFromSupabase();
    return NextResponse.json(venues);
  } catch (error: any) {
    console.error('Error fetching venues from Supabase:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch venues from Supabase' },
      { status: 500 }
    );
  }
}