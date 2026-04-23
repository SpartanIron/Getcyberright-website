"use client";
import { useState } from "react";
import { Shield, ExternalLink, Star, ChevronRight, Lock, Eye, Trash2, Wifi, Key } from "lucide-react";
import { affiliateTools, type AffiliateTool } from "@/data/affiliate-tools";
import { AffiliateToolCard } from "@/components/affiliate-tool-card";
import { NewsletterSignup } from "@/components/newsletter-signup";

export default function RecommendedTools() {
    const [activeCategory, setActiveCategory] = useState("all");
    const categories = [
          { id: "all", label: "All Tools" },
          { id: "identity", label: "Identity Protection" },
          { id: "data-removal", label: "Data Removal" },
          { id: "vpn", label: "VPN" },
          { id: "antimalware", label: "Antimalware" },
          { id: "password", label: "Passwords" },
        ];
    const filtered = activeCategory === "all"
      ? affiliateTools
      : affiliateTools.filter((t) => t.category === activeCategory);
    return (
          <div className="min-h-screen bg-[#111A2C] text-white">
            <section className="py-16 px-4 text-center border-b border-gray-800">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-teal-900/40 border border-teal-700 rounded-full px-4 py-1.5 text-sm text-teal-300 mb-6">
                  <Shield className="w-4 h-4" />
                  Tools We Actually Trust
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Recommended Security Tools</h1>
                <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                  As a CISM-certified cybersecurity professional with 15+ years of experience, these are the tools I recommend to families, seniors, and small businesses. Every product is independently evaluated.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />All tools independently reviewed</span>
                  <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-teal-400" />No paid placements</span>
                  <span className="flex items-center gap-1.5"><ExternalLink className="w-4 h-4 text-gray-400" />Affiliate links support our free mission</span>
                </div>
              </div>
            </section>
            <div className="max-w-6xl mx-auto px-4 py-12">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-10">
                <h2 className="text-xl font-bold mb-3">How We Choose These Tools</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  GetCyberRight was built by a cybersecurity professional with experience at AWS, DISA, and JSOC. Every tool was evaluated for effectiveness, ease of use, price value, privacy practices, and support quality. We only recommend tools we would give to our own family.
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  Disclosure: Some links on this page are affiliate links. If you purchase through them, GetCyberRight earns a small commission at no extra cost to you. This helps keep all our tools and education free.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? "bg-teal-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"}`}>
                                {cat.label}
                              </button>
                            ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filtered.map((tool) => (
                              <AffiliateToolCard key={tool.id} tool={tool} variant="full" />
                            ))}
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="rounded-2xl border border-[#35486E] bg-[#1A2744] p-6">
                  <h3 className="text-lg font-bold mb-2">For Senior Living Facilities</h3>
                  <p className="text-sm text-gray-400 mb-4">Protect your residents from the 147,000+ elder fraud complaints filed in 2024. Cybersecurity awareness training designed for seniors. Bulk licensing from $99/month.</p>
                  <a href="/for-organizations" className="inline-flex items-center gap-2 text-teal-400 text-sm font-semibold hover:text-teal-300">Request a Demo <ChevronRight className="w-4 h-4" /></a>
                </div>
                <div className="rounded-2xl border border-[#35486E] bg-[#1A2744] p-6">
                  <h3 className="text-lg font-bold mb-2">For Small Businesses</h3>
                  <p className="text-sm text-gray-400 mb-4">SMBs are targeted 4x more than large organizations. Protect your team from phishing, ransomware, and social engineering. Plans from $29/month.</p>
                  <a href="/small-business" className="inline-flex items-center gap-2 text-orange-400 text-sm font-semibold hover:text-orange-300">See Business Plans <ChevronRight className="w-4 h-4" /></a>
                </div>
              </div>
              <div className="max-w-lg mx-auto">
                <NewsletterSignup variant="card" context="general" />
              </div>
            </div>
          </div>
        );
  }
