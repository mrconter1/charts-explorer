export interface Episode {
  id: number;
  first_appearance_date: string;
  score: number;
  episode_name: string;
  show_name: string;
  episode_uri: string;
  show_uri: string;
  show_description: string;
  region: 'se' | 'us';
  created_at: string;
  updated_at: string;
}

export type Region = 'se' | 'us';
export type TimeWindow = 'week' | 'month' | 'quarter' | 'year' | 'all';

export interface DashboardFilters {
  region: Region;
  timeWindow: TimeWindow;
  startDate: Date;
  endDate: Date;
} 