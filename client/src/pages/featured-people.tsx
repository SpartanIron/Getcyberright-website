import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Users, Trophy, Target, ExternalLink } from "lucide-react";
import type { FeaturedPerson } from "@shared/schema";

export function FeaturedPeople() {
  const { data: people, isLoading } = useQuery<FeaturedPerson[]>({
    queryKey: ["/api/featured-people"],
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
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
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
          Featured Cybersecurity Leaders
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Meet the visionaries, researchers, and practitioners making significant impacts 
          in the cybersecurity space through innovation, education, and leadership.
        </p>
        <div className="mt-6 mx-auto max-w-xl">
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
            <Trophy className="w-4 h-4 mr-2" />
            Monthly Spotlight: 10 Leaders Rotating Every Quarter
          </Badge>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Our featured professionals rotate quarterly to showcase diverse voices from around the world
          </p>
        </div>
      </div>

      {/* People Grid */}
      {people && people.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <Card key={person.id} className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-800/25">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  {person.imageUrl ? (
                    <img 
                      src={person.imageUrl} 
                      alt={person.name}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <Users className="h-8 w-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {person.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{person.title}</p>
                    {person.company && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">{person.company}</p>
                    )}
                  </div>
                  {person.featured && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 dark:from-yellow-900 dark:to-yellow-800 dark:text-yellow-200">
                      <Trophy className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Bio */}
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {person.bio}
                </p>

                {/* Expertise Areas */}
                {person.expertise && person.expertise.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {person.expertise.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {person.expertise.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{person.expertise.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {person.achievements && person.achievements.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      {person.achievements.slice(0, 2).map((achievement, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="mt-1 h-1 w-1 rounded-full bg-blue-500 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Impact Score */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Impact Score
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(person.impactScore || 0, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {person.impactScore || 0}/100
                    </span>
                  </div>
                </div>

                {/* Links */}
                {(person.linkedinUrl || person.twitterUrl || person.websiteUrl) && (
                  <div className="flex gap-2 pt-2">
                    {person.linkedinUrl && (
                      <a 
                        href={person.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {person.twitterUrl && (
                      <a 
                        href={person.twitterUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {person.websiteUrl && (
                      <a 
                        href={person.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Featured People Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Featured cybersecurity leaders will appear here once they're added to the platform.
          </p>
        </div>
      )}
    </div>
  );
}