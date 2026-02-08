import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/article-card";
import { Play, Calendar, Users, Mic, TrendingUp } from "lucide-react";
import type { Article } from "@shared/schema";

export default function Interviews() {
  const { data: interviews, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles?category=Interview"],
  });

  const upcomingInterviews = [
    {
      title: "The Future of Zero Trust Architecture",
      guest: "Dr. Sarah Chen",
      role: "CISO at TechCorp",
      date: "Dec 15, 2024",
      time: "2:00 PM EST",
      topics: ["Zero Trust", "Architecture", "Implementation"]
    },
    {
      title: "AI in Cybersecurity: Opportunities and Challenges",
      guest: "Michael Rodriguez",
      role: "AI Security Researcher",
      date: "Dec 22, 2024",
      time: "1:00 PM EST",
      topics: ["AI Security", "Machine Learning", "Threat Detection"]
    },
    {
      title: "Building a Career in Ethical Hacking",
      guest: "Alex Thompson",
      role: "Senior Penetration Tester",
      date: "Dec 29, 2024",
      time: "3:00 PM EST",
      topics: ["Ethical Hacking", "Career Development", "Certifications"]
    }
  ];

  const interviewStats = [
    { icon: <Users className="h-6 w-6" />, value: "150+", label: "Industry Experts" },
    { icon: <Mic className="h-6 w-6" />, value: "200+", label: "Interviews Conducted" },
    { icon: <Play className="h-6 w-6" />, value: "500k+", label: "Total Views" },
    { icon: <Calendar className="h-6 w-6" />, value: "Weekly", label: "New Episodes" }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Expert Interviews</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Gain insights from industry leaders, cybersecurity experts, and thought leaders 
            shaping the future of digital security.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {interviewStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-[var(--cyber-blue)] mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Interviews */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Interviews</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingInterviews.map((interview, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Live
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {interview.date}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{interview.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">{interview.guest}</p>
                      <p className="text-sm text-muted-foreground">{interview.role}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {interview.topics.map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button className="w-full bg-[var(--cyber-blue)] hover:bg-[var(--cyber-blue-dark)]">
                        <Play className="mr-2 h-4 w-4" />
                        Set Reminder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Interviews */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent Interviews</h2>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-muted"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : interviews && interviews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview) => (
                <ArticleCard key={interview.id} article={interview} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Mic className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Past Interviews Available</h3>
                <p className="text-muted-foreground">
                  We're working on bringing you exclusive interviews with industry experts. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cyber-gradient text-white">
            <CardContent className="p-8">
              <Play className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Watch on YouTube</h3>
              <p className="text-blue-100 mb-4">
                Subscribe to our YouTube channel for the latest interviews and cybersecurity insights.
              </p>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                Subscribe Now
              </Button>
            </CardContent>
          </Card>

          <Card className="security-gradient text-white">
            <CardContent className="p-8">
              <Users className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Suggest a Guest</h3>
              <p className="text-green-100 mb-4">
                Know an expert who should be featured? Let us know who you'd like to hear from.
              </p>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                Suggest Guest
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
