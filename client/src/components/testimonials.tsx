import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "My father received a WhatsApp message offering a job that paid in advance. He was ready to send his ID and bank details. I checked the link here and it came back as a known fraud site. That one check protected our whole family's savings.",
    name: "Amina O.",
    context: "Lagos, Nigeria",
    role: "Family Caregiver",
    initials: "AO",
  },
  {
    quote:
      "My teenager almost handed over his school login on a fake portal a friend forwarded him. We sat down with the family training pack and now he checks every link before clicking. It changed how we talk about the internet at home.",
    name: "Robert M.",
    context: "Chicago, USA",
    role: "Parent",
    initials: "RM",
  },
  {
    quote:
      "I got a call saying my Social Security number was being suspended and that I had to act right away. The seniors guides walked me through what to listen for. I hung up, called the real office, and confirmed it was a scam. I felt prepared instead of scared.",
    name: "Sandra K.",
    context: "Phoenix, USA",
    role: "Senior",
    initials: "SK",
  },
  {
    quote:
      "We rolled out the small business training to our seven-person team after a fake invoice cost us money. A few months later, two of my staff caught a vendor impersonation attempt before anything was paid. The cost of that earlier lesson disappeared overnight.",
    name: "James T.",
    context: "Austin, USA",
    role: "Small Business Owner",
    initials: "JT",
  },
  {
    quote:
      "I teach Grade 7 and the kids' lessons fit perfectly into our digital citizenship unit. The activities are clear, age-appropriate, and the students actually engage with them. Several parents have asked me where to find more.",
    name: "Ms. Patricia W.",
    context: "Toronto, Canada",
    role: "Educator",
    initials: "PW",
  },
];

export function Testimonials() {
  return (
    <section
      className="py-20 sm:py-28 lg:py-32 bg-hero relative overflow-hidden"
      data-testid="section-testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-hero via-hero to-hero dark:from-[#0A2A3C] dark:via-[#0A2A3C] dark:to-[#00293C]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2
            id="testimonials-heading"
            className="text-4xl sm:text-5xl font-extrabold text-white mb-5"
            data-testid="text-testimonials-heading"
          >
            Real Stories from Real Families
          </h2>
          <p className="text-xl text-white/70 leading-relaxed">
            People around the world are using these tools to protect the people they love. Here are some of their stories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.initials}
              className="bg-white/[0.06] border border-white/10 rounded-2xl p-7 sm:p-8 flex flex-col"
              data-testid={`testimonial-card-${testimonial.initials.toLowerCase()}`}
            >
              <Quote className="w-8 h-8 text-white/15 mb-5 flex-shrink-0" aria-hidden="true" />
              <blockquote className="text-white/85 leading-relaxed mb-8 flex-1">
                {testimonial.quote}
              </blockquote>
              <div className="flex items-center gap-3 mt-auto">
                <div
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-sm font-semibold text-white/70"
                  aria-hidden="true"
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                  <p className="text-sm text-white/50">
                    {testimonial.role} &middot; {testimonial.context}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
