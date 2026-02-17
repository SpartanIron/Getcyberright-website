import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Share2, Bookmark, ExternalLink, TrendingUp } from "lucide-react";
import type { Article } from "@shared/schema";

// Decode HTML entities in text (e.g., &#8216; -> ')
function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  };
  return text
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&apos;|&nbsp;/g, (match) => entities[match] || match);
}

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  compact?: boolean;
}

export function ArticleCard({ article, featured = false, compact = false }: ArticleCardProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return d.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "news":
        return "bg-red-500 text-white";
      case "tutorial":
        return "bg-emerald-500 text-white";
      case "career":
        return "bg-amber-500 text-white";
      case "analysis":
        return "bg-blue-500 text-white";
      case "interview":
        return "bg-purple-500 text-white";
      case "threat intelligence":
        return "bg-orange-500 text-white";
      case "security":
        return "bg-indigo-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  // Generate ultra-realistic, topic-specific thumbnail images
  const getThumbnailUrl = (article: Article) => {
    if (article.imageUrl) return article.imageUrl;
    
    // Ultra-realistic cybersecurity images matched to specific topics
    const topicSpecificImages = {
      // News articles - realistic newsroom, breaking news, cyber incidents
      "news": [
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Server room
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Binary code/hacking
        "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Cyber security monitoring
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Lock/security
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Network security
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90"  // Digital security
      ],
      // Tutorial articles - hands-on learning, code, training
      "tutorial": [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Laptop coding
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Desk setup
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Computer screen
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Code editor
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Terminal
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90"  // Programming
      ],
      // Career articles - professional development, workplace
      "career": [
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Business meeting
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Laptop business
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Office workspace
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Professional working
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Office environment
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90"  // Conference room
      ],
      // Analysis articles - data, charts, research
      "analysis": [
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Data analysis
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Analytics dashboard
        "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Charts/graphs
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Business analytics
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Computer analysis
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90"  // Network analysis
      ],
      // Interview articles - people, conversations, portraits
      "interview": [
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Professional interview
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Business meeting
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Professional portrait
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Executive working
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Office discussion
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90"  // Team meeting
      ],
      // Security articles - locks, shields, protection
      "security": [
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Digital lock
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Cybersecurity
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Server security
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Network protection
        "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Security monitoring
        "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90"  // Digital security
      ],
      // Threat intelligence - monitoring, alerts, investigation
      "threat intelligence": [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Threat monitoring
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Cyber investigation
        "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Security operations
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Threat detection
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90", // Intelligence gathering
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90"  // Network monitoring
      ]
    };
    
    const category = article.category.toLowerCase() as keyof typeof topicSpecificImages;
    const imageSet = topicSpecificImages[category] || topicSpecificImages["security"];
    
    // Smart content matching - analyze title keywords for better image selection
    const titleLower = article.title.toLowerCase();
    let selectedImageIndex = 0;
    
    // Keyword-based image selection for more accurate matching
    if (titleLower.includes('hack') || titleLower.includes('breach') || titleLower.includes('attack')) {
      selectedImageIndex = 1; // Security monitoring/incident response images
    } else if (titleLower.includes('server') || titleLower.includes('infrastructure') || titleLower.includes('network')) {
      selectedImageIndex = 0; // Server room/infrastructure images
    } else if (titleLower.includes('data') || titleLower.includes('analysis') || titleLower.includes('report')) {
      selectedImageIndex = 2; // Data analysis/monitoring images
    } else if (titleLower.includes('tool') || titleLower.includes('software') || titleLower.includes('platform')) {
      selectedImageIndex = 3; // Technology/tools images
    } else if (titleLower.includes('training') || titleLower.includes('learn') || titleLower.includes('course')) {
      selectedImageIndex = 4; // Learning/education images
    } else {
      // Fallback to title hash for consistent selection
      const titleHash = article.title.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      selectedImageIndex = Math.abs(titleHash) % imageSet.length;
    }
    
    return imageSet[selectedImageIndex];
  };

  if (compact) {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-md">
        <a href={article.url || `#`} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative">
            <img 
              src={getThumbnailUrl(article)} 
              alt={article.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop&crop=entropy&auto=format&q=90";
              }}
            />
            <div className="absolute top-3 left-3">
              <Badge className={`${getCategoryColor(article.category)} font-medium px-2 py-1 text-xs`}>
                {article.breaking && <span className="animate-pulse mr-1">●</span>}
                {article.category.toUpperCase()}
              </Badge>
            </div>
            {article.breaking && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-red-600 text-white animate-pulse">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  BREAKING
                </Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
              <Clock className="w-3 h-3 mr-1" />
              {formatDate(article.publishedAt!)}
              {article.readTime && (
                <>
                  <span className="mx-2">•</span>
                  <span>{article.readTime} min read</span>
                </>
              )}
            </div>
            
            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 text-gray-900 dark:text-white">
              {decodeHtmlEntities(article.title)}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
              {decodeHtmlEntities(article.excerpt)}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={article.authorAvatar ?? undefined} alt={article.author} />
                  <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">
                    {article.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{article.author}</span>
              </div>
              
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </CardContent>
        </a>
      </Card>
    );
  }

  if (featured) {
    return (
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-900 border-0 shadow-lg">
        <a href={article.url || `#`} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative">
            <img
              src={getThumbnailUrl(article)}
              alt={article.title}
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop&crop=entropy&auto=format&q=95";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className={`${getCategoryColor(article.category)} font-bold px-3 py-1 mb-3`}>
                {article.breaking && <span className="animate-pulse mr-2">●</span>}
                {article.category.toUpperCase()}
              </Badge>
              {article.breaking && (
                <Badge className="bg-red-600 text-white animate-pulse ml-2 font-bold">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  BREAKING NEWS
                </Badge>
              )}
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
              <Clock className="w-4 h-4 mr-2" />
              {formatDate(article.publishedAt!)}
              {article.readTime && (
                <>
                  <span className="mx-3">•</span>
                  <span>{article.readTime} min read</span>
                </>
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors leading-tight text-gray-900 dark:text-white">
              {decodeHtmlEntities(article.title)}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-base leading-relaxed">
              {decodeHtmlEntities(article.excerpt)}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={article.authorAvatar ?? undefined} alt={article.author} />
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 font-semibold">
                    {article.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{article.author}</p>
                  {article.authorTitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{article.authorTitle}</p>
                  )}
                </div>
              </div>
              
              <Button variant="outline" className="group-hover:bg-blue-600 group-hover:text-white transition-colors">
                Read Article
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </a>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-40 object-cover"
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-3">
          <Badge className={getCategoryColor(article.category)} variant="secondary">
            {article.breaking ? "Breaking" : article.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(article.publishedAt!)}
          </span>
        </div>
        <Link to="/news">
          <h3 className="text-lg font-semibold hover:text-[var(--cyber-blue)] transition-colors mb-3 leading-tight cursor-pointer">
            {decodeHtmlEntities(article.title)}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {decodeHtmlEntities(article.excerpt)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{article.readTime} min read</span>
          </div>
          <Share2 className="h-4 w-4 text-muted-foreground hover:text-[var(--cyber-blue)] cursor-pointer" />
        </div>
      </CardContent>
    </Card>
  );
}
