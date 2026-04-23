import { ExternalLink, Shield, Star } from "lucide-react";
import type { AffiliateTool } from "@/data/affiliate-tools";

interface AffiliateToolCardProps {
    tool: AffiliateTool;
    variant?: "compact" | "full";
    context?: string;
}

export function AffiliateToolCard({
    tool,
    variant = "full",
}: AffiliateToolCardProps) {
    const categoryColors: Record<AffiliateTool["category"], string> = {
          vpn: "bg-blue-500",
          identity: "bg-purple-500",
          password: "bg-green-500",
          antimalware: "bg-red-500",
          "data-removal": "bg-orange-500",
    };

  if (variant === "compact") {
        return (
                <a
                          href={tool.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="group flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:border-teal-500 hover:bg-teal-950/30 transition-all duration-200"
                        >
                        <div
            className={`w-8 h-8 rounded-md ${categoryColors[tool.category]} flex items-center justify-center text-white font-bold text-xs shrink-0`}
                                  >
                          {tool.logoPlaceholder}
                        </div>div>
                        <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1">
                                              <span className="text-sm font-semibold text-white truncate">
                                                {tool.name}
                                              </span>span>
                                    {tool.badge && (
                                        <span className="text-xs bg-teal-900 text-teal-300 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                          {tool.badge}
                                        </span>span>
                                              )}
                                  </div>div>
                                  <p className="text-xs text-gray-400 truncate">{tool.tagline}</p>p>
                        </div>div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-teal-400 shrink-0" />
                </a>a>
              );
  }
  
    return (
          <div className="rounded-xl border border-gray-700 bg-gray-900 overflow-hidden hover:border-teal-600 transition-all duration-200 flex flex-col">
                <div className="p-4 flex-1">
                        <div className="flex items-start gap-3 mb-3">
                                  <div
                                                className={`w-10 h-10 rounded-lg ${categoryColors[tool.category]} flex items-center justify-center text-white font-bold shrink-0`}
                                              >
                                    {tool.logoPlaceholder}
                                  </div>div>
                                  <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="font-bold text-white text-sm">{tool.name}</h3>h3>
                                                {tool.badge && (
                            <span className="text-xs bg-teal-900 text-teal-300 px-2 py-0.5 rounded-full">
                              {tool.badge}
                            </span>span>
                                                            )}
                                              </div>div>
                                              <p className="text-xs text-teal-400 font-medium">{tool.tagline}</p>p>
                                  </div>div>
                                  <div className="flex items-center gap-0.5 shrink-0">
                                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                              <span className="text-xs text-gray-400">{tool.rating}</span>span>
                                  </div>div>
                        </div>div>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                          {tool.description}
                        </p>p>
                </div>div>
                <div className="px-4 pb-4">
                        <a
                                    href={tool.affiliateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors duration-200 group"
                                  >
                                  <Shield className="w-4 h-4" />
                                  <span>{tool.cta}</span>span>
                                  <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                        </a>a>
                        <p className="text-center text-xs text-gray-600 mt-1.5">
                                  Affiliate link. We may earn a commission.
                        </p>p>
                </div>div>
          </div>div>
        );
}</a>
