import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { PageBanner } from "@/components/page-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Video, 
  Users, 
  Building2,
  Clock,
  MapPin,
  ArrowRight,
  Bell,
  Presentation,
  MessageCircle,
  Shield,
  Mail
} from "lucide-react";
import bannerImage from "@/assets/banners/events-banner.png";

interface Event {
  id: string;
  title: string;
  description: string;
  type: "webinar" | "workshop" | "conference";
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "registration-open" | "sold-out" | "past";
  audience: string;
}

const upcomingEvents: Event[] = [
  {
    id: "senior-safety-webinar",
    title: "Protecting Seniors from Phone Scams",
    description: "Learn the latest tactics scammers use to target older adults and how to protect your loved ones. Includes Q&A session.",
    type: "webinar",
    date: "Coming Soon",
    time: "TBD",
    location: "Online",
    status: "upcoming",
    audience: "Seniors, Caregivers, Families"
  },
  {
    id: "small-business-workshop",
    title: "Cybersecurity Essentials for Small Business",
    description: "A hands-on workshop covering the fundamentals of protecting your business from cyber threats without breaking the bank.",
    type: "workshop",
    date: "Coming Soon",
    time: "TBD",
    location: "Online",
    status: "upcoming",
    audience: "Small Business Owners, Entrepreneurs"
  },
  {
    id: "family-safety-webinar",
    title: "Family Online Safety: A Parent's Guide",
    description: "Practical strategies for keeping your children safe online, from social media to gaming to device management.",
    type: "webinar",
    date: "Coming Soon",
    time: "TBD",
    location: "Online",
    status: "upcoming",
    audience: "Parents, Educators"
  }
];

const eventTypes = [
  {
    icon: Video,
    title: "Webinars",
    description: "Live online presentations with Q&A sessions. Learn from cybersecurity experts from anywhere in the world."
  },
  {
    icon: Presentation,
    title: "Workshops",
    description: "Hands-on training sessions with practical exercises. Walk away with actionable skills you can use immediately."
  },
  {
    icon: MessageCircle,
    title: "Community Events",
    description: "Local events hosted by community partners. Connect with others in your area who care about online safety."
  }
];

const sponsorshipTiers = [
  {
    title: "Presenting Sponsor",
    description: "Maximum visibility as the primary event sponsor with speaking opportunities and premium branding.",
    features: [
      "Logo on all event materials",
      "5-minute speaking slot",
      "Attendee list access",
      "Social media promotion",
      "Post-event report"
    ]
  },
  {
    title: "Supporting Sponsor",
    description: "Strong brand presence with logo placement and promotional opportunities.",
    features: [
      "Logo on event page",
      "Mention during event",
      "Social media thanks",
      "Post-event summary"
    ]
  },
  {
    title: "Community Partner",
    description: "Support our mission while gaining exposure to our engaged audience.",
    features: [
      "Logo on sponsors page",
      "Newsletter mention",
      "Social media recognition"
    ]
  }
];

const typeColors = {
  webinar: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  workshop: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  conference: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
};

export default function Events() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.events} />
      <Navigation />
      
      <main>
        <PageBanner
          title="Events and Webinars"
          subtitle="Join our live events to learn practical cybersecurity skills, connect with experts, and protect what matters most."
          imageSrc={bannerImage}
          imageAlt="Cybersecurity training event"
          imagePosition="right"
          colorVariant="indigo"
        />

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Event Types</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We offer a variety of learning experiences to fit your schedule and learning style.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {eventTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover-elevate">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <type.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{type.title}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Events</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Sign up for our newsletter to be notified when registration opens for these events.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full" data-testid={`event-card-${event.id}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={typeColors[event.type]}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                        <Badge variant="outline">{event.status === "upcoming" ? "Coming Soon" : event.status}</Badge>
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.audience}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <Card className="inline-block">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">Get Event Notifications</p>
                    <p className="text-sm text-muted-foreground">Subscribe to our newsletter for event announcements</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">Sponsor an Event</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Partner with us to reach security-conscious families and businesses while supporting 
                our mission to make the internet safer for everyone.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {sponsorshipTiers.map((tier, index) => (
                <motion.div
                  key={tier.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle>{tier.title}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <Button size="lg" asChild>
                <a href="mailto:events@getcyberright.com" className="inline-flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Events Team
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">events@getcyberright.com</p>
            </motion.div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
