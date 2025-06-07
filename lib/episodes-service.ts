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
      .order('score', { ascending: false }) // Higher score = better (updated for new system)
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

// Get global min and max scores for consistent score transformation
export async function getGlobalScoreRange(): Promise<{ minScore: number; maxScore: number }> {
  try {
    // Get min and max scores in a single query using aggregate functions
    const { data, error } = await supabase
      .from('episodes')
      .select('score')
      .order('score', { ascending: true })
      .limit(1000000); // Get all scores to calculate min/max

    if (error) {
      console.error('Error fetching score range:', error);
      return { minScore: 1, maxScore: 1000 }; // Fallback values
    }

    if (!data || data.length === 0) {
      return { minScore: 1, maxScore: 1000 }; // Fallback values
    }

    const scores = data.map(episode => episode.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    return { minScore, maxScore };
  } catch (error) {
    console.error('Error in getGlobalScoreRange:', error);
    return { minScore: 1, maxScore: 1000 }; // Fallback values
  }
} 