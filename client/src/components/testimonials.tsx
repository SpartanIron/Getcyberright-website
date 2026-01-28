import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "My mom almost sent $5,000 to a 'grandchild' who was supposedly in jail. Thanks to what I learned here, I recognized it as a scam and stopped her in time.",
    name: "Sarah M.",
    role: "Protecting her parents",
    initials: "SM",
    rating: 5,
  },
  {
    quote:
      "The Scam Checker saved me. I got a text about a package delivery and was about to click. Checked it here first and found out it was a phishing link.",
    name: "Marcus T.",
    role: "First-time user",
    initials: "MT",
    rating: 5,
  },
  {
    quote:
      "Finally, safety advice I can actually understand! No confusing tech jargon. I set up parental controls on all my kids' devices in one afternoon.",
    name: "Jennifer L.",
    role: "Mom of 3",
    initials: "JL",
    rating: 5,
  },
  {
    quote:
      "My 75-year-old father was being targeted by romance scammers. GetCyberRight helped us recognize the warning signs and protect him from financial ruin.",
    name: "Michael T.",
    role: "Son & Caregiver",
    initials: "MT",
    rating: 5,
  },
  {
    quote:
      "We use GetCyberRight materials in our community center to educate seniors. The content is clear, respectful, and doesn't make anyone feel stupid for not knowing tech.",
    name: "Linda W.",
    role: "Community Center Director",
    initials: "LW",
    rating: 5,
  },
  {
    quote:
      "After clicking a suspicious link, I panicked. The 'What To Do Next' guide walked me through exactly what steps to take. Invaluable resource!",
    name: "David K.",
    role: "College Student",
    initials: "DK",
    rating: 5,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev + itemsPerPage >= testimonials.length ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [itemsPerPage]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerPage >= testimonials.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, testimonials.length - itemsPerPage) : prev - 1
    );
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  if (visibleTestimonials.length < itemsPerPage) {
    visibleTestimonials.push(
      ...testimonials.slice(0, itemsPerPage - visibleTestimonials.length)
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Success Stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Trusted by Families and Organizations
          </h2>
          <p className="text-lg text-muted-foreground">
            See how GetCyberRight has helped people just like you stay safe
            online.
          </p>
        </motion.div>

        <div className="relative">
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex"
              data-testid="button-testimonial-prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              <AnimatePresence mode="popLayout">
                {visibleTestimonials.map((testimonial, index) => (
                  <motion.div
                    key={`${testimonial.name}-${currentIndex}-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className="h-full"
                      data-testid={`testimonial-card-${index}`}
                    >
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-primary text-primary"
                            />
                          ))}
                        </div>
                        <Quote className="w-8 h-8 text-primary/20 mb-4" />
                        <blockquote className="text-foreground mb-6 leading-relaxed flex-1">
                          "{testimonial.quote}"
                        </blockquote>
                        <div className="flex items-center gap-3 mt-auto">
                          <Avatar className="border-2 border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                              {testimonial.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {testimonial.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex"
              data-testid="button-testimonial-next"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(testimonials.length / itemsPerPage) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerPage)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(currentIndex / itemsPerPage) === index
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  }`}
                  data-testid={`carousel-dot-${index}`}
                />
              )
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center gap-8 mt-12 pt-8 border-t"
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">50,000+</p>
            <p className="text-sm text-muted-foreground">Families Helped</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">4.9/5</p>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">6</p>
            <p className="text-sm text-muted-foreground">Continents</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
