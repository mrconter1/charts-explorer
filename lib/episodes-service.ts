import { supabase } from './supabase';
import { Episode, Region, TimeWindow } from '@/types/podcast';
import { getDateRange } from './date-utils';

export interface FetchEpisodesParams {
  region: Region;
  timeWindow: TimeWindow;
  currentDate: Date;
  limit?: number;
}

export async function fetchTopEpisodes({
  region,
  timeWindow,
  currentDate,
  limit = 25
}: FetchEpisodesParams): Promise<Episode[]> {
  try {
    let query = supabase
      .from('episodes')
      .select('*')
      .eq('region', region)
      .order('score', { ascending: true }) // Lower score = better (golf-style)
      .limit(limit);

    // Add date filtering for non-"all" time windows
    if (timeWindow !== 'all') {
      const { startDate, endDate } = getDateRange(timeWindow, currentDate);
      
      // Format dates for Supabase (YYYY-MM-DD)
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      query = query
        .gte('first_appearance_date', startDateStr)
        .lte('first_appearance_date', endDateStr);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching episodes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchTopEpisodes:', error);
    return [];
  }
}

// Helper function to get episode count for a specific filter
export async function getEpisodeCount({
  region,
  timeWindow,
  currentDate
}: Omit<FetchEpisodesParams, 'limit'>): Promise<number> {
  try {
    let query = supabase
      .from('episodes')
      .select('*', { count: 'exact', head: true })
      .eq('region', region);

    if (timeWindow !== 'all') {
      const { startDate, endDate } = getDateRange(timeWindow, currentDate);
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      query = query
        .gte('first_appearance_date', startDateStr)
        .lte('first_appearance_date', endDateStr);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Error getting episode count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in getEpisodeCount:', error);
    return 0;
  }
} 