import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { Link } from "wouter";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import logoImage from "@assets/image_(3)_1769558492356.png";

const resources = [
  {
    slug: "how-to-spot-phishing-emails",
    title: "How to Spot Phishing Emails: A Complete Guide",
    excerpt: "Learn the telltale signs that an email might be a phishing attempt. From suspicious sender addresses to urgent language, we cover everything you need to know.",
    category: "Email Safety",
    readTime: "8 min read",
    featured: true
  },
  {
    slug: "protecting-seniors-from-phone-scams",
    title: "Protecting Seniors from Phone Scams",
    excerpt: "Phone scams targeting seniors are on the rise. This guide helps families have important conversations and set up protections.",
    category: "Senior Safety",
    readTime: "6 min read",
    featured: true
  },
  {
    slug: "romance-scam-warning-signs",
    title: "Romance Scam Warning Signs Everyone Should Know",
    excerpt: "Romance scams cost victims billions each year. Learn to recognize the patterns scammers use to build false trust and request money.",
    category: "Scam Awareness",
    readTime: "10 min read",
    featured: false
  },
  {
    slug: "setting-up-two-factor-authentication",
    title: "Setting Up Two Factor Authentication Without the Confusion",
    excerpt: "Two factor authentication is one of the best ways to protect your accounts. We explain what it is and how to set it up simply.",
    category: "Account Security",
    readTime: "5 min read",
    featured: false
  },
  {
    slug: "social-media-privacy-settings",
    title: "Social Media Privacy Settings: A Platform-by-Platform Guide",
    excerpt: "Your social media profiles may be sharing more than you realize. Learn how to lock down your privacy on Facebook, Instagram, and more.",
    category: "Privacy",
    readTime: "12 min read",
    featured: false
  },
  {
    slug: "what-to-do-after-clicking-suspicious-link",
    title: "What To Do After Clicking a Suspicious Link",
    excerpt: "Clicked something you shouldn't have? Don't panic. Here's exactly what to do next to minimize any potential damage.",
    category: "Emergency Response",
    readTime: "4 min read",
    featured: true
  },
  {
    slug: "teaching-kids-about-online-safety",
    title: "Teaching Kids About Online Safety: Age-Appropriate Conversations",
    excerpt: "How to talk to children about staying safe online without scaring them. Guidance for parents of kids from preschool to teenagers.",
    category: "Family Safety",
    readTime: "9 min read",
    featured: false
  },
  {
    slug: "small-business-security-basics",
    title: "Small Business Security Basics: Where to Start",
    excerpt: "A practical starting point for small business owners who want to protect their business but don't have an IT department.",
    category: "Business",
    readTime: "7 min read",
    featured: false
  }
];

const categories = ["All", "Email Safety", "Senior Safety", "Scam Awareness", "Account Security", "Privacy", "Family Safety", "Business"];

export default function Resources() {
  const featuredResources = resources.filter(r => r.featured);
  const allResources = resources;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <img src={logoImage} alt="" className="w-5 h-5 object-contain" />
                <span>Educational Resources</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Learn to Protect Yourself{" "}
                <span className="text-primary">Online</span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Guides, articles, and educational content written in plain language. 
                No tech jargon, just practical knowledge you can use today.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured Guides</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {featuredResources.map((resource, index) => (
                <motion.div
                  key={resource.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/resources/${resource.slug}`}>
                    <Card className="h-full hover-elevate cursor-pointer" data-testid={`featured-${resource.slug}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                            Featured
                          </Badge>
                          <Badge variant="outline">{resource.category}</Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {resource.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {resource.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{resource.readTime}</span>
                          </div>
                          <span className="text-primary text-sm font-medium flex items-center gap-1">
                            Read more <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                  data-testid={`filter-${category.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {allResources.map((resource, index) => (
                <motion.div
                  key={resource.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/resources/${resource.slug}`}>
                    <Card className="h-full hover-elevate cursor-pointer" data-testid={`resource-${resource.slug}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                              <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                            </div>
                            
                            <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                              {resource.title}
                            </h3>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {resource.excerpt}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
}
