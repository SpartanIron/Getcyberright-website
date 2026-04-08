"use client";

import { useEffect } from "react";

// Client-side SEO hook for dynamic page meta updates.
// Next.js App Router metadata (app/*/page.tsx) handles server-side meta for crawlers.
// This hook updates meta tags client-side for SPA navigation within pages.

interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
  keywords?: string;
  canonicalUrl?: string;
}

export function useSEO({
  title,
  description,
  ogTitle,
  ogDescription,
  ogType = "website",
  ogImage,
  keywords,
  canonicalUrl
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateCanonical = (url: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = url;
    };

    updateMeta("description", description);
    updateMeta("og:title", ogTitle || title, true);
    updateMeta("og:description", ogDescription || description, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:url", canonicalUrl || window.location.href, true);
    
    // Update Twitter meta tags dynamically
    updateMeta("twitter:title", ogTitle || title);
    updateMeta("twitter:description", ogDescription || description);
    
    if (ogImage) {
      const absoluteImage = ogImage.startsWith("http") ? ogImage : `https://www.getcyberright.com${ogImage}`;
      updateMeta("og:image", absoluteImage, true);
      updateMeta("twitter:image", absoluteImage);
    }
    
    if (keywords) {
      updateMeta("keywords", keywords);
    }

    if (canonicalUrl) {
      updateCanonical(canonicalUrl);
    } else {
      updateCanonical(`https://www.getcyberright.com${window.location.pathname}`);
    }

    return () => {
      document.title = "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors";
    };
  }, [title, description, ogTitle, ogDescription, ogType, ogImage, keywords, canonicalUrl]);
}
