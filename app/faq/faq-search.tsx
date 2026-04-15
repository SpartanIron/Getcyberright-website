"use client";

import { useState } from "react";
import { Search, HelpCircle, Shield, Mail, Lock, Users, Globe, AlertTriangle, CalendarDays, Chrome, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

interface FAQCategory {
  title: string;
  iconKey: string;
  questions: Array<{ q: string; a: string }>;
}

interface FAQSearchableContentProps {
  categories: FAQCategory[];
  lastReviewed: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  mail: Mail,
  chrome: Chrome,
  creditcard: CreditCard,
  lock: Lock,
  users: Users,
  alert: AlertTriangle,
  globe: Globe,
};

export function FAQSearchableContent({ categories, lastReviewed }: FAQSearchableContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = searchQuery.trim()
    ? categories
        .map(cat => ({
          ...cat,
          questions: cat.questions.filter(
            q =>
              q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.a.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter(cat => cat.questions.length > 0)
    : categories;

  return (
    <>
      <div className="container mx-auto px-4 max-w-2xl py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border"
            aria-label="Search FAQ"
          />
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => {
              const IconComponent = iconMap[category.iconKey] || HelpCircle;
              return (
                <Card key={categoryIndex} className="overflow-hidden" data-testid={`card-faq-category-${categoryIndex}`}>
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">{category.title}</h2>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((item, itemIndex) => (
                        <AccordionItem key={itemIndex} value={`${categoryIndex}-${itemIndex}`} className="border-b last:border-b-0">
                          <AccordionTrigger className="px-4 py-3 text-left font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 text-slate-600 dark:text-slate-300">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredCategories.length === 0 && searchQuery.trim() && (
            <div className="text-center py-12">
              <p className="text-lg text-slate-400">No questions found matching your search.</p>
              <p className="text-sm text-slate-500 mt-2">Try a different search term.</p>
            </div>
          )}

          <Card className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-slate-300 mb-6">
                We are here to help. Reach out to us and we will get back to you as soon as possible.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                data-testid="link-faq-contact"
              >
                Contact Us
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
