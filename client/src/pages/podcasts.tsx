import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mic, Play, Clock, Calendar, ExternalLink, Users, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Podcast } from "@shared/schema";

export function Podcasts() {
  const { data: podcasts, isLoading } = useQuery<Podcast[]>({
    queryKey: ["/api/podcasts"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-[600px] mx-auto" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <Skeleton className="h-48 w-full rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Cybersecurity Podcasts
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Stay informed with expert insights, industry discussions, and the latest 
          cybersecurity trends through our curated collection of podcasts.
        </p>
      </div>

      {/* Podcasts Grid */}
      {podcasts && podcasts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {podcasts.map((podcast) => (
            <Card key={podcast.id} className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-800/25">
              {/* Podcast Cover */}
              {podcast.coverImageUrl && (
                <div className="relative overflow-hidden">
                  <img 
                    src={podcast.coverImageUrl} 
                    alt={podcast.title}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                      <Play className="mr-2 h-4 w-4" />
                      Listen
                    </Button>
                  </div>
                  {podcast.featured && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {podcast.title}
                  </CardTitle>
                  {!podcast.coverImageUrl && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 text-white flex-shrink-0">
                      <Mic className="h-6 w-6" />
                    </div>
                  )}
                </div>
                
                {/* Podcast Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {podcast.hostName}
                  </div>
                  {podcast.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {podcast.duration}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {podcast.description}
                </p>

                {/* Category and Published Date */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {podcast.category}
                  </Badge>
                  {podcast.publishedAt && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(podcast.publishedAt), { addSuffix: true })}
                    </div>
                  )}
                </div>

                {/* Episode Info */}
                {(podcast.episodeNumber || podcast.seasonNumber) && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {podcast.seasonNumber && `Season ${podcast.seasonNumber}`}
                    {podcast.seasonNumber && podcast.episodeNumber && " • "}
                    {podcast.episodeNumber && `Episode ${podcast.episodeNumber}`}
                  </div>
                )}

                {/* Key Topics */}
                {podcast.keyTopics && podcast.keyTopics.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                      Key Topics
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {podcast.keyTopics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {podcast.keyTopics.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{podcast.keyTopics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Guest Information */}
                {podcast.guestName && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">Guest: </span>
                    <span className="text-gray-700 dark:text-gray-300">{podcast.guestName}</span>
                    {podcast.guestTitle && (
                      <span className="text-gray-500 dark:text-gray-400"> • {podcast.guestTitle}</span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  {podcast.audioUrl && (
                    <Button size="sm" className="flex-1">
                      <Play className="mr-2 h-4 w-4" />
                      Listen
                    </Button>
                  )}
                  {podcast.spotifyUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={podcast.spotifyUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Spotify
                      </a>
                    </Button>
                  )}
                  {podcast.appleUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={podcast.appleUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Apple
                      </a>
                    </Button>
                  )}
                </div>

                {/* Transcript Link */}
                {podcast.transcriptUrl && (
                  <div className="text-center">
                    <a 
                      href={podcast.transcriptUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      View Transcript
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Mic className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Podcasts Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Cybersecurity podcasts will appear here once they're added to the platform.
          </p>
        </div>
      )}
    </div>
  );
}