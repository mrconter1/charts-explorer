'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, BarChart3, Loader2, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Episode } from '@/types/podcast';
import { fetchTopEpisodes, getGlobalScoreRange } from '@/lib/episodes-service';

export default function PodcastPage() {
  const params = useParams();
  const showUri = params.showUri as string;
  const decodedShowUri = decodeURIComponent(showUri);
  
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scoreRange, setScoreRange] = useState<{ minScore: number; maxScore: number } | null>(null);
  const [podcastInfo, setPodcastInfo] = useState<{ name: string; description: string } | null>(null);

  // Fetch global score range
  useEffect(() => {
    const loadScoreRange = async () => {
      try {
        const range = await getGlobalScoreRange();
        setScoreRange(range);
      } catch (err) {
        console.error('Failed to fetch score range:', err);
        setScoreRange({ minScore: 1, maxScore: 1000 });
      }
    };
    loadScoreRange();
  }, []);

  // Fetch episodes for this specific podcast
  useEffect(() => {
    const loadPodcastEpisodes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get all episodes from both regions for this podcast
        const [seEpisodes, usEpisodes] = await Promise.all([
          fetchTopEpisodes({
            region: 'se',
            timeWindow: 'all',
            currentDate: new Date(),
            limit: 1000
          }),
          fetchTopEpisodes({
            region: 'us', 
            timeWindow: 'all',
            currentDate: new Date(),
            limit: 1000
          })
        ]);

        // Combine and filter by show URI
        const allEpisodes = [...seEpisodes, ...usEpisodes];
        const podcastEpisodes = allEpisodes
          .filter(episode => episode.show_uri === decodedShowUri)
          .sort((a, b) => a.score - b.score); // Sort by score (lower = better)

        setEpisodes(podcastEpisodes);

        // Set podcast info from first episode
        if (podcastEpisodes.length > 0) {
          setPodcastInfo({
            name: podcastEpisodes[0].show_name,
            description: podcastEpisodes[0].show_description
          });
        }
      } catch (err) {
        console.error('Failed to fetch podcast episodes:', err);
        setError('Failed to load podcast episodes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (decodedShowUri) {
      loadPodcastEpisodes();
    }
  }, [decodedShowUri]);

  // Transform raw score to display score
  const getDisplayScore = (rawScore: number): number => {
    if (!scoreRange) return 0;
    const { maxScore } = scoreRange;
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

  // Convert Spotify URI to app URL
  const getSpotifyUrl = (uri: string) => {
    return uri;
  };

  // Get Spotify show URL
  const getSpotifyShowUrl = (showUri: string) => {
    return showUri;
  };

  // Skeleton loading component for episode tiles
  const EpisodeSkeleton = () => (
    <Card className="border-gray-800 bg-gray-900">
      <CardContent className="px-4 py-3">
        <div className="flex items-start gap-4 animate-pulse">
          {/* Score Badge Skeleton */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-[50px] h-[44px] bg-gray-800 rounded-lg"></div>
            <div className="w-8 h-8 bg-gray-800 rounded"></div>
          </div>

          {/* Episode Info Skeleton */}
          <div className="flex-grow min-w-0 space-y-2">
            <div className="h-5 bg-gray-800 rounded w-3/4"></div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              <div className="h-3 bg-gray-800 rounded w-1/3"></div>
            </div>
          </div>

          {/* Play Button Skeleton */}
          <div className="flex-shrink-0 flex items-center">
            <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Loading Header */}
          <div className="text-center space-y-4 mb-8">
            <div className="h-12 bg-gray-800 rounded w-2/3 mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-800 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
          
          {/* Episodes List Loading */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-800 rounded w-48 animate-pulse"></div>
            <div className="space-y-2 pb-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <EpisodeSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !podcastInfo) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error || 'Podcast not found'}</p>
            <Link href="/">
              <Button variant="outline" className="border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700">
                Back to Charts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Podcast Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {podcastInfo.name}
          </h1>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {podcastInfo.description}
          </p>
          <div className="flex justify-between items-center pt-2 max-w-4xl mx-auto">
            <Button
              onClick={() => window.open(getSpotifyShowUrl(decodedShowUri), '_blank')}
              className="bg-green-600 hover:bg-green-500 text-white flex items-center gap-2 px-4 py-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Spotify
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 flex items-center gap-2 px-4 py-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Charts
              </Button>
            </Link>
          </div>
        </div>

        {/* Episodes List */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-400" />
            Top Episodes ({episodes.length})
          </h2>
          
          {episodes.length === 0 ? (
            <Card className="border-gray-800 bg-gray-900">
              <CardContent className="text-center py-12">
                <div className="text-gray-500">
                  <p className="text-lg mb-2">No episodes found</p>
                  <p className="text-sm">This podcast might not have episodes in our current dataset.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2 pb-8">
              {episodes.map((episode, index) => (
                <Card key={episode.id} className="border-gray-800 bg-gray-900 hover:bg-gray-800/50 transition-colors">
                  <CardContent className="px-4 py-3">
                    <div className="flex items-start gap-4">
                      {/* Score Badge and Podcast Icon */}
                      <div className="flex-shrink-0 flex flex-col items-center gap-2">
                        <div className="px-2 py-1.5 bg-green-900/30 border border-green-700/50 rounded-lg flex flex-col items-center min-w-[50px]">
                          <span className="text-green-300 text-xs leading-none">Score</span>
                          <span className="font-medium text-green-400 text-sm leading-none mt-0.5">{getDisplayScore(episode.score)}</span>
                        </div>
                        
                        {/* Podcast Page Link - Hidden since we're already on podcast page */}
                        <div className="w-8 h-8"></div>
                      </div>

                      {/* Episode Info */}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-base text-gray-100 leading-tight mb-2">
                          {episode.episode_name}
                        </h3>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <span className="font-medium">{episode.region === 'se' ? '🇸🇪 Sweden' : '🇺🇸 United States'}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(episode.first_appearance_date)}
                          </div>
                        </div>
                      </div>

                      {/* Play Button */}
                      <div className="flex-shrink-0 flex items-center">
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