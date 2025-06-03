import { Episode } from '@/types/podcast';

// Generate mock episodes with realistic data
export const mockEpisodes: Episode[] = [
  // Swedish Episodes
  {
    id: 1,
    first_appearance_date: '2024-01-15',
    score: 5,
    episode_name: 'The Future of AI in Healthcare',
    show_name: 'Tech Talk Stockholm',
    episode_uri: 'spotify:episode:1',
    show_uri: 'spotify:show:1',
    show_description: 'Sweden\'s premier technology podcast discussing AI, healthcare, and innovation.',
    region: 'se',
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-20T10:30:00Z'
  },
  {
    id: 2,
    first_appearance_date: '2024-01-18',
    score: 12,
    episode_name: 'Climate Solutions for the Nordic Region',
    show_name: 'Green Nordic',
    episode_uri: 'spotify:episode:2',
    show_uri: 'spotify:show:2',
    show_description: 'Environmental discussions focused on Nordic sustainability initiatives.',
    region: 'se',
    created_at: '2024-01-18T09:00:00Z',
    updated_at: '2024-01-22T14:15:00Z'
  },
  {
    id: 3,
    first_appearance_date: '2024-01-20',
    score: 8,
    episode_name: 'Swedish Startup Success Stories',
    show_name: 'Entrepreneur Sweden',
    episode_uri: 'spotify:episode:3',
    show_uri: 'spotify:show:3',
    show_description: 'Inspiring stories from Swedish entrepreneurs and business leaders.',
    region: 'se',
    created_at: '2024-01-20T11:00:00Z',
    updated_at: '2024-01-25T16:45:00Z'
  },
  {
    id: 4,
    first_appearance_date: '2024-02-01',
    score: 3,
    episode_name: 'Music Industry Revolution',
    show_name: 'Stockholm Sound',
    episode_uri: 'spotify:episode:4',
    show_uri: 'spotify:show:4',
    show_description: 'Deep dive into the music industry from Stockholm\'s perspective.',
    region: 'se',
    created_at: '2024-02-01T07:30:00Z',
    updated_at: '2024-02-05T12:20:00Z'
  },
  {
    id: 5,
    first_appearance_date: '2024-02-10',
    score: 15,
    episode_name: 'Nordic Design Philosophy',
    show_name: 'Design Stockholm',
    episode_uri: 'spotify:episode:5',
    show_uri: 'spotify:show:5',
    show_description: 'Exploring the principles behind Nordic design and minimalism.',
    region: 'se',
    created_at: '2024-02-10T13:00:00Z',
    updated_at: '2024-02-15T09:10:00Z'
  },

  // US Episodes
  {
    id: 6,
    first_appearance_date: '2024-01-12',
    score: 2,
    episode_name: 'Silicon Valley Insider Stories',
    show_name: 'Valley Talk',
    episode_uri: 'spotify:episode:6',
    show_uri: 'spotify:show:6',
    show_description: 'Behind-the-scenes stories from Silicon Valley\'s biggest companies.',
    region: 'us',
    created_at: '2024-01-12T15:00:00Z',
    updated_at: '2024-01-17T18:30:00Z'
  },
  {
    id: 7,
    first_appearance_date: '2024-01-16',
    score: 7,
    episode_name: 'The Psychology of Success',
    show_name: 'Mind Matters USA',
    episode_uri: 'spotify:episode:7',
    show_uri: 'spotify:show:7',
    show_description: 'Exploring the mental frameworks that drive success in America.',
    region: 'us',
    created_at: '2024-01-16T12:00:00Z',
    updated_at: '2024-01-21T14:45:00Z'
  },
  {
    id: 8,
    first_appearance_date: '2024-01-22',
    score: 11,
    episode_name: 'Cryptocurrency Market Analysis',
    show_name: 'Crypto America',
    episode_uri: 'spotify:episode:8',
    show_uri: 'spotify:show:8',
    show_description: 'Weekly analysis of cryptocurrency trends in the US market.',
    region: 'us',
    created_at: '2024-01-22T16:00:00Z',
    updated_at: '2024-01-27T11:25:00Z'
  },
  {
    id: 9,
    first_appearance_date: '2024-02-03',
    score: 4,
    episode_name: 'Hollywood Behind the Scenes',
    show_name: 'Entertainment Weekly',
    episode_uri: 'spotify:episode:9',
    show_uri: 'spotify:show:9',
    show_description: 'Exclusive interviews with Hollywood\'s biggest stars and directors.',
    region: 'us',
    created_at: '2024-02-03T10:00:00Z',
    updated_at: '2024-02-08T15:15:00Z'
  },
  {
    id: 10,
    first_appearance_date: '2024-02-12',
    score: 9,
    episode_name: 'American Sports Analytics',
    show_name: 'Sports Science USA',
    episode_uri: 'spotify:episode:10',
    show_uri: 'spotify:show:10',
    show_description: 'Data-driven analysis of American sports performance and trends.',
    region: 'us',
    created_at: '2024-02-12T14:30:00Z',
    updated_at: '2024-02-17T16:40:00Z'
  },

  // More recent episodes for current time testing
  {
    id: 11,
    first_appearance_date: '2024-12-01',
    score: 1,
    episode_name: 'Year-End Tech Roundup',
    show_name: 'Tech Talk Stockholm',
    episode_uri: 'spotify:episode:11',
    show_uri: 'spotify:show:1',
    show_description: 'Sweden\'s premier technology podcast discussing AI, healthcare, and innovation.',
    region: 'se',
    created_at: '2024-12-01T08:00:00Z',
    updated_at: '2024-12-15T10:30:00Z'
  },
  {
    id: 12,
    first_appearance_date: '2024-12-05',
    score: 6,
    episode_name: 'Holiday Shopping Trends 2024',
    show_name: 'Consumer Insights',
    episode_uri: 'spotify:episode:12',
    show_uri: 'spotify:show:11',
    show_description: 'Analysis of consumer behavior during the holiday season.',
    region: 'us',
    created_at: '2024-12-05T12:00:00Z',
    updated_at: '2024-12-10T14:20:00Z'
  }
];

// Helper functions for filtering
export const filterEpisodesByDateRange = (episodes: Episode[], startDate: Date, endDate: Date): Episode[] => {
  return episodes.filter(episode => {
    const episodeDate = new Date(episode.first_appearance_date);
    return episodeDate >= startDate && episodeDate <= endDate;
  });
};

export const filterEpisodesByRegion = (episodes: Episode[], region: 'se' | 'us'): Episode[] => {
  return episodes.filter(episode => episode.region === region);
};

export const sortEpisodesByScore = (episodes: Episode[]): Episode[] => {
  return [...episodes].sort((a, b) => a.score - b.score); // Lower score = better ranking
}; 