import { useEffect } from "react";

interface OrganizationData {
  type: "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQData {
  type: "FAQPage";
  items: FAQItem[];
}

interface ArticleData {
  type: "Article";
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; url?: string };
  publisher: { name: string; logo?: string };
  image?: string;
}

interface HowToStep {
  name: string;
  text: string;
}

interface HowToData {
  type: "HowTo";
  name: string;
  description: string;
  steps: HowToStep[];
  dateModified?: string;
}

interface WebSiteData {
  type: "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    queryInput: string;
    target: string;
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbData {
  type: "BreadcrumbList";
  items: BreadcrumbItem[];
}

interface CourseData {
  type: "Course";
  name: string;
  description: string;
  provider: string;
  url?: string;
  isAccessibleForFree?: boolean;
}

interface WebApplicationData {
  type: "WebApplication";
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: { price: string; priceCurrency: string };
  provider?: string;
}

interface BlogPostingData {
  type: "BlogPosting";
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; url?: string };
  publisher: { name: string; logo?: string };
  image?: string;
  articleSection?: string;
  keywords?: string[];
  wordCount?: number;
}

interface DatasetData {
  type: "Dataset";
  name: string;
  description: string;
  url: string;
  keywords?: string[];
  creator?: { name: string; url?: string };
  dateModified?: string;
  license?: string;
  variableMeasured?: string[];
  measurementTechnique?: string;
  distribution?: { contentUrl: string; encodingFormat: string };
}

type StructuredDataInput =
  | OrganizationData
  | FAQData
  | ArticleData
  | HowToData
  | WebSiteData
  | BreadcrumbData
  | CourseData
  | WebApplicationData
  | BlogPostingData
  | DatasetData;

function buildJsonLd(data: StructuredDataInput): object {
  switch (data.type) {
    case "Organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: data.name,
        url: data.url,
        logo: data.logo,
        description: data.description,
        sameAs: data.sameAs || [],
      };

    case "FAQPage":
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      };

    case "Article":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.headline,
        description: data.description,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        author: {
          "@type": "Organization",
          name: data.author.name,
          url: data.author.url,
        },
        publisher: {
          "@type": "Organization",
          name: data.publisher.name,
          logo: data.publisher.logo
            ? {
                "@type": "ImageObject",
                url: data.publisher.logo,
              }
            : undefined,
        },
        image: data.image,
      };

    case "HowTo":
      return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: data.name,
        description: data.description,
        dateModified: data.dateModified,
        step: data.steps.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          text: step.text,
        })),
      };

    case "WebSite":
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: data.name,
        url: data.url,
        description: data.description,
        ...(data.potentialAction
          ? {
              potentialAction: {
                "@type": "SearchAction",
                target: data.potentialAction.target,
                "query-input": data.potentialAction.queryInput,
              },
            }
          : {}),
      };

    case "BreadcrumbList":
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: data.items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      };

    case "Course":
      return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: data.name,
        description: data.description,
        provider: {
          "@type": "Organization",
          name: data.provider,
        },
        url: data.url,
        isAccessibleForFree: data.isAccessibleForFree ?? true,
      };

    case "WebApplication":
      return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: data.name,
        description: data.description,
        url: data.url,
        applicationCategory: data.applicationCategory,
        operatingSystem: data.operatingSystem || "All",
        offers: data.offers ? {
          "@type": "Offer",
          price: data.offers.price,
          priceCurrency: data.offers.priceCurrency,
        } : {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        ...(data.provider ? {
          provider: {
            "@type": "Organization",
            name: data.provider,
          },
        } : {}),
      };

    case "BlogPosting":
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: data.headline,
        description: data.description,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        author: {
          "@type": "Organization",
          name: data.author.name,
          ...(data.author.url ? { url: data.author.url } : {}),
        },
        publisher: {
          "@type": "Organization",
          name: data.publisher.name,
          ...(data.publisher.logo ? {
            logo: {
              "@type": "ImageObject",
              url: data.publisher.logo,
            },
          } : {}),
        },
        ...(data.image ? { image: data.image } : {}),
        ...(data.articleSection ? { articleSection: data.articleSection } : {}),
        ...(data.keywords ? { keywords: data.keywords.join(", ") } : {}),
        ...(data.wordCount ? { wordCount: data.wordCount } : {}),
      };

    case "Dataset":
      return {
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: data.name,
        description: data.description,
        url: data.url,
        ...(data.keywords ? { keywords: data.keywords } : {}),
        ...(data.creator ? {
          creator: {
            "@type": "Organization",
            name: data.creator.name,
            ...(data.creator.url ? { url: data.creator.url } : {}),
          },
        } : {}),
        ...(data.dateModified ? { dateModified: data.dateModified } : {}),
        ...(data.license ? { license: data.license } : {}),
        ...(data.variableMeasured ? { variableMeasured: data.variableMeasured } : {}),
        ...(data.measurementTechnique ? { measurementTechnique: data.measurementTechnique } : {}),
        ...(data.distribution ? {
          distribution: {
            "@type": "DataDownload",
            contentUrl: data.distribution.contentUrl,
            encodingFormat: data.distribution.encodingFormat,
          },
        } : {}),
      };

    default:
      return {};
  }
}

const SCRIPT_ID_PREFIX = "structured-data-";

export function StructuredData({ data }: { data: StructuredDataInput | StructuredDataInput[] }) {
  useEffect(() => {
    const items = Array.isArray(data) ? data : [data];
    const scriptIds: string[] = [];

    items.forEach((item, index) => {
      const id = `${SCRIPT_ID_PREFIX}${item.type}-${index}`;
      scriptIds.push(id);

      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = id;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(buildJsonLd(item));
    });

    return () => {
      scriptIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, [data]);

  return null;
}

export type {
  OrganizationData,
  FAQData,
  FAQItem,
  ArticleData,
  BlogPostingData,
  HowToData,
  WebSiteData,
  BreadcrumbData,
  CourseData,
  WebApplicationData,
  DatasetData,
  StructuredDataInput,
};
