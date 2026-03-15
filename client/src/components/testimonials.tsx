import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I got a text saying my bank account was locked. I was about to click the link, but I pasted it into the Scam Checker first. It flagged it instantly. That one check saved me from handing over my login.",
    name: "Sarah M.",
    context: "Protecting her parents",
    initials: "SM",
  },
  {
    quote:
      "I ran the Data Broker Removal tool and found my home address, phone number, and email listed on 14 different sites I had never heard of. I removed myself from all of them in a weekend.",
    name: "Marcus T.",
    context: "Father of two",
    initials: "MT",
  },
  {
    quote:
      "My 72-year-old mom was getting calls from someone pretending to be her grandson. The guides here helped me explain what was happening without making her feel embarrassed. That matters.",
    name: "Jennifer L.",
    context: "Looking out for her mom",
    initials: "JL",
  },
  {
    quote:
      "We use the training materials at our community center for a weekly class with older adults. The content is respectful and doesn't talk down to anyone. That's rare.",
    name: "David R.",
    context: "Community center volunteer",
    initials: "DR",
  },
  {
    quote:
      "I thought I was careful online until I ran a quick check on my password. Turns out it had already been exposed in a breach. Changed everything that same night.",
    name: "Angela K.",
    context: "Small business owner",
    initials: "AK",
  },
];

export function Testimonials() {
  return (
    <section
      className="py-20 sm:py-28 lg:py-32 bg-[#0A2A3C] relative overflow-hidden"
      data-testid="section-testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2
            id="testimonials-heading"
            className="text-4xl sm:text-5xl font-extrabold text-white mb-5"
            data-testid="text-testimonials-heading"
          >
            What People Are Saying
          </h2>
          <p className="text-xl text-white/70 leading-relaxed">
            Real situations where the right tool or the right information made the difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial) => (
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
                  <p className="text-sm text-white/50">{testimonial.context}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6 lg:max-w-[calc(66.666%+0.75rem)]">
          {testimonials.slice(3, 5).map((testimonial) => (
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
                  <p className="text-sm text-white/50">{testimonial.context}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
