import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, GraduationCap, IdCard, Briefcase, Wrench, Star, Users, Clock } from "lucide-react";
import type { Resource } from "@shared/schema";

interface EnhancedResource extends Resource {
  enhancedTitle?: string;
  enhancedDescription?: string;
}

interface ResourceCardProps {
  resource: EnhancedResource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "free":
        return <GraduationCap className="h-5 w-5" />;
      case "premium":
        return <IdCard className="h-5 w-5" />;
      case "career":
        return <Briefcase className="h-5 w-5" />;
      case "tools":
        return <Wrench className="h-5 w-5" />;
      default:
        return <GraduationCap className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "free":
        return "bg-emerald-500 text-white";
      case "premium":
        return "bg-blue-500 text-white";
      case "career":
        return "bg-amber-500 text-white";
      case "tools":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "free":
        return "Free Course";
      case "premium":
        return "Premium";
      case "career":
        return "Career Guide";
      case "tools":
        return "Hands-on Tool";
      default:
        return "Resource";
    }
  };

  // Generate ultra-realistic images based on resource content and provider
  const getThumbnailUrl = (resource: Resource) => {
    // Ultra-realistic images matched to specific learning resource types
    const resourceSpecificImages = {
      // Free courses - online learning, education, accessible training
      "free": [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Students learning
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Computer learning
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Online education
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Team learning
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Study setup
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95"  // Coding education
      ],
      // Premium courses - advanced training, certification, professional development
      "premium": [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Premium workspace
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Professional setup
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Executive training
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Professional meeting
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Business professional
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95"  // Corporate training
      ],
      // Career guidance - mentoring, professional development, job search
      "career": [
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Professional workspace
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Career professional
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Business meeting
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Interview preparation
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Professional development
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95"  // Career advancement
      ],
      // Tools - cybersecurity tools, software, hands-on practice
      "tools": [
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Programming tools
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Development tools
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Code editor
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Terminal tools
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95", // Security tools
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop&crop=entropy&auto=format&q=95"  // Cybersecurity tools
      ]
    };
    
    const typeKey = resource.type as keyof typeof resourceSpecificImages;
    const imageSet = resourceSpecificImages[typeKey] || resourceSpecificImages["free"];
    
    // Smart content matching for resources - analyze title and provider for optimal image selection
    const titleLower = resource.title.toLowerCase();
    const providerLower = resource.provider?.toLowerCase() || '';
    let selectedImageIndex = 0;
    
    // Provider-specific matching first
    if (providerLower.includes('sans') || providerLower.includes('cybrary') || providerLower.includes('coursera')) {
      selectedImageIndex = 0; // Premium educational environment
    } else if (providerLower.includes('udemy') || providerLower.includes('pluralsight') || providerLower.includes('linkedin')) {
      selectedImageIndex = 1; // Online learning platform
    } else if (providerLower.includes('youtube') || providerLower.includes('free') || titleLower.includes('free')) {
      selectedImageIndex = 2; // Accessible/free learning
    } else if (titleLower.includes('certification') || titleLower.includes('cissp') || titleLower.includes('ceh')) {
      selectedImageIndex = 3; // Professional certification
    } else if (titleLower.includes('penetration') || titleLower.includes('ethical hacking') || titleLower.includes('security tools')) {
      selectedImageIndex = 4; // Hands-on security tools
    } else if (titleLower.includes('career') || titleLower.includes('interview') || titleLower.includes('resume')) {
      selectedImageIndex = 5; // Career development
    } else {
      // Fallback to consistent hash-based selection
      const contentHash = (resource.title + (resource.provider || '')).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      selectedImageIndex = Math.abs(contentHash) % imageSet.length;
    }
    
    return imageSet[selectedImageIndex];
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-900 border-0 shadow-md">
      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative">
          <img 
            src={resource.imageUrl || getThumbnailUrl(resource)} 
            alt={resource.enhancedTitle || resource.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = getThumbnailUrl(resource);
            }}
          />
          <div className="absolute top-3 left-3">
            <Badge className={`${getTypeColor(resource.type)} font-medium px-2 py-1 text-xs flex items-center`}>
              {getTypeIcon(resource.type)}
              <span className="ml-1">{getTypeLabel(resource.type)}</span>
            </Badge>
          </div>
          {resource.type === "free" && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-600 text-white font-bold">
                FREE
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 text-gray-900 dark:text-white">
            {resource.enhancedTitle || resource.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
            {resource.enhancedDescription || resource.description}
          </p>
          
          <div className="space-y-1 mb-4">
            {resource.provider && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Users className="w-3 h-3 mr-1" />
                <span>{resource.provider}</span>
              </div>
            )}
            {resource.difficulty && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Star className="w-3 h-3 mr-1" />
                <span className="capitalize">{resource.difficulty} Level</span>
              </div>
            )}
            {resource.price && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                <span>{resource.price}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {resource.category}
            </span>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </CardContent>
      </a>
    </Card>
  );
}
