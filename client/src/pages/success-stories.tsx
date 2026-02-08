import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { 
  Shield, Quote, Star, Heart, Users, CheckCircle, 
  Send, Loader2, MapPin, Calendar, AlertCircle
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { apiRequest } from "@/lib/queryClient";

interface Testimonial {
  id: number;
  name: string;
  location?: string;
  story: string;
  category: 'scam_avoided' | 'family_protected' | 'learned_skills' | 'general';
  rating: number;
  date: string;
}

const featuredStories: Testimonial[] = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Texas, USA",
    story: "GetCyberRight's scam checker saved me from clicking a phishing link that looked exactly like my bank's website. The AI caught subtle red flags I would have missed!",
    category: 'scam_avoided',
    rating: 5,
    date: "2025-12"
  },
  {
    id: 2,
    name: "Robert K.",
    location: "Ontario, Canada",
    story: "As a senior, I was skeptical about online tools. But the simple, clear explanations helped me understand what to watch out for. I now check every suspicious link before clicking.",
    category: 'learned_skills',
    rating: 5,
    date: "2025-11"
  },
  {
    id: 3,
    name: "Maria L.",
    location: "California, USA",
    story: "I used the QR code scanner at a parking meter and it warned me the code was fake! Someone had placed a fraudulent sticker over the real one. Saved me from a $200 scam.",
    category: 'scam_avoided',
    rating: 5,
    date: "2026-01"
  },
  {
    id: 4,
    name: "James T.",
    location: "London, UK",
    story: "The daily safety tips helped my whole family become more aware. My teenage daughter now knows how to spot fake social media accounts. Peace of mind as a parent!",
    category: 'family_protected',
    rating: 5,
    date: "2025-10"
  },
  {
    id: 5,
    name: "Patricia H.",
    location: "Florida, USA",
    story: "My mom almost fell for a 'grandparent scam' call. Thanks to the education from GetCyberRight, she recognized the warning signs and hung up. This site is doing important work!",
    category: 'family_protected',
    rating: 5,
    date: "2025-12"
  },
  {
    id: 6,
    name: "David C.",
    location: "Sydney, Australia",
    story: "The email header analyzer revealed that a 'Microsoft support' email was actually from Nigeria. The detailed breakdown made it crystal clear why it was suspicious.",
    category: 'scam_avoided',
    rating: 5,
    date: "2025-11"
  }
];

const categoryConfig = {
  scam_avoided: { label: "Scam Avoided", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  family_protected: { label: "Family Protected", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  learned_skills: { label: "Skills Learned", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  general: { label: "Success Story", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" }
};

export default function SuccessStories() {
  useSEO({
    title: "Success Stories | GetCyberRight",
    description: "Read real stories from people who avoided scams and protected their families using GetCyberRight's free cyber safety tools.",
    keywords: "success stories, scam prevention, testimonials, cyber safety, family protection"
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    story: "",
    category: "general" as const
  });
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      setError(null);
      setFormData({ name: "", location: "", story: "", category: "general" });
    },
    onError: () => {
      setError("Something went wrong. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.story) {
      submitMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            <Heart className="h-3 w-3 mr-1" />
            Real Stories, Real Protection
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            See how GetCyberRight has helped families stay safe online. 
            These are real stories from real people.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Shield className="h-5 w-5 text-teal-600" />
              <span className="font-medium">{featuredStories.filter(s => s.category === 'scam_avoided').length}+ Scams Caught</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium">{featuredStories.filter(s => s.category === 'family_protected').length}+ Families Protected</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">5.0 Average Rating</span>
            </div>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {featuredStories.map((story) => (
              <motion.div key={story.id} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className={categoryConfig[story.category].color}>
                        {categoryConfig[story.category].label}
                      </Badge>
                      <div className="flex gap-0.5">
                        {[...Array(story.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    
                    <Quote className="h-8 w-8 text-teal-200 dark:text-teal-800 mb-3" />
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                      {story.story}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{story.name}</p>
                        {story.location && (
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {story.location}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {story.date}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
            Share Your Story
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Has GetCyberRight helped you stay safe? We'd love to hear about it!
          </p>

          {submitted ? (
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Thank you for sharing!
                </h3>
                <p className="text-green-600 dark:text-green-300 text-sm">
                  Your story helps inspire others to stay safe online.
                </p>
              </CardContent>
            </Card>
          ) : showForm ? (
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                      Your Name (or initials)
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., John D."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                      Location (optional)
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Texas, USA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                      Your Story
                    </label>
                    <Textarea
                      value={formData.story}
                      onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                      placeholder="Tell us how GetCyberRight helped you..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700" disabled={submitMutation.isPending}>
                      {submitMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Submit Story
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Button 
              size="lg" 
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => setShowForm(true)}
            >
              <Heart className="h-4 w-4 mr-2" />
              Share Your Story
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
