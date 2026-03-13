import { Link } from "wouter";
import { CLUSTER_RELATIONSHIPS, CLUSTER_TARGET_PAGES, CLUSTER_LABELS, type SEOCluster } from "@shared/seo-keywords";
import { SCAM_PAGES } from "@shared/scam-content";
import { ArrowRight, BookOpen } from "lucide-react";

interface RelatedContentProps {
  currentCluster: string;
  currentPath: string;
  relatedSlugs?: string[];
  maxItems?: number;
}

export function RelatedContent({ currentCluster, currentPath, relatedSlugs, maxItems = 6 }: RelatedContentProps) {
  const links: { path: string; title: string; description?: string }[] = [];

  if (relatedSlugs && relatedSlugs.length > 0) {
    for (const slug of relatedSlugs) {
      const scamPage = SCAM_PAGES.find(p => p.slug === slug);
      if (scamPage && `/scams/${scamPage.slug}` !== currentPath) {
        links.push({
          path: `/scams/${scamPage.slug}`,
          title: scamPage.title,
          description: scamPage.overview.substring(0, 120) + "...",
        });
      }
    }
  }

  const cluster = currentCluster as SEOCluster;
  if (CLUSTER_RELATIONSHIPS[cluster]) {
    const relatedClusters = CLUSTER_RELATIONSHIPS[cluster];
    for (const relCluster of relatedClusters) {
      const pages = CLUSTER_TARGET_PAGES[relCluster];
      if (pages) {
        for (const page of pages) {
          if (page.path !== currentPath && !links.some(l => l.path === page.path)) {
            const label = CLUSTER_LABELS[relCluster];
            links.push({
              path: page.path,
              title: page.title,
              description: `Related ${label} resource`,
            });
          }
        }
      }
    }
  }

  const displayLinks = links.slice(0, maxItems);

  if (displayLinks.length === 0) return null;

  return (
    <section className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700" data-testid="section-related-content">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-teal-600" />
        Related Resources
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className="group flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all"
            data-testid={`link-related-${link.path.replace(/\//g, "-")}`}
          >
            <div className="min-w-0">
              <h4 className="font-medium text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">{link.title}</h4>
              {link.description && (
                <p className="text-xs text-muted-foreground mt-1 truncate">{link.description}</p>
              )}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-teal-600 flex-shrink-0 ml-2 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}
