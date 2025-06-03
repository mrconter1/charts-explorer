'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Calendar, Globe, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Episode, Region, TimeWindow } from '@/types/podcast';
import { mockEpisodes, filterEpisodesByDateRange, filterEpisodesByRegion, sortEpisodesByScore } from '@/lib/mock-data';
import { getDateRange, navigateTimeWindow, formatDateRange, getTimeWindowLabel } from '@/lib/date-utils';

export default function PodcastDashboard() {
  // Use a fixed date initially to avoid hydration mismatch
  const [currentDate, setCurrentDate] = useState(new Date('2024-12-15'));
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('week');
  const [region, setRegion] = useState<Region>('se');
  const [mounted, setMounted] = useState(false);

  // Set actual current date after component mounts
  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date());
  }, []);

  // Calculate filtered and sorted episodes
  const filteredEpisodes = useMemo(() => {
    const { startDate, endDate } = getDateRange(timeWindow, currentDate);
    let episodes = filterEpisodesByRegion(mockEpisodes, region);
    episodes = filterEpisodesByDateRange(episodes, startDate, endDate);
    return sortEpisodesByScore(episodes);
  }, [currentDate, timeWindow, region]);

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

  const getScoreColor = (score: number) => {
    if (score <= 5) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score <= 10) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (score <= 15) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center space-y-4 mb-8 flex-shrink-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-400" />
            Charts Explorer
          </h1>
        </div>

        {/* Controls */}
        <Card className="border-gray-800 bg-gray-900 mb-6 flex-shrink-0">
          <CardContent className="px-6 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

              {/* Time Navigation - Single Row */}
              {timeWindow !== 'all' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Date Range</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTimeWindowNavigation('prev')}
                      className="flex items-center justify-center gap-1 border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 px-2"
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
        <div className="flex-1 flex flex-col min-h-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 mb-4 flex-shrink-0">
            🏆 Top Episodes
          </h2>
          
          {filteredEpisodes.length === 0 ? (
            <Card className="border-gray-800 bg-gray-900 flex-1 flex items-center justify-center">
              <CardContent className="text-center py-12">
                <div className="text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No episodes found</p>
                  <p className="text-sm">Try adjusting your filters or selecting a different time window.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3 pb-4">
                {filteredEpisodes.map((episode, index) => (
                  <Card key={episode.id} className="border-gray-800 bg-gray-900 hover:bg-gray-800/50 transition-colors">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col space-y-4">
                        {/* Top Row: Rank, Title, Score */}
                        <div className="flex items-start gap-4">
                          {/* Rank */}
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-200 text-sm">
                              {index + 1}
                            </div>
                          </div>

                          {/* Episode Info */}
                          <div className="flex-grow min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg text-gray-100 leading-tight mb-1">
                              {episode.episode_name}
                            </h3>
                            <p className="text-gray-400 font-medium text-sm sm:text-base">{episode.show_name}</p>
                          </div>

                          {/* Score Badge */}
                          <div className="flex-shrink-0">
                            <Badge className={`${getScoreColor(episode.score)} text-sm sm:text-base font-bold px-2 py-1 border`}>
                              {episode.score} pts
                            </Badge>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-500 pl-12 line-clamp-2 sm:line-clamp-1">
                          {episode.show_description}
                        </p>
                        
                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-3 pl-12 text-xs text-gray-500">
                          <span>First appeared: {new Date(episode.first_appearance_date).toLocaleDateString()}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Region: {getRegionLabel(episode.region)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 