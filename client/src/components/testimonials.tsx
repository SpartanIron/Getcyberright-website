import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "My father received a WhatsApp message offering a job that paid in advance. He was ready to send his ID and bank details. I checked the link here and it came back as a known fraud site. That one check protected our whole family's savings.",
    name: "Amina O.",
    context: "Lagos, Nigeria",
    initials: "AO",
  },
  {
    quote:
      "Someone contacted my grandmother on LINE pretending to be a government tax officer, saying she owed money. The guides here explained exactly how that scam works. We reported it and she never sent a single yen.",
    name: "Kenji T.",
    context: "Osaka, Japan",
    initials: "KT",
  },
  {
    quote:
      "I got a parcel delivery text with a tracking link that looked exactly like Royal Mail. I pasted it into the Scam Checker and it flagged it immediately. I would have clicked that link without thinking twice.",
    name: "Rachel D.",
    context: "Manchester, UK",
    initials: "RD",
  },
  {
    quote:
      "After a data breach at a local retailer, I used the password tool and found three of my accounts were using the same exposed password. I changed them all that evening. Simple tool, but it caught something I missed for years.",
    name: "Carlos M.",
    context: "Bogota, Colombia",
    initials: "CM",
  },
  {
    quote:
      "My son's school had no safety curriculum for kids online. I shared the training materials from here with his teacher and they now use them every term. Finally, something that speaks to parents and kids at the same level.",
    name: "Priya S.",
    context: "Mumbai, India",
    initials: "PS",
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6">
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
          <div
            className="hidden 3xl:flex bg-white/[0.06] border border-white/10 rounded-2xl p-7 sm:p-8 flex-col"
            data-testid={`testimonial-card-${testimonials[3].initials.toLowerCase()}`}
          >
            <Quote className="w-8 h-8 text-white/15 mb-5 flex-shrink-0" aria-hidden="true" />
            <blockquote className="text-white/85 leading-relaxed mb-8 flex-1">
              {testimonials[3].quote}
            </blockquote>
            <div className="flex items-center gap-3 mt-auto">
              <div
                className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-sm font-semibold text-white/70"
                aria-hidden="true"
              >
                {testimonials[3].initials}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{testimonials[3].name}</p>
                <p className="text-sm text-white/50">{testimonials[3].context}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6 lg:max-w-[calc(66.666%+0.75rem)] 3xl:hidden">
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
