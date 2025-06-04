'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Calendar, Globe, BarChart3, Loader2, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Episode, Region, TimeWindow } from '@/types/podcast';
import { fetchTopEpisodes, getGlobalScoreRange } from '@/lib/episodes-service';
import { getDateRange, navigateTimeWindow, formatDateRange, getTimeWindowLabel } from '@/lib/date-utils';

export default function PodcastDashboard() {
  // Use a fixed date initially to avoid hydration mismatch
  const [currentDate, setCurrentDate] = useState(new Date('2024-12-15'));
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('week');
  const [region, setRegion] = useState<Region>('se');
  const [mounted, setMounted] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scoreRange, setScoreRange] = useState<{ minScore: number; maxScore: number } | null>(null);

  // Set actual current date after component mounts
  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());
  }, []);

  // Fetch global score range once when component mounts
  useEffect(() => {
    const loadScoreRange = async () => {
      try {
        const range = await getGlobalScoreRange();
        setScoreRange(range);
      } catch (err) {
        console.error('Failed to fetch score range:', err);
        // Use fallback values
        setScoreRange({ minScore: 1, maxScore: 1000 });
      }
    };

    if (mounted) {
      loadScoreRange();
    }
  }, [mounted]);

  // Fetch episodes when filters change
  useEffect(() => {
    if (!mounted) return;

    const loadEpisodes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchTopEpisodes({
          region,
          timeWindow,
          currentDate,
          limit: 50
        });
        setEpisodes(data);
      } catch (err) {
        console.error('Failed to fetch episodes:', err);
        setError('Failed to load episodes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEpisodes();
  }, [mounted, region, timeWindow, currentDate]);

  const handleTimeWindowNavigation = (direction: 'prev' | 'next') => {
    if (timeWindow === 'all') return; // Can't navigate in "all" mode
    const newDate = navigateTimeWindow(currentDate, timeWindow, direction);
    setCurrentDate(newDate);
  };

  const handleTimeWindowChange = (newTimeWindow: TimeWindow) => {
    setTimeWindow(newTimeWindow);
    // Reset to current date when changing time window
    if (newTimeWindow !== 'all') {
      setCurrentDate(new Date());
    }
  };

  const { startDate, endDate } = getDateRange(timeWindow, currentDate);
  const dateRangeText = formatDateRange(startDate, endDate, timeWindow);

  const getRegionLabel = (region: Region) => {
    return region === 'se' ? '🇸🇪 Sweden' : '🇺🇸 United States';
  };

  // Convert Spotify URI to app URL
  const getSpotifyUrl = (episodeUri: string) => {
    // Use spotify: URI directly to open in app, fallback to web if app not available
    return episodeUri;
  };

  // Transform raw score to display score (higher = better)
  const getDisplayScore = (rawScore: number): number => {
    if (!scoreRange) return 0;
    
    const { maxScore } = scoreRange;
    
    // Simple inversion: higher display scores = better performance
    const displayScore = maxScore - rawScore;
    return Math.max(0, displayScore);
  };

  // Format date in human readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-400" />
              Charts Explorer
            </h1>
          </div>
          <div className="text-center text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-400" />
            Charts Explorer
          </h1>
        </div>

        {/* Controls */}
        <Card className="border-gray-800 bg-gray-900 mb-6">
          <CardContent className="px-6 py-3">
            <div className="space-y-4">
              {/* Region and Time Window - Always on Same Row */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Region Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-300">
                    <Globe className="h-4 w-4 text-cyan-400" />
                    Region
                  </label>
                  <Select value={region} onValueChange={(value: Region) => setRegion(value)}>
                    <SelectTrigger className="w-full border-gray-700 bg-gray-800 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800">
                      <SelectItem value="se" className="text-gray-200 focus:bg-gray-700">🇸🇪 Sweden</SelectItem>
                      <SelectItem value="us" className="text-gray-200 focus:bg-gray-700">🇺🇸 United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Window Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-300">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    Time Window
                  </label>
                  <Select 
                    value={timeWindow} 
                    onValueChange={(value: TimeWindow) => handleTimeWindowChange(value)}
                  >
                    <SelectTrigger className="w-full border-gray-700 bg-gray-800 text-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800">
                      <SelectItem value="week" className="text-gray-200 focus:bg-gray-700">Week</SelectItem>
                      <SelectItem value="month" className="text-gray-200 focus:bg-gray-700">Month</SelectItem>
                      <SelectItem value="quarter" className="text-gray-200 focus:bg-gray-700">Quarter</SelectItem>
                      <SelectItem value="year" className="text-gray-200 focus:bg-gray-700">Year</SelectItem>
                      <SelectItem value="all" className="text-gray-200 focus:bg-gray-700">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time Navigation - Separate Row */}
              {timeWindow !== 'all' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Date Range</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTimeWindowNavigation('prev')}
                      className="flex items-center justify-center gap-1 border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 px-2"
                      disabled={loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-center flex-1">
                      <span className="font-medium text-gray-200 text-sm">{dateRangeText}</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTimeWindowNavigation('next')}
                      className="flex items-center justify-center gap-1 border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 px-2"
                      disabled={loading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Episodes List */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            🏆 Top Episodes
          </h2>
          
          {loading ? (
            <Card className="border-gray-800 bg-gray-900">
              <CardContent className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
                <p className="text-gray-400">Loading episodes...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-gray-800 bg-gray-900">
              <CardContent className="text-center py-12">
                <div className="text-red-400">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Error loading data</p>
                  <p className="text-sm">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : episodes.length === 0 ? (
            <Card className="border-gray-800 bg-gray-900">
              <CardContent className="text-center py-12">
                <div className="text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No episodes found</p>
                  <p className="text-sm">Try adjusting your filters or selecting a different time window.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2 pb-8">
              {episodes.map((episode, index) => (
                <Card key={episode.id} className="border-gray-800 bg-gray-900 hover:bg-gray-800/50 transition-colors">
                  <CardContent className="px-4 py-2">
                    <div className="flex items-center gap-4">
                      {/* Score Badge */}
                      <div className="flex-shrink-0">
                        <div className="px-3 py-2 bg-green-900/30 border border-green-700/50 rounded-lg flex flex-col items-center">
                          <span className="text-green-300 text-xs leading-none">Score</span>
                          <span className="font-medium text-green-400 text-sm leading-none">{getDisplayScore(episode.score)}</span>
                        </div>
                      </div>

                      {/* Episode Info */}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-base text-gray-100 leading-tight mb-1">
                          {episode.episode_name}
                        </h3>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-400">
                            <span className="font-medium">{episode.show_name}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(episode.first_appearance_date)}
                          </div>
                        </div>
                      </div>

                      {/* Play Button */}
                      <div className="flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => window.open(getSpotifyUrl(episode.episode_uri), '_blank')}
                          className="w-10 h-10 rounded-full !bg-green-600 hover:!bg-green-500 !border-green-600 hover:!border-green-500 !text-white hover:!text-white p-0 flex items-center justify-center"
                        >
                          <Play className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 