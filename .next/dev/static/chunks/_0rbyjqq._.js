(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/client/src/hooks/use-seo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSEO",
    ()=>useSEO
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useSEO({ title, description, ogTitle, ogDescription, ogType = "website", ogImage, keywords, canonicalUrl }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSEO.useEffect": ()=>{
            document.title = title;
            const updateMeta = {
                "useSEO.useEffect.updateMeta": (name, content, isProperty = false)=>{
                    const attr = isProperty ? "property" : "name";
                    let meta = document.querySelector(`meta[${attr}="${name}"]`);
                    if (!meta) {
                        meta = document.createElement("meta");
                        meta.setAttribute(attr, name);
                        document.head.appendChild(meta);
                    }
                    meta.content = content;
                }
            }["useSEO.useEffect.updateMeta"];
            const updateCanonical = {
                "useSEO.useEffect.updateCanonical": (url)=>{
                    let link = document.querySelector('link[rel="canonical"]');
                    if (!link) {
                        link = document.createElement("link");
                        link.rel = "canonical";
                        document.head.appendChild(link);
                    }
                    link.href = url;
                }
            }["useSEO.useEffect.updateCanonical"];
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
            return ({
                "useSEO.useEffect": ()=>{
                    document.title = "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors";
                }
            })["useSEO.useEffect"];
        }
    }["useSEO.useEffect"], [
        title,
        description,
        ogTitle,
        ogDescription,
        ogType,
        ogImage,
        keywords,
        canonicalUrl
    ]);
}
_s(useSEO, "OD7bBpZva5O2jO+Puf00hKivP7c=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/structured-data.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StructuredData",
    ()=>StructuredData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function buildJsonLd(data) {
    switch(data.type){
        case "Organization":
            return {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: data.name,
                url: data.url,
                logo: data.logo,
                description: data.description,
                sameAs: data.sameAs || []
            };
        case "FAQPage":
            return {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: data.items.map((item)=>({
                        "@type": "Question",
                        name: item.question,
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: item.answer
                        }
                    }))
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
                    url: data.author.url
                },
                publisher: {
                    "@type": "Organization",
                    name: data.publisher.name,
                    logo: data.publisher.logo ? {
                        "@type": "ImageObject",
                        url: data.publisher.logo
                    } : undefined
                },
                image: data.image
            };
        case "HowTo":
            return {
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: data.name,
                description: data.description,
                dateModified: data.dateModified,
                step: data.steps.map((step, i)=>({
                        "@type": "HowToStep",
                        position: i + 1,
                        name: step.name,
                        text: step.text
                    }))
            };
        case "WebSite":
            return {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: data.name,
                url: data.url,
                description: data.description,
                ...data.potentialAction ? {
                    potentialAction: {
                        "@type": "SearchAction",
                        target: data.potentialAction.target,
                        "query-input": data.potentialAction.queryInput
                    }
                } : {}
            };
        case "BreadcrumbList":
            return {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: data.items.map((item, i)=>({
                        "@type": "ListItem",
                        position: i + 1,
                        name: item.name,
                        item: item.url
                    }))
            };
        case "Course":
            return {
                "@context": "https://schema.org",
                "@type": "Course",
                name: data.name,
                description: data.description,
                provider: {
                    "@type": "Organization",
                    name: data.provider
                },
                url: data.url,
                isAccessibleForFree: data.isAccessibleForFree ?? true
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
                    priceCurrency: data.offers.priceCurrency
                } : {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD"
                },
                ...data.provider ? {
                    provider: {
                        "@type": "Organization",
                        name: data.provider
                    }
                } : {}
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
                    ...data.author.url ? {
                        url: data.author.url
                    } : {}
                },
                publisher: {
                    "@type": "Organization",
                    name: data.publisher.name,
                    ...data.publisher.logo ? {
                        logo: {
                            "@type": "ImageObject",
                            url: data.publisher.logo
                        }
                    } : {}
                },
                ...data.image ? {
                    image: data.image
                } : {},
                ...data.articleSection ? {
                    articleSection: data.articleSection
                } : {},
                ...data.keywords ? {
                    keywords: data.keywords.join(", ")
                } : {},
                ...data.wordCount ? {
                    wordCount: data.wordCount
                } : {}
            };
        case "Dataset":
            return {
                "@context": "https://schema.org",
                "@type": "Dataset",
                name: data.name,
                description: data.description,
                url: data.url,
                ...data.keywords ? {
                    keywords: data.keywords
                } : {},
                ...data.creator ? {
                    creator: {
                        "@type": "Organization",
                        name: data.creator.name,
                        ...data.creator.url ? {
                            url: data.creator.url
                        } : {}
                    }
                } : {},
                ...data.dateModified ? {
                    dateModified: data.dateModified
                } : {},
                ...data.license ? {
                    license: data.license
                } : {},
                ...data.variableMeasured ? {
                    variableMeasured: data.variableMeasured
                } : {},
                ...data.measurementTechnique ? {
                    measurementTechnique: data.measurementTechnique
                } : {},
                ...data.distribution ? {
                    distribution: {
                        "@type": "DataDownload",
                        contentUrl: data.distribution.contentUrl,
                        encodingFormat: data.distribution.encodingFormat
                    }
                } : {}
            };
        default:
            return {};
    }
}
const SCRIPT_ID_PREFIX = "structured-data-";
function StructuredData({ data }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StructuredData.useEffect": ()=>{
            const items = Array.isArray(data) ? data : [
                data
            ];
            const scriptIds = [];
            items.forEach({
                "StructuredData.useEffect": (item, index)=>{
                    const id = `${SCRIPT_ID_PREFIX}${item.type}-${index}`;
                    scriptIds.push(id);
                    let script = document.getElementById(id);
                    if (!script) {
                        script = document.createElement("script");
                        script.id = id;
                        script.type = "application/ld+json";
                        document.head.appendChild(script);
                    }
                    script.textContent = JSON.stringify(buildJsonLd(item));
                }
            }["StructuredData.useEffect"]);
            return ({
                "StructuredData.useEffect": ()=>{
                    scriptIds.forEach({
                        "StructuredData.useEffect": (id)=>{
                            const el = document.getElementById(id);
                            if (el) el.remove();
                        }
                    }["StructuredData.useEffect"]);
                }
            })["StructuredData.useEffect"];
        }
    }["StructuredData.useEffect"], [
        data
    ]);
    return null;
}
_s(StructuredData, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = StructuredData;
var _c;
__turbopack_context__.k.register(_c, "StructuredData");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/seo-keywords.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLUSTER_LABELS",
    ()=>CLUSTER_LABELS,
    "CLUSTER_RELATIONSHIPS",
    ()=>CLUSTER_RELATIONSHIPS,
    "CLUSTER_TARGET_PAGES",
    ()=>CLUSTER_TARGET_PAGES,
    "SEO_CLUSTERS",
    ()=>SEO_CLUSTERS,
    "SEO_KEYWORDS",
    ()=>SEO_KEYWORDS
]);
const SEO_CLUSTERS = [
    "identity-theft",
    "online-scams",
    "phishing-attacks",
    "cyber-safety-seniors",
    "cyber-safety-kids",
    "password-security",
    "privacy-protection",
    "device-security",
    "data-breaches",
    "social-media-security"
];
const CLUSTER_LABELS = {
    "identity-theft": "Identity Theft",
    "online-scams": "Online Scams",
    "phishing-attacks": "Phishing Attacks",
    "cyber-safety-seniors": "Cyber Safety for Seniors",
    "cyber-safety-kids": "Cyber Safety for Kids",
    "password-security": "Password Security",
    "privacy-protection": "Privacy Protection",
    "device-security": "Device Security",
    "data-breaches": "Data Breaches",
    "social-media-security": "Social Media Security"
};
const CLUSTER_RELATIONSHIPS = {
    "identity-theft": [
        "privacy-protection",
        "data-breaches",
        "online-scams"
    ],
    "online-scams": [
        "phishing-attacks",
        "identity-theft",
        "cyber-safety-seniors"
    ],
    "phishing-attacks": [
        "online-scams",
        "password-security",
        "social-media-security"
    ],
    "cyber-safety-seniors": [
        "online-scams",
        "phishing-attacks",
        "identity-theft"
    ],
    "cyber-safety-kids": [
        "social-media-security",
        "privacy-protection",
        "device-security"
    ],
    "password-security": [
        "identity-theft",
        "phishing-attacks",
        "device-security"
    ],
    "privacy-protection": [
        "identity-theft",
        "data-breaches",
        "social-media-security"
    ],
    "device-security": [
        "password-security",
        "privacy-protection",
        "data-breaches"
    ],
    "data-breaches": [
        "identity-theft",
        "privacy-protection",
        "password-security"
    ],
    "social-media-security": [
        "privacy-protection",
        "cyber-safety-kids",
        "phishing-attacks"
    ]
};
const CLUSTER_TARGET_PAGES = {
    "identity-theft": [
        {
            path: "/data-removal",
            title: "Data Broker Removal Tool"
        },
        {
            path: "/emergency-help",
            title: "Identity Theft Recovery Guide"
        },
        {
            path: "/scams/identity-theft",
            title: "How Identity Theft Happens"
        }
    ],
    "online-scams": [
        {
            path: "/scam-checker",
            title: "GCR Scam Guard"
        },
        {
            path: "/scams/paypal-scam",
            title: "PayPal Scam Guide"
        },
        {
            path: "/scams/amazon-scam",
            title: "Amazon Scam Guide"
        },
        {
            path: "/scams/romance-scam",
            title: "Romance Scam Guide"
        },
        {
            path: "/report-scam",
            title: "Report a Scam"
        }
    ],
    "phishing-attacks": [
        {
            path: "/scam-checker",
            title: "Phishing Detection Tool"
        },
        {
            path: "/scams/phishing",
            title: "Phishing Attack Guide"
        },
        {
            path: "/training",
            title: "Anti-Phishing Training"
        }
    ],
    "cyber-safety-seniors": [
        {
            path: "/seniors",
            title: "Senior Cyber Safety Hub"
        },
        {
            path: "/scams/tech-support-scam",
            title: "Tech Support Scam Guide"
        },
        {
            path: "/emergency-help",
            title: "Emergency Help for Scam Victims"
        }
    ],
    "cyber-safety-kids": [
        {
            path: "/kids",
            title: "Kids Digital Safety Hub"
        },
        {
            path: "/parents",
            title: "Parent Safety Resources"
        },
        {
            path: "/parents/child-safety-scanner",
            title: "Child Safety Conversation Scanner"
        }
    ],
    "password-security": [
        {
            path: "/password-generator",
            title: "Security Key Generator"
        },
        {
            path: "/cyber-hygiene",
            title: "Cyber Hygiene Assessment"
        },
        {
            path: "/training",
            title: "Password Security Training"
        }
    ],
    "privacy-protection": [
        {
            path: "/data-removal",
            title: "Data Broker Removal"
        },
        {
            path: "/ai-safety",
            title: "AI Privacy Guide"
        },
        {
            path: "/privacy",
            title: "Privacy Policy"
        }
    ],
    "device-security": [
        {
            path: "/cyber-hygiene",
            title: "Device Security Check"
        },
        {
            path: "/password-generator",
            title: "Secure Password Generator"
        },
        {
            path: "/training",
            title: "Device Security Training"
        }
    ],
    "data-breaches": [
        {
            path: "/breach-dashboard",
            title: "Breach Monitoring Dashboard"
        },
        {
            path: "/data-removal",
            title: "Remove Your Exposed Data"
        },
        {
            path: "/scams/data-breach",
            title: "Data Breach Response Guide"
        }
    ],
    "social-media-security": [
        {
            path: "/ai-safety",
            title: "AI and Social Media Safety"
        },
        {
            path: "/parents",
            title: "Social Media Safety for Families"
        },
        {
            path: "/scams/facebook-scam",
            title: "Facebook Scam Guide"
        },
        {
            path: "/scams/instagram-scam",
            title: "Instagram Scam Guide"
        }
    ]
};
const SEO_KEYWORDS = [
    // IDENTITY THEFT CLUSTER (30 keywords)
    {
        keyword: "how to prevent identity theft",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "identity theft warning signs",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "what to do if identity is stolen",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "identity theft recovery steps",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "identity theft protection tips",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "how criminals steal identity",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft statistics",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft prevention checklist",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/checklists"
    },
    {
        keyword: "how to freeze your credit",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "credit freeze vs fraud alert",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/emergency-help"
    },
    {
        keyword: "identity theft monitoring tools",
        cluster: "identity-theft",
        searchIntent: "commercial",
        contentType: "tool",
        priority: "medium",
        targetPage: "/data-removal"
    },
    {
        keyword: "how identity theft happens",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "child identity theft protection",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "identity theft scams",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft examples",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft victims guide",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "identity theft reporting process",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/report-scam"
    },
    {
        keyword: "identity theft recovery plan",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "financial identity theft",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "tax identity theft",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "social security identity theft",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft investigation",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft protection services",
        cluster: "identity-theft",
        searchIntent: "commercial",
        contentType: "article",
        priority: "medium",
        targetPage: "/data-removal"
    },
    {
        keyword: "identity theft online risks",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft red flags",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft protection checklist",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/checklists"
    },
    {
        keyword: "identity theft protection tips for seniors",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "identity theft case studies",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft prevention strategies",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "identity theft consequences",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    // ONLINE SCAMS CLUSTER (40 keywords)
    {
        keyword: "common online scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "latest internet scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/news"
    },
    {
        keyword: "paypal scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/paypal-scam"
    },
    {
        keyword: "amazon scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/amazon-scam"
    },
    {
        keyword: "facebook marketplace scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/facebook-scam"
    },
    {
        keyword: "instagram scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/instagram-scam"
    },
    {
        keyword: "whatsapp scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/whatsapp-scam"
    },
    {
        keyword: "romance scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/romance-scam"
    },
    {
        keyword: "crypto investment scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "job scams online",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/job-scam"
    },
    {
        keyword: "fake charity scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "tech support scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/tech-support-scam"
    },
    {
        keyword: "phishing scams examples",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phone scams targeting seniors",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "fake delivery scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/delivery-scam"
    },
    {
        keyword: "gift card scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "zelle scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/zelle-scam"
    },
    {
        keyword: "venmo scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "online shopping scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/shopping-scam"
    },
    {
        keyword: "email scams examples",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "social media scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "lottery scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "advance fee scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "internet fraud schemes",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "scam warning signs",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "how to detect scams online",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "how scammers manipulate victims",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "scammer tactics explained",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "internet scam statistics",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "real scam examples",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "how scammers steal money",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "common fraud schemes",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "online scam prevention",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "scam reporting process",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/report-scam"
    },
    {
        keyword: "scam awareness tips",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "scam detection tips",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "financial scams explained",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "digital scam threats",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "how to report scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/report-scam"
    },
    {
        keyword: "scam protection guide",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/scam-checker"
    },
    // PHISHING ATTACKS CLUSTER (30 keywords)
    {
        keyword: "phishing email examples",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing attack definition",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "how to detect phishing emails",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing scams examples",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing message warning signs",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing prevention tips",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "spear phishing explained",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing vs spoofing",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "how phishing works",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing statistics",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing attacks on businesses",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "phishing email red flags",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing email templates used by scammers",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing links explained",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing message analysis",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "tool",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "phishing awareness tips",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing case studies",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing email detection",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "tool",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "phishing risks explained",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing prevention checklist",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/checklists"
    },
    {
        keyword: "phishing attack response",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "phishing attacks targeting seniors",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "phishing attacks targeting businesses",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "phishing email reporting",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/report-scam"
    },
    {
        keyword: "phishing scams on social media",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "phishing scam examples 2026",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing attack methods",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing protection strategies",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "phishing scam detection",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "tool",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "phishing security tips",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/phishing"
    },
    // CYBER SAFETY FOR SENIORS CLUSTER (30 keywords)
    {
        keyword: "cybersecurity tips for seniors",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "online safety for elderly",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "senior scam prevention",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "elder fraud protection",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "seniors tech support scams",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/tech-support-scam"
    },
    {
        keyword: "grandparent scam",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/grandparent-scam"
    },
    {
        keyword: "medicare scams targeting seniors",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "senior romance scam warning signs",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/romance-scam"
    },
    {
        keyword: "safe internet browsing for seniors",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "how to help seniors avoid scams",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "seniors online banking safety",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "phone scams against elderly",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "senior identity theft prevention",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "senior social media safety",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "protecting elderly from phishing",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "senior cybersecurity checklist",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/checklists"
    },
    {
        keyword: "seniors email safety tips",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "elder financial exploitation",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "seniors password security",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "seniors device security tips",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "how seniors get scammed",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "senior scam recovery",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "protecting grandparents online",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "senior online shopping safety",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "telemarketing scams targeting elderly",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "seniors wifi security",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "low",
        targetPage: "/seniors"
    },
    {
        keyword: "senior cyber awareness training",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/training"
    },
    {
        keyword: "age-related cyber vulnerabilities",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/seniors"
    },
    {
        keyword: "senior digital literacy",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "seniors safe video calling",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "low",
        targetPage: "/seniors"
    },
    // CYBER SAFETY FOR KIDS CLUSTER (30 keywords)
    {
        keyword: "internet safety for kids",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "online safety for children",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "cyberbullying prevention",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "parental controls setup",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "kids social media safety",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "safe apps for kids",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/parents"
    },
    {
        keyword: "teaching kids about online predators",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "screen time management for children",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/parents"
    },
    {
        keyword: "child identity theft prevention",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "kids digital footprint",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/kids"
    },
    {
        keyword: "online gaming safety for kids",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "age appropriate internet usage",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/parents"
    },
    {
        keyword: "kids password education",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/kids"
    },
    {
        keyword: "child online privacy protection",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "kids phishing awareness",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/kids"
    },
    {
        keyword: "family cyber safety plan",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "safe search for kids",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/parents"
    },
    {
        keyword: "children sharing personal information online",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "kids cyber safety education",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/training"
    },
    {
        keyword: "monitoring kids online activity",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/parents"
    },
    {
        keyword: "teens social media risks",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "kids first smartphone safety",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "educational cybersecurity games for kids",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/kids"
    },
    {
        keyword: "protecting kids from online scams",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "kids digital wellness",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/kids"
    },
    {
        keyword: "child online safety statistics",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/parents"
    },
    {
        keyword: "kids safe messaging apps",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/parents"
    },
    {
        keyword: "children internet addiction",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/parents"
    },
    {
        keyword: "kids cyber hygiene habits",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/kids"
    },
    {
        keyword: "family internet safety rules",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    // PASSWORD SECURITY CLUSTER (30 keywords)
    {
        keyword: "how to create strong password",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "password manager comparison",
        cluster: "password-security",
        searchIntent: "commercial",
        contentType: "article",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "best password practices",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "two factor authentication setup",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "password security checklist",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/checklists"
    },
    {
        keyword: "passkey vs password",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "how passwords get hacked",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "password strength checker",
        cluster: "password-security",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "common passwords to avoid",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "password reuse dangers",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "biometric authentication explained",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "password generator tool",
        cluster: "password-security",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "how to remember passwords",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "multi factor authentication benefits",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "password entropy explained",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/password-generator"
    },
    {
        keyword: "secure passphrase creation",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "password vault security",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "breached password check",
        cluster: "password-security",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "password cracking methods",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "brute force attack prevention",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "dictionary attack explained",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/password-generator"
    },
    {
        keyword: "password hygiene tips",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "hardware security key",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "single sign on security",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/password-generator"
    },
    {
        keyword: "password policy best practices",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "TOTP authenticator apps",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "credential stuffing prevention",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "password sharing risks",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "kids password education",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/kids"
    },
    {
        keyword: "business password policy",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/small-business"
    },
    // PRIVACY PROTECTION CLUSTER (30 keywords)
    {
        keyword: "how to protect personal data online",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "data broker removal",
        cluster: "privacy-protection",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "remove personal information from internet",
        cluster: "privacy-protection",
        searchIntent: "transactional",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "online privacy checklist",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/checklists"
    },
    {
        keyword: "browser privacy settings",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "VPN explained",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "cookie tracking explained",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "digital footprint management",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "GDPR rights explained",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/privacy"
    },
    {
        keyword: "right to be forgotten",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/data-removal"
    },
    {
        keyword: "data minimization practices",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/data-removal"
    },
    {
        keyword: "private browsing limitations",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "app permissions privacy",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "social media privacy settings",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "personal data protection law",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/privacy"
    },
    {
        keyword: "opt out of data collection",
        cluster: "privacy-protection",
        searchIntent: "transactional",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "location tracking privacy",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "encrypted messaging apps",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "privacy focused search engines",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "smart home privacy risks",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "email privacy protection",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "children online privacy",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "AI data privacy concerns",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "data broker opt out guide",
        cluster: "privacy-protection",
        searchIntent: "transactional",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "privacy audit guide",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "secure file sharing",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "low",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "photo privacy risks",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "workplace privacy rights",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/small-business"
    },
    {
        keyword: "privacy protection for seniors",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "data privacy best practices",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    // DEVICE SECURITY CLUSTER (30 keywords)
    {
        keyword: "how to secure your phone",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "laptop security tips",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "tablet security for seniors",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "smart home device security",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "public wifi security risks",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "software update importance",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "antivirus vs antimalware",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "bluetooth security risks",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "securing IoT devices",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "lost phone security steps",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "device encryption explained",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "secure your home network",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "malware removal guide",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "ransomware protection tips",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "kids device security setup",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "USB security risks",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "secure your webcam",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "browser extension security",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "mobile app security tips",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "backup best practices",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "firewall explained simply",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "router security settings",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "adware removal",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "secure cloud storage",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "operating system security comparison",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "travel device security tips",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/travel-safety"
    },
    {
        keyword: "work from home device security",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "BYOD security policy",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "low",
        targetPage: "/small-business"
    },
    {
        keyword: "phone security for seniors",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "family device security plan",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    // DATA BREACHES CLUSTER (30 keywords)
    {
        keyword: "how to check if data is breached",
        cluster: "data-breaches",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "data breach notification",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "what to do after data breach",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "latest data breaches 2026",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/news"
    },
    {
        keyword: "data breach response plan",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "email breach checker",
        cluster: "data-breaches",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "password breach lookup",
        cluster: "data-breaches",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "how data breaches happen",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "data breach impact on consumers",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "biggest data breaches in history",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "dark web data monitoring",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "data breach class action",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "breach notification laws",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "company data breach responsibility",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "small business data breach prevention",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/small-business"
    },
    {
        keyword: "data breach credit monitoring",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "healthcare data breaches",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "financial data breach protection",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "data breach statistics",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "personal data exposed online",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "social security number breach",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "breach fatigue explained",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "data breach insurance",
        cluster: "data-breaches",
        searchIntent: "commercial",
        contentType: "article",
        priority: "low",
        targetPage: "/small-business"
    },
    {
        keyword: "student data breach risks",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/educators"
    },
    {
        keyword: "medical identity theft after breach",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "data breach prevention checklist",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/checklists"
    },
    {
        keyword: "breach monitoring service",
        cluster: "data-breaches",
        searchIntent: "commercial",
        contentType: "tool",
        priority: "high",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "third party vendor breach risks",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/small-business"
    },
    {
        keyword: "data breach cost to business",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "protecting children from data breaches",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/parents"
    },
    // SOCIAL MEDIA SECURITY CLUSTER (30 keywords)
    {
        keyword: "social media account security",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "facebook security settings",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "instagram privacy settings",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "tiktok safety tips",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "social media hacking prevention",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "fake social media profiles",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "social media phishing attacks",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "social engineering on social media",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "social media identity theft",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "oversharing risks on social media",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "social media for kids safety",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "twitter/x account security",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "linkedin scams",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "social media two factor setup",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "reporting social media harassment",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/emergency-help"
    },
    {
        keyword: "social media data collection",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "deleting social media data",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/data-removal"
    },
    {
        keyword: "social media scam red flags",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "catfishing warning signs",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/romance-scam"
    },
    {
        keyword: "social media impersonation",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "protecting teens on social media",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "social media addiction risks",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/kids"
    },
    {
        keyword: "influencer scams",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "social media privacy audit",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "business social media security",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "social media account recovery",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "deepfake social media risks",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "social media misinformation",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "seniors social media safety",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "social media security checklist",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/checklists"
    },
    // AI SCAMS AND DEEPFAKE DETECTION (22 keywords)
    {
        keyword: "AI scam detection",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "tool",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "deepfake detection tools",
        cluster: "online-scams",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "how to spot a deepfake video",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "AI voice cloning scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/ai-scam"
    },
    {
        keyword: "deepfake audio detection",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "tool",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "AI generated phishing emails",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "ChatGPT scam messages",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "AI impersonation fraud",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/ai-scam"
    },
    {
        keyword: "deepfake romance scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/romance-scam"
    },
    {
        keyword: "AI powered social engineering",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "synthetic identity fraud AI",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "AI deepfake video call scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/ai-scam"
    },
    {
        keyword: "generative AI fraud risks",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "AI chatbot scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "deepfake detection guide for families",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "AI scam warning signs",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "how AI is used in fraud",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "deepfake celebrity scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/ai-scam"
    },
    {
        keyword: "AI generated fake websites",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "voice deepfake prevention tips",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "AI privacy risks explained",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "deepfake protection for seniors",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    // SMART HOME AND IOT SECURITY (16 keywords)
    {
        keyword: "smart home security guide",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "IoT device vulnerabilities",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "smart speaker privacy risks",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "securing smart cameras",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "smart lock security risks",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "smart TV privacy settings",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "IoT botnet attacks explained",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "smart home network segmentation",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "Alexa privacy settings guide",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "Google Home security tips",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "smart thermostat security",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "baby monitor hacking prevention",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "smart doorbell security risks",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "wearable device security",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "IoT firmware update importance",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "smart home privacy checklist",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/checklists"
    },
    // CRYPTO AND BLOCKCHAIN FRAUD (16 keywords)
    {
        keyword: "cryptocurrency scams explained",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "bitcoin investment fraud",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "crypto rug pull scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "NFT scam warning signs",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "fake crypto exchange scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "crypto wallet security tips",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "pig butchering crypto scam",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "blockchain phishing attacks",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "crypto giveaway scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "DeFi scams prevention",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "crypto pump and dump schemes",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "how to verify crypto projects",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "crypto recovery scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/crypto-scam"
    },
    {
        keyword: "seed phrase protection tips",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "crypto romance investment scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/romance-scam"
    },
    {
        keyword: "cryptocurrency fraud reporting",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/report-scam"
    },
    // SOCIAL ENGINEERING TACTICS (16 keywords)
    {
        keyword: "social engineering attacks explained",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "pretexting scam tactics",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "baiting attacks prevention",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "tailgating social engineering",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scam-checker"
    },
    {
        keyword: "vishing phone scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phone-scam"
    },
    {
        keyword: "smishing text message scams",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "quid pro quo scam tactics",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scam-checker"
    },
    {
        keyword: "authority impersonation scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/government-scam"
    },
    {
        keyword: "urgency tactics in scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "fear based manipulation scams",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "psychological manipulation in fraud",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "business email compromise BEC",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/small-business"
    },
    {
        keyword: "CEO fraud scam prevention",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "watering hole attacks",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scam-checker"
    },
    {
        keyword: "social engineering red flags",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "how to resist social engineering",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/training"
    },
    // MOBILE DEVICE SECURITY (16 keywords)
    {
        keyword: "smartphone security checklist",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/checklists"
    },
    {
        keyword: "iPhone security settings guide",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "Android security tips",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "mobile malware protection",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "SIM swap attack prevention",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "mobile banking security tips",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "app store scam apps",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "mobile phishing attacks",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "secure mobile payment tips",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "mobile VPN setup guide",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "phone stolen what to do",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "mobile app permission risks",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "sideloading app risks",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "mobile hotspot security",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "phone number spoofing explained",
        cluster: "online-scams",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phone-scam"
    },
    {
        keyword: "two factor authentication on phone",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/password-generator"
    },
    // EMAIL SECURITY AND PHISHING (21 keywords)
    {
        keyword: "email security best practices",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "how to spot fake emails",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "email spoofing explained",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "whaling attack prevention",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "email encryption guide",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "suspicious email attachment dangers",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "email header analysis guide",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "low",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "spam filter best practices",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "business phishing simulation",
        cluster: "phishing-attacks",
        searchIntent: "commercial",
        contentType: "tool",
        priority: "medium",
        targetPage: "/training"
    },
    {
        keyword: "email compromise recovery steps",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "phishing link checker tool",
        cluster: "phishing-attacks",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "how to report phishing emails",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/report-scam"
    },
    {
        keyword: "email account hacked recovery",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "QR code phishing quishing",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "invoice fraud email scams",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "email forwarding attack risks",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scams/phishing"
    },
    {
        keyword: "disposable email security risks",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "email alias for privacy",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/data-removal"
    },
    {
        keyword: "phishing training for employees",
        cluster: "phishing-attacks",
        searchIntent: "commercial",
        contentType: "guide",
        priority: "high",
        targetPage: "/training"
    },
    {
        keyword: "CEO impersonation email scam",
        cluster: "phishing-attacks",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "email security for seniors",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    // IDENTITY THEFT PREVENTION EXPANDED (20 keywords)
    {
        keyword: "medical identity theft prevention",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "synthetic identity theft explained",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft insurance worth it",
        cluster: "identity-theft",
        searchIntent: "commercial",
        contentType: "article",
        priority: "medium",
        targetPage: "/data-removal"
    },
    {
        keyword: "dark web identity monitoring",
        cluster: "identity-theft",
        searchIntent: "commercial",
        contentType: "tool",
        priority: "high",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "identity theft affidavit guide",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/emergency-help"
    },
    {
        keyword: "how to dispute fraudulent accounts",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "mail theft identity fraud",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "dumpster diving identity theft",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "SSN protection strategies",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "identity theft and tax refund fraud",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "employment identity theft",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft in college students",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "deceased identity theft prevention",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "identity theft and social media",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "credit card fraud vs identity theft",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/identity-theft"
    },
    {
        keyword: "how to place fraud alert on credit",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "identity theft protection for military",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/data-removal"
    },
    {
        keyword: "identity theft during travel",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/travel-safety"
    },
    {
        keyword: "new account fraud prevention",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "identity theft victim support resources",
        cluster: "identity-theft",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    // PASSWORD AND AUTHENTICATION EXPANDED (16 keywords)
    {
        keyword: "passwordless authentication explained",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "FIDO2 security key setup",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "authenticator app comparison",
        cluster: "password-security",
        searchIntent: "commercial",
        contentType: "article",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "passkey setup guide Apple",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "passkey setup guide Google",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "password manager security risks",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "recovery codes backup guide",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "SMS two factor authentication risks",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "phishing resistant authentication",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "zero trust authentication model",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/small-business"
    },
    {
        keyword: "password audit tool",
        cluster: "password-security",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "how long to crack my password",
        cluster: "password-security",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "master password best practices",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/password-generator"
    },
    {
        keyword: "biometric login security risks",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/password-generator"
    },
    {
        keyword: "account lockout best practices",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/small-business"
    },
    {
        keyword: "password sharing with family safely",
        cluster: "password-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/parents"
    },
    // PRIVACY AND DATA PROTECTION EXPANDED (21 keywords)
    {
        keyword: "CCPA consumer rights explained",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/privacy"
    },
    {
        keyword: "data broker list complete",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "how to remove yourself from Google",
        cluster: "privacy-protection",
        searchIntent: "transactional",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "people search site removal",
        cluster: "privacy-protection",
        searchIntent: "transactional",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "personal data deletion requests",
        cluster: "privacy-protection",
        searchIntent: "transactional",
        contentType: "guide",
        priority: "high",
        targetPage: "/data-removal"
    },
    {
        keyword: "privacy focused browser comparison",
        cluster: "privacy-protection",
        searchIntent: "commercial",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "ad tracking opt out guide",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/data-removal"
    },
    {
        keyword: "metadata privacy risks",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/ai-safety"
    },
    {
        keyword: "photo EXIF data privacy",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "DNS privacy explained",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "privacy settings iPhone guide",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "privacy settings Android guide",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "data retention policy explained",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/privacy"
    },
    {
        keyword: "third party cookie alternatives",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "online anonymity guide",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "children data collection COPPA",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "health data privacy HIPAA",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/privacy"
    },
    {
        keyword: "data subject access request guide",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/data-removal"
    },
    {
        keyword: "privacy impact assessment guide",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "low",
        targetPage: "/small-business"
    },
    {
        keyword: "surveillance capitalism explained",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "WhatsApp privacy settings guide",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    // SENIOR-SPECIFIC CYBER SAFETY EXPANDED (16 keywords)
    {
        keyword: "IRS scam calls targeting seniors",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "sweepstakes scams elderly",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "remote access scams seniors",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/tech-support-scam"
    },
    {
        keyword: "caregiver financial exploitation",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "senior tablet setup security guide",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "power of attorney scams",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "seniors texting scam awareness",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "funeral and cemetery scams elderly",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/seniors"
    },
    {
        keyword: "prescription drug scams seniors",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "reverse mortgage scams",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "seniors antivirus setup guide",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/seniors"
    },
    {
        keyword: "family scam code word system",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "seniors online dating safety",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/scams/romance-scam"
    },
    {
        keyword: "grandparent scam prevention tips",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "elder abuse financial signs",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/seniors"
    },
    {
        keyword: "senior smartphone safety course",
        cluster: "cyber-safety-seniors",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/training"
    },
    // KID-SPECIFIC ONLINE SAFETY EXPANDED (16 keywords)
    {
        keyword: "roblox safety for kids",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "minecraft online safety tips",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "kids YouTube safety settings",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "online predator warning signs",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "sexting prevention for teens",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "kids privacy on TikTok",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "teen social media peer pressure",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/kids"
    },
    {
        keyword: "digital citizenship for students",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/educators"
    },
    {
        keyword: "child account security setup",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "kids AI chatbot safety",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "children location sharing risks",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/parents"
    },
    {
        keyword: "teen identity theft risks",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/kids"
    },
    {
        keyword: "school cybersecurity education",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/educators"
    },
    {
        keyword: "family media agreement template",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/parents"
    },
    {
        keyword: "kids safe video chat apps",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/parents"
    },
    {
        keyword: "children in-app purchase scams",
        cluster: "cyber-safety-kids",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/kids"
    },
    // DATA BREACH RESPONSE EXPANDED (16 keywords)
    {
        keyword: "data breach action plan template",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "credit monitoring after data breach",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "data breach settlement claims",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "data leak vs data breach difference",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "how to check dark web for my data",
        cluster: "data-breaches",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "exposed credentials checker",
        cluster: "data-breaches",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "high",
        targetPage: "/breach-dashboard"
    },
    {
        keyword: "data breach notification email real or fake",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scam-checker"
    },
    {
        keyword: "account takeover after breach",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "data breach identity theft risk",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "corporate data breach response",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "zero day breach explained",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/scams/data-breach"
    },
    {
        keyword: "API data breach risks",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/small-business"
    },
    {
        keyword: "data breach victim rights",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "ransomware data breach response",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "supply chain data breach",
        cluster: "data-breaches",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/small-business"
    },
    {
        keyword: "breach impact calculator",
        cluster: "data-breaches",
        searchIntent: "transactional",
        contentType: "tool",
        priority: "medium",
        targetPage: "/breach-dashboard"
    },
    // VPN AND NETWORK SECURITY (12 keywords)
    {
        keyword: "VPN for beginners guide",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "best VPN practices for privacy",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "free VPN security risks",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "VPN vs proxy difference",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "home network security setup",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "wifi security WPA3 explained",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "public wifi safety tips",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "DNS security for families",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/parents"
    },
    {
        keyword: "network monitoring tools home",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "low",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "guest wifi network setup",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    {
        keyword: "VPN for travel security",
        cluster: "privacy-protection",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/travel-safety"
    },
    {
        keyword: "man in the middle attack prevention",
        cluster: "device-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/cyber-hygiene"
    },
    // SOCIAL MEDIA THREATS EXPANDED (16 keywords)
    {
        keyword: "Facebook account hacked recovery",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "Instagram hacked what to do",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "TikTok privacy risks explained",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "social media stalking prevention",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "Snapchat safety settings",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/kids"
    },
    {
        keyword: "Discord safety for teens",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/kids"
    },
    {
        keyword: "social media doxxing prevention",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/ai-safety"
    },
    {
        keyword: "fake giveaway scams social media",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "social media bot detection",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "review and rating scams",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scam-checker"
    },
    {
        keyword: "WhatsApp group scam tactics",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "social media marketplace fraud",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "high",
        targetPage: "/scams/facebook-scam"
    },
    {
        keyword: "Twitter X verification scams",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/scams/social-media-scam"
    },
    {
        keyword: "social media sextortion prevention",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "high",
        targetPage: "/emergency-help"
    },
    {
        keyword: "Threads privacy settings guide",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "guide",
        priority: "medium",
        targetPage: "/ai-safety"
    },
    {
        keyword: "social media digital wellbeing",
        cluster: "social-media-security",
        searchIntent: "informational",
        contentType: "article",
        priority: "medium",
        targetPage: "/ai-safety"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/scam-content.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SCAM_PAGES",
    ()=>SCAM_PAGES,
    "getAllScamSlugs",
    ()=>getAllScamSlugs,
    "getScamBySlug",
    ()=>getScamBySlug
]);
const SCAM_PAGES = [
    {
        slug: "paypal-scam",
        title: "PayPal Scams: How to Spot and Avoid Them",
        metaTitle: "PayPal Scams: How to Identify, Avoid & Report Fraud | GetCyberRight",
        metaDescription: "Learn to identify PayPal scams including fake invoices, shipping fraud, and phishing emails. Step-by-step protection guide with real examples.",
        keywords: [
            "paypal scams",
            "paypal fraud",
            "fake paypal email",
            "paypal phishing",
            "paypal invoice scam"
        ],
        cluster: "online-scams",
        overview: "PayPal scams are among the most common online fraud schemes, targeting the platform's 400+ million users worldwide. Scammers exploit PayPal's trusted reputation by sending fake invoices, phishing emails that mimic PayPal's branding, and fraudulent payment requests. These scams trick victims into sending money, sharing login credentials, or clicking malicious links that install malware. Understanding how these scams work is your best defense against losing money or having your account compromised.",
        howItWorks: [
            "Scammers send fake PayPal invoices for products or services you never purchased, hoping you will pay without checking.",
            "Phishing emails that look identical to real PayPal notifications ask you to 'verify your account' or 'confirm a transaction' by clicking a link that leads to a fake login page.",
            "Overpayment scams where a buyer 'accidentally' sends too much money and asks you to refund the difference before the original payment is reversed.",
            "Fake shipping notifications claim a package is on its way, prompting you to click a tracking link that downloads malware.",
            "Scammers posing as PayPal customer support call to report suspicious activity and ask for your login details to 'secure' your account."
        ],
        warningSigns: [
            "Emails from addresses that do not end in @paypal.com",
            "Urgent messages threatening account suspension unless you act immediately",
            "Invoices for products or services you did not order",
            "Requests to send money via Friends & Family for purchases",
            "Messages with spelling errors, generic greetings like 'Dear User', or mismatched URLs",
            "Requests to call a phone number not listed on PayPal's official website",
            "Payment notifications for amounts you were not expecting"
        ],
        exampleMessages: [
            {
                type: "Phishing Email",
                content: "Subject: Your PayPal account has been limited. Dear Customer, We have noticed unusual activity on your account. Please verify your identity by clicking the link below within 24 hours or your account will be permanently suspended. [Verify Now]"
            },
            {
                type: "Fake Invoice",
                content: "You have received an invoice for $499.99 from Norton Security LLC for Annual Subscription Renewal. If you did not authorize this transaction, call 1-800-XXX-XXXX immediately to cancel."
            },
            {
                type: "Overpayment Scam",
                content: "Hi, I accidentally sent you $1,500 instead of $150 for the item. Can you please refund me the $1,350 difference via Zelle or wire transfer? I really need the money back quickly."
            }
        ],
        preventionSteps: [
            {
                title: "Always log in directly",
                description: "Never click links in emails claiming to be from PayPal. Instead, open your browser and type paypal.com directly to check your account."
            },
            {
                title: "Check the sender's email address",
                description: "Legitimate PayPal emails come from @paypal.com. Look carefully for misspellings like @paypa1.com or @paypal-security.com."
            },
            {
                title: "Never send money outside PayPal for a PayPal transaction",
                description: "If someone asks you to refund money through Zelle, Venmo, wire transfer, or gift cards, it is a scam."
            },
            {
                title: "Enable two-factor authentication",
                description: "Add an extra layer of security to your PayPal account so scammers cannot access it even if they steal your password."
            },
            {
                title: "Report suspicious messages",
                description: "Forward suspicious emails to phishing@paypal.com and delete them. Report fake invoices directly within PayPal."
            },
            {
                title: "Use PayPal's Purchase Protection",
                description: "When buying items, always use Goods & Services payment type to ensure you are covered by PayPal's buyer protection."
            }
        ],
        faq: [
            {
                question: "How do I know if a PayPal email is real?",
                answer: "Real PayPal emails come from @paypal.com, address you by your full name, and never ask you to click a link to verify your account. Log into PayPal directly to check for any actual notifications."
            },
            {
                question: "What should I do if I fell for a PayPal scam?",
                answer: "Change your PayPal password immediately, enable two-factor authentication, report the transaction to PayPal's Resolution Center, contact your bank if a linked account was compromised, and file a report with the FTC at reportfraud.ftc.gov."
            },
            {
                question: "Can PayPal refund money lost to scams?",
                answer: "PayPal may refund transactions made through their platform if reported promptly through the Resolution Center. However, money sent via Friends & Family or transferred outside PayPal is typically not recoverable."
            },
            {
                question: "Are PayPal invoice scams common?",
                answer: "Yes, fake PayPal invoices are one of the most common PayPal scams. Scammers send invoices for products you never ordered, hoping you will call the listed phone number where they will try to steal your information."
            }
        ],
        relatedScams: [
            "zelle-scam",
            "shopping-scam",
            "phishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "amazon-scam",
        title: "Amazon Scams: Protect Yourself from Fake Orders and Fraud",
        metaTitle: "Amazon Scams: Spot Fake Orders, Phishing & Fraud | GetCyberRight",
        metaDescription: "Complete guide to Amazon scams including fake order confirmations, delivery scams, and impersonation calls. Learn how to protect your account and money.",
        keywords: [
            "amazon scams",
            "fake amazon email",
            "amazon phishing",
            "amazon delivery scam",
            "amazon refund scam"
        ],
        cluster: "online-scams",
        overview: "Amazon scams exploit the trust consumers place in the world's largest online retailer. With billions of packages shipped annually, scammers use fake order confirmations, delivery notifications, and account alerts to trick people into revealing personal information or making payments. These scams target both buyers and sellers, using sophisticated techniques that closely mimic Amazon's official communications. Learning to recognize these schemes can save you from financial loss and identity theft.",
        howItWorks: [
            "Scammers send fake order confirmation emails for expensive items you never purchased, prompting you to click a 'Cancel Order' link that leads to a phishing site.",
            "Phone calls from people claiming to be Amazon support, warning about unauthorized purchases on your account and requesting remote access to your computer.",
            "Fake delivery notifications via text message with tracking links that install malware or lead to credential-stealing websites.",
            "Phony Amazon gift card offers that require you to enter personal information or pay a small fee to claim a reward.",
            "Counterfeit seller accounts that list items at impossibly low prices, collect payment, and never deliver the product."
        ],
        warningSigns: [
            "Order confirmations for items you did not purchase",
            "Phone calls from 'Amazon' asking for remote access to your computer",
            "Texts about package delivery problems with unfamiliar tracking links",
            "Requests to pay with gift cards, wire transfers, or cryptocurrency",
            "Emails urging you to update payment information through a provided link",
            "Deals that seem too good to be true with prices far below market value",
            "Messages from sellers asking you to complete transactions outside of Amazon"
        ],
        exampleMessages: [
            {
                type: "Fake Order Email",
                content: "Your Amazon order #112-7654321-9876543 for MacBook Pro ($1,299.99) has been confirmed. If you did not place this order, click here to cancel immediately to avoid being charged."
            },
            {
                type: "Delivery Scam Text",
                content: "Amazon: Your package could not be delivered due to an incomplete address. Update your information here to reschedule delivery: [suspicious link]"
            },
            {
                type: "Phone Scam Script",
                content: "This is Amazon Security calling. We have detected an unauthorized purchase of $799 on your account. To stop this charge, please stay on the line and follow our instructions to verify your identity."
            }
        ],
        preventionSteps: [
            {
                title: "Check orders on amazon.com directly",
                description: "Never click links in order confirmation emails. Log into your Amazon account directly to view your actual order history."
            },
            {
                title: "Amazon will never call asking for payment",
                description: "Amazon does not make outbound calls asking for payment or personal information. If you receive such a call, hang up immediately."
            },
            {
                title: "Use Amazon's in-app messaging",
                description: "Communicate with sellers only through Amazon's messaging system. Never respond to requests to contact sellers via personal email or phone."
            },
            {
                title: "Enable login notifications",
                description: "Turn on Amazon's login notifications so you are alerted whenever someone accesses your account from a new device."
            },
            {
                title: "Report suspicious contacts",
                description: "Forward suspicious emails to stop-spoofing@amazon.com and report phone scams through Amazon's customer service."
            },
            {
                title: "Verify seller ratings",
                description: "Before purchasing from third-party sellers, check their ratings, review count, and how long they have been selling on Amazon."
            }
        ],
        faq: [
            {
                question: "How do I report a scam on Amazon?",
                answer: "Forward suspicious emails to stop-spoofing@amazon.com. For phone scams, report them through Amazon's customer service or at reportfraud.ftc.gov. You can also report suspicious sellers directly through the product listing page."
            },
            {
                question: "Can scammers access my Amazon account?",
                answer: "If you clicked a phishing link and entered your credentials, change your Amazon password immediately, enable two-factor authentication, and review your order history for unauthorized purchases. Also check for any changes to your delivery addresses or payment methods."
            },
            {
                question: "Are Amazon gift card scams common?",
                answer: "Yes. Scammers frequently ask victims to buy Amazon gift cards and share the codes as payment for fake debts, taxes, or prizes. Amazon gift cards can only be used to purchase items on Amazon and should never be used as payment to individuals or organizations outside the platform."
            },
            {
                question: "How do I know if an Amazon email is real?",
                answer: "Real Amazon emails come from an @amazon.com domain and will reference your actual name and order details. You can verify any email by checking your Message Center at amazon.com/gp/message."
            }
        ],
        relatedScams: [
            "delivery-scam",
            "phishing",
            "shopping-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "facebook-scam",
        title: "Facebook and Marketplace Scams: Stay Safe Online",
        metaTitle: "Facebook Scams & Marketplace Fraud: Protection Guide | GetCyberRight",
        metaDescription: "Identify Facebook Marketplace scams, fake profiles, and social media fraud. Learn prevention strategies and how to report Facebook scams safely.",
        keywords: [
            "facebook scams",
            "facebook marketplace scams",
            "facebook phishing",
            "fake facebook profiles",
            "facebook fraud"
        ],
        cluster: "online-scams",
        overview: "Facebook scams range from Marketplace fraud and fake profiles to phishing messages and investment schemes. With nearly 3 billion monthly active users, Facebook is a prime target for scammers who create convincing fake accounts, post fraudulent listings, and send deceptive messages designed to steal money and personal information. Marketplace scams alone cost consumers millions each year through fake product listings, overpayment tricks, and shipping fraud.",
        howItWorks: [
            "Fake Marketplace listings offer popular items at deeply discounted prices, collecting payment through off-platform methods and never delivering the product.",
            "Romance scammers create attractive fake profiles and build emotional connections over weeks or months before asking for money.",
            "Phishing messages from compromised friend accounts ask you to click links, vote in fake contests, or watch 'Is this you?' videos that steal your login credentials.",
            "Fake giveaway and contest pages impersonate legitimate brands, collecting personal information from participants.",
            "Investment scam groups promote fake cryptocurrency or trading opportunities with manufactured success stories."
        ],
        warningSigns: [
            "Marketplace listings with prices significantly below market value",
            "Sellers who refuse to meet in person or only accept off-platform payments",
            "Friend requests from people you are already friends with (cloned profiles)",
            "Messages with suspicious links even from known contacts",
            "Pages promoting guaranteed investment returns",
            "Profiles with very few photos, no mutual friends, and recently created accounts",
            "Urgent messages about account security asking you to click a link"
        ],
        exampleMessages: [
            {
                type: "Marketplace Scam",
                content: "I'm selling this PS5 for $150 because I'm moving and need to get rid of it fast. I can ship it to you if you send payment through Zelle or CashApp. I'll mail it as soon as I get the payment!"
            },
            {
                type: "Phishing Message",
                content: "OMG [your name] is this you in this video?? I can't believe someone posted this!! 😱 [link]"
            },
            {
                type: "Romance Scam",
                content: "I know we've only been talking for a few weeks but I feel such a connection with you. I'm stuck overseas and need help with a plane ticket to come see you. Can you wire me $500?"
            }
        ],
        preventionSteps: [
            {
                title: "Use Facebook's built-in payment system",
                description: "For Marketplace transactions, use Facebook Pay or cash for local pickups. Never send money through wire transfers, gift cards, or peer-to-peer apps for online purchases."
            },
            {
                title: "Meet in safe public locations",
                description: "For local Marketplace transactions, meet at a police station, bank lobby, or other well-lit public place. Never invite strangers to your home."
            },
            {
                title: "Verify profiles before engaging",
                description: "Check the age of the account, number of friends, and post history. Scam profiles are often newly created with few photos and connections."
            },
            {
                title: "Do not click suspicious links",
                description: "Even if a message appears to come from a friend, do not click links without verifying through another communication channel that they actually sent it."
            },
            {
                title: "Enable two-factor authentication",
                description: "Protect your Facebook account with two-factor authentication so scammers cannot take it over even if they obtain your password."
            },
            {
                title: "Report suspicious activity",
                description: "Use Facebook's built-in reporting tools to flag fake profiles, fraudulent listings, and scam messages. This helps protect other users."
            }
        ],
        faq: [
            {
                question: "How do I report a Facebook Marketplace scam?",
                answer: "Click the three dots on the listing and select 'Report listing.' You can also report through facebook.com/help. If you lost money, file a report with the FTC at reportfraud.ftc.gov and your local police."
            },
            {
                question: "Can I get my money back from a Facebook scam?",
                answer: "If you paid through Facebook Pay, you may be eligible for a refund through Facebook's Purchase Protection. If you paid through external methods like wire transfer or gift cards, recovery is very difficult. Contact your bank immediately to report the fraud."
            },
            {
                question: "How do I know if a Facebook profile is fake?",
                answer: "Look for recently created accounts, very few photos (often stock or stolen images), minimal post history, few friends, and no mutual connections. You can reverse-image-search profile photos to check if they appear elsewhere online."
            },
            {
                question: "Are Facebook Marketplace purchases safe?",
                answer: "Facebook Marketplace can be safe if you follow precautions: use Facebook Pay for shipping purchases, meet in public for local sales, verify seller profiles, and never pay with gift cards or wire transfers."
            }
        ],
        relatedScams: [
            "instagram-scam",
            "romance-scam",
            "social-media-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "romance-scam",
        title: "Romance Scams: How Scammers Exploit Love and Trust",
        metaTitle: "Romance Scams: Warning Signs, Prevention & Recovery | GetCyberRight",
        metaDescription: "Learn how romance scammers operate, the warning signs to watch for, and how to protect yourself and loved ones from relationship fraud.",
        keywords: [
            "romance scams",
            "online dating scams",
            "catfishing",
            "romance fraud",
            "love scam warning signs"
        ],
        cluster: "online-scams",
        overview: "Romance scams cost victims more money per incident than almost any other type of fraud, with reported losses exceeding $1.3 billion annually in the United States alone. Scammers create fake profiles on dating apps and social media platforms, building deep emotional connections over weeks or months before requesting money. Victims span all ages but seniors are disproportionately targeted. These scams cause devastating financial and emotional harm, and many victims are too embarrassed to report them.",
        howItWorks: [
            "Scammers create attractive profiles using stolen photos and fabricated backstories, often posing as military personnel, doctors, or overseas business professionals.",
            "They build trust through daily messages, phone calls, and sometimes video chats using deepfake technology, creating a sense of intimacy over weeks or months.",
            "Once emotional attachment is established, they introduce a crisis requiring money, such as a medical emergency, travel costs, or business problem.",
            "Requests start small but escalate, with scammers using guilt, love, and emotional manipulation to extract increasingly larger sums.",
            "Some scammers involve victims in money laundering by asking them to receive and forward money, making the victim an unwitting accomplice."
        ],
        warningSigns: [
            "They fall in love very quickly and express intense feelings early in the relationship",
            "They always have excuses for not meeting in person or video chatting",
            "Their profile photos look like professional model shots",
            "They claim to work overseas, be in the military, or work on an oil rig",
            "They ask for money for emergencies, travel, medical bills, or customs fees",
            "They want to move communication off the dating platform to personal email or messaging apps",
            "Their stories contain inconsistencies or change over time",
            "They ask you to send money via wire transfer, gift cards, or cryptocurrency"
        ],
        exampleMessages: [
            {
                type: "Love Bombing",
                content: "I've never felt this way about anyone before. Even though we haven't met, I know you're my soulmate. I think about you every moment of every day. I want to spend the rest of my life with you."
            },
            {
                type: "Money Request",
                content: "My darling, I'm so embarrassed to ask but I've had a medical emergency and I'm stuck in the hospital overseas. I need $3,000 for the surgery or they won't treat me. You're the only one I trust. I'll pay you back as soon as I'm home."
            },
            {
                type: "Escalation",
                content: "I've booked my flight to come see you! But customs is holding my luggage and demanding a $5,000 clearance fee. If you can help me with this, I'll be in your arms by tomorrow. I promise to pay everything back."
            }
        ],
        preventionSteps: [
            {
                title: "Reverse image search profile photos",
                description: "Copy their profile photo and search it on Google Images or TinEye. Scammers typically steal photos from other social media accounts or stock photo sites."
            },
            {
                title: "Never send money to someone you have not met in person",
                description: "No matter how strong your feelings are, never send money to someone you have only interacted with online. Real partners do not ask for money before meeting."
            },
            {
                title: "Be wary of excuses to avoid video calls",
                description: "If someone always has an excuse for why they cannot video chat, be suspicious. Ask for a live video call where they perform a specific action to verify their identity."
            },
            {
                title: "Talk to trusted friends and family",
                description: "Share the relationship details with people you trust. Scammers isolate victims and discourage them from discussing the relationship with others."
            },
            {
                title: "Watch for love bombing",
                description: "Be cautious of someone who declares love very quickly or pushes the relationship forward faster than feels natural. This is a common manipulation tactic."
            },
            {
                title: "Keep communication on the platform",
                description: "Dating platforms have safety features and moderation. Scammers push to move conversations to personal email or messaging apps to avoid detection."
            }
        ],
        faq: [
            {
                question: "How common are romance scams?",
                answer: "Romance scams are extremely common. The FTC reports that nearly 70,000 Americans reported romance scams in recent years, with losses exceeding $1.3 billion. The actual numbers are likely much higher since many victims do not report due to embarrassment."
            },
            {
                question: "Who is most at risk for romance scams?",
                answer: "While anyone can be targeted, people who are recently divorced, widowed, or lonely are particularly vulnerable. Seniors lose the highest dollar amounts per incident. Scammers specifically target people who appear to be seeking companionship."
            },
            {
                question: "What should I do if I suspect a romance scam?",
                answer: "Stop all communication with the person immediately. Do not send any more money. Save all messages and evidence. Report the scam to the dating platform and your national fraud authority: FTC (reportfraud.ftc.gov) in the US, Action Fraud in the UK, ACSC (scamwatch.gov.au) in Australia, or the Canadian Anti-Fraud Centre. Talk to someone you trust about what happened."
            },
            {
                question: "Can romance scammers use deepfake video calls?",
                answer: "Yes, scammers are increasingly using AI deepfake technology to conduct video calls that appear to show a real person. If something seems off about a video call, ask the person to perform unexpected actions like holding up a specific number of fingers or turning their head, which deepfakes may not handle smoothly."
            }
        ],
        relatedScams: [
            "social-media-scam",
            "facebook-scam",
            "instagram-scam",
            "identity-theft"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "crypto-scam",
        title: "Cryptocurrency Scams: Protect Your Digital Assets",
        metaTitle: "Crypto Scams: Investment Fraud, Rug Pulls & Protection | GetCyberRight",
        metaDescription: "Identify cryptocurrency scams including fake exchanges, rug pulls, and pig butchering schemes. Learn to protect your crypto investments from fraud.",
        keywords: [
            "crypto scams",
            "cryptocurrency fraud",
            "bitcoin scam",
            "pig butchering scam",
            "fake crypto exchange"
        ],
        cluster: "online-scams",
        overview: "Cryptocurrency scams have exploded in recent years, with losses exceeding $5.6 billion annually. Scammers exploit the complexity and novelty of digital currencies to trick victims through fake investment platforms, fraudulent exchanges, rug pulls, and elaborate pig butchering schemes. The irreversible nature of crypto transactions makes recovery nearly impossible. These scams target everyone from first-time investors to experienced traders.",
        howItWorks: [
            "Pig butchering scams build trust through social media or dating apps over weeks before introducing a 'guaranteed' crypto investment opportunity with fake platforms showing impressive returns.",
            "Fake cryptocurrency exchanges and wallets steal deposits by mimicking legitimate platforms with professional-looking websites and fabricated trading data.",
            "Rug pull schemes create a new token, generate hype through social media, pump the price, and then developers cash out, leaving investors with worthless tokens.",
            "Phishing attacks target crypto wallet users with fake emails about security issues, tricking them into entering their seed phrase on fraudulent websites.",
            "Celebrity endorsement scams use deepfake videos of well-known figures promoting fake crypto investments or giveaways."
        ],
        warningSigns: [
            "Guaranteed returns or 'risk-free' investment promises",
            "Pressure to invest quickly before an opportunity disappears",
            "Unsolicited investment advice from strangers on social media",
            "Platforms that make it easy to deposit but difficult to withdraw",
            "Requests to share your wallet seed phrase or private keys",
            "New tokens with anonymous development teams and no audited code",
            "Celebrity endorsement videos that seem too good to be true"
        ],
        exampleMessages: [
            {
                type: "Pig Butchering",
                content: "Hey! I know we just started talking but my uncle is a crypto analyst and he shared an amazing platform with me. I've already made $50K this month! Want me to show you how? You can start with just $500."
            },
            {
                type: "Fake Giveaway",
                content: "BREAKING: Elon Musk is giving away 5,000 BTC to celebrate Tesla's anniversary! Send 0.1 BTC to the address below and receive 1 BTC back instantly! Limited time only! [wallet address]"
            },
            {
                type: "Phishing",
                content: "URGENT: Unusual login detected on your Coinbase account from Russia. Click here immediately to secure your account and verify your identity before funds are transferred."
            }
        ],
        preventionSteps: [
            {
                title: "Never share your seed phrase",
                description: "Your seed phrase is the master key to your crypto wallet. No legitimate service, support agent, or platform will ever ask for it. Anyone who asks for it is trying to steal your funds."
            },
            {
                title: "Use only established exchanges",
                description: "Stick to well-known, regulated exchanges like Coinbase, Kraken, or Gemini. Research any platform thoroughly before depositing funds, and verify the URL carefully."
            },
            {
                title: "Be skeptical of guaranteed returns",
                description: "No legitimate investment can guarantee returns, especially in the volatile crypto market. Promises of guaranteed or unusually high returns are the hallmark of scams."
            },
            {
                title: "Verify celebrity endorsements",
                description: "Scammers frequently use deepfake videos and fake social media posts featuring celebrities. Always verify endorsements through official channels before acting on them."
            },
            {
                title: "Start small and test withdrawals",
                description: "If you try a new platform, start with a very small amount and attempt a withdrawal before depositing more. Scam platforms make withdrawals difficult or impossible."
            },
            {
                title: "Research tokens before investing",
                description: "Check if a token's smart contract code has been audited, investigate the development team, and look for red flags like anonymous founders or locked liquidity claims."
            }
        ],
        faq: [
            {
                question: "What is a pig butchering crypto scam?",
                answer: "Pig butchering is a scam where criminals build a relationship with victims (the 'fattening' phase) before introducing a fake crypto investment platform. Victims see fake profits and invest more and more until the scammers disappear with all the money. The term comes from the concept of 'fattening the pig before slaughter.'"
            },
            {
                question: "Can I recover money lost to crypto scams?",
                answer: "Recovery is very difficult because cryptocurrency transactions are irreversible. Report the scam to your national cybercrime authority (FTC and IC3 in the US, Action Fraud in the UK, ACSC in Australia) and your local police. Some recovery firms exist but be cautious, as many of them are also scams."
            },
            {
                question: "How do I spot a fake crypto exchange?",
                answer: "Red flags include: no regulatory registration, promises of unusually high returns, difficulty withdrawing funds, pressure to deposit more, professional-looking but recently created websites, and no verifiable company information or leadership team."
            },
            {
                question: "Are crypto giveaways legitimate?",
                answer: "Almost never. Legitimate companies do not ask you to send cryptocurrency first in order to receive more back. Any giveaway requiring you to send crypto is a scam, regardless of who appears to be promoting it."
            }
        ],
        relatedScams: [
            "social-media-scam",
            "romance-scam",
            "phishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "tech-support-scam",
        title: "Tech Support Scams: How Criminals Impersonate Helpers",
        metaTitle: "Tech Support Scams: Warning Signs & Prevention Guide | GetCyberRight",
        metaDescription: "Learn how tech support scams work, from fake pop-ups to phone calls. Protect yourself and seniors from remote access fraud and fake virus alerts.",
        keywords: [
            "tech support scams",
            "fake virus warning",
            "microsoft scam call",
            "remote access scam",
            "computer virus pop-up scam"
        ],
        cluster: "cyber-safety-seniors",
        overview: "Tech support scams trick victims into believing their computer is infected with viruses or has serious security problems, then charge hundreds or thousands of dollars for unnecessary 'repairs.' These scams target seniors disproportionately and use fake pop-up warnings, unsolicited phone calls, and search engine ads to reach victims. Once scammers gain remote access to a victim's computer, they can steal personal files, install actual malware, and access financial accounts.",
        howItWorks: [
            "Fake pop-up warnings appear in your browser claiming your computer is infected, displaying a phone number to call for immediate help.",
            "Unsolicited phone calls from people claiming to be Microsoft, Apple, or your internet provider, warning about detected security threats on your device.",
            "Scammers convince victims to download remote access software like TeamViewer or AnyDesk, giving the scammer full control of the computer.",
            "Once connected, scammers show fake 'evidence' of viruses by displaying normal system logs or running fake diagnostic tools.",
            "Victims are charged $200 to $1,000+ for unnecessary services, often through gift cards, wire transfers, or by accessing bank accounts through the remote connection."
        ],
        warningSigns: [
            "Unexpected pop-ups warning about viruses with a phone number to call",
            "Unsolicited calls from 'Microsoft' or 'Apple' about your computer",
            "Requests to install remote access software like TeamViewer or AnyDesk",
            "Pressure to pay immediately with gift cards or wire transfers",
            "Claims that your computer is sending spam or has been hacked",
            "Warnings that your computer will be disabled if you do not act now",
            "Requests to access your bank account through the remote session"
        ],
        exampleMessages: [
            {
                type: "Pop-up Warning",
                content: "WARNING! Your computer has been infected with 5 viruses! Your personal data and banking information is at risk! Do NOT shut down your computer! Call Microsoft Support immediately: 1-888-XXX-XXXX"
            },
            {
                type: "Phone Call",
                content: "Hello, this is John from Microsoft Technical Support. We have detected unusual activity from your computer's IP address. Hackers may have accessed your files. I need to connect to your computer to run a security scan."
            },
            {
                type: "Follow-up Email",
                content: "Your tech support subscription of $399.99 has been auto-renewed. If you wish to cancel and receive a refund, call our support line at 1-800-XXX-XXXX within 24 hours."
            }
        ],
        preventionSteps: [
            {
                title: "Microsoft and Apple will never call you unsolicited",
                description: "Major tech companies do not make outbound calls to customers about security issues. Any such call is a scam. Hang up immediately."
            },
            {
                title: "Close suspicious pop-ups safely",
                description: "If you see a virus warning pop-up, do not call the number. Close the browser using Task Manager (Ctrl+Alt+Delete on Windows, Command+Q on Mac). These pop-ups are fake."
            },
            {
                title: "Never give remote access to unsolicited callers",
                description: "Do not download TeamViewer, AnyDesk, or similar software at the request of someone who contacted you. Only grant remote access to technicians you contacted through verified channels."
            },
            {
                title: "Use legitimate security software",
                description: "Install reputable antivirus software from known companies. Your computer likely already has built-in protection (Windows Defender, macOS security)."
            },
            {
                title: "Talk to a trusted person before paying",
                description: "If you are concerned about your computer, talk to a family member, friend, or visit a local computer repair shop. Never make payments under pressure from an unsolicited call."
            },
            {
                title: "Report tech support scams",
                description: "Report these scams to the FTC at reportfraud.ftc.gov and Microsoft at microsoft.com/reportascam."
            }
        ],
        faq: [
            {
                question: "Can a pop-up warning be a real virus?",
                answer: "No. Legitimate antivirus software will never display a pop-up in your browser with a phone number to call. These are scam websites designed to look alarming. Close your browser completely to dismiss them."
            },
            {
                question: "What do I do if I already gave remote access?",
                answer: "Immediately disconnect from the internet, uninstall any remote access software the scammer installed, run a full antivirus scan, change all passwords from a different device, monitor your bank accounts for unauthorized activity, and contact your bank."
            },
            {
                question: "Why do tech support scams target seniors?",
                answer: "Seniors are targeted because they may be less familiar with how technology works, more trusting of authority figures, more likely to answer phone calls from unknown numbers, and may not have a tech-savvy person nearby to consult."
            },
            {
                question: "How much do tech support scams cost victims?",
                answer: "The average tech support scam costs victims between $200 and $1,000 per incident, but some victims have lost their entire savings. The FTC reports hundreds of millions in annual losses from tech support fraud."
            }
        ],
        relatedScams: [
            "phishing",
            "grandparent-scam",
            "identity-theft"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "phishing",
        title: "Phishing Attacks: The Complete Protection Guide",
        metaTitle: "Phishing Attacks: How to Detect, Prevent & Report Phishing | GetCyberRight",
        metaDescription: "Comprehensive guide to phishing attacks including email phishing, spear phishing, and smishing. Learn to identify and protect yourself from phishing scams.",
        keywords: [
            "phishing attacks",
            "phishing email examples",
            "how to detect phishing",
            "spear phishing",
            "email phishing prevention"
        ],
        cluster: "phishing-attacks",
        overview: "Phishing is the most common type of cyberattack, responsible for over 90% of data breaches. These attacks use deceptive emails, text messages, phone calls, and websites to trick people into revealing sensitive information like passwords, credit card numbers, and Social Security numbers. Phishing has evolved from obvious spam to highly sophisticated targeted attacks that can fool even experienced internet users. Understanding the different types and tactics is essential for staying safe online.",
        howItWorks: [
            "Email phishing sends mass messages disguised as trusted organizations (banks, tech companies, government agencies) with links to fake login pages that harvest credentials.",
            "Spear phishing targets specific individuals using personal information gathered from social media and data breaches to craft convincing, personalized messages.",
            "Smishing (SMS phishing) sends text messages with urgent alerts about packages, bank accounts, or prizes, containing links to malicious websites.",
            "Vishing (voice phishing) uses phone calls with spoofed caller IDs to impersonate banks, government agencies, or tech support.",
            "Clone phishing duplicates a legitimate email you previously received, replacing links or attachments with malicious versions."
        ],
        warningSigns: [
            "Generic greetings like 'Dear Customer' instead of your actual name",
            "Urgent language threatening account closure, legal action, or missed deadlines",
            "Sender email addresses that look similar to but differ from legitimate domains",
            "Links where the displayed text does not match the actual URL (hover to check)",
            "Requests for sensitive information like passwords, Social Security numbers, or PINs",
            "Unexpected attachments, especially .exe, .zip, or macro-enabled documents",
            "Poor grammar, spelling errors, and formatting inconsistencies",
            "Offers that seem too good to be true or unexpected prize notifications"
        ],
        exampleMessages: [
            {
                type: "Bank Phishing",
                content: "ALERT: Unusual activity detected on your account ending in 4532. Your account has been temporarily locked. Click here to verify your identity and restore access: [link]. Failure to verify within 24 hours will result in permanent account closure."
            },
            {
                type: "Spear Phishing",
                content: "Hi [your name], I noticed you attended the Digital Marketing Conference last week. I wanted to share the presentation slides I promised. Here's the download link: [malicious link]. Looking forward to connecting! Best, [fake name]"
            },
            {
                type: "Smishing",
                content: "USPS: Your package #US9847362 has been held due to unpaid shipping fee of $1.99. Complete payment to avoid return: [link]"
            }
        ],
        preventionSteps: [
            {
                title: "Verify sender addresses carefully",
                description: "Look closely at the sender's email address. Phishing emails use domains that look similar to legitimate ones, like 'support@amaz0n-security.com' instead of 'support@amazon.com.'"
            },
            {
                title: "Hover before you click",
                description: "Before clicking any link, hover your mouse over it to see the actual destination URL. On mobile, press and hold the link without tapping. If the URL looks suspicious, do not click."
            },
            {
                title: "Go directly to the source",
                description: "If you receive an alert about your bank account, subscription, or package, do not use the link in the message. Instead, navigate directly to the official website by typing the URL in your browser."
            },
            {
                title: "Enable multi-factor authentication everywhere",
                description: "MFA protects your accounts even if a phishing attack captures your password. Use an authenticator app rather than SMS for the strongest protection."
            },
            {
                title: "Keep software updated",
                description: "Security updates patch vulnerabilities that phishing attacks exploit. Keep your operating system, browser, and security software up to date."
            },
            {
                title: "Use our GCR Scam Guard tool",
                description: "Paste any suspicious message, email, or URL into the GetCyberRight GCR Scam Guard for instant AI-powered analysis of potential phishing indicators."
            }
        ],
        faq: [
            {
                question: "What is the difference between phishing and spear phishing?",
                answer: "Regular phishing sends generic messages to thousands of people hoping some will respond. Spear phishing targets specific individuals using personal details to create highly convincing, personalized messages that are much harder to detect."
            },
            {
                question: "Can phishing emails contain malware?",
                answer: "Yes. Phishing emails can include malicious attachments that install malware, ransomware, or keyloggers when opened. They can also link to websites that automatically download malware to your device."
            },
            {
                question: "What should I do if I clicked a phishing link?",
                answer: "If you entered credentials: change that password immediately on the real site and enable MFA. If you downloaded a file: disconnect from the internet, run antivirus, and consider a professional security check. Monitor your accounts for unusual activity."
            },
            {
                question: "How do I report phishing emails?",
                answer: "Forward phishing emails to the Anti-Phishing Working Group at reportphishing@apwg.org. Report them to the FTC at reportfraud.ftc.gov. Most email providers also have a 'Report phishing' button. Use our Report a Scam tool to contribute to community protection."
            }
        ],
        relatedScams: [
            "social-media-scam",
            "tech-support-scam",
            "identity-theft",
            "data-breach"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "instagram-scam",
        title: "Instagram Scams: Protect Your Account and Identity",
        metaTitle: "Instagram Scams: Fake Followers, DM Fraud & Protection | GetCyberRight",
        metaDescription: "Identify Instagram scams including fake sponsorships, DM phishing, and account takeovers. Learn to protect your Instagram account from fraud.",
        keywords: [
            "instagram scams",
            "instagram phishing",
            "instagram DM scam",
            "fake instagram followers",
            "instagram account hacked"
        ],
        cluster: "social-media-security",
        overview: "Instagram scams exploit the platform's visual nature and influencer culture to trick users into giving up personal information, money, or account access. From fake brand deals and lottery wins to phishing DMs and investment schemes, scammers use sophisticated tactics that target users of all ages. Instagram's emphasis on visual content makes it easy for scammers to create convincing fake profiles and advertisements.",
        howItWorks: [
            "Fake brand partnership messages offer money for promoting products, but require an upfront payment or personal information to 'register.'",
            "Account takeover schemes send messages about copyright violations or verification opportunities, directing victims to fake Instagram login pages.",
            "Investment and get-rich-quick schemes show lavish lifestyles and promise to teach followers how to earn money quickly for a fee.",
            "Fake giveaways require participants to click links, share personal information, or send money to claim nonexistent prizes.",
            "Impersonation accounts duplicate legitimate profiles to scam that person's followers through DMs."
        ],
        warningSigns: [
            "DMs offering large payments for minimal promotion work",
            "Messages about copyright strikes requiring immediate action",
            "Verification badge offers in exchange for personal information",
            "Investment opportunities showing guaranteed returns",
            "Links in DMs or comments from accounts with few posts",
            "Friend or celebrity accounts sending unusual money requests",
            "Requests to move conversations to WhatsApp or email"
        ],
        exampleMessages: [
            {
                type: "Fake Sponsorship",
                content: "Hi! We love your content and want to offer you a paid partnership! You could earn $500-$2000 per post. To get started, we just need you to register on our brand portal: [link]. A small $50 activation fee applies."
            },
            {
                type: "Copyright Scam",
                content: "Instagram Notice: Your account has been reported for copyright infringement. You must verify your identity within 24 hours or your account will be permanently deleted. Verify here: [link]"
            },
            {
                type: "Crypto Scheme",
                content: "I turned $200 into $15,000 in just one week using this crypto trading bot! DM me 'INFO' and I'll show you exactly how. Only 10 spots left! 🚀💰"
            }
        ],
        preventionSteps: [
            {
                title: "Never enter your password on external links",
                description: "Instagram will never send you to an external website to log in. Always check that you are on instagram.com before entering your credentials."
            },
            {
                title: "Enable two-factor authentication",
                description: "Go to Settings > Security > Two-Factor Authentication and enable it using an authentication app for the strongest protection."
            },
            {
                title: "Verify brand offers independently",
                description: "If a brand contacts you for a partnership, search for their official website and contact them through their listed email or social accounts to confirm the offer is real."
            },
            {
                title: "Check official Instagram communications in the app",
                description: "Go to Settings > Security > Emails from Instagram to see legitimate emails Instagram has sent you. If a message is not listed there, it is likely a scam."
            },
            {
                title: "Be cautious with DMs from strangers",
                description: "Do not click links, send money, or share personal information with accounts you do not know personally, regardless of how convincing their profile looks."
            },
            {
                title: "Report and block suspicious accounts",
                description: "Use Instagram's report feature to flag scam accounts. This helps protect the community and removes fraudulent profiles faster."
            }
        ],
        faq: [
            {
                question: "How do I recover a hacked Instagram account?",
                answer: "Visit instagram.com/hacked and follow the recovery steps. You may need to verify your identity through a selfie video. If recovery is unsuccessful, report the issue through Instagram's Help Center. Change passwords on all accounts that shared the same password."
            },
            {
                question: "Are Instagram verification badge offers real?",
                answer: "No. Instagram does not sell verification badges or offer them through DMs. The verification process is handled directly through the Instagram app under Settings. Any message offering to verify your account is a scam."
            },
            {
                question: "Can clicking a link in an Instagram DM hack my account?",
                answer: "Clicking a link itself does not hack your account, but if the link leads to a fake login page where you enter your Instagram password, the scammer will have your credentials. Some links may also attempt to install malware on your device."
            },
            {
                question: "How do I spot a fake Instagram account?",
                answer: "Look for low follower-to-following ratios, very few posts, recently created accounts, generic or stock profile photos, and posts with abnormally high engagement from suspicious-looking accounts."
            }
        ],
        relatedScams: [
            "facebook-scam",
            "social-media-scam",
            "romance-scam",
            "phishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "whatsapp-scam",
        title: "WhatsApp Scams: How Criminals Target Messaging Users",
        metaTitle: "WhatsApp Scams: Identify & Prevent Messaging Fraud | GetCyberRight",
        metaDescription: "Learn about WhatsApp scams including hijacking, impersonation, and verification code theft. Protect your account and family from messaging fraud.",
        keywords: [
            "whatsapp scams",
            "whatsapp fraud",
            "whatsapp hijacking",
            "whatsapp verification scam",
            "whatsapp impersonation"
        ],
        cluster: "online-scams",
        overview: "WhatsApp scams exploit the platform's 2+ billion users through account hijacking, impersonation, and social engineering. Scammers steal verification codes to take over accounts, impersonate family members to request emergency money, and send malicious links disguised as legitimate messages. The personal nature of messaging apps makes these scams particularly effective because victims assume messages from known contacts are trustworthy.",
        howItWorks: [
            "Account hijacking: scammers trick you into sharing your WhatsApp verification code, allowing them to take over your account and message your contacts.",
            "Family impersonation: scammers pretend to be a family member messaging from a 'new phone number' and urgently request money.",
            "Prize and survey scams send messages claiming you have won a prize or can earn rewards by completing a survey that collects personal data.",
            "Malicious links shared in group chats or forwarded messages lead to phishing sites or malware downloads.",
            "Job offer scams recruit people for fake jobs that require upfront fees or involve money laundering."
        ],
        warningSigns: [
            "Messages asking for your 6-digit WhatsApp verification code",
            "A known contact messaging from a 'new number' asking for urgent money",
            "Links to claim prizes, discounts, or free products",
            "Job offers that require upfront payment or seem too easy for the pay",
            "Messages pressuring you to forward content to other contacts",
            "Calls from unknown numbers asking you to share a code sent to your phone"
        ],
        exampleMessages: [
            {
                type: "Verification Code Theft",
                content: "Hi! I accidentally sent my verification code to your number instead of mine. Can you please forward me the 6-digit code you just received? Sorry for the trouble!"
            },
            {
                type: "Family Impersonation",
                content: "Hi Mom, this is Sarah. I got a new phone and lost my old number. I'm in a bit of trouble and need you to transfer $800 to this account urgently. I'll explain everything later. Please don't call my old number."
            },
            {
                type: "Fake Prize",
                content: "Congratulations! You've been selected as a WhatsApp winner! Click below to claim your $1,000 Amazon gift card. Offer expires in 24 hours! [link]"
            }
        ],
        preventionSteps: [
            {
                title: "Never share your verification code",
                description: "Your WhatsApp verification code is only for you. No one, not even WhatsApp, will ever ask for it. Never share it with anyone for any reason."
            },
            {
                title: "Enable two-step verification",
                description: "Go to Settings > Account > Two-Step Verification and set a 6-digit PIN. This prevents scammers from activating your account on another device."
            },
            {
                title: "Verify identity through a different channel",
                description: "If a family member or friend messages from a 'new number' asking for money, call their original number or verify their identity through another method before sending anything."
            },
            {
                title: "Do not click suspicious links",
                description: "Even if a link comes from a known contact, be cautious. Their account may have been compromised. Verify with the sender before clicking."
            },
            {
                title: "Restrict who can add you to groups",
                description: "Go to Settings > Privacy > Groups and limit who can add you to groups to 'My Contacts' to reduce exposure to group-based scams."
            },
            {
                title: "Report and block scam numbers",
                description: "Use WhatsApp's built-in reporting feature to flag scam accounts, which helps WhatsApp remove them from the platform."
            }
        ],
        faq: [
            {
                question: "How do I recover a hijacked WhatsApp account?",
                answer: "Reinstall WhatsApp and register with your phone number. Enter the verification code sent via SMS. This will log the scammer out. Then immediately enable two-step verification. If two-step verification was already enabled by the scammer, you may need to wait 7 days before you can verify without it."
            },
            {
                question: "Can WhatsApp messages contain viruses?",
                answer: "WhatsApp messages themselves do not contain viruses, but links in messages can lead to malicious websites, and shared files could potentially contain malware. Be cautious with links and files from unknown senders."
            },
            {
                question: "How do scammers get my WhatsApp number?",
                answer: "Scammers obtain phone numbers through data breaches, social media profiles, random number generation, and purchasing contact lists. Having your number does not give them access to your account unless they also obtain your verification code."
            },
            {
                question: "Should I respond to scam messages on WhatsApp?",
                answer: "No. Do not respond to suspicious messages. Block the number, report it to WhatsApp, and delete the conversation. Responding confirms your number is active and may lead to more scam attempts."
            }
        ],
        relatedScams: [
            "phishing",
            "grandparent-scam",
            "social-media-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "job-scam",
        title: "Job Scams: How to Spot Fake Employment Offers",
        metaTitle: "Job Scams: Fake Employment Offers & Work-from-Home Fraud | GetCyberRight",
        metaDescription: "Protect yourself from fake job offers, work-from-home scams, and employment fraud. Learn the warning signs and how to verify legitimate opportunities.",
        keywords: [
            "job scams",
            "fake job offers",
            "work from home scam",
            "employment scam",
            "job interview scam"
        ],
        cluster: "online-scams",
        overview: "Job scams prey on people seeking employment by offering attractive positions that do not exist. Scammers post fake listings on legitimate job boards, send unsolicited offers via email and social media, and conduct fake interviews to steal personal information or money. These scams have surged with the rise of remote work, as scammers exploit the demand for work-from-home opportunities. Victims lose money through fake training fees, equipment purchases, and identity theft.",
        howItWorks: [
            "Fake job postings on real job boards offer high salaries for minimal experience, collecting personal data through the application process.",
            "Unsolicited job offers arrive via email, text, or LinkedIn from 'recruiters' for positions you never applied for.",
            "Fake interviews conducted over text or messaging apps lead to requests for Social Security numbers, bank details, or upfront payments.",
            "Equipment and training fee scams require new 'hires' to pay for equipment, training materials, or background checks before starting.",
            "Check forwarding schemes send victims fake checks to deposit and forward money, leaving the victim liable when the check bounces."
        ],
        warningSigns: [
            "Job offers for positions you never applied to",
            "Interviews conducted entirely over text message or chat",
            "Requests for payment for training, equipment, or background checks",
            "Salaries that are significantly above market rate for the role",
            "Vague job descriptions with no specific duties or requirements",
            "Companies with no verifiable online presence or reviews",
            "Requests for bank account or Social Security number before being officially hired",
            "Pressure to accept immediately without time to research"
        ],
        exampleMessages: [
            {
                type: "Unsolicited Offer",
                content: "Hi [name], I'm a recruiter from [company]. I found your resume online and have an amazing work-from-home opportunity. Data entry position, $45/hour, flexible schedule, no experience needed. Reply YES to learn more!"
            },
            {
                type: "Equipment Scam",
                content: "Congratulations on being selected! Before your start date, you'll need to purchase the company software package ($299) from our vendor. We'll reimburse you on your first paycheck."
            },
            {
                type: "Check Scam",
                content: "We're sending you a check for $3,500 to purchase your home office equipment. Please deposit it, keep $500 for yourself, and send the remaining $3,000 to our equipment vendor via wire transfer."
            }
        ],
        preventionSteps: [
            {
                title: "Research the company thoroughly",
                description: "Search for the company name, check their official website, look for reviews on Glassdoor, and verify the job listing appears on their official careers page."
            },
            {
                title: "Never pay to get a job",
                description: "Legitimate employers do not charge employees for training, equipment, background checks, or application processing. Any request for payment is a red flag."
            },
            {
                title: "Verify recruiter identities",
                description: "Look up the recruiter on the company's official LinkedIn page or website. Call the company's main number and ask to speak with their HR department."
            },
            {
                title: "Protect your personal information",
                description: "Do not provide your Social Security number, bank account, or other sensitive information until you have verified the job is legitimate and you have a formal written offer."
            },
            {
                title: "Be skeptical of too-good-to-be-true offers",
                description: "If a job promises high pay for easy work with no experience required, it is likely a scam. Research typical salaries for similar positions."
            },
            {
                title: "Use official job platforms",
                description: "Apply through company websites directly or established job boards. Be cautious of jobs advertised only through social media or messaging apps."
            }
        ],
        faq: [
            {
                question: "How do I report a fake job posting?",
                answer: "Report fake listings to the job board where you found them (Indeed, LinkedIn, etc.), the FTC at reportfraud.ftc.gov, and your state attorney general. If you shared personal information, place a fraud alert on your credit reports."
            },
            {
                question: "Can job scammers steal my identity?",
                answer: "Yes. Job scams frequently collect Social Security numbers, driver's license copies, bank account details, and other personal information through fake application and onboarding processes. This information can be used for identity theft."
            },
            {
                question: "Are work-from-home jobs always scams?",
                answer: "No, many legitimate companies offer remote positions. However, scammers exploit the demand for remote work. Verify any opportunity by researching the company, checking their official website for the listing, and never paying upfront fees."
            },
            {
                question: "What should I do if I deposited a fake check?",
                answer: "Contact your bank immediately to report the check as fraudulent. Do not spend or send any of the money. File a police report and report the scam to the FTC. You may be held responsible for the full amount of the bounced check."
            }
        ],
        relatedScams: [
            "phishing",
            "identity-theft",
            "social-media-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "delivery-scam",
        title: "Fake Delivery Scams: Package Notification Fraud",
        metaTitle: "Delivery Scams: Fake Package Notifications & USPS/UPS Fraud | GetCyberRight",
        metaDescription: "Spot fake delivery notifications from USPS, FedEx, UPS, and Amazon. Learn how delivery scams work and how to protect yourself from package fraud.",
        keywords: [
            "delivery scam",
            "fake package notification",
            "usps scam text",
            "fedex scam",
            "ups phishing"
        ],
        cluster: "online-scams",
        overview: "Fake delivery scams have become one of the fastest-growing fraud types, exploiting the massive increase in online shopping. Scammers send text messages and emails impersonating USPS, FedEx, UPS, Amazon, and other carriers, claiming there is a problem with a package delivery. These messages contain links to phishing sites that steal personal information, payment details, or install malware on your device.",
        howItWorks: [
            "Scammers send mass text messages claiming a package delivery failed and requesting address verification through a link.",
            "Fake email notifications mimic real carrier branding, asking victims to pay a small redelivery fee that captures credit card information.",
            "QR codes on fake delivery notices left on doors direct victims to phishing websites.",
            "Fake tracking pages ask for login credentials or payment information to 'schedule redelivery.'",
            "Brushing scams send real packages you did not order, using your address to create fake reviews."
        ],
        warningSigns: [
            "Delivery notifications for packages you did not order",
            "Texts from short codes or unknown numbers about deliveries",
            "Requests to pay a fee to receive or redeliver a package",
            "Tracking links that do not go to official carrier websites",
            "Messages with urgent deadlines to claim a package",
            "Notifications that do not include your actual name"
        ],
        exampleMessages: [
            {
                type: "Fake USPS Text",
                content: "USPS: We were unable to deliver your package. Schedule a redelivery by verifying your address: [link]. Package will be returned if not claimed within 48 hours."
            },
            {
                type: "FedEx Email",
                content: "FedEx Delivery Exception: Package #FX7739201 requires a $1.99 redelivery fee due to incorrect address. Update your information: [link]"
            },
            {
                type: "Missed Delivery Notice",
                content: "UPS: Your package is being held at our facility. A customs/processing fee of $3.50 is required before delivery. Complete payment: [link]"
            }
        ],
        preventionSteps: [
            {
                title: "Track packages through official apps and websites only",
                description: "If you receive a delivery notification, do not click the link. Instead, go directly to the carrier's official website or app and enter the tracking number manually."
            },
            {
                title: "Carriers never charge redelivery fees via text",
                description: "USPS, FedEx, UPS, and other major carriers do not charge fees via text message or email to redeliver packages. Any such request is a scam."
            },
            {
                title: "Check your actual orders",
                description: "Before responding to any delivery notification, verify whether you actually have a pending order through the retailer's website or your email order confirmations."
            },
            {
                title: "Do not scan unknown QR codes",
                description: "If you find a delivery notice with a QR code that you were not expecting, do not scan it. Contact the carrier directly through their official website."
            },
            {
                title: "Report suspicious messages",
                description: "Forward suspicious texts to 7726 (SPAM) and report phishing emails to the carrier. For USPS, report to uspis.gov."
            }
        ],
        faq: [
            {
                question: "Why am I getting fake delivery texts?",
                answer: "Scammers send millions of fake delivery texts to random phone numbers, especially during holiday shopping seasons. Your number may have been obtained from data breaches, social media, or randomly generated."
            },
            {
                question: "What happens if I click a fake delivery link?",
                answer: "The link typically leads to a phishing site that asks for personal information or credit card details. Some links may attempt to install malware. If you clicked but did not enter information, run an antivirus scan. If you entered information, change your passwords and monitor your accounts."
            },
            {
                question: "Does USPS send text messages about deliveries?",
                answer: "USPS only sends text messages if you specifically signed up for Informed Delivery text notifications. USPS will never send texts asking for payment or personal information."
            },
            {
                question: "What is a brushing scam?",
                answer: "A brushing scam is when you receive packages you did not order. Companies send cheap items to random addresses so they can post fake verified purchase reviews. While not directly harmful, it means someone has your name and address. Report it to the retailer."
            }
        ],
        relatedScams: [
            "phishing",
            "amazon-scam",
            "shopping-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "zelle-scam",
        title: "Zelle Scams: How Instant Payments Enable Fraud",
        metaTitle: "Zelle Scams: Payment Fraud Prevention & Recovery Guide | GetCyberRight",
        metaDescription: "Learn how Zelle scams work including bank impersonation, fake buyer schemes, and unauthorized transfers. Protect your money from instant payment fraud.",
        keywords: [
            "zelle scams",
            "zelle fraud",
            "zelle payment scam",
            "bank impersonation zelle",
            "zelle money lost"
        ],
        cluster: "online-scams",
        overview: "Zelle scams exploit the instant, irreversible nature of peer-to-peer payments to steal money from victims. Because Zelle transfers are instantaneous and cannot be reversed like credit card charges, scammers have increasingly targeted the platform. Common schemes include bank impersonation, fake buyer scams on marketplaces, and social engineering attacks that trick victims into sending money they cannot recover.",
        howItWorks: [
            "Bank impersonation: scammers call or text pretending to be your bank's fraud department, guiding you through steps that actually send your money to the scammer's account.",
            "Marketplace overpayment: a fake buyer 'accidentally' sends too much via Zelle and asks you to refund the difference before the original payment is reversed.",
            "Fake invoices and payment requests arrive via Zelle from scammers posing as businesses for services you never used.",
            "Romance and social media scammers request Zelle payments because they know the transfers are instant and irreversible.",
            "Account upgrade scams claim you need to send money to yourself to 'upgrade' your Zelle account, but the money actually goes to the scammer."
        ],
        warningSigns: [
            "Calls or texts from your 'bank' asking you to send Zelle payments to stop fraud",
            "Buyers wanting to overpay and requesting refunds through Zelle",
            "Requests to send Zelle payments to yourself to 'verify' or 'upgrade' your account",
            "Pressure to send payments immediately",
            "Payment requests from people or businesses you do not know",
            "Instructions to send money to a different phone number or email than expected"
        ],
        exampleMessages: [
            {
                type: "Bank Impersonation",
                content: "Bank of America Fraud Alert: Suspicious Zelle transfer of $500 detected. Reply YES to confirm or NO to cancel. If you did not authorize this, call us immediately at 1-800-XXX-XXXX."
            },
            {
                type: "Overpayment",
                content: "I sent you $1,000 instead of $100 via Zelle by mistake! Can you please send back the $900 difference? I really need it for rent. Please send it quickly!"
            },
            {
                type: "Account Upgrade",
                content: "To upgrade your Zelle to a business account and receive the $2,000 payment, you'll need to first send $200 to this email address for verification. It will be refunded immediately."
            }
        ],
        preventionSteps: [
            {
                title: "Only send Zelle payments to people you know and trust",
                description: "Zelle is designed for sending money to friends and family. Never use it for purchases from strangers or unknown businesses."
            },
            {
                title: "Your bank will never ask you to send Zelle payments",
                description: "Banks do not ask customers to transfer money via Zelle to stop fraud. If you receive such a call, hang up and call your bank using the number on your debit card."
            },
            {
                title: "Never refund overpayments",
                description: "If someone 'accidentally' sends too much money, do not send money back. The original payment is likely fraudulent and will be reversed, leaving you out the money you sent."
            },
            {
                title: "Verify payment requests independently",
                description: "If you receive a Zelle request from someone claiming to be a business or service provider, verify their identity through official channels before sending payment."
            },
            {
                title: "Set up Zelle alerts",
                description: "Enable notifications for all Zelle transactions so you are immediately aware of any unauthorized activity on your account."
            }
        ],
        faq: [
            {
                question: "Can I get my money back if I was scammed on Zelle?",
                answer: "Unfortunately, Zelle transfers that you authorized are generally not reversible, even if you were tricked. However, unauthorized transfers (ones you did not initiate) are protected. Report fraud to your bank immediately and file complaints with the FTC and CFPB."
            },
            {
                question: "Is Zelle safe to use?",
                answer: "Zelle is safe when used for its intended purpose: sending money to people you know and trust personally. It is not designed for transactions with strangers and offers no buyer or seller protection like PayPal or credit cards."
            },
            {
                question: "How do bank impersonation Zelle scams work?",
                answer: "Scammers spoof your bank's phone number and claim fraud was detected. They guide you through steps to 'secure' your account that actually involve sending your money to the scammer. Your bank will never ask you to send Zelle payments to stop fraud."
            },
            {
                question: "Should I use Zelle for Marketplace purchases?",
                answer: "No. Never use Zelle to pay for items from strangers on Facebook Marketplace, Craigslist, or similar platforms. If the item is not as described or never arrives, you have no way to recover your payment."
            }
        ],
        relatedScams: [
            "paypal-scam",
            "shopping-scam",
            "phishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "shopping-scam",
        title: "Online Shopping Scams: Fake Stores and Purchase Fraud",
        metaTitle: "Online Shopping Scams: Fake Websites & Purchase Fraud | GetCyberRight",
        metaDescription: "Identify fake online stores, counterfeit products, and shopping fraud. Learn to verify legitimate retailers and protect your money when shopping online.",
        keywords: [
            "online shopping scams",
            "fake online store",
            "counterfeit products online",
            "shopping fraud",
            "fake website scam"
        ],
        cluster: "online-scams",
        overview: "Online shopping scams use fake websites, social media ads, and fraudulent listings to trick consumers into paying for products that never arrive or are drastically different from what was advertised. These scam stores often mimic legitimate retailers with professional-looking websites, stolen product images, and too-good-to-be-true prices. With billions spent online annually, shopping scams cost consumers hundreds of millions of dollars each year.",
        howItWorks: [
            "Fake online stores with professional designs offer popular products at deep discounts, collect payment, and never ship anything.",
            "Social media ads promote 'limited time' deals on trending products, linking to scam websites that harvest payment information.",
            "Counterfeit product sellers deliver cheap knockoffs that look nothing like the advertised items.",
            "Bait-and-switch stores show one product but ship a completely different, much cheaper item.",
            "Subscription traps offer free trials that automatically enroll victims in expensive recurring charges."
        ],
        warningSigns: [
            "Prices that are 50% or more below retail for popular products",
            "Websites with no physical address, phone number, or contact information",
            "Only accepting payment through wire transfer, gift cards, or cryptocurrency",
            "Recently created websites with no customer reviews outside their own site",
            "Poor grammar, spelling errors, and low-quality website design",
            "No clear return policy or terms of service",
            "Social media ads with high engagement but comments disabled"
        ],
        exampleMessages: [
            {
                type: "Social Media Ad",
                content: "FLASH SALE: Nike Air Max 90 - 85% OFF! Only $29.99 (Regular $189.99). Limited stock available. Free shipping worldwide. Shop now before they're gone!"
            },
            {
                type: "Fake Store",
                content: "Thank you for your order #FS-28471! Your 4K Smart TV ($99.99) will be shipped within 7-10 business days. For tracking information, visit our website. No tracking updates after 2 weeks."
            },
            {
                type: "Subscription Trap",
                content: "Try our premium skincare FREE! Just pay $4.99 shipping. (Hidden in fine print: By accepting this offer, you agree to monthly shipments of $89.99 per month billed automatically.)"
            }
        ],
        preventionSteps: [
            {
                title: "Research the store before buying",
                description: "Search for the store name plus 'scam' or 'reviews.' Check the Better Business Bureau, Trustpilot, and Reddit for customer experiences. Verify the website's age using whois lookup tools."
            },
            {
                title: "Use credit cards for online purchases",
                description: "Credit cards offer fraud protection and chargeback options that debit cards, wire transfers, and gift cards do not. Never buy from online stores that only accept non-reversible payment methods."
            },
            {
                title: "Check for secure checkout",
                description: "Verify the website URL starts with https:// and has a padlock icon. However, note that scam sites can also have SSL certificates, so this alone does not guarantee legitimacy."
            },
            {
                title: "Be skeptical of extreme discounts",
                description: "If a deal seems too good to be true, it almost certainly is. Compare prices across multiple legitimate retailers to gauge realistic pricing."
            },
            {
                title: "Read the fine print",
                description: "Before entering payment information, check for hidden subscription terms, return policies, and shipping details. Legitimate retailers have clear, accessible policies."
            },
            {
                title: "Check for real contact information",
                description: "Legitimate stores provide a physical address, phone number, and customer service email. Try contacting them before purchasing to verify they are real."
            }
        ],
        faq: [
            {
                question: "How do I get a refund from a fake online store?",
                answer: "If you paid by credit card, file a chargeback with your bank. If you paid through PayPal, open a dispute. For other payment methods, recovery is much harder. Report the scam to the FTC and your state consumer protection office."
            },
            {
                question: "How can I check if an online store is legitimate?",
                answer: "Check the domain age using WHOIS, look for reviews on independent sites, verify the contact information, check for social media presence with real engagement, and search for the store name plus 'scam' or 'review.'"
            },
            {
                question: "Are social media shopping ads safe?",
                answer: "Not always. While many legitimate retailers advertise on social media, scammers also create convincing ads. Before purchasing from a social media ad, research the seller independently and verify they are a real, established business."
            },
            {
                question: "What is a bait-and-switch scam?",
                answer: "A bait-and-switch scam advertises one product (the bait) but delivers a different, inferior product (the switch). The item shipped may be a cheap knockoff or completely unrelated to what was ordered."
            }
        ],
        relatedScams: [
            "amazon-scam",
            "delivery-scam",
            "social-media-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "grandparent-scam",
        title: "Grandparent Scams: Protecting Seniors from Family Impersonation",
        metaTitle: "Grandparent Scams: Emergency Impersonation Fraud Prevention | GetCyberRight",
        metaDescription: "Learn how grandparent scams work, where criminals impersonate family members in crisis. Protection tips for seniors and families.",
        keywords: [
            "grandparent scam",
            "emergency scam call",
            "family impersonation scam",
            "senior phone scam",
            "grandchild scam"
        ],
        cluster: "cyber-safety-seniors",
        overview: "Grandparent scams are a cruel form of fraud that specifically targets seniors by exploiting their love for their grandchildren. Scammers call pretending to be a grandchild in distress, often claiming to have been arrested, in an accident, or stranded overseas. They beg for immediate financial help and plead with the victim not to tell other family members. These scams have become more dangerous with AI voice cloning technology that can mimic a real person's voice from just a few seconds of audio.",
        howItWorks: [
            "A scammer calls pretending to be a grandchild in distress, using a panicked voice and saying 'Grandma/Grandpa, it's me!'",
            "They claim an emergency such as arrest, car accident, medical emergency, or being stranded in another country.",
            "They ask for immediate money via wire transfer, gift cards, or cash sent by courier.",
            "They insist the grandparent not tell other family members, often saying they are embarrassed or that it could hurt their case.",
            "AI voice cloning technology now allows scammers to mimic the actual grandchild's voice using audio from social media videos."
        ],
        warningSigns: [
            "A caller claiming to be a grandchild but sounding slightly different",
            "Urgent requests for money due to an emergency",
            "Instructions to keep the situation secret from other family members",
            "Requests for payment via wire transfer, gift cards, or cash",
            "A 'lawyer' or 'police officer' gets on the line to validate the story",
            "The caller cannot answer personal questions that the real grandchild would know"
        ],
        exampleMessages: [
            {
                type: "Initial Call",
                content: "Grandma? It's me... [crying]. I've been in a terrible car accident and I got arrested. I need you to send $5,000 for bail right away. Please don't tell Mom and Dad, they'll be so disappointed in me."
            },
            {
                type: "Lawyer Follow-up",
                content: "Hello, this is Attorney James Smith. I'm representing your grandchild. They've asked me to contact you about their bail. We need $8,000 wired to our office immediately to prevent them from spending the weekend in jail."
            },
            {
                type: "AI Voice Clone",
                content: "[Using AI-cloned voice of actual grandchild] Grandpa, I'm stuck in Mexico and my wallet was stolen. I need you to wire me $3,000 through Western Union so I can get home. I'm so scared."
            }
        ],
        preventionSteps: [
            {
                title: "Establish a family code word",
                description: "Create a secret code word that only family members know. In an emergency, ask the caller for the code word. Use the GetCyberRight Family Codeword Generator to create one."
            },
            {
                title: "Hang up and verify",
                description: "If someone claims to be a grandchild in trouble, hang up and call the grandchild directly on their known phone number. Contact their parents or other family members to verify the situation."
            },
            {
                title: "Do not wire money or buy gift cards",
                description: "Legitimate emergencies are never resolved by wiring money or buying gift cards. Bail bonds, hospitals, and lawyers accept traditional payment methods."
            },
            {
                title: "Ask personal questions",
                description: "Ask the caller questions only your real grandchild would know, such as the name of their pet, their school, or a recent family event."
            },
            {
                title: "Be aware of AI voice cloning",
                description: "Scammers can now clone voices from social media videos. Even if a voice sounds like your grandchild, still verify through independent contact."
            },
            {
                title: "Discuss this scam with elderly family members",
                description: "Make sure seniors in your family know about grandparent scams and have a plan to verify emergency calls before sending money."
            }
        ],
        faq: [
            {
                question: "How do grandparent scams find their victims?",
                answer: "Scammers get information from social media profiles, data breaches, phone directories, and obituaries. They may know a grandchild's name and location from public social media posts. Some simply call random seniors and let the victim fill in details."
            },
            {
                question: "Can AI really clone my grandchild's voice?",
                answer: "Yes. Modern AI voice cloning technology can create a convincing replica of someone's voice from just a few seconds of audio, often taken from social media videos. This makes it crucial to verify any urgent request through independent means."
            },
            {
                question: "What should I do if I already sent money?",
                answer: "Contact the wire service or gift card company immediately to attempt to stop or reverse the transaction. File a police report, contact your bank, and report to your national fraud authority: FTC (reportfraud.ftc.gov) in the US, Action Fraud (actionfraud.police.uk) in the UK, or Scamwatch (scamwatch.gov.au) in Australia."
            },
            {
                question: "How can I protect my grandparents from this scam?",
                answer: "Set up a family code word, discuss how these scams work, and encourage them to always verify emergency calls by hanging up and calling the grandchild directly. Make sure they know it is safe to call family members to verify, regardless of what the caller says."
            }
        ],
        relatedScams: [
            "tech-support-scam",
            "romance-scam",
            "identity-theft"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "social-media-scam",
        title: "Social Media Scams: Protecting Your Digital Life",
        metaTitle: "Social Media Scams: Complete Protection Guide | GetCyberRight",
        metaDescription: "Comprehensive guide to social media scams across all platforms. Learn to identify fake profiles, scam ads, and protect your accounts from fraud.",
        keywords: [
            "social media scams",
            "social media fraud",
            "fake profile scam",
            "social media security",
            "social engineering attacks"
        ],
        cluster: "social-media-security",
        overview: "Social media scams affect billions of users across platforms like Facebook, Instagram, TikTok, LinkedIn, and X (Twitter). Scammers exploit the trust and openness of social platforms to steal money, harvest personal data, and spread malware. From fake giveaways and phishing messages to investment schemes and romance fraud, social media has become the primary channel for reaching potential scam victims. Understanding how these scams operate across platforms is essential for staying safe online.",
        howItWorks: [
            "Fake profiles impersonate real people or create attractive personas to build trust before scamming followers.",
            "Phishing links shared in comments, DMs, and posts redirect users to credential-stealing websites.",
            "Fake giveaways and contest pages collect personal information under the guise of prize entry.",
            "Investment and money-making scheme accounts showcase fake luxury lifestyles to lure victims.",
            "Compromised accounts send scam messages to the victim's contacts, exploiting existing trust."
        ],
        warningSigns: [
            "Accounts with few followers but following many people",
            "DMs from strangers with links or money-making offers",
            "Giveaways requiring you to click external links or share personal data",
            "Investment advice promising guaranteed returns",
            "Messages from friends that seem out of character or urgent",
            "Ads for products with impossibly low prices",
            "Requests to move conversations to other platforms"
        ],
        exampleMessages: [
            {
                type: "Giveaway Scam",
                content: "You've been randomly selected to win a $500 gift card! Like this post, follow our page, and click the link in bio to claim. Must enter within 24 hours!"
            },
            {
                type: "Compromised Account",
                content: "Hey! I found this photo of you on this website, you need to see this... [link]"
            },
            {
                type: "Investment Pitch",
                content: "I made $12,000 last week from my phone! My mentor taught me forex trading and now I help others do the same. DM me 'START' to learn the method. 🔥💰"
            }
        ],
        preventionSteps: [
            {
                title: "Enable two-factor authentication on all social accounts",
                description: "This is the single most important step. Use an authenticator app rather than SMS for stronger protection against account takeovers."
            },
            {
                title: "Be selective about friend and follow requests",
                description: "Only accept requests from people you know personally. Scammers create fake or cloned profiles to gain access to your information."
            },
            {
                title: "Do not click links in DMs from unknown accounts",
                description: "Even if a message seems interesting or urgent, do not click links from accounts you do not know. Verify with the sender through another channel if the message appears to come from a friend."
            },
            {
                title: "Review your privacy settings regularly",
                description: "Limit who can see your posts, friend list, and personal information. The less data visible publicly, the harder it is for scammers to target you."
            },
            {
                title: "Report suspicious accounts and content",
                description: "Use each platform's reporting tools to flag scam accounts, fake ads, and suspicious content. This helps protect the entire community."
            },
            {
                title: "Verify opportunities independently",
                description: "If you see an enticing offer, giveaway, or job opportunity on social media, verify it through the official website of the company involved before engaging."
            }
        ],
        faq: [
            {
                question: "Which social media platform has the most scams?",
                answer: "Facebook and Instagram see the highest volume of reported scams due to their large user bases. However, scams are prevalent across all platforms including TikTok, LinkedIn, X (Twitter), and messaging apps."
            },
            {
                question: "How do I know if my social media account was hacked?",
                answer: "Signs include posts you did not make, messages sent from your account that you did not write, changed passwords or email addresses, unfamiliar login locations in your account security settings, and friends reporting suspicious messages from you."
            },
            {
                question: "Are sponsored ads on social media safe?",
                answer: "While many sponsored ads are from legitimate businesses, scammers also purchase ads. Always research the advertiser independently before making purchases. Look for reviews, verify the company exists, and be wary of deals that seem too good to be true."
            },
            {
                question: "How can I protect my children from social media scams?",
                answer: "Set age-appropriate accounts, enable privacy settings, use parental controls, teach them never to share personal information or click suspicious links, and maintain open communication about their online interactions."
            }
        ],
        relatedScams: [
            "facebook-scam",
            "instagram-scam",
            "phishing",
            "romance-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "identity-theft",
        title: "Identity Theft: Prevention, Detection, and Recovery",
        metaTitle: "Identity Theft: Complete Prevention & Recovery Guide | GetCyberRight",
        metaDescription: "Learn how identity theft happens, warning signs to watch for, and step-by-step recovery guide. Protect your personal information from criminals.",
        keywords: [
            "identity theft",
            "identity theft prevention",
            "identity theft recovery",
            "how identity theft happens",
            "identity theft warning signs"
        ],
        cluster: "identity-theft",
        overview: "Identity theft occurs when someone uses your personal information without permission to commit fraud or other crimes. It affects millions of people each year, with losses totaling billions of dollars. Criminals steal identities through data breaches, phishing attacks, mail theft, dumpster diving, and social engineering. The impact goes far beyond financial loss, affecting credit scores, employment opportunities, and emotional wellbeing. Early detection and swift action are critical to minimizing damage.",
        howItWorks: [
            "Data breaches expose millions of records containing Social Security numbers, credit card numbers, and other personal data that criminals sell on the dark web.",
            "Phishing attacks trick victims into entering personal information on fake websites or sharing details over the phone.",
            "Mail theft and dumpster diving allow criminals to collect credit card statements, bank statements, and pre-approved credit offers.",
            "Social engineering manipulates people into revealing personal information through pretexting, impersonation, and relationship building.",
            "Stolen personal data is used to open new credit accounts, file fraudulent tax returns, commit medical identity theft, or take over existing accounts."
        ],
        warningSigns: [
            "Unfamiliar charges on your credit card or bank statements",
            "Bills or statements for accounts you did not open",
            "Unexpected calls from debt collectors about debts you do not owe",
            "Denial of credit applications for no apparent reason",
            "IRS notice about duplicate tax returns filed in your name",
            "Missing mail or unfamiliar mail arriving at your address",
            "Unexpected changes to your credit score",
            "Medical bills for treatments you did not receive"
        ],
        exampleMessages: [
            {
                type: "Account Opening Alert",
                content: "Thank you for opening your new Capital One credit card ending in 4821. Your credit limit is $5,000. If you did not apply for this card, please contact us immediately."
            },
            {
                type: "IRS Notice",
                content: "Dear Taxpayer, Our records indicate that a federal tax return was already filed using your Social Security number for the current tax year. If you did not file this return, you may be a victim of identity theft."
            },
            {
                type: "Collection Notice",
                content: "This is an attempt to collect a debt. You owe $3,247 to [company] for services rendered. If you do not pay within 30 days, this will be reported to credit bureaus."
            }
        ],
        preventionSteps: [
            {
                title: "Freeze your credit",
                description: "Place a security freeze with all three credit bureaus (Equifax, Experian, TransUnion). This prevents anyone from opening new credit accounts in your name. It is free and can be temporarily lifted when you need to apply for credit."
            },
            {
                title: "Monitor your accounts regularly",
                description: "Review bank and credit card statements weekly. Check your credit reports at annualcreditreport.com. Set up transaction alerts for all financial accounts."
            },
            {
                title: "Protect your Social Security number",
                description: "Never carry your Social Security card in your wallet. Only share your SSN when absolutely necessary and verify why it is needed. Do not provide it over the phone unless you initiated the call."
            },
            {
                title: "Use our Data Broker Removal tool",
                description: "Remove your personal information from data broker websites that sell your data to anyone willing to pay. The GetCyberRight Data Broker Removal tool helps you find and remove your data from 501+ broker sites."
            },
            {
                title: "Secure your mail",
                description: "Use a locked mailbox or PO box, opt for electronic statements, and shred documents containing personal information before discarding them."
            },
            {
                title: "Use strong, unique passwords",
                description: "Use a different password for every account and enable multi-factor authentication. Our Security Key Generator can create strong passwords instantly."
            }
        ],
        faq: [
            {
                question: "How do I check if my identity has been stolen?",
                answer: "Review your credit reports from all three bureaus at annualcreditreport.com, check your bank and credit card statements for unfamiliar charges, monitor your mailbox for unexpected bills or account statements, and use the GetCyberRight Breach Monitoring tool to check if your data appears in known breaches."
            },
            {
                question: "What is the first thing I should do if my identity is stolen?",
                answer: "First, place a fraud alert with one of the three credit bureaus (they are required to notify the other two). Then file an identity theft report at identitytheft.gov, freeze your credit at all three bureaus, and contact any companies where fraudulent accounts were opened."
            },
            {
                question: "How long does identity theft recovery take?",
                answer: "Recovery time varies widely depending on the severity. Simple cases may be resolved in a few weeks, while complex cases involving multiple fraudulent accounts, tax fraud, or criminal identity theft can take months or even years to fully resolve."
            },
            {
                question: "Can children be victims of identity theft?",
                answer: "Yes, child identity theft is a growing problem. Children's Social Security numbers can be used for years before the theft is discovered. Parents should freeze their children's credit and monitor for any unexpected mail about accounts or debts in their child's name."
            }
        ],
        relatedScams: [
            "phishing",
            "data-breach",
            "social-media-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "data-breach",
        title: "Data Breaches: What They Mean for You and How to Respond",
        metaTitle: "Data Breaches: Response Guide & Protection Steps | GetCyberRight",
        metaDescription: "Understand how data breaches affect you personally. Step-by-step response guide, breach checking tools, and long-term protection strategies.",
        keywords: [
            "data breach",
            "data breach response",
            "what to do after data breach",
            "data breach protection",
            "check if data breached"
        ],
        cluster: "data-breaches",
        overview: "Data breaches expose personal information when organizations suffer security incidents that compromise their stored data. Billions of records are breached each year, exposing names, email addresses, passwords, Social Security numbers, credit card data, and medical records. While you cannot prevent companies from being breached, you can take proactive steps to reduce your risk and respond quickly when your data is involved in a breach. Understanding what data was exposed and acting promptly are key to minimizing harm.",
        howItWorks: [
            "Hackers exploit vulnerabilities in company systems through unpatched software, weak credentials, or social engineering to access databases containing customer information.",
            "Stolen data is sold on dark web marketplaces where criminals purchase it for identity theft, account takeover, and fraud.",
            "Credential stuffing attacks use breached username/password combinations to access other accounts where people reused the same credentials.",
            "Companies may not discover breaches for weeks or months, giving criminals time to exploit stolen data before victims are notified.",
            "Breach notification laws require companies to inform affected individuals, but the delay and varying regulations mean you may not hear about a breach promptly."
        ],
        warningSigns: [
            "Breach notification letter or email from a company you have an account with",
            "Unexpected password reset emails for accounts you did not request",
            "Inability to log into accounts with your known password",
            "Unfamiliar charges on financial accounts",
            "Spam or phishing emails increasing significantly",
            "Alerts from breach monitoring services about your data appearing in new leaks"
        ],
        exampleMessages: [
            {
                type: "Breach Notification",
                content: "We are writing to inform you that on [date], we discovered a security incident that may have affected your personal information, including your name, email address, and encrypted password. We recommend you change your password immediately."
            },
            {
                type: "Dark Web Alert",
                content: "Your email address [email] was found in a data breach from [company] on [date]. The exposed data includes: email, password hash, phone number, and mailing address."
            },
            {
                type: "Account Security Alert",
                content: "We detected a login to your account from an unfamiliar device in [location]. If this was not you, your account credentials may have been compromised in a data breach."
            }
        ],
        preventionSteps: [
            {
                title: "Check if your data has been breached",
                description: "Use the GetCyberRight Breach Monitoring Dashboard to check if your email, phone number, or personal data appears in known data breaches."
            },
            {
                title: "Use unique passwords for every account",
                description: "If you reuse passwords, a single breach can compromise all your accounts. Use our Security Key Generator to create unique passwords and a password manager to store them."
            },
            {
                title: "Enable multi-factor authentication",
                description: "MFA ensures that even if your password is breached, criminals cannot access your account without the second factor."
            },
            {
                title: "Remove your data from broker sites",
                description: "Use the GetCyberRight Data Broker Removal tool to find and remove your personal information from 501+ data broker websites that buy and sell breached data."
            },
            {
                title: "Monitor your financial accounts",
                description: "Set up alerts for all financial transactions. Review statements regularly. Consider a credit freeze to prevent unauthorized credit applications."
            },
            {
                title: "Act fast when notified",
                description: "When you receive a breach notification, change the affected password immediately, check for any unauthorized activity, and enable MFA if not already active."
            }
        ],
        faq: [
            {
                question: "How do I know if my data was in a breach?",
                answer: "Use breach checking tools like the GetCyberRight Breach Monitoring Dashboard, which checks your email against known data breaches. You may also receive notification emails directly from breached companies."
            },
            {
                question: "What should I do first after a data breach?",
                answer: "Change the password for the breached account immediately, then change it on any other account where you used the same password. Enable MFA, monitor your financial accounts for suspicious activity, and consider a credit freeze if sensitive financial data was exposed."
            },
            {
                question: "Are data breach notification emails legitimate?",
                answer: "Most are legitimate, but scammers also send fake breach notifications to steal credentials. Verify by checking the company's official website for breach announcements rather than clicking links in the email."
            },
            {
                question: "How can I minimize my risk from future breaches?",
                answer: "Use unique passwords for every account, enable MFA everywhere, minimize the personal data you share with online services, regularly remove your data from data broker sites, and monitor your credit reports."
            }
        ],
        relatedScams: [
            "identity-theft",
            "phishing",
            "shopping-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "irs-tax-scam",
        title: "IRS & Tax Scams: How Criminals Exploit Tax Season",
        metaTitle: "IRS Tax Scams: Spot Fake IRS Calls, Emails & Letters | GetCyberRight",
        metaDescription: "Protect yourself from IRS and tax scams. Learn to identify fake IRS calls, phishing emails, and fraudulent tax refund schemes with real examples.",
        keywords: [
            "irs scam",
            "tax scam",
            "fake irs call",
            "irs phishing email",
            "tax refund scam"
        ],
        cluster: "online-scams",
        overview: "IRS and tax scams intensify during tax season but occur year-round. Criminals impersonate IRS agents through phone calls, emails, and letters, threatening arrest or legal action to pressure victims into immediate payment. These scams exploit fear and urgency, targeting taxpayers who may owe money or expect refunds. The real IRS never demands immediate payment by gift card, wire transfer, or cryptocurrency, and always initiates contact by mail.",
        howItWorks: [
            "Scammers call pretending to be IRS agents, claiming you owe back taxes and threatening arrest or license suspension if you do not pay immediately.",
            "Phishing emails mimic official IRS communications, directing you to fake websites that steal your Social Security number, bank details, and tax information.",
            "Fake tax preparation services collect your personal information under the guise of filing your taxes, then use it for identity theft or fraudulent refund claims.",
            "Criminals file fraudulent tax returns using stolen Social Security numbers to claim refunds before the real taxpayer files."
        ],
        warningSigns: [
            "Phone calls demanding immediate payment through gift cards, wire transfers, or cryptocurrency",
            "Threats of arrest, deportation, or license revocation for unpaid taxes",
            "Emails claiming to be from the IRS asking you to click links or download attachments",
            "Requests for your Social Security number or financial information over the phone",
            "Caller ID showing IRS or government numbers, which can be spoofed",
            "Promises of large, unexpected tax refunds"
        ],
        exampleMessages: [
            {
                type: "Phone Call",
                content: "This is Officer Johnson from the IRS Criminal Investigation Division. We have filed a lawsuit against you for unpaid federal taxes totaling $4,328. If you do not settle this amount within the next two hours, a warrant will be issued for your arrest."
            },
            {
                type: "Phishing Email",
                content: "Subject: IRS Tax Refund Notification. Dear Taxpayer, After reviewing your tax records, we have determined you are eligible for a refund of $3,247.50. Please complete the attached form with your banking information to receive your refund within 5 business days."
            }
        ],
        preventionSteps: [
            {
                title: "Know how the IRS contacts you",
                description: "The IRS always initiates contact by mail, never by phone, email, text, or social media. If someone claims to be the IRS and contacts you any other way, it is a scam."
            },
            {
                title: "Never pay with gift cards or wire transfers",
                description: "The IRS accepts payments through official channels like IRS.gov or by check payable to the US Treasury. They never demand payment by gift card, cryptocurrency, or wire transfer."
            },
            {
                title: "File your taxes early",
                description: "Filing your tax return early prevents criminals from filing a fraudulent return using your Social Security number."
            },
            {
                title: "Protect your Social Security number",
                description: "Never give your SSN to unsolicited callers or in response to emails. Use an IRS Identity Protection PIN if one is available to you."
            },
            {
                title: "Report suspicious contact",
                description: "Report IRS impersonation scams to TIGTA (Treasury Inspector General for Tax Administration) and forward suspicious IRS emails to phishing@irs.gov."
            }
        ],
        faq: [
            {
                question: "Will the IRS call me about unpaid taxes?",
                answer: "The IRS does not initiate contact by phone to demand immediate payment. They always send official letters first. If you receive a threatening call claiming to be the IRS, hang up and report it."
            },
            {
                question: "What if I actually owe taxes?",
                answer: "If you owe taxes, you will receive official correspondence by mail. You can verify any tax debt by calling the IRS directly at 1-800-829-1040 or checking your account online at IRS.gov."
            },
            {
                question: "How do I protect myself from tax identity theft?",
                answer: "File your taxes early, use an IRS Identity Protection PIN, monitor your IRS account online, protect your Social Security number, and use strong passwords on tax preparation software."
            }
        ],
        relatedScams: [
            "government-impersonation-scam",
            "phishing",
            "identity-theft"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "medicare-scam",
        title: "Medicare Scams: Protecting Seniors from Healthcare Fraud",
        metaTitle: "Medicare Scams: Identify & Avoid Healthcare Fraud | GetCyberRight",
        metaDescription: "Learn about Medicare scams targeting seniors. Spot fake Medicare calls, identity theft through healthcare fraud, and protect your benefits.",
        keywords: [
            "medicare scam",
            "medicare fraud",
            "fake medicare call",
            "healthcare scam",
            "medicare identity theft"
        ],
        cluster: "cyber-safety-seniors",
        overview: "Medicare scams specifically target seniors and people with disabilities who depend on Medicare benefits. Scammers pose as Medicare representatives to steal personal information, bill for services never provided, or trick beneficiaries into sharing their Medicare numbers. These schemes can result in identity theft, unauthorized charges to Medicare accounts, and loss of benefits. Understanding how to verify legitimate Medicare communications is essential for protecting your healthcare coverage.",
        howItWorks: [
            "Callers posing as Medicare representatives claim your card needs to be updated or replaced, then ask for your Medicare number and personal details.",
            "Scammers offer free medical equipment, genetic testing, or health screenings in exchange for your Medicare number, then bill Medicare for services you never received.",
            "Fake Medicare websites collect personal and financial information under the pretense of enrollment or benefit verification.",
            "Door-to-door visitors claim to be from Medicare and pressure you into signing up for unnecessary services or sharing your information."
        ],
        warningSigns: [
            "Unsolicited calls or visits from people claiming to be Medicare representatives",
            "Requests for your Medicare number to activate new cards or verify benefits",
            "Offers for free medical equipment or testing that require your Medicare information",
            "Threats that your Medicare benefits will be canceled if you do not provide information",
            "Bills or Explanation of Benefits statements for services you never received"
        ],
        exampleMessages: [
            {
                type: "Phone Call",
                content: "Hello, this is Sarah from Medicare Services. We are issuing new Medicare cards and need to verify your information to send your replacement. Can you please confirm your Medicare number and date of birth?"
            },
            {
                type: "Text Message",
                content: "MEDICARE ALERT: Your benefits are at risk of suspension. Call 1-800-XXX-XXXX immediately to verify your enrollment and avoid losing coverage."
            }
        ],
        preventionSteps: [
            {
                title: "Guard your Medicare number",
                description: "Treat your Medicare number like a credit card number. Never share it with unsolicited callers, visitors, or in response to texts and emails."
            },
            {
                title: "Know that Medicare will not call you unsolicited",
                description: "Medicare does not call beneficiaries to sell products, ask for personal information, or threaten benefit cancellation. If someone calls claiming to be Medicare, hang up."
            },
            {
                title: "Review your Medicare statements",
                description: "Check your Medicare Summary Notice or Explanation of Benefits for services you did not receive. Report any discrepancies to 1-800-MEDICARE."
            },
            {
                title: "Report Medicare fraud",
                description: "Call 1-800-MEDICARE (1-800-633-4227) or contact your local Senior Medicare Patrol (SMP) program to report suspected fraud."
            }
        ],
        faq: [
            {
                question: "How do I know if a Medicare call is real?",
                answer: "Medicare rarely calls beneficiaries, and when they do, it is because you called first or are already enrolled in a plan. Medicare never calls to sell products, ask for your Medicare number, or threaten to cancel your coverage."
            },
            {
                question: "What should I do if someone has my Medicare number?",
                answer: "Call 1-800-MEDICARE to report the theft. You can request a new Medicare number and card. Monitor your Medicare statements closely for unauthorized charges."
            },
            {
                question: "Are free medical equipment offers legitimate?",
                answer: "Be cautious of any unsolicited offer for free medical supplies. Legitimate providers require a doctor's prescription and do not cold-call or go door-to-door soliciting your Medicare number."
            }
        ],
        relatedScams: [
            "grandparent-scam",
            "government-impersonation-scam",
            "identity-theft"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "student-loan-scam",
        title: "Student Loan Scams: Spotting Fake Forgiveness Programs",
        metaTitle: "Student Loan Scams: Fake Forgiveness & Relief Fraud | GetCyberRight",
        metaDescription: "Protect yourself from student loan scams. Identify fake forgiveness programs, fee-based relief services, and impersonation schemes targeting borrowers.",
        keywords: [
            "student loan scam",
            "student loan forgiveness scam",
            "fake loan relief",
            "student debt scam",
            "loan forgiveness fraud"
        ],
        cluster: "online-scams",
        overview: "Student loan scams prey on borrowers seeking relief from education debt. Scammers promise loan forgiveness, debt elimination, or dramatically reduced payments in exchange for upfront fees. They often impersonate the Department of Education or legitimate loan servicers, creating urgency by claiming limited-time forgiveness programs. Legitimate student loan assistance is always free through your servicer or the Department of Education.",
        howItWorks: [
            "Companies charge upfront fees of hundreds or thousands of dollars for student loan assistance services that are available for free through the Department of Education.",
            "Scammers impersonate your loan servicer or the Department of Education, claiming you qualify for a special forgiveness program that requires immediate action.",
            "Fraudulent companies ask you to sign a third-party authorization form, then change your loan payment address to their company, redirecting your payments to them.",
            "Fake websites mimic official government portals to collect your personal information and Federal Student Aid credentials."
        ],
        warningSigns: [
            "Promises of immediate or guaranteed loan forgiveness",
            "Requests for upfront fees before any services are provided",
            "Pressure to act immediately before a deadline expires",
            "Requests for your Federal Student Aid (FSA) login credentials",
            "Companies that claim special relationships with the Department of Education",
            "Unsolicited calls or emails about student loan relief programs"
        ],
        exampleMessages: [
            {
                type: "Phone Call",
                content: "Congratulations! Based on your student loan profile, you qualify for the new Biden Student Loan Forgiveness Program. This program has limited spots and closes in 48 hours. We just need a one-time processing fee of $499 to submit your application."
            },
            {
                type: "Email",
                content: "Subject: Action Required - Student Loan Forgiveness Application. Your federal student loans may be eligible for 100% forgiveness under the new relief act. Click here to verify your eligibility before the enrollment period ends on Friday."
            }
        ],
        preventionSteps: [
            {
                title: "Use free official resources only",
                description: "Apply for income-driven repayment plans and forgiveness programs for free at studentaid.gov or by contacting your loan servicer directly. Never pay for help with federal loans."
            },
            {
                title: "Never share your FSA credentials",
                description: "Your Federal Student Aid ID gives access to your loan accounts. Never share these credentials with any third party. No legitimate company needs your FSA login."
            },
            {
                title: "Research any company before signing up",
                description: "Check with the Better Business Bureau, FTC, and your state attorney general before engaging with any student loan relief company."
            },
            {
                title: "Verify directly with your servicer",
                description: "If you receive a call about your loans, hang up and call your loan servicer directly using the number on your billing statement."
            }
        ],
        faq: [
            {
                question: "Are student loan forgiveness programs real?",
                answer: "Yes, legitimate federal forgiveness programs exist, such as Public Service Loan Forgiveness (PSLF) and income-driven repayment forgiveness. These are administered for free through the Department of Education. Any company charging fees for these services is a scam."
            },
            {
                question: "How do I apply for real student loan forgiveness?",
                answer: "Visit studentaid.gov or contact your loan servicer directly. All legitimate applications are free. Do not pay any company to submit applications on your behalf."
            },
            {
                question: "What if I already paid a student loan scam company?",
                answer: "Contact your bank to dispute the charges. File complaints with the FTC at reportfraud.ftc.gov, your state attorney general, and the Consumer Financial Protection Bureau (CFPB)."
            }
        ],
        relatedScams: [
            "phishing",
            "government-impersonation-scam",
            "identity-theft"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "rental-scam",
        title: "Rental Scams: How to Avoid Fake Listings and Fraud",
        metaTitle: "Rental Scams: Spot Fake Listings & Rental Fraud | GetCyberRight",
        metaDescription: "Learn to identify rental scams including fake listings, phantom landlords, and deposit theft. Protect yourself when searching for housing.",
        keywords: [
            "rental scam",
            "fake rental listing",
            "apartment scam",
            "rental fraud",
            "landlord scam"
        ],
        cluster: "online-scams",
        overview: "Rental scams target people searching for apartments and houses, exploiting the competitive housing market to steal deposits and personal information. Scammers post fake listings using photos stolen from legitimate properties, offer below-market prices to attract attention, and pressure victims to send money before viewing the property. These scams are particularly devastating because victims lose both money and time in their housing search.",
        howItWorks: [
            "Scammers copy legitimate property listings and repost them at lower prices on classified sites, then collect deposits from multiple victims for a property they do not own.",
            "Fake landlords insist on collecting deposits or first month's rent before allowing property viewings, claiming high demand or out-of-town status.",
            "Scammers create convincing fake lease agreements to appear legitimate, then disappear after collecting move-in costs.",
            "Fraudulent property managers collect application fees, personal information, and credit reports from multiple applicants without ever renting the property."
        ],
        warningSigns: [
            "Rental prices significantly below market rate for the area",
            "Landlord refuses or is unable to show the property in person",
            "Requests for payment via wire transfer, gift cards, or cryptocurrency",
            "Pressure to send deposit money immediately to secure the unit",
            "Landlord claims to be out of town and cannot meet in person",
            "Listing photos that look too professional or appear on other websites"
        ],
        exampleMessages: [
            {
                type: "Email",
                content: "Thank you for your interest in my property! I am currently overseas for missionary work and cannot show the apartment in person. However, I can offer you a great deal at $800/month. Just send the first month's rent and security deposit via Zelle and I will mail you the keys."
            },
            {
                type: "Text Message",
                content: "Hi! The apartment at 123 Main St is still available but I have 5 other people interested. If you can send the $1,200 deposit by tonight via CashApp, I can hold it for you. Otherwise it will go to the next person."
            }
        ],
        preventionSteps: [
            {
                title: "Always view the property in person",
                description: "Never send money for a rental you have not physically visited. Verify the property exists and matches the listing description."
            },
            {
                title: "Research the landlord or property manager",
                description: "Verify property ownership through county records. Search for the property address and landlord name online to check for scam reports."
            },
            {
                title: "Never wire money or pay with gift cards",
                description: "Use traceable payment methods like checks. Legitimate landlords accept standard payment methods and provide receipts."
            },
            {
                title: "Be skeptical of prices below market rate",
                description: "If a rental price seems too good to be true, it probably is. Compare prices with similar properties in the area."
            },
            {
                title: "Reverse image search listing photos",
                description: "Use Google reverse image search to check if listing photos appear on other websites or have been stolen from legitimate listings."
            }
        ],
        faq: [
            {
                question: "How common are rental scams?",
                answer: "Rental scams affect millions of people annually, with the average victim losing over $1,000. They are especially common on classified sites like Craigslist, Facebook Marketplace, and during competitive rental seasons."
            },
            {
                question: "Can I get my money back from a rental scam?",
                answer: "Recovery depends on the payment method. Wire transfers and gift cards are nearly impossible to recover. Credit card payments can be disputed. File a police report, report to the FTC, and contact your bank immediately."
            },
            {
                question: "How do I verify a rental listing is real?",
                answer: "Visit the property in person, verify ownership through county records, meet the landlord face-to-face, never pay before seeing the unit, and be wary of prices significantly below market rate."
            }
        ],
        relatedScams: [
            "shopping-scam",
            "phishing",
            "wire-fraud-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "lottery-scam",
        title: "Lottery & Sweepstakes Scams: You Did Not Win",
        metaTitle: "Lottery Scams: Fake Sweepstakes & Prize Fraud | GetCyberRight",
        metaDescription: "Protect yourself from lottery and sweepstakes scams. Learn why you cannot win a contest you never entered and how to spot fake prize notifications.",
        keywords: [
            "lottery scam",
            "sweepstakes scam",
            "fake prize notification",
            "you won scam",
            "foreign lottery scam"
        ],
        cluster: "online-scams",
        overview: "Lottery and sweepstakes scams notify victims they have won a large prize in a contest they never entered. To claim the prize, victims must pay taxes, processing fees, or insurance costs upfront. The prize never materializes, and scammers continue requesting payments for additional fees. These scams especially target seniors and can result in devastating financial losses over extended periods.",
        howItWorks: [
            "Victims receive calls, emails, texts, or letters announcing they have won a large prize in a lottery or sweepstakes.",
            "To claim the winnings, victims must pay upfront fees for taxes, processing, insurance, or currency conversion.",
            "After paying initial fees, scammers invent additional costs that must be paid before the prize can be released.",
            "Some scammers send fake checks that bounce after the victim deposits them and sends money to cover supposed fees."
        ],
        warningSigns: [
            "Notification that you won a contest you never entered",
            "Requirement to pay fees, taxes, or charges to collect your prize",
            "Requests for payment via wire transfer, gift cards, or cryptocurrency",
            "Prize notifications from foreign countries you have never visited",
            "Urgency to respond quickly or forfeit the winnings",
            "A check for part of the winnings arrives with instructions to send some back"
        ],
        exampleMessages: [
            {
                type: "Email",
                content: "CONGRATULATIONS! Your email has been selected as the winner of the Euro Millions International Lottery. You have won 2,500,000 EUR. To process your winnings, please remit a processing fee of $299 via Western Union to our claims agent."
            },
            {
                type: "Letter",
                content: "Official Notification: You are the Grand Prize Winner of the Publishers Clearing House Sweepstakes. Prize amount: $750,000. To release your funds, please call our claims department and provide your bank routing number for direct deposit of your winnings."
            }
        ],
        preventionSteps: [
            {
                title: "Remember the golden rule",
                description: "You cannot win a contest you did not enter. Period. Any notification saying otherwise is a scam."
            },
            {
                title: "Never pay to collect a prize",
                description: "Legitimate contests never require winners to pay fees, taxes, or processing charges to receive their prize. All costs are deducted from winnings."
            },
            {
                title: "Do not deposit unexpected checks",
                description: "Fake checks can take weeks to bounce. If you deposit one and spend the money, you will owe the bank the full amount plus fees."
            },
            {
                title: "Warn family members, especially seniors",
                description: "Lottery scams disproportionately target older adults. Talk to elderly family members about these scams and help them recognize the warning signs."
            }
        ],
        faq: [
            {
                question: "Can I really win a foreign lottery?",
                answer: "No. It is illegal for US residents to participate in foreign lotteries. Any notification claiming you won a foreign lottery is a scam. Legitimate lotteries do not notify winners by email, phone, or text."
            },
            {
                question: "Why do scammers send real-looking checks?",
                answer: "Fake checks can look identical to real ones and may initially clear at your bank. However, they will bounce days or weeks later, and you will be responsible for any money you have already spent or sent to the scammer."
            },
            {
                question: "What should I do if I receive a prize notification?",
                answer: "Do not respond, do not pay anything, and do not provide personal information. Report it to the FTC at reportfraud.ftc.gov and delete the message."
            }
        ],
        relatedScams: [
            "grandparent-scam",
            "wire-fraud-scam",
            "gift-card-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "charity-scam",
        title: "Charity Scams: How to Spot Fake Charitable Organizations",
        metaTitle: "Charity Scams: Identify Fake Charities & Donation Fraud | GetCyberRight",
        metaDescription: "Learn to identify charity scams and fake organizations. Verify charities before donating and protect yourself from donation fraud.",
        keywords: [
            "charity scam",
            "fake charity",
            "donation scam",
            "charity fraud",
            "fake fundraiser"
        ],
        cluster: "online-scams",
        overview: "Charity scams exploit people's generosity, especially after natural disasters, during holiday seasons, or following tragic events. Scammers create fake charitable organizations with names similar to well-known charities, use emotional appeals to pressure donations, and pocket the money. Some operate fake crowdfunding campaigns or impersonate legitimate charity workers. Verifying charities before donating ensures your money reaches those who truly need help.",
        howItWorks: [
            "Scammers create organizations with names nearly identical to well-known charities, making it difficult to distinguish real from fake.",
            "Unsolicited callers use high-pressure tactics and emotional stories to solicit immediate donations by phone, often requesting gift cards or wire transfers.",
            "Fake crowdfunding campaigns on social media and fundraising platforms collect donations for fabricated causes or individuals.",
            "Scammers impersonate charity workers going door-to-door, collecting cash donations and personal information."
        ],
        warningSigns: [
            "Charity name closely resembles a well-known organization",
            "High-pressure tactics demanding immediate donations",
            "Requests for donations via wire transfer, gift cards, or cryptocurrency",
            "Vague descriptions of how donations will be used",
            "Inability to provide tax ID number or proof of tax-exempt status",
            "Thank-you messages for donations you did not make"
        ],
        exampleMessages: [
            {
                type: "Phone Call",
                content: "Hi, I am calling from the National Veterans Relief Foundation. We are collecting donations for disabled veterans who need medical care. Can we count on you for a $100 donation today? We accept all major gift cards for your convenience."
            },
            {
                type: "Social Media Post",
                content: "URGENT: My neighbor's family lost everything in a house fire. The kids have no clothes and the family has nowhere to go. Please donate to this GoFundMe to help them get back on their feet. Every dollar counts!"
            }
        ],
        preventionSteps: [
            {
                title: "Research before donating",
                description: "Use Charity Navigator (charitynavigator.org), GuideStar (guidestar.org), or the BBB Wise Giving Alliance to verify the charity's legitimacy and financial health before donating."
            },
            {
                title: "Donate directly through official websites",
                description: "Type the charity's URL directly into your browser rather than clicking links in emails or social media posts."
            },
            {
                title: "Never donate via gift cards or wire transfers",
                description: "Legitimate charities accept checks, credit cards, and online payments through secure platforms. Gift card requests are always a scam."
            },
            {
                title: "Ask for documentation",
                description: "Request the charity's tax ID number and verify it on the IRS Tax Exempt Organization Search tool at irs.gov."
            }
        ],
        faq: [
            {
                question: "How can I verify if a charity is real?",
                answer: "Check Charity Navigator, GuideStar, or the BBB Wise Giving Alliance. You can also verify tax-exempt status on the IRS website. Legitimate charities are transparent about their finances and operations."
            },
            {
                question: "Are GoFundMe campaigns safe to donate to?",
                answer: "While many crowdfunding campaigns are legitimate, fraud does occur. Look for detailed descriptions, updates, verified identities, and media coverage supporting the campaign's claims before donating."
            },
            {
                question: "What should I do if I donated to a fake charity?",
                answer: "Contact your bank or credit card company to dispute the charge. Report the fraudulent charity to your state attorney general, the FTC, and the National Center for Charitable Statistics."
            }
        ],
        relatedScams: [
            "phishing",
            "social-media-scam",
            "wire-fraud-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "sim-swap-scam",
        title: "SIM Swap Attacks: How Criminals Hijack Your Phone Number",
        metaTitle: "SIM Swap Scams: Protect Your Phone Number from Hijacking | GetCyberRight",
        metaDescription: "Learn about SIM swap attacks where criminals transfer your phone number to their device. Protect your accounts from this growing threat.",
        keywords: [
            "sim swap scam",
            "sim swapping",
            "phone number hijack",
            "sim card fraud",
            "number porting scam"
        ],
        cluster: "device-security",
        overview: "SIM swap attacks occur when criminals convince your mobile carrier to transfer your phone number to a SIM card they control. Once they have your number, they can receive your text messages and calls, including two-factor authentication codes. This gives them access to your bank accounts, email, social media, and cryptocurrency wallets. SIM swapping has become one of the fastest-growing forms of fraud, with losses reaching hundreds of millions of dollars.",
        howItWorks: [
            "Criminals gather personal information about the victim through social media, data breaches, phishing, or social engineering.",
            "They contact the victim's mobile carrier pretending to be the account holder, claiming a lost or damaged phone and requesting a SIM transfer.",
            "Once the carrier transfers the number, the criminal's phone receives all calls and texts meant for the victim.",
            "With access to SMS-based two-factor authentication codes, the criminal quickly accesses and drains bank accounts, cryptocurrency wallets, and other valuable accounts."
        ],
        warningSigns: [
            "Sudden loss of cell phone service (no signal, calls, or texts)",
            "Notification from your carrier about a SIM change you did not request",
            "Unable to log into your accounts despite using correct passwords",
            "Unexpected password reset notifications",
            "Unusual activity on your bank or financial accounts",
            "Social media accounts posting content you did not create"
        ],
        exampleMessages: [
            {
                type: "Carrier Notification",
                content: "Your SIM card has been changed. If you did not request this change, please contact customer service immediately at [carrier number]."
            },
            {
                type: "Phishing Text (used to gather info)",
                content: "Your mobile account requires verification. Reply with your account PIN and the last 4 digits of your SSN to avoid service interruption."
            }
        ],
        preventionSteps: [
            {
                title: "Set up a PIN or passphrase with your carrier",
                description: "Add an extra security PIN or passphrase to your mobile account that must be provided before any changes can be made, including SIM swaps."
            },
            {
                title: "Use authenticator apps instead of SMS",
                description: "Replace SMS-based two-factor authentication with authenticator apps like Google Authenticator, Authy, or hardware security keys whenever possible."
            },
            {
                title: "Limit personal information shared online",
                description: "Reduce the personal details you share on social media. Criminals use publicly available information to impersonate you to your carrier."
            },
            {
                title: "Contact your carrier about SIM lock features",
                description: "Many carriers offer SIM lock or number lock features that prevent unauthorized transfers. Enable these protections on your account."
            },
            {
                title: "Act immediately if you lose service",
                description: "If your phone suddenly loses service, contact your carrier right away. Quick action can prevent criminals from accessing your accounts."
            }
        ],
        faq: [
            {
                question: "How quickly do SIM swap attacks happen?",
                answer: "Once a criminal successfully performs a SIM swap, they can access your accounts within minutes. They typically target financial accounts first, draining funds before the victim realizes what has happened."
            },
            {
                question: "Can my carrier protect me from SIM swaps?",
                answer: "Yes. Most carriers offer account PINs, port-out PINs, and SIM lock features. Contact your carrier to enable all available protections. Some carriers also offer number lock features that completely prevent transfers."
            },
            {
                question: "What should I do if I am a victim of SIM swapping?",
                answer: "Contact your carrier immediately to regain control of your number. Change passwords on all accounts, especially financial ones. Enable non-SMS two-factor authentication. Report to your national cybercrime authority and local police. In the US, file with the FTC and IC3. In the UK, report to Action Fraud. In Australia, contact the ACSC."
            }
        ],
        relatedScams: [
            "identity-theft",
            "phishing",
            "bank-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "utility-scam",
        title: "Utility Scams: Fake Power, Gas & Water Company Threats",
        metaTitle: "Utility Scams: Spot Fake Shutoff Threats & Utility Fraud | GetCyberRight",
        metaDescription: "Protect yourself from utility scams. Learn to identify fake shutoff threats from scammers impersonating electric, gas, and water companies.",
        keywords: [
            "utility scam",
            "fake utility call",
            "power company scam",
            "electric bill scam",
            "gas company fraud"
        ],
        cluster: "online-scams",
        overview: "Utility scams target homeowners and businesses by impersonating electric, gas, water, or internet service providers. Scammers threaten immediate service disconnection unless the victim makes an instant payment, usually through gift cards, wire transfers, or cryptocurrency. These scams spike during extreme weather when the threat of losing power or heat feels most urgent.",
        howItWorks: [
            "Scammers call claiming to be from your utility company and state your account is past due with service disconnection scheduled within the hour.",
            "They demand immediate payment through untraceable methods like prepaid debit cards, gift cards, or cryptocurrency.",
            "Some scammers visit homes in person wearing fake utility uniforms, demanding cash payments at the door.",
            "Others send phishing emails with fake past-due notices containing links to fraudulent payment portals."
        ],
        warningSigns: [
            "Threats of immediate service disconnection within hours",
            "Demands for payment via gift cards, wire transfer, or cryptocurrency",
            "Callers who refuse to provide their name, ID number, or callback number",
            "In-person visits demanding cash payments",
            "Emails with urgent payment links that do not match your utility's official website"
        ],
        exampleMessages: [
            {
                type: "Phone Call",
                content: "This is the disconnection department at your electric company. Your account is $547 past due and your power will be shut off in 45 minutes unless you make a payment right now. We can accept Green Dot cards or Bitcoin for immediate processing."
            },
            {
                type: "In-Person Visit",
                content: "Hi, I am from the gas company. We detected a leak in your area and need to inspect your meter. I also show your account has an unpaid balance. If you can pay $200 cash right now, I can make sure your service continues."
            }
        ],
        preventionSteps: [
            {
                title: "Call your utility directly",
                description: "If you receive a threatening call, hang up and call your utility company using the number on your bill or their official website."
            },
            {
                title: "Know your utility's policies",
                description: "Utility companies send multiple written notices before disconnection and never demand immediate payment by gift card or cryptocurrency."
            },
            {
                title: "Verify in-person visitors",
                description: "Legitimate utility workers carry photo ID and drive marked vehicles. Call your utility company to verify any unexpected visits."
            },
            {
                title: "Check your account online",
                description: "Log into your utility account through the official website to verify your actual balance and payment status."
            }
        ],
        faq: [
            {
                question: "Will my utility really shut off my service immediately?",
                answer: "No. Utility companies are required to send written notices before disconnection and provide payment plan options. They never threaten immediate shutoff over the phone or demand payment by gift card."
            },
            {
                question: "Do utility workers come to your door asking for payment?",
                answer: "Legitimate utility workers do not collect payments at your door. If someone comes to your home claiming to be from a utility company and asks for money, do not pay them and call the utility to verify."
            },
            {
                question: "How do I report a utility scam?",
                answer: "Report it to your actual utility company, file a complaint with the FTC at reportfraud.ftc.gov, and contact your state public utility commission."
            }
        ],
        relatedScams: [
            "government-impersonation-scam",
            "gift-card-scam",
            "phishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "investment-scam",
        title: "Investment Scams: Ponzi Schemes, Pump and Dump & More",
        metaTitle: "Investment Scams: Spot Ponzi Schemes & Investment Fraud | GetCyberRight",
        metaDescription: "Learn to identify investment scams including Ponzi schemes, pump and dump, and guaranteed return fraud. Protect your money from financial scammers.",
        keywords: [
            "investment scam",
            "ponzi scheme",
            "pump and dump",
            "investment fraud",
            "guaranteed returns scam"
        ],
        cluster: "online-scams",
        overview: "Investment scams promise extraordinary returns with little or no risk. From Ponzi schemes that use new investor money to pay earlier investors, to pump-and-dump schemes that artificially inflate stock prices, these scams cause billions in losses annually. Social media has accelerated investment fraud with influencer-promoted schemes, fake trading platforms, and AI-generated testimonials. If an investment opportunity sounds too good to be true, it almost certainly is.",
        howItWorks: [
            "Ponzi schemes pay existing investors with money from new investors, creating the illusion of legitimate returns until the scheme collapses.",
            "Pump-and-dump operators hype worthless stocks through social media, newsletters, or spam, sell their holdings at inflated prices, then watch the price crash.",
            "Fake trading platforms show fictional profits to encourage larger deposits, but never allow withdrawals.",
            "Affinity fraud targets members of specific communities, using trusted leaders or members to recruit new victims."
        ],
        warningSigns: [
            "Promises of guaranteed high returns with no risk",
            "Pressure to invest quickly before an opportunity disappears",
            "Unlicensed sellers or unregistered investment products",
            "Difficulty withdrawing your money or receiving returns",
            "Secretive or complex strategies that cannot be clearly explained",
            "Investments promoted through social media influencers or unsolicited contacts"
        ],
        exampleMessages: [
            {
                type: "Social Media DM",
                content: "Hey! I started investing with this amazing platform 3 months ago and I have already turned $500 into $15,000. They use AI trading algorithms that guarantee 30% returns monthly. Want me to send you the link? Spots are limited!"
            },
            {
                type: "Email",
                content: "EXCLUSIVE INVESTMENT ALERT: Our proprietary algorithmic trading system has generated 847% returns this year. We are opening 50 spots for qualified investors. Minimum investment: $5,000. Guaranteed returns. Risk-free. Click to schedule your consultation."
            }
        ],
        preventionSteps: [
            {
                title: "Verify the investment and the seller",
                description: "Check if the investment is registered with the SEC (sec.gov/edgar) and if the seller is licensed through FINRA BrokerCheck (brokercheck.finra.org)."
            },
            {
                title: "Be skeptical of guaranteed returns",
                description: "No legitimate investment can guarantee returns. All investments carry risk. Promises of guaranteed high returns are a hallmark of fraud."
            },
            {
                title: "Understand the investment fully",
                description: "If you cannot clearly explain how the investment generates returns, do not invest. Legitimate investments can be explained simply."
            },
            {
                title: "Be cautious of social media investment advice",
                description: "Do not make investment decisions based on social media posts, influencer recommendations, or unsolicited messages. These are common channels for pump-and-dump schemes."
            }
        ],
        faq: [
            {
                question: "How do I check if an investment is legitimate?",
                answer: "Verify the company and securities are registered with the SEC at sec.gov. Check the seller's license through FINRA BrokerCheck. Research the company independently and be wary of unsolicited investment offers."
            },
            {
                question: "What are the signs of a Ponzi scheme?",
                answer: "Consistently high returns regardless of market conditions, difficulty withdrawing funds, unregistered investments, secretive strategies, and recruitment-focused business models are all red flags of Ponzi schemes."
            },
            {
                question: "Can I recover money lost to an investment scam?",
                answer: "Recovery is difficult but possible. Report to your financial regulator (SEC and FINRA in the US, FCA in the UK, ASIC in Australia). Contact a securities attorney. If you paid by credit card, dispute the charges. File a complaint with your national fraud authority and local police."
            }
        ],
        relatedScams: [
            "crypto-scam",
            "social-media-scam",
            "phishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "work-from-home-scam",
        title: "Work From Home Scams: Fake Remote Job Offers",
        metaTitle: "Work From Home Scams: Spot Fake Remote Jobs & Employment Fraud | GetCyberRight",
        metaDescription: "Learn to identify work-from-home scams including fake job offers, reshipping schemes, and payment processing fraud targeting remote workers.",
        keywords: [
            "work from home scam",
            "remote job scam",
            "fake job offer",
            "work at home fraud",
            "online job scam"
        ],
        cluster: "online-scams",
        overview: "Work-from-home scams exploit the growing demand for remote employment. Scammers post attractive job listings promising high pay for minimal work, then use these fake positions to steal personal information, collect fees for training materials, or recruit unwitting participants into money laundering schemes. The rise of remote work has made these scams harder to distinguish from legitimate opportunities.",
        howItWorks: [
            "Scammers post job listings for positions like data entry, envelope stuffing, or product testing that promise high pay for easy work.",
            "They collect personal information, including Social Security numbers and bank details, during the fake hiring process for identity theft.",
            "Some require payment for training materials, software, or certification before starting work.",
            "Reshipping scams recruit workers to receive and forward packages purchased with stolen credit cards, making the worker an unwitting accomplice to fraud."
        ],
        warningSigns: [
            "Job offers that promise high pay for little or no experience required",
            "Requests to pay for training materials, certifications, or equipment upfront",
            "Job offers received without applying or interviewing",
            "Vague job descriptions that avoid specifics about the work",
            "Requests for personal financial information before hiring is finalized",
            "Payment by check with instructions to send a portion to someone else"
        ],
        exampleMessages: [
            {
                type: "Email",
                content: "We have reviewed your resume and would like to offer you a remote position as a Financial Processing Agent. Salary: $4,500/month. No experience needed. Your duties include receiving and forwarding payments. To get started, please send us your bank details for payroll setup."
            },
            {
                type: "Job Listing",
                content: "IMMEDIATE HIRE: Work from home product tester. Earn $75/hour testing products shipped to your home. Write short reviews and keep the products. Apply now! One-time registration fee of $49.99 required."
            }
        ],
        preventionSteps: [
            {
                title: "Research the company thoroughly",
                description: "Verify the company exists with a legitimate website, physical address, and business registration. Check reviews on Glassdoor and the BBB."
            },
            {
                title: "Never pay to get a job",
                description: "Legitimate employers never charge employees for training, equipment, or the privilege of working. Any upfront fee is a red flag."
            },
            {
                title: "Be cautious of unsolicited offers",
                description: "Real employers do not typically send job offers to people who have not applied. Unsolicited job offers, especially via text or social media, are usually scams."
            },
            {
                title: "Never forward payments or packages",
                description: "Any job that involves receiving and forwarding money or packages is likely a fraud scheme. You could face criminal liability for participating."
            }
        ],
        faq: [
            {
                question: "How can I find legitimate remote jobs?",
                answer: "Use established job boards like LinkedIn, Indeed, FlexJobs, or company career pages. Research the company, verify the job posting on the company's official website, and never pay upfront fees."
            },
            {
                question: "What is a reshipping scam?",
                answer: "Scammers hire workers to receive packages at home and forward them to another address. The packages contain items purchased with stolen credit cards. Workers face criminal liability for receiving stolen goods."
            },
            {
                question: "What if I already shared my bank details?",
                answer: "Contact your bank immediately to secure your account. Place fraud alerts on your credit reports. Monitor your accounts closely for unauthorized transactions. File a report with the FTC and local police."
            }
        ],
        relatedScams: [
            "job-scam",
            "phishing",
            "identity-theft"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "puppy-scam",
        title: "Puppy & Pet Scams: Fake Animal Sales Online",
        metaTitle: "Puppy Scams: Spot Fake Pet Sales & Breeder Fraud | GetCyberRight",
        metaDescription: "Protect yourself from puppy and pet scams. Learn to identify fake breeders, fraudulent pet listings, and phantom animal sales online.",
        keywords: [
            "puppy scam",
            "pet scam",
            "fake breeder",
            "puppy fraud",
            "online pet scam"
        ],
        cluster: "online-scams",
        overview: "Puppy and pet scams use adorable animal photos to lure victims into paying for pets that do not exist. Scammers post fake listings on social media, classified sites, and fake breeder websites, collect payment for the animal plus shipping fees, then demand additional money for insurance, crates, vaccinations, or customs fees. The pet never arrives, leaving victims heartbroken and financially harmed.",
        howItWorks: [
            "Scammers steal photos of cute puppies or kittens and post fake listings at attractive prices on social media and classified sites.",
            "After collecting payment for the pet, they claim additional fees are needed for shipping, insurance, temperature-controlled crates, or veterinary certificates.",
            "They create fake shipping company websites with tracking numbers that show the pet in transit to maintain the illusion.",
            "Some send fake videos or photos to build emotional attachment before requesting more money."
        ],
        warningSigns: [
            "Seller cannot or will not meet in person or video chat with the pet",
            "Price is significantly below market rate for the breed",
            "Requests for payment via wire transfer, gift cards, or cryptocurrency",
            "Multiple fees added after initial payment",
            "Seller's website was recently created or lacks verifiable contact information",
            "Only accepting payment methods that cannot be reversed"
        ],
        exampleMessages: [
            {
                type: "Email",
                content: "Great news! Your golden retriever puppy is ready for shipping. We need $350 for the climate-controlled crate and pet insurance. Once paid, your puppy will arrive within 48 hours via our certified pet delivery service."
            },
            {
                type: "Social Media Post",
                content: "Beautiful AKC registered French Bulldog puppies available. Champion bloodline. Only $800 each (normally $3,500). We are relocating and need to find loving homes fast. Shipping available nationwide. Venmo or Zelle accepted."
            }
        ],
        preventionSteps: [
            {
                title: "Visit the pet in person before paying",
                description: "Always meet the seller and see the animal in person before sending any money. Legitimate breeders welcome visits to their facilities."
            },
            {
                title: "Research the breeder or seller",
                description: "Check reviews, verify business registration, and look for complaints. Use reverse image search on pet photos to see if they appear on other websites."
            },
            {
                title: "Be wary of below-market prices",
                description: "If a purebred pet is listed at a fraction of the typical price, it is likely a scam. Research average prices for the breed you are interested in."
            },
            {
                title: "Use adoption resources",
                description: "Consider adopting from local shelters or rescue organizations where you can meet the animal in person. Sites like Petfinder and Adopt-a-Pet list animals from verified rescues."
            }
        ],
        faq: [
            {
                question: "How common are puppy scams?",
                answer: "The BBB reports that pet scams are one of the most common types of online fraud, with thousands of victims annually. Losses can range from hundreds to thousands of dollars."
            },
            {
                question: "Can I buy a pet safely online?",
                answer: "Buying pets online carries significant risk. The safest approach is to visit the animal in person before paying. If you must buy remotely, verify the breeder through breed-specific registries and use payment methods that offer buyer protection."
            },
            {
                question: "What breeds are most commonly used in pet scams?",
                answer: "French Bulldogs, English Bulldogs, Dachshunds, Yorkshire Terriers, and other popular or expensive breeds are frequently used in scam listings because their high prices make the fraud more profitable."
            }
        ],
        relatedScams: [
            "shopping-scam",
            "wire-fraud-scam",
            "social-media-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "ticket-scam",
        title: "Ticket Scams: Fake Concert, Sports & Event Tickets",
        metaTitle: "Ticket Scams: Spot Fake Event Tickets & Resale Fraud | GetCyberRight",
        metaDescription: "Learn to avoid ticket scams for concerts, sports events, and festivals. Identify fake tickets, fraudulent resellers, and counterfeit ticket websites.",
        keywords: [
            "ticket scam",
            "fake concert tickets",
            "fake event tickets",
            "ticket fraud",
            "counterfeit tickets"
        ],
        cluster: "online-scams",
        overview: "Ticket scams sell counterfeit, duplicate, or nonexistent tickets for concerts, sporting events, festivals, and shows. Scammers set up fake resale websites, post listings on social media, and use the urgency of sold-out events to pressure buyers into quick purchases. Victims discover the fraud only when they are turned away at the venue, often after traveling significant distances.",
        howItWorks: [
            "Scammers create professional-looking websites that mimic legitimate ticket resale platforms.",
            "Fake sellers post tickets on social media and classified sites, often at prices that seem like a deal.",
            "Duplicate tickets are sold to multiple buyers using the same barcode, so only the first person to scan gets in.",
            "After payment, scammers either send fake tickets, provide invalid digital tickets, or simply disappear."
        ],
        warningSigns: [
            "Tickets priced significantly below face value for sold-out events",
            "Seller insists on payment through non-refundable methods",
            "Ticket website URL does not match the official venue or ticketing company",
            "Seller cannot or will not meet in person for the exchange",
            "No clear refund policy or buyer protection guarantees"
        ],
        exampleMessages: [
            {
                type: "Social Media Post",
                content: "2 Taylor Swift tickets for Saturday night, Section A Row 5. Face value $450 each, selling for $200 each because I can't go anymore. Venmo only. First come first served! DM me."
            },
            {
                type: "Fake Website",
                content: "VIPTicketExchange.com: Premium concert and sports tickets at unbeatable prices. 100% guaranteed authentic. Secure checkout. Same-day digital delivery. All major events available."
            }
        ],
        preventionSteps: [
            {
                title: "Buy from official sources only",
                description: "Purchase tickets directly from the venue, official ticketing partners (Ticketmaster, AXS, etc.), or verified resale platforms (StubHub, SeatGeek) with buyer guarantees."
            },
            {
                title: "Verify resale websites",
                description: "Check for HTTPS, read reviews, and verify the website is the real platform, not a lookalike. Scam sites often use similar domain names."
            },
            {
                title: "Use payment methods with buyer protection",
                description: "Pay with credit cards or through platforms that offer purchase protection. Never use wire transfers, cryptocurrency, or peer-to-peer payment apps for ticket purchases from strangers."
            },
            {
                title: "Be cautious of social media sellers",
                description: "If buying from individuals on social media, meet in person at a safe location and verify the ticket is legitimate before paying."
            }
        ],
        faq: [
            {
                question: "How do I verify if a ticket is real?",
                answer: "Legitimate tickets from official sources include unique barcodes, holograms, or QR codes. Contact the venue or official ticketing partner directly to verify a ticket's authenticity if you have doubts."
            },
            {
                question: "Are ticket resale websites safe?",
                answer: "Established platforms like StubHub and SeatGeek offer buyer protection guarantees. However, many fake resale websites exist that look professional but are fraudulent. Always verify the website URL carefully."
            },
            {
                question: "What should I do if I bought fake tickets?",
                answer: "Dispute the charge with your credit card company, report the seller to the platform where you found them, file a complaint with the FTC, and report the incident to local police."
            }
        ],
        relatedScams: [
            "shopping-scam",
            "social-media-scam",
            "phishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "auto-warranty-scam",
        title: "Auto Warranty Scams: Fake Vehicle Protection Plans",
        metaTitle: "Auto Warranty Scams: Spot Fake Extended Warranty Calls | GetCyberRight",
        metaDescription: "Protect yourself from auto warranty scams. Learn to identify fake extended warranty calls, texts, and mailers targeting vehicle owners.",
        keywords: [
            "auto warranty scam",
            "extended warranty scam",
            "car warranty fraud",
            "vehicle warranty scam",
            "fake warranty call"
        ],
        cluster: "online-scams",
        overview: "Auto warranty scams are among the most common robocall schemes. Scammers contact vehicle owners through calls, texts, emails, and official-looking mailers, claiming your vehicle's warranty is about to expire and urging immediate action. They sell worthless or nonexistent service contracts, collect payment, and either disappear or deny all claims when repairs are needed.",
        howItWorks: [
            "Robocalls and texts claim your vehicle's warranty is expiring and urge you to call immediately to avoid losing coverage.",
            "Official-looking mailers disguised as urgent notices from your dealer or manufacturer create a false sense of legitimacy.",
            "When you call back, high-pressure salespeople rush you through the purchase of an overpriced, limited, or completely fake warranty.",
            "If you buy the plan and need repairs, claims are denied for various technicalities, or the company has disappeared entirely."
        ],
        warningSigns: [
            "Unsolicited calls, texts, or mail about your vehicle warranty",
            "Claims that your warranty is about to expire (when it may not be)",
            "High-pressure tactics to purchase immediately",
            "Vague details about coverage and exclusions",
            "Inability to provide the company's official name, address, or license information"
        ],
        exampleMessages: [
            {
                type: "Robocall",
                content: "This is your final notice regarding your vehicle's extended warranty. Your warranty coverage is about to expire and this is your last chance to renew. Press 1 now to speak with a coverage specialist before you lose all benefits."
            },
            {
                type: "Mail",
                content: "URGENT NOTICE: Your vehicle warranty is set to expire. Protect yourself from expensive repairs. Call 1-800-XXX-XXXX within 5 business days to maintain your coverage at the current rate."
            }
        ],
        preventionSteps: [
            {
                title: "Check your actual warranty status",
                description: "Contact your vehicle manufacturer or dealer directly to find out if your factory warranty is still active and what it covers."
            },
            {
                title: "Do not respond to unsolicited contacts",
                description: "Ignore robocalls, texts, and mailers about warranties. Your manufacturer or dealer will not contact you this way about warranty expiration."
            },
            {
                title: "Research any warranty company thoroughly",
                description: "Before purchasing any extended warranty, check the company's BBB rating, read reviews, and verify they are licensed in your state."
            },
            {
                title: "Block robocall numbers",
                description: "Register on the National Do Not Call Registry (donotcall.gov) and use your phone's built-in call blocking features or third-party apps."
            }
        ],
        faq: [
            {
                question: "Is my car warranty really expiring?",
                answer: "Most factory warranties are 3-5 years or a set mileage. Check your owner's manual or contact your dealer to verify your actual warranty status. Scammers have no way of knowing your real warranty status."
            },
            {
                question: "Are extended warranties worth buying?",
                answer: "Some legitimate extended warranties can be worthwhile, but always purchase directly from your manufacturer or a well-established, licensed company. Never buy from unsolicited callers or mailers."
            },
            {
                question: "How do I stop auto warranty robocalls?",
                answer: "Register on the Do Not Call Registry, block individual numbers, use your carrier's spam call filtering, and consider call-blocking apps. Report repeated calls to the FTC."
            }
        ],
        relatedScams: [
            "vishing",
            "phishing",
            "identity-theft"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "gift-card-scam",
        title: "Gift Card Scams: Why Scammers Want Gift Card Payments",
        metaTitle: "Gift Card Scams: Why Criminals Request Gift Card Payment | GetCyberRight",
        metaDescription: "Understand why scammers demand gift card payments. Learn about gift card fraud, draining schemes, and how to protect yourself.",
        keywords: [
            "gift card scam",
            "gift card fraud",
            "gift card payment scam",
            "itunes gift card scam",
            "google play gift card scam"
        ],
        cluster: "online-scams",
        overview: "Gift card scams are a preferred payment method for many types of fraud because gift cards are nearly impossible to trace or reverse. Scammers demand payment in gift cards for fake IRS debts, utility bills, tech support, bail money, and more. They also tamper with gift cards on store racks, draining the value before the buyer can use them. No legitimate business or government agency ever requests payment by gift card.",
        howItWorks: [
            "Scammers demand payment through gift cards (iTunes, Google Play, Amazon, Green Dot) because the funds are nearly untraceable and cannot be reversed.",
            "The victim is instructed to purchase specific gift cards, then read the card numbers and PINs to the scammer over the phone.",
            "In-store tampering involves scammers recording the numbers on gift cards displayed on store racks, then monitoring for activation so they can drain the value remotely.",
            "Online scammers sell discounted gift cards that are stolen, counterfeit, or have already been drained."
        ],
        warningSigns: [
            "Any request to pay with gift cards for bills, fines, or debts",
            "Instructions to purchase gift cards and share the numbers by phone or text",
            "Gift card packaging that appears tampered with or resealed",
            "Online gift card deals at significantly below face value",
            "Urgency to buy cards immediately and share the information right away"
        ],
        exampleMessages: [
            {
                type: "Phone Call",
                content: "This is the IRS. You owe $3,200 in back taxes. To avoid criminal prosecution, you must purchase $3,200 in Google Play gift cards and call us back with the redemption codes. A warrant for your arrest will be issued if this is not resolved today."
            },
            {
                type: "Text Message",
                content: "Boss: I need you to do me a favor. I am in a meeting and need you to buy 5 Apple gift cards at $100 each for a client. I will reimburse you. Just scratch off the backs and send me photos of the codes."
            }
        ],
        preventionSteps: [
            {
                title: "Remember: gift cards are for gifts only",
                description: "No legitimate business, government agency, or utility company will ever ask you to pay with gift cards. This is always a scam."
            },
            {
                title: "Inspect gift cards before purchasing",
                description: "Check that the protective scratch-off coating is intact and the packaging has not been opened, resealed, or tampered with."
            },
            {
                title: "Keep gift card receipts",
                description: "Save the receipt and the card until the full value has been used. If the card is drained by a scammer, the receipt may help with a store investigation."
            },
            {
                title: "Report gift card scams",
                description: "Report to the FTC at reportfraud.ftc.gov and contact the gift card company directly. Some companies may be able to freeze remaining funds."
            }
        ],
        faq: [
            {
                question: "Why do scammers prefer gift cards?",
                answer: "Gift cards are essentially untraceable cash. Once the scammer has the card numbers and PINs, they can instantly convert the value to cash or cryptocurrency. Unlike credit cards, gift card transactions cannot be reversed."
            },
            {
                question: "Can I get my money back from a gift card scam?",
                answer: "Recovery is very difficult but not impossible. Contact the gift card company immediately, as some may freeze the funds if they have not been redeemed. File a report with the FTC and keep all documentation."
            },
            {
                question: "How do scammers drain gift cards from store racks?",
                answer: "Scammers carefully open packaging, record the card numbers and PINs, then reseal the package. They use automated systems to check when the card is activated, then immediately redeem the value online."
            }
        ],
        relatedScams: [
            "irs-tax-scam",
            "utility-scam",
            "tech-support-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "wire-fraud-scam",
        title: "Wire Transfer Fraud: Protecting Your Money from Wire Scams",
        metaTitle: "Wire Transfer Fraud: How to Protect Against Wire Scams | GetCyberRight",
        metaDescription: "Learn about wire transfer fraud, including real estate wire fraud, business email compromise, and romance scam wire transfers. Protect your money.",
        keywords: [
            "wire fraud",
            "wire transfer scam",
            "real estate wire fraud",
            "money transfer scam",
            "western union scam"
        ],
        cluster: "online-scams",
        overview: "Wire transfer fraud causes billions in losses annually because wire transfers are fast, irreversible, and difficult to trace. Criminals use business email compromise, real estate closing fraud, romance scams, and other schemes to trick victims into wiring money. Once the wire is sent, the money is typically moved through multiple accounts and across borders within minutes, making recovery nearly impossible.",
        howItWorks: [
            "In real estate wire fraud, scammers hack email accounts of title companies or agents and send victims fake closing instructions with fraudulent wire transfer details.",
            "Business email compromise involves impersonating executives or vendors to trick employees into wiring company funds to criminal accounts.",
            "Romance scammers build relationships over weeks or months, then create emergencies requiring urgent wire transfers.",
            "Fake invoice schemes send convincing invoices for services with wire transfer payment instructions to criminal accounts."
        ],
        warningSigns: [
            "Last-minute changes to wire transfer instructions, especially received by email",
            "Urgency to send wire transfers immediately without time to verify",
            "Wire instructions to personal accounts rather than business accounts",
            "Requests to keep the wire transfer confidential",
            "Email addresses that look similar to but are slightly different from legitimate contacts"
        ],
        exampleMessages: [
            {
                type: "Email (Real Estate)",
                content: "Hi, I am reaching out regarding your upcoming closing. Please note our wire instructions have been updated. Wire your closing costs of $47,350 to the following account by end of business today to avoid delays: [fraudulent account details]"
            },
            {
                type: "Email (Business)",
                content: "Hi [Employee Name], I need you to process an urgent wire transfer of $28,500 to this vendor today. Please do not discuss this with anyone as it is part of a confidential acquisition. I am in meetings all day but will explain later."
            }
        ],
        preventionSteps: [
            {
                title: "Verify wire instructions by phone",
                description: "Always call the recipient using a known phone number (not one from the email) to verbally confirm wire transfer instructions before sending any money."
            },
            {
                title: "Be suspicious of last-minute changes",
                description: "If wire instructions change at the last minute, stop the process and verify through an independent channel. This is a major red flag."
            },
            {
                title: "Use multi-person authorization",
                description: "Implement dual authorization requirements for all wire transfers above a certain threshold at your business."
            },
            {
                title: "Act immediately if you sent a fraudulent wire",
                description: "Contact your bank within 24 hours to attempt a wire recall. File reports with your national cybercrime authority (IC3 in the US, Action Fraud in the UK, ACSC in Australia) and local law enforcement."
            }
        ],
        faq: [
            {
                question: "Can I recover money from a fraudulent wire transfer?",
                answer: "Recovery is possible but time-sensitive. Contact your bank immediately to initiate a wire recall. Banks have limited time to freeze recipient accounts. The sooner you act, the better your chances."
            },
            {
                question: "How do scammers intercept real estate transactions?",
                answer: "Scammers compromise email accounts of real estate agents, title companies, or attorneys by phishing. They monitor email threads for closing details, then send fake wire instructions at the critical moment."
            },
            {
                question: "How can businesses prevent wire fraud?",
                answer: "Implement dual authorization for wire transfers, verify all changes to payment instructions by phone, train employees to recognize business email compromise, and use email security measures like DMARC."
            }
        ],
        relatedScams: [
            "business-email-scam",
            "romance-scam",
            "phishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "business-email-scam",
        title: "Business Email Compromise (BEC): Corporate Email Fraud",
        metaTitle: "Business Email Compromise: Prevent BEC Scams | GetCyberRight",
        metaDescription: "Protect your business from email compromise scams. Learn how BEC attacks work, warning signs, and prevention strategies for corporate email fraud.",
        keywords: [
            "business email compromise",
            "BEC scam",
            "CEO fraud",
            "corporate email scam",
            "email spoofing"
        ],
        cluster: "phishing-attacks",
        overview: "Business Email Compromise (BEC) is one of the costliest forms of cybercrime. According to Europol and the FBI, BEC causes billions in global losses annually. The UK NCSC and Australia's ACSC have issued similar warnings about its rapid growth. Attackers compromise or spoof corporate email accounts to trick employees, vendors, or partners into making fraudulent wire transfers or sharing sensitive information. Unlike mass phishing, BEC attacks are highly targeted and often involve extensive research into the target organization.",
        howItWorks: [
            "Attackers compromise an executive's email account through phishing or credential stuffing, then use it to send fraudulent requests to employees.",
            "Email spoofing creates messages that appear to come from the CEO, CFO, or a trusted vendor, requesting urgent wire transfers or sensitive data.",
            "Vendor email compromise involves hacking a supplier's email to send fake invoices with updated payment information.",
            "Payroll diversion schemes redirect employee direct deposits to criminal accounts by impersonating employees through HR email requests."
        ],
        warningSigns: [
            "Urgent requests for wire transfers or payment changes from executives",
            "Emails requesting secrecy about financial transactions",
            "Changes to vendor payment information received by email",
            "Requests for W-2s, employee data, or sensitive company information",
            "Slight variations in email addresses from known contacts",
            "Unusual timing of requests, such as after business hours or during travel"
        ],
        exampleMessages: [
            {
                type: "CEO Impersonation",
                content: "Hi [CFO Name], I need you to process a wire transfer of $125,000 to complete a confidential acquisition. This is time-sensitive and cannot wait until Monday. I am traveling and unreachable by phone. Please process immediately and confirm by email."
            },
            {
                type: "Vendor Impersonation",
                content: "Hello, This is to inform you that our banking information has changed. Please update your records with the new account details below for all future payments. Invoice #4827 for $67,450 is due this week."
            }
        ],
        preventionSteps: [
            {
                title: "Implement verification procedures",
                description: "Require phone verification for all wire transfers, payment changes, and sensitive data requests using known contact numbers, not numbers provided in the suspicious email."
            },
            {
                title: "Use multi-factor authentication on all email accounts",
                description: "MFA prevents attackers from accessing email accounts even if passwords are compromised through phishing."
            },
            {
                title: "Deploy email authentication protocols",
                description: "Implement SPF, DKIM, and DMARC to prevent email spoofing and flag messages from unauthorized senders."
            },
            {
                title: "Train employees regularly",
                description: "Conduct regular BEC awareness training with realistic phishing simulations. Ensure all employees, especially those in finance and HR, understand BEC tactics."
            }
        ],
        faq: [
            {
                question: "How much do BEC scams cost businesses?",
                answer: "According to multiple agencies including Europol, the FBI, and the UK NCSC, BEC scams cause billions in global losses annually, with average losses per incident exceeding $120,000. They affect businesses of all sizes across all industries."
            },
            {
                question: "How do attackers choose their targets?",
                answer: "BEC attackers research companies through LinkedIn, SEC filings, social media, and company websites. They identify key personnel in finance and executive roles, and time their attacks around known events like mergers or travel."
            },
            {
                question: "What should we do if we fall victim to BEC?",
                answer: "Contact your bank immediately to attempt a wire recall. Report to your national cybercrime authority (IC3 in the US, Action Fraud in the UK, ACSC in Australia), notify local law enforcement, engage a cybersecurity firm to investigate, and implement stronger controls to prevent future attacks."
            }
        ],
        relatedScams: [
            "phishing",
            "wire-fraud-scam",
            "identity-theft"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "smishing",
        title: "Smishing: How SMS Phishing Attacks Steal Your Data",
        metaTitle: "Smishing: Protect Against SMS Phishing Attacks | GetCyberRight",
        metaDescription: "Learn about smishing (SMS phishing) attacks. Identify fake text messages, protect your phone, and avoid clicking malicious links in texts.",
        keywords: [
            "smishing",
            "sms phishing",
            "text message scam",
            "phishing text",
            "fake text message"
        ],
        cluster: "phishing-attacks",
        overview: "Smishing (SMS phishing) uses text messages to trick recipients into clicking malicious links, sharing personal information, or downloading malware. Smishing attacks have surged as people increasingly trust text messages over email. Scammers impersonate banks, delivery services, government agencies, and tech companies, exploiting the urgency and brevity of text communication to catch victims off guard.",
        howItWorks: [
            "Scammers send mass text messages impersonating trusted organizations with urgent calls to action.",
            "Messages contain shortened URLs that redirect to phishing websites designed to steal login credentials, personal data, or financial information.",
            "Some smishing texts deliver malware that gives attackers access to the victim's phone, contacts, and banking apps.",
            "Two-step smishing involves a text followed by a phone call from someone claiming to be from the organization, using information from the text interaction to seem legitimate."
        ],
        warningSigns: [
            "Unexpected text messages from unknown numbers claiming to be from known companies",
            "Urgent messages about account problems, suspicious activity, or missed deliveries",
            "Shortened URLs that hide the actual destination website",
            "Texts requesting personal information, passwords, or verification codes",
            "Messages with poor grammar, unusual formatting, or generic greetings",
            "Offers that seem too good to be true sent via text"
        ],
        exampleMessages: [
            {
                type: "Fake Bank Alert",
                content: "ALERT: Unusual activity detected on your Chase account. Your account has been temporarily locked. Verify your identity now: https://bit.ly/ch4se-verify"
            },
            {
                type: "Fake Delivery",
                content: "USPS: Your package cannot be delivered due to incomplete address. Update your delivery info here: https://usps-redeliver.info/track/8847362"
            }
        ],
        preventionSteps: [
            {
                title: "Do not click links in unexpected texts",
                description: "If you receive a text claiming to be from your bank or a delivery service, open the official app or website directly instead of clicking the link in the message."
            },
            {
                title: "Verify through official channels",
                description: "Contact the organization directly using a phone number from their official website, not from the text message."
            },
            {
                title: "Enable spam filtering on your phone",
                description: "Both iPhone and Android have built-in spam text filtering. Enable these features and report spam messages when you receive them."
            },
            {
                title: "Never share verification codes",
                description: "Legitimate companies will never text you asking for verification codes or passwords. These codes are for your use only."
            }
        ],
        faq: [
            {
                question: "What makes smishing different from email phishing?",
                answer: "Smishing exploits the higher trust people place in text messages. Texts feel more personal and urgent, and people are less likely to scrutinize links on small phone screens. Smishing also bypasses email spam filters."
            },
            {
                question: "Can clicking a smishing link infect my phone?",
                answer: "Yes, some smishing links can install malware on your phone, especially on Android devices. Even without malware, the link may lead to a convincing fake website designed to steal your information."
            },
            {
                question: "How do I report smishing texts?",
                answer: "Forward suspicious texts to 7726 (SPAM) to report them to your carrier. You can also report them to the FTC at reportfraud.ftc.gov and block the sender on your phone."
            }
        ],
        relatedScams: [
            "phishing",
            "delivery-scam",
            "bank-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "vishing",
        title: "Vishing: Voice Phishing Phone Scams Explained",
        metaTitle: "Vishing: Protect Against Voice Phishing Phone Scams | GetCyberRight",
        metaDescription: "Learn about vishing (voice phishing) attacks. Protect yourself from phone scams using caller ID spoofing, robocalls, and social engineering.",
        keywords: [
            "vishing",
            "voice phishing",
            "phone scam",
            "caller id spoofing",
            "phone fraud"
        ],
        cluster: "phishing-attacks",
        overview: "Vishing (voice phishing) uses phone calls to manipulate victims into revealing sensitive information or making payments. Advanced caller ID spoofing makes calls appear to come from legitimate organizations, including banks, government agencies, and tech companies. AI-powered voice cloning has made vishing even more dangerous, enabling scammers to impersonate specific individuals convincingly.",
        howItWorks: [
            "Scammers use caller ID spoofing to make calls appear to come from legitimate numbers, including your bank, the IRS, or local police.",
            "Robocalls deliver automated messages about account problems, warranty expirations, or legal issues, directing victims to press a number or call back.",
            "Live callers use social engineering techniques, creating urgency and fear to pressure victims into sharing personal information or making payments.",
            "AI voice cloning technology allows scammers to mimic the voices of family members, executives, or authority figures."
        ],
        warningSigns: [
            "Unsolicited calls demanding immediate action or payment",
            "Callers who refuse to provide identifying information or a callback number",
            "Threats of arrest, account closure, or legal action",
            "Requests for personal information your bank or service provider should already have",
            "Caller ID showing a trusted organization but the call feels suspicious",
            "Being asked to confirm information the caller provides rather than being asked to identify yourself"
        ],
        exampleMessages: [
            {
                type: "Bank Impersonation Call",
                content: "This is the fraud department at Wells Fargo. We have detected unauthorized transactions on your account totaling $2,340. To verify your identity and block these charges, I need your account number and the last four digits of your Social Security number."
            },
            {
                type: "Tech Support Call",
                content: "Hello, this is Microsoft Technical Support. We have detected critical errors on your computer that indicate a virus infection. If not resolved immediately, your personal data including banking information will be compromised. I need remote access to your computer to fix this."
            }
        ],
        preventionSteps: [
            {
                title: "Let unknown calls go to voicemail",
                description: "If you do not recognize the number, let it go to voicemail. Legitimate callers will leave a message. Scammers rarely do."
            },
            {
                title: "Never give information to incoming callers",
                description: "If someone calls claiming to be from your bank or a government agency, hang up and call the organization directly using the number on their official website."
            },
            {
                title: "Use call blocking and spam detection",
                description: "Enable your phone's built-in call screening features and consider apps like Nomorobo, Hiya, or Truecaller to identify potential scam calls."
            },
            {
                title: "Register on the Do Not Call Registry",
                description: "While scammers ignore it, registering at donotcall.gov means any telemarketing call you receive is more likely to be fraudulent."
            }
        ],
        faq: [
            {
                question: "Can scammers really spoof my bank's phone number?",
                answer: "Yes, caller ID spoofing technology allows scammers to display any phone number they choose, including your bank's, the IRS, or even your own number. Never trust caller ID alone to verify a call's legitimacy."
            },
            {
                question: "How do AI voice scams work?",
                answer: "Scammers use AI to clone voices from short audio samples found on social media, voicemail greetings, or recorded calls. They can create convincing impersonations of family members or executives to request money or information."
            },
            {
                question: "What should I do if I gave information to a vishing scammer?",
                answer: "Change passwords immediately for any accounts discussed. Contact your bank to secure financial accounts. Place fraud alerts on your credit reports. Monitor all accounts closely for unauthorized activity."
            }
        ],
        relatedScams: [
            "smishing",
            "tech-support-scam",
            "grandparent-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "catfishing",
        title: "Catfishing: How Fake Online Profiles Lead to Fraud",
        metaTitle: "Catfishing: Spot Fake Profiles & Online Impersonation | GetCyberRight",
        metaDescription: "Learn about catfishing and fake online profiles. Identify imposters on dating sites and social media before they exploit your trust.",
        keywords: [
            "catfishing",
            "fake profile",
            "online impersonation",
            "catfish scam",
            "fake dating profile"
        ],
        cluster: "social-media-security",
        overview: "Catfishing involves creating fake online identities to deceive others, typically on dating platforms and social media. Catfishers use stolen photos and fabricated life stories to build emotional connections, eventually exploiting their victims for money, personal information, or other purposes. With AI-generated photos and deepfake technology, catfishing has become increasingly sophisticated and harder to detect.",
        howItWorks: [
            "Scammers create attractive profiles using stolen photos and carefully crafted backstories on dating apps and social media.",
            "They invest weeks or months building emotional connections through frequent messaging, calls, and video chats (often with excuses for not using video).",
            "Once trust is established, they create emergencies requiring financial help, such as medical bills, travel costs, or business problems.",
            "AI-generated photos and deepfake video technology make fake identities increasingly convincing and difficult to detect."
        ],
        warningSigns: [
            "Profile photos that look professionally shot or too perfect",
            "Refusal or inability to video chat or meet in person",
            "Excuses for why they cannot meet, such as military deployment, working overseas, or medical emergencies",
            "Relationship progresses very quickly with intense emotional declarations",
            "Requests for money or gift cards for emergencies",
            "Inconsistencies in their stories or personal details"
        ],
        exampleMessages: [
            {
                type: "Dating App Message",
                content: "I feel like we have a real connection. I have never felt this way about anyone before. I wish I could be with you right now, but I am stationed overseas for another 6 months. I just found out my mother needs surgery and I do not have access to my bank account from here. Could you help me with $2,000? I will pay you back as soon as I get home."
            },
            {
                type: "Social Media DM",
                content: "Hi! I came across your profile and I love your energy. I am a petroleum engineer working on an oil rig off the coast of Scotland. It gets lonely out here. I would love to get to know you better. Can we chat on WhatsApp?"
            }
        ],
        preventionSteps: [
            {
                title: "Reverse image search profile photos",
                description: "Use Google reverse image search or TinEye to check if the person's photos appear elsewhere online or belong to someone else."
            },
            {
                title: "Insist on video calls early",
                description: "A real person will be willing to video chat. If someone consistently avoids video calls, it is a major red flag."
            },
            {
                title: "Never send money to someone you have not met",
                description: "No matter how genuine the connection feels, never send money, gift cards, or financial information to someone you have only met online."
            },
            {
                title: "Watch for AI-generated photos",
                description: "Look for signs of AI-generated images: asymmetric features, blurry backgrounds, strange ear shapes, or mismatched jewelry and accessories."
            }
        ],
        faq: [
            {
                question: "How common is catfishing?",
                answer: "Romance scams involving catfishing account for billions in reported losses annually. The FTC reports that romance scams are the most financially damaging form of consumer fraud."
            },
            {
                question: "Can catfishers use AI to create fake photos?",
                answer: "Yes, AI tools can generate realistic photos of people who do not exist. These photos will not appear in reverse image searches, making them harder to detect. Look for subtle signs like asymmetric features or unusual backgrounds."
            },
            {
                question: "What should I do if I think I am being catfished?",
                answer: "Stop sending money immediately. Reverse image search their photos. Ask for a live video call. If they cannot or will not verify their identity, cut off contact. Report the profile to the platform and to the FTC."
            }
        ],
        relatedScams: [
            "romance-scam",
            "social-media-scam",
            "sextortion-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "sextortion-scam",
        title: "Sextortion Scams: Blackmail and Online Exploitation",
        metaTitle: "Sextortion Scams: Protect Against Online Blackmail | GetCyberRight",
        metaDescription: "Learn about sextortion scams and online blackmail. Protect yourself and your family from criminals who use intimate content for extortion.",
        keywords: [
            "sextortion",
            "online blackmail",
            "sextortion scam",
            "blackmail email",
            "intimate image threat"
        ],
        cluster: "social-media-security",
        overview: "Sextortion involves criminals threatening to release intimate images or information unless the victim pays money. Some sextortion attempts are completely fabricated, with scammers sending mass emails claiming to have compromising footage from hacked webcams. Others target victims who have shared intimate content online, particularly teenagers and young adults. Sextortion can have devastating emotional and psychological effects on victims.",
        howItWorks: [
            "Mass sextortion emails claim the sender hacked your webcam and recorded you visiting adult websites, demanding Bitcoin payment to prevent release.",
            "Criminals build online relationships, convince victims to share intimate photos or videos, then threaten to distribute them unless paid.",
            "Fake dating profiles or social media accounts lure victims into compromising video chats that are secretly recorded.",
            "Some criminals use AI to create fake compromising images of victims from their social media photos."
        ],
        warningSigns: [
            "Emails claiming to have hacked your webcam and recorded you",
            "Messages including an old password of yours (obtained from data breaches) as proof of hacking",
            "New online contacts who quickly push for intimate photo or video exchanges",
            "Threats to send compromising material to your contacts unless you pay",
            "Demands for payment in cryptocurrency or gift cards"
        ],
        exampleMessages: [
            {
                type: "Blackmail Email",
                content: "I have installed malware on your computer and recorded you through your webcam while you visited adult websites. I have your contact list. Pay $2,000 in Bitcoin within 48 hours or I will send the video to everyone you know. Your password is [old password from breach]."
            },
            {
                type: "Social Media Threat",
                content: "I have screenshots of everything you sent me. If you do not send $500 via CashApp in the next hour, I am sending these to your family, friends, and employer. Do not try to block me, I already have everything saved."
            }
        ],
        preventionSteps: [
            {
                title: "Do not respond to mass sextortion emails",
                description: "These are sent to millions of people and are almost always fake. They use old passwords from data breaches to seem credible. Delete them and change any passwords mentioned."
            },
            {
                title: "Never share intimate content online",
                description: "Once images or videos are shared digitally, you lose control of them. Even with people you trust, relationships can change and content can be stolen."
            },
            {
                title: "Cover your webcam when not in use",
                description: "Use a webcam cover or piece of tape for an extra layer of privacy protection against any potential unauthorized access."
            },
            {
                title: "Report and do not pay",
                description: "Paying never guarantees the threats will stop. Report sextortion to your national cybercrime authority (IC3 in the US, CEOP in the UK, ACSC in Australia), the National Center for Missing and Exploited Children or equivalent child protection agency (if involving a minor), and local law enforcement."
            }
        ],
        faq: [
            {
                question: "Are mass sextortion emails real?",
                answer: "Almost never. These emails are sent to millions of people using email lists from data breaches. The old password they include is real (from a breach) but they have not actually hacked your webcam. Change the password mentioned and delete the email."
            },
            {
                question: "What should I do if someone is threatening to share my images?",
                answer: "Do not pay. Save all communications as evidence. Block the person but do not delete conversations. Report to the platform, your national cybercrime authority, and local police. Contact the Cyber Civil Rights Initiative (cybercivilrights.org) in the US, or the Revenge Porn Helpline (revengepornhelpline.org.uk) in the UK for support."
            },
            {
                question: "How can I protect my teenager from sextortion?",
                answer: "Talk openly about the risks of sharing intimate content online. Explain that sextortion is a crime and that victims should never pay or feel ashamed to ask for help. Ensure they know to report to a trusted adult immediately."
            }
        ],
        relatedScams: [
            "catfishing",
            "romance-scam",
            "social-media-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "ransomware",
        title: "Ransomware: Understanding and Preventing Data Hostage Attacks",
        metaTitle: "Ransomware: Prevent, Detect & Recover from Attacks | GetCyberRight",
        metaDescription: "Learn about ransomware attacks that encrypt your files and demand payment. Prevention strategies, detection tips, and recovery options explained.",
        keywords: [
            "ransomware",
            "ransomware attack",
            "ransomware prevention",
            "file encryption malware",
            "ransomware protection"
        ],
        cluster: "device-security",
        overview: "Ransomware is malicious software that encrypts your files and demands payment (usually in cryptocurrency) to restore access. Attacks target individuals, businesses, hospitals, schools, and government agencies. Modern ransomware operations have evolved into professional criminal enterprises, with some groups offering ransomware-as-a-service to other criminals. Prevention through backups, updates, and security awareness remains the best defense.",
        howItWorks: [
            "Ransomware typically enters systems through phishing emails with malicious attachments, compromised websites, or exploited software vulnerabilities.",
            "Once activated, the malware encrypts files on the infected computer and any connected network drives, making them inaccessible.",
            "A ransom note appears demanding payment in cryptocurrency within a deadline, after which the ransom increases or files are permanently destroyed.",
            "Double extortion ransomware also steals data before encrypting it, threatening to publish sensitive information if the ransom is not paid."
        ],
        warningSigns: [
            "Files suddenly cannot be opened or have unusual extensions added",
            "A ransom note appears on your screen or in every folder",
            "Computer performance significantly slows down during the encryption process",
            "Antivirus software is disabled or blocked from running",
            "Unexpected pop-ups or system messages about encryption"
        ],
        exampleMessages: [
            {
                type: "Ransom Note",
                content: "ALL YOUR FILES HAVE BEEN ENCRYPTED! Your personal files, documents, photos, and databases are no longer accessible. The only way to recover them is to purchase our decryption tool. Send 0.5 Bitcoin to the following wallet address within 72 hours. After this time, your files will be permanently deleted."
            },
            {
                type: "Phishing Email (delivery method)",
                content: "Subject: Invoice #INV-2026-0847. Dear Customer, Please review the attached invoice for your recent order. Payment is due within 30 days. [Attachment: Invoice-0847.docm]"
            }
        ],
        preventionSteps: [
            {
                title: "Maintain offline backups",
                description: "Regularly back up important files to an external drive that is disconnected from your computer when not in use. Cloud backups should use versioning so encrypted files do not overwrite clean copies."
            },
            {
                title: "Keep all software updated",
                description: "Install security updates promptly for your operating system, browsers, and all software. Ransomware often exploits known vulnerabilities in outdated software."
            },
            {
                title: "Use reputable antivirus and anti-malware software",
                description: "Keep security software active and updated. Enable real-time scanning and behavior-based detection that can identify ransomware activity."
            },
            {
                title: "Do not open suspicious email attachments",
                description: "Be extremely cautious with email attachments, especially from unknown senders. Disable macros in office documents unless specifically needed."
            },
            {
                title: "Use network segmentation",
                description: "For businesses, segment your network so that if one system is infected, the ransomware cannot easily spread to other systems and backup drives."
            }
        ],
        faq: [
            {
                question: "Should I pay the ransom?",
                answer: "Law enforcement agencies generally advise against paying ransoms. Payment funds criminal operations, does not guarantee file recovery, and marks you as a willing payer for future attacks. Focus on prevention and maintaining good backups."
            },
            {
                question: "Can I recover encrypted files without paying?",
                answer: "Sometimes. Check nomoreransom.org for free decryption tools for known ransomware variants. If you have offline backups, you can restore from those. Some security firms may be able to help with specific ransomware strains."
            },
            {
                question: "How do I protect my business from ransomware?",
                answer: "Implement the 3-2-1 backup rule (3 copies, 2 different media, 1 offsite), keep all systems updated, train employees on phishing awareness, use network segmentation, implement email filtering, and have an incident response plan ready."
            }
        ],
        relatedScams: [
            "phishing",
            "business-email-scam",
            "fake-antivirus-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "fake-antivirus-scam",
        title: "Fake Antivirus Scams: Bogus Security Alert Pop-ups",
        metaTitle: "Fake Antivirus Scams: Spot Bogus Security Alerts | GetCyberRight",
        metaDescription: "Learn to identify fake antivirus pop-ups and scareware. Protect yourself from bogus security alerts that trick you into paying for fake software.",
        keywords: [
            "fake antivirus",
            "scareware",
            "fake virus alert",
            "fake security warning",
            "bogus antivirus"
        ],
        cluster: "device-security",
        overview: "Fake antivirus scams, also known as scareware, use alarming pop-ups and fake security alerts to trick you into believing your computer is infected with viruses. These pop-ups mimic legitimate antivirus warnings and pressure you to purchase fake security software, call a fake support number, or download actual malware. The fraudulent software either does nothing or actively harms your computer while charging you for protection.",
        howItWorks: [
            "Malicious websites or ads display fake virus detection pop-ups that mimic Windows Defender, Norton, or McAfee alerts.",
            "The pop-ups claim your computer is infected and cannot be closed normally, creating panic and urgency.",
            "Victims are directed to purchase fake antivirus software, call a tech support number, or download a program that installs actual malware.",
            "Some scareware installs legitimate-looking programs that run fake scans showing dozens of threats, reinforcing the need to pay for the full version."
        ],
        warningSigns: [
            "Pop-ups claiming your computer has many viruses that appeared while browsing",
            "Security warnings that cannot be closed by normal means",
            "Alerts from antivirus software you do not have installed",
            "Warnings urging you to call a phone number immediately",
            "Pop-ups that look slightly different from your actual antivirus software",
            "Websites that trigger full-screen alerts about virus infections"
        ],
        exampleMessages: [
            {
                type: "Pop-Up Alert",
                content: "WARNING! Windows has detected 47 viruses on your system! Your personal data, bank passwords, and photos are at risk. Download TotalSecure Antivirus NOW to remove threats. Your PC will be permanently damaged in 5:00 minutes if action is not taken."
            },
            {
                type: "Browser Alert",
                content: "CRITICAL ALERT FROM MICROSOFT: Your computer has been locked. Trojan Spyware detected! Call Microsoft Support immediately: 1-888-XXX-XXXX. Do not restart your computer or you will lose all data."
            }
        ],
        preventionSteps: [
            {
                title: "Close the browser to dismiss fake alerts",
                description: "Use Ctrl+Alt+Delete (Windows) or Force Quit (Mac) to close your browser. Do not click anything within the pop-up, including close or cancel buttons."
            },
            {
                title: "Use only reputable antivirus software",
                description: "Install trusted antivirus software from known companies like Windows Defender (built-in), Malwarebytes, Bitdefender, or Norton. Purchase directly from official websites."
            },
            {
                title: "Keep your browser updated",
                description: "Modern browsers have built-in protection against malicious pop-ups and known scareware sites. Ensure your browser is always up to date."
            },
            {
                title: "Use an ad blocker",
                description: "Ad blockers can prevent many malicious ads and pop-ups from appearing in the first place, reducing your exposure to scareware."
            }
        ],
        faq: [
            {
                question: "How do I know if a virus alert is real?",
                answer: "Real antivirus alerts come from software you have actually installed and appear within the application, not in your browser. Your built-in antivirus (like Windows Defender) will never ask you to call a phone number or purchase software through a pop-up."
            },
            {
                question: "What if I already downloaded fake antivirus software?",
                answer: "Run a scan with legitimate antivirus software (Windows Defender or Malwarebytes Free). Uninstall the fake software through your system settings. If you paid, dispute the charge with your bank or credit card company."
            },
            {
                question: "Can fake virus alerts actually infect my computer?",
                answer: "Clicking on fake alerts or downloading the recommended software can install actual malware on your computer. However, simply seeing the pop-up does not infect your system. Close the browser without clicking anything inside the alert."
            }
        ],
        relatedScams: [
            "tech-support-scam",
            "ransomware",
            "phishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "cashapp-scam",
        title: "Cash App Scams: How to Protect Your Money",
        metaTitle: "Cash App Scams: Spot Fraud & Protect Your Account | GetCyberRight",
        metaDescription: "Learn about Cash App scams including fake giveaways, money flipping, and payment fraud. Protect your Cash App account from scammers.",
        keywords: [
            "cash app scam",
            "cashapp fraud",
            "cash app money flip",
            "cash app giveaway scam",
            "cash app hack"
        ],
        cluster: "online-scams",
        overview: "Cash App scams exploit the platform's peer-to-peer payment system, where transactions are instant and difficult to reverse. Scammers use fake giveaways, money flipping promises, impersonation of Cash App support, and fraudulent sales to steal money from users. Because Cash App payments are designed for people you know and trust, sending money to strangers carries significant risk.",
        howItWorks: [
            "Fake Cash App giveaways on social media promise to multiply your money if you send a small amount first. You send money and receive nothing back.",
            "Money flipping scams promise to turn small amounts into large returns through a secret technique or glitch. There is no glitch; they just keep your money.",
            "Scammers impersonate Cash App support through fake accounts and ask for your login information, PIN, or sign-in code to steal your account.",
            "Fake sellers accept Cash App payment for items that are never delivered, knowing the buyer has limited recourse."
        ],
        warningSigns: [
            "Promises to multiply your money through Cash App",
            "Social media posts about Cash App giveaways requiring you to send money first",
            "Messages from Cash App support asking for your PIN or sign-in code",
            "Sellers who only accept Cash App payment with no other options",
            "Requests from strangers to receive and forward Cash App payments"
        ],
        exampleMessages: [
            {
                type: "Social Media Post",
                content: "CASH APP FRIDAY! Send $50 to $CashFlip2026 and receive $500 back within 1 hour! DM me for proof. First 20 people only! #CashAppFriday #MoneyFlip"
            },
            {
                type: "Direct Message",
                content: "Hi, I am from Cash App customer support. We detected unusual activity on your account. To verify your identity and prevent your account from being locked, please send us your sign-in code and PIN."
            }
        ],
        preventionSteps: [
            {
                title: "Only send money to people you know",
                description: "Cash App is designed for sending money to friends and family. Treat Cash App payments like cash. Once sent, they are very difficult to recover."
            },
            {
                title: "Enable security features",
                description: "Turn on Security Lock to require a PIN, Touch ID, or Face ID for every payment. Enable notifications for all transactions."
            },
            {
                title: "Ignore money multiplication offers",
                description: "No one can multiply your money through Cash App. All money flipping and giveaway schemes that require you to send money first are scams."
            },
            {
                title: "Know that Cash App support will never ask for your PIN",
                description: "Cash App support is available only through the app or at cash.app/help. They will never ask for your sign-in code, PIN, or password."
            }
        ],
        faq: [
            {
                question: "Can I get my money back on Cash App if scammed?",
                answer: "Cash App transactions are generally instant and non-reversible. You can request a refund from the recipient or dispute the transaction through Cash App support, but recovery is not guaranteed. Prevention is the best protection."
            },
            {
                question: "How do I contact real Cash App support?",
                answer: "Access support only through the Cash App application or at cash.app/help. Cash App support will never contact you first through social media, text, or phone calls."
            },
            {
                question: "Are Cash App giveaways on social media real?",
                answer: "While Cash App has occasionally run official promotions, any giveaway requiring you to send money first is a scam. Official Cash App promotions never ask you to send money to receive a prize."
            }
        ],
        relatedScams: [
            "venmo-scam",
            "zelle-scam",
            "social-media-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "venmo-scam",
        title: "Venmo Scams: Protect Yourself from Payment Fraud",
        metaTitle: "Venmo Scams: Spot Payment Fraud & Protect Your Account | GetCyberRight",
        metaDescription: "Learn about Venmo scams including fake payments, overpayment fraud, and account takeover. Protect your Venmo account from common fraud schemes.",
        keywords: [
            "venmo scam",
            "venmo fraud",
            "venmo payment scam",
            "venmo phishing",
            "venmo fake payment"
        ],
        cluster: "online-scams",
        overview: "Venmo scams target the platform's social and peer-to-peer features to defraud users. Common schemes include sending fake payment notifications, overpayment scams, phishing for account credentials, and using stolen credit cards to make payments that are later reversed. Venmo is designed for transactions between people who know and trust each other, making it risky for purchases from strangers.",
        howItWorks: [
            "Scammers send fake Venmo payment notification emails that look legitimate but contain phishing links to steal your login credentials.",
            "Overpayment scams involve sending more than the agreed amount (often from a stolen account), then asking you to return the difference before the original payment is reversed.",
            "Fraudulent buyers pay with Venmo for items sold online, then dispute the charge or the payment reverses because the linked payment source was stolen.",
            "Account takeover through phishing or credential stuffing gives scammers access to drain your Venmo balance and linked bank account."
        ],
        warningSigns: [
            "Payment notifications from Venmo that arrive by email rather than in the app",
            "Strangers sending you money and asking for a refund",
            "Requests to use Venmo for purchases from people you do not know",
            "Emails or texts asking you to verify your Venmo account through a link",
            "Unexpected password reset notifications for your Venmo account"
        ],
        exampleMessages: [
            {
                type: "Phishing Email",
                content: "Subject: You've got money! [Name] paid you $850.00. Note: For the couch - thanks! View your Venmo account: [phishing link]. If you did not request this transaction, click here to report."
            },
            {
                type: "Text from Buyer",
                content: "Hey, I just sent you $400 on Venmo for the concert tickets but I accidentally sent $600. Can you please send $200 back? I really need it corrected ASAP."
            }
        ],
        preventionSteps: [
            {
                title: "Only use Venmo with people you know",
                description: "Venmo is designed for splitting costs with friends. Avoid using it for transactions with strangers. For business transactions, use Venmo for Business which offers seller protection."
            },
            {
                title: "Verify payments in the app",
                description: "Always check your Venmo app directly to confirm payments. Do not rely on email notifications, which can be faked."
            },
            {
                title: "Enable multi-factor authentication",
                description: "Add PIN protection and enable two-factor authentication on your Venmo account to prevent unauthorized access."
            },
            {
                title: "Make your transactions private",
                description: "Set your Venmo transactions to private in settings. Public transaction history can be used by scammers to gather information about your activity."
            }
        ],
        faq: [
            {
                question: "Does Venmo offer buyer or seller protection?",
                answer: "Standard Venmo person-to-person payments do not include buyer or seller protection. Only Venmo for Business profiles and authorized merchant transactions offer some protection. This is why using Venmo with strangers is risky."
            },
            {
                question: "Can Venmo payments be reversed?",
                answer: "Payments made from stolen credit cards or bank accounts can be reversed, leaving you without the payment. This is why overpayment scams are effective. Never refund a stranger's overpayment."
            },
            {
                question: "How do I secure my Venmo account?",
                answer: "Enable PIN or biometric authentication, turn on two-factor authentication, use a strong unique password, set transactions to private, and review connected payment methods regularly."
            }
        ],
        relatedScams: [
            "cashapp-scam",
            "zelle-scam",
            "phishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "apple-scam",
        title: "Apple & iCloud Scams: Fake Apple ID Phishing",
        metaTitle: "Apple Scams: Protect Your Apple ID & iCloud Account | GetCyberRight",
        metaDescription: "Learn about Apple and iCloud phishing scams. Spot fake Apple ID alerts, iCloud storage warnings, and App Store purchase notifications.",
        keywords: [
            "apple scam",
            "icloud phishing",
            "apple id scam",
            "fake apple email",
            "apple support scam"
        ],
        cluster: "phishing-attacks",
        overview: "Apple scams target the billions of iPhone, iPad, and Mac users worldwide. Scammers send fake Apple ID alerts, iCloud storage warnings, and App Store purchase notifications to steal Apple ID credentials, payment information, and personal data. Because Apple IDs are connected to payment methods, photos, contacts, and device management, compromising one account gives criminals extensive access to a victim's digital life.",
        howItWorks: [
            "Phishing emails mimic Apple's branding, warning about unauthorized purchases, iCloud storage limits, or account security issues.",
            "Fake Apple support calls claim your iCloud account has been compromised and request your Apple ID credentials or remote access to your device.",
            "Scam texts alert you to fake problems with your Apple ID, directing you to phishing websites that capture your login information.",
            "Fake App Store refund emails lead to credential-harvesting websites designed to look identical to Apple's login page."
        ],
        warningSigns: [
            "Emails from addresses that do not end in @apple.com",
            "Messages about purchases you did not make requesting immediate action",
            "Calls from Apple support that you did not initiate",
            "Texts with shortened links about Apple ID problems",
            "Pop-ups on websites claiming your iPhone has a virus",
            "Requests for your Apple ID password or verification code"
        ],
        exampleMessages: [
            {
                type: "Phishing Email",
                content: "Your Apple ID was used to sign in to iCloud on a new device. If this was not you, your account may be compromised. Verify your identity now to secure your account: [Sign In] If you do not respond within 24 hours, your account will be locked."
            },
            {
                type: "Fake Text",
                content: "Apple Alert: Your iCloud storage is 99% full. Photos and documents will stop syncing. Upgrade your storage plan now: https://icloud-upgrade.info/manage"
            }
        ],
        preventionSteps: [
            {
                title: "Go directly to Apple's website",
                description: "Never click links in emails or texts claiming to be from Apple. Instead, go directly to appleid.apple.com or open the Settings app on your device."
            },
            {
                title: "Enable two-factor authentication",
                description: "Turn on two-factor authentication for your Apple ID. Never share the verification code with anyone, even someone claiming to be Apple support."
            },
            {
                title: "Know how Apple communicates",
                description: "Apple will never call you about account problems unless you requested a call. They will never ask for your password or verification code."
            },
            {
                title: "Report suspicious messages",
                description: "Forward suspicious emails to reportphishing@apple.com. Report suspicious calls to Apple and the FTC."
            }
        ],
        faq: [
            {
                question: "How do I know if an Apple email is real?",
                answer: "Legitimate Apple emails come from @apple.com addresses, use your real name (not generic greetings), and never ask you to click a link to provide your password. Check your account directly through Settings or appleid.apple.com."
            },
            {
                question: "Will Apple call me about my account?",
                answer: "Apple does not make unsolicited calls about account problems or suspicious activity. If you receive such a call, it is a scam. Apple Support can be reached at support.apple.com if you need help."
            },
            {
                question: "What if someone has my Apple ID password?",
                answer: "Change your Apple ID password immediately at appleid.apple.com. Enable two-factor authentication, review your trusted devices, check for unauthorized purchases, and update your security questions."
            }
        ],
        relatedScams: [
            "phishing",
            "tech-support-scam",
            "smishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "google-scam",
        title: "Google Account Scams: Phishing and Account Takeover",
        metaTitle: "Google Scams: Protect Your Gmail & Google Account | GetCyberRight",
        metaDescription: "Learn about Google account scams including Gmail phishing, fake security alerts, and Google Voice scams. Protect your Google account from takeover.",
        keywords: [
            "google scam",
            "gmail phishing",
            "google account hack",
            "google voice scam",
            "fake google alert"
        ],
        cluster: "phishing-attacks",
        overview: "Google account scams target the billions of people who use Gmail, Google Drive, YouTube, and other Google services. Because a Google account often serves as the central hub for email, cloud storage, photos, and account recovery for other services, compromising it gives criminals access to a victim's entire digital life. Scammers use sophisticated phishing, fake security alerts, and Google Voice verification scams.",
        howItWorks: [
            "Phishing emails mimic Google security alerts about unauthorized sign-ins or suspicious activity, directing victims to fake Google login pages.",
            "Google Voice scams trick victims into sharing a Google Voice verification code, which the scammer uses to set up a Google Voice number linked to the victim's phone.",
            "Fake Google Drive sharing notifications lead to phishing pages when clicked.",
            "Calendar spam adds events to your Google Calendar with phishing links, exploiting the automatic event acceptance feature."
        ],
        warningSigns: [
            "Security alert emails with links that do not go to accounts.google.com",
            "Requests to share Google verification codes with strangers",
            "Unexpected Google Drive sharing notifications from unknown people",
            "Calendar events you did not create with suspicious links",
            "Emails about Google accounts or services you do not use"
        ],
        exampleMessages: [
            {
                type: "Fake Security Alert",
                content: "Someone just signed in to your Google Account from a new Windows device. If this was not you, someone else has access to your account. Review your account now: [Sign In to Review Activity]"
            },
            {
                type: "Google Voice Scam",
                content: "Hi! I am responding to your listing on Craigslist. Before we meet, I just want to make sure you are a real person. I sent a Google verification code to your phone. Can you just read me that code so I know you are not a bot?"
            }
        ],
        preventionSteps: [
            {
                title: "Use Google's Security Checkup",
                description: "Visit myaccount.google.com/security-checkup regularly to review your account security, connected devices, and third-party access."
            },
            {
                title: "Enable Advanced Protection",
                description: "Google's Advanced Protection Program provides the strongest defense against phishing and account takeover. It requires a physical security key for sign-in."
            },
            {
                title: "Never share verification codes",
                description: "Google verification codes are for your use only. No legitimate person or service will ask you to share a code sent to your phone."
            },
            {
                title: "Check email sender addresses carefully",
                description: "Google security emails come from specific addresses like no-reply@accounts.google.com. Hover over links to verify they go to google.com before clicking."
            }
        ],
        faq: [
            {
                question: "What is the Google Voice verification scam?",
                answer: "Scammers ask you to share a Google verification code, claiming it is to verify your identity. They actually use it to create a Google Voice number linked to your phone, which they then use for other scams."
            },
            {
                question: "How do I know if a Google security email is real?",
                answer: "Legitimate Google emails come from @google.com or @accounts.google.com. You can also check recent security activity directly at myaccount.google.com/notifications without clicking any links in the email."
            },
            {
                question: "What should I do if my Google account is compromised?",
                answer: "Go to myaccount.google.com immediately, change your password, review and remove unrecognized devices, revoke third-party access, enable two-factor authentication, and check for forwarding rules in Gmail settings."
            }
        ],
        relatedScams: [
            "phishing",
            "smishing",
            "identity-theft"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "microsoft-scam",
        title: "Microsoft & Windows Scams: Fake Tech Support Alerts",
        metaTitle: "Microsoft Scams: Spot Fake Windows Alerts & Support Scams | GetCyberRight",
        metaDescription: "Protect yourself from Microsoft and Windows scams. Identify fake support calls, phishing emails, and fraudulent Windows security alerts.",
        keywords: [
            "microsoft scam",
            "windows scam",
            "fake microsoft call",
            "windows virus alert",
            "microsoft support scam"
        ],
        cluster: "phishing-attacks",
        overview: "Microsoft scams exploit the dominance of Windows as the world's most-used operating system. Criminals impersonate Microsoft through fake tech support calls, phishing emails about Microsoft 365 subscriptions, and fraudulent Windows security pop-ups. These scams aim to gain remote access to your computer, steal your credentials, or charge for unnecessary services. Microsoft never makes unsolicited calls about computer problems.",
        howItWorks: [
            "Cold calls from people claiming to be Microsoft support agents who have detected problems on your computer.",
            "Pop-up alerts in your browser claiming Windows has detected critical errors, directing you to call a fake support number.",
            "Phishing emails about Microsoft 365 subscription renewals or account security issues leading to credential-stealing websites.",
            "Remote access scams where fake technicians ask you to install remote control software, then use it to steal data or install malware."
        ],
        warningSigns: [
            "Unsolicited calls from Microsoft or Windows support",
            "Pop-ups claiming your computer has critical errors with a phone number to call",
            "Emails about Microsoft subscriptions you do not have",
            "Requests to install remote access software like TeamViewer or AnyDesk",
            "Technicians who claim to find many problems after accessing your computer"
        ],
        exampleMessages: [
            {
                type: "Phone Call",
                content: "Hello, this is the Windows Technical Department. Our system has detected that your computer is sending error reports and may be infected with a dangerous virus. We need to connect to your computer remotely to diagnose and fix the problem before your data is compromised."
            },
            {
                type: "Email",
                content: "Your Microsoft 365 subscription will expire today. Failure to renew will result in permanent loss of all emails, documents, and OneDrive files. Renew now for the discounted rate of $49.99: [Renew Subscription]"
            }
        ],
        preventionSteps: [
            {
                title: "Know that Microsoft does not make unsolicited calls",
                description: "Microsoft will never call you about computer problems. If someone calls claiming to be from Microsoft, it is a scam. Hang up immediately."
            },
            {
                title: "Close browser pop-ups without calling",
                description: "Use Task Manager (Ctrl+Alt+Delete) to force close your browser if a fake alert appears. Never call the phone number displayed in a pop-up."
            },
            {
                title: "Never give remote access to unsolicited callers",
                description: "Do not install remote access software at the request of someone who called you. Legitimate tech support only connects remotely when you initiate the contact."
            },
            {
                title: "Manage Microsoft subscriptions through your account",
                description: "Check your actual Microsoft subscriptions at account.microsoft.com. Do not rely on email notifications for subscription status."
            }
        ],
        faq: [
            {
                question: "Does Microsoft monitor my computer for problems?",
                answer: "No. Microsoft does not monitor individual computers and will never call you about detected issues. Windows may show legitimate error messages, but these appear as system notifications, not browser pop-ups with phone numbers."
            },
            {
                question: "What if I already gave a scammer remote access?",
                answer: "Disconnect from the internet immediately. Uninstall any remote access software they had you install. Run a full antivirus scan. Change all passwords from a different, secure device. Monitor financial accounts for unauthorized activity."
            },
            {
                question: "How can I get real Microsoft support?",
                answer: "Visit support.microsoft.com for legitimate help. You can also use the Get Help app built into Windows. Microsoft support is available through official channels only."
            }
        ],
        relatedScams: [
            "tech-support-scam",
            "fake-antivirus-scam",
            "phishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "bank-scam",
        title: "Bank Impersonation Scams: Fake Bank Calls and Texts",
        metaTitle: "Bank Scams: Spot Fake Bank Calls, Texts & Emails | GetCyberRight",
        metaDescription: "Protect yourself from bank impersonation scams. Learn to identify fake bank fraud alerts, phishing texts, and impersonation calls targeting your accounts.",
        keywords: [
            "bank scam",
            "fake bank call",
            "bank phishing",
            "bank fraud alert scam",
            "bank impersonation"
        ],
        cluster: "online-scams",
        overview: "Bank impersonation scams are among the most convincing fraud schemes because they exploit the trust people place in their financial institutions. Scammers use caller ID spoofing, sophisticated phishing emails, and fake fraud alert texts that closely mimic legitimate bank communications. They create urgency around supposed unauthorized transactions to trick victims into revealing account credentials, transferring funds, or providing personal information.",
        howItWorks: [
            "Scammers send fake fraud alert texts about suspicious transactions, then call pretending to be the bank's fraud department when you respond.",
            "Caller ID spoofing makes the call appear to come from your bank's actual phone number, increasing credibility.",
            "Fake bank representatives walk you through 'securing' your account, which actually involves authorizing transfers to the scammer's account.",
            "Phishing emails about account locks, new statements, or security updates lead to convincing fake banking login pages."
        ],
        warningSigns: [
            "Unsolicited calls or texts about suspicious account activity",
            "Requests for your full account number, PIN, online banking password, or one-time codes",
            "Instructions to transfer money to a 'safe account' to protect it from fraud",
            "Caller asking you to verify information they should already have",
            "Urgency and pressure to act immediately without time to think"
        ],
        exampleMessages: [
            {
                type: "Fake Fraud Alert",
                content: "Chase Alert: We detected a $1,847.00 purchase at Target in Miami, FL. If this was not you, reply NO. A fraud specialist will call you shortly to secure your account."
            },
            {
                type: "Phone Call Follow-Up",
                content: "Hello, this is the Chase fraud prevention team following up on the alert you received. We need to verify your identity to reverse the fraudulent charge. Can you please confirm the last four digits of your Social Security number and your online banking password?"
            }
        ],
        preventionSteps: [
            {
                title: "Call your bank directly",
                description: "If you receive a suspicious fraud alert, hang up and call the number on the back of your debit or credit card. Do not use any phone number provided in the alert."
            },
            {
                title: "Never share passwords or one-time codes",
                description: "Your bank will never ask for your online banking password, PIN, or one-time authentication codes. These are major red flags."
            },
            {
                title: "Do not transfer money to protect it",
                description: "Banks never ask you to move money to a different account to keep it safe. Any such request is a scam."
            },
            {
                title: "Set up legitimate bank alerts",
                description: "Enable real transaction alerts through your bank's official app or website so you can distinguish genuine notifications from scam attempts."
            }
        ],
        faq: [
            {
                question: "How can scammers spoof my bank's phone number?",
                answer: "Caller ID spoofing technology allows scammers to display any phone number, including your bank's. This is why you should never trust caller ID alone. Always call your bank back using the number on your card."
            },
            {
                question: "Will my bank really text me about fraud?",
                answer: "Many banks do send legitimate fraud alert texts. However, real bank alerts will never ask you to reply with personal information or click links. When in doubt, call your bank directly."
            },
            {
                question: "What should I do if I gave a scammer my banking information?",
                answer: "Contact your bank immediately through their official number. Request to freeze or close compromised accounts. Change your online banking password. File reports with local police and the FTC."
            }
        ],
        relatedScams: [
            "phishing",
            "smishing",
            "vishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "government-impersonation-scam",
        title: "Government Impersonation Scams: Fake Federal Agency Fraud",
        metaTitle: "Government Impersonation Scams: Spot Fake Agency Contacts | GetCyberRight",
        metaDescription: "Protect yourself from government impersonation scams. Learn how criminals pose as IRS, SSA, Medicare, and law enforcement to steal money and information.",
        keywords: [
            "government impersonation scam",
            "fake government call",
            "ssa scam",
            "federal agency scam",
            "impersonation fraud"
        ],
        cluster: "online-scams",
        overview: "Government impersonation scams involve criminals posing as officials from agencies like the IRS, Social Security Administration, Medicare, FBI, DEA, or local law enforcement. They use threats of arrest, benefit suspension, or legal action to intimidate victims into making immediate payments or sharing sensitive personal information. These scams are particularly effective against seniors and immigrants who may be less familiar with how government agencies actually communicate.",
        howItWorks: [
            "Callers claim to be from the Social Security Administration, stating your SSN has been linked to criminal activity and will be suspended unless you verify your identity.",
            "Fake law enforcement officials threaten arrest for unpaid fines, missed jury duty, or alleged crimes, demanding immediate payment.",
            "Scammers impersonating immigration officials threaten deportation or visa revocation unless fees are paid immediately.",
            "Fake emails and letters mimic official government correspondence, complete with agency logos and case numbers."
        ],
        warningSigns: [
            "Unsolicited calls from government agencies demanding immediate payment",
            "Threats of arrest, deportation, or benefit suspension",
            "Requests for payment via gift cards, wire transfer, or cryptocurrency",
            "Caller provides a badge number or case number unsolicited",
            "Pressure to stay on the phone and not contact anyone else",
            "Claims that your Social Security number has been suspended"
        ],
        exampleMessages: [
            {
                type: "SSA Impersonation Call",
                content: "This is Officer Williams from the Social Security Administration. Your Social Security number has been connected to suspicious activity and will be suspended immediately. To resolve this matter, you need to verify your identity and pay a $500 reactivation fee. We accept payment through Target or Walmart gift cards."
            },
            {
                type: "Law Enforcement Impersonation",
                content: "This is Sergeant Johnson from the county sheriff's office. A warrant has been issued for your arrest due to failure to appear for jury duty. You can resolve this by paying the $750 fine immediately. If you do not pay today, officers will be sent to your home."
            }
        ],
        preventionSteps: [
            {
                title: "Know how government agencies contact you",
                description: "The SSA, IRS, and other federal agencies primarily communicate by mail. They do not call to demand immediate payment, threaten arrest, or ask for payment by gift card."
            },
            {
                title: "Your SSN cannot be suspended",
                description: "No government agency can suspend your Social Security number. This is not a real thing. Any call claiming otherwise is a scam."
            },
            {
                title: "Hang up and call the agency directly",
                description: "If you receive a suspicious call from a government agency, hang up and call the agency using the number from their official website."
            },
            {
                title: "Report government impersonation scams",
                description: "Report to the FTC at reportfraud.ftc.gov, the relevant agency's Office of Inspector General, and your local police department."
            }
        ],
        faq: [
            {
                question: "Can the government suspend my Social Security number?",
                answer: "No. The Social Security Administration cannot suspend, revoke, or freeze your Social Security number. Any caller making this claim is a scammer."
            },
            {
                question: "Will law enforcement call me about a warrant?",
                answer: "Legitimate law enforcement does not call to collect fines or resolve warrants over the phone, especially not through gift card payments. If you are concerned, contact your local police non-emergency line directly."
            },
            {
                question: "How do I verify a government communication?",
                answer: "Look up the agency's contact information independently (not from the message you received) and call them directly. The SSA can be reached at 1-800-772-1213, the IRS at 1-800-829-1040."
            }
        ],
        relatedScams: [
            "irs-tax-scam",
            "medicare-scam",
            "vishing"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "ai-deepfake-scam",
        title: "AI Deepfake Scams: When You Cannot Trust What You See",
        metaTitle: "AI Deepfake Scams: Detect Fake Videos, Audio & Images | GetCyberRight",
        metaDescription: "Learn about AI deepfake scams using fake videos, cloned voices, and generated images. Protect yourself from AI-powered fraud and manipulation.",
        keywords: [
            "deepfake scam",
            "ai scam",
            "voice cloning scam",
            "deepfake fraud",
            "ai generated scam"
        ],
        cluster: "online-scams",
        overview: "AI deepfake scams represent a new frontier in fraud, using artificial intelligence to create convincing fake videos, clone voices, and generate realistic images of real people. Scammers use these technologies to impersonate family members in emergency calls, create fake celebrity endorsements for fraudulent investments, manipulate video calls for business fraud, and produce fake compromising content for extortion. As AI technology becomes more accessible, these scams are rapidly increasing.",
        howItWorks: [
            "Voice cloning technology creates convincing replicas of family members' voices from short audio samples found on social media or voicemail, used to make fake emergency calls requesting money.",
            "Deepfake videos of celebrities are used to promote fake investment platforms, cryptocurrency schemes, and fraudulent products.",
            "AI-generated images create realistic but fake identity documents, profile photos, and product images for various scam operations.",
            "Real-time deepfake technology can alter appearances during live video calls, enabling business email compromise and romance scams at unprecedented levels of sophistication."
        ],
        warningSigns: [
            "Emergency calls from family members that sound slightly off or robotic",
            "Celebrity endorsements for investment platforms on social media",
            "Video calls where the person's lips do not perfectly match their speech",
            "Unusual requests from people who sound like someone you know",
            "Images that appear too perfect or have subtle visual artifacts",
            "Skin that appears unnaturally smooth or lighting that seems inconsistent"
        ],
        exampleMessages: [
            {
                type: "AI Voice Clone Call",
                content: "[In daughter's cloned voice]: Mom, I have been in a car accident and I am at the hospital. They say I need surgery but I do not have my insurance card. Can you send $5,000 right away? Please do not tell Dad, I do not want him to worry."
            },
            {
                type: "Deepfake Celebrity Ad",
                content: "[Deepfake video of Elon Musk]: I am excited to announce a new cryptocurrency platform that uses my proprietary AI to guarantee 500% returns. I am personally investing $100 million. Visit the link below to get started with just $250."
            }
        ],
        preventionSteps: [
            {
                title: "Establish a family code word",
                description: "Create a secret code word or phrase with family members that only you know. In an emergency call, ask for the code word to verify the caller's identity."
            },
            {
                title: "Verify before acting",
                description: "If you receive an urgent call from a family member, hang up and call them back on their known number. If they are truly in trouble, they will answer."
            },
            {
                title: "Be skeptical of celebrity endorsements",
                description: "No legitimate investment opportunity uses celebrity deepfakes for promotion. Verify any investment through official SEC databases and the celebrity's official channels."
            },
            {
                title: "Learn to spot deepfake signs",
                description: "Look for unnatural blinking, inconsistent lighting, blurry edges around the face, lip sync issues, and artificial-looking skin textures in videos."
            },
            {
                title: "Use the GetCyberRight Deepfake Detector",
                description: "Our AI-powered tools can help analyze suspicious audio and video content for signs of deepfake manipulation."
            }
        ],
        faq: [
            {
                question: "How realistic are AI deepfakes now?",
                answer: "Modern deepfake technology can create highly convincing fake videos, images, and audio that are difficult for the human eye to detect. Voice cloning can replicate a person's voice from just a few seconds of sample audio."
            },
            {
                question: "How can I protect my voice from being cloned?",
                answer: "Limit the amount of audio and video you share publicly on social media. Consider making your social media profiles private. Be aware that any audio of your voice, including voicemail greetings, could potentially be used for voice cloning."
            },
            {
                question: "What is the family code word strategy?",
                answer: "Choose a memorable but uncommon word or phrase that only your family knows. In any emergency call requesting money or sensitive information, ask for the code word first. A real family member will know it; a deepfake cannot."
            }
        ],
        relatedScams: [
            "vishing",
            "investment-scam",
            "sextortion-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "qr-code-scam",
        title: "QR Code Scams (Quishing): Malicious QR Code Attacks",
        metaTitle: "QR Code Scams: Protect Against Malicious QR Codes | GetCyberRight",
        metaDescription: "Learn about QR code scams (quishing). Identify malicious QR codes on parking meters, in emails, and on fake flyers before they steal your data.",
        keywords: [
            "qr code scam",
            "quishing",
            "malicious qr code",
            "fake qr code",
            "qr code phishing"
        ],
        cluster: "phishing-attacks",
        overview: "QR code scams, known as quishing, exploit the widespread adoption of QR codes for payments, menus, and information sharing. Criminals place malicious QR codes over legitimate ones on parking meters, restaurant tables, and public signage, or embed them in phishing emails and fake flyers. Scanning a malicious QR code can redirect you to phishing websites, trigger malware downloads, or initiate unauthorized payments.",
        howItWorks: [
            "Criminals place stickers with malicious QR codes over legitimate ones on parking meters, leading victims to fake payment sites that steal credit card information.",
            "Phishing emails and letters contain QR codes that bypass email security filters, which cannot scan the content of QR code images.",
            "Fake flyers and posters in public places advertise deals, contests, or Wi-Fi access through QR codes that lead to malicious websites.",
            "QR codes on fake parking tickets, utility bills, and government notices direct victims to fraudulent payment portals."
        ],
        warningSigns: [
            "QR codes that appear to be stickers placed over existing codes",
            "QR codes in unexpected places or on unofficial-looking materials",
            "QR codes in emails from unknown senders",
            "Scanning a QR code that opens a website URL that does not match the expected organization",
            "QR codes that immediately prompt you to download an app or file"
        ],
        exampleMessages: [
            {
                type: "Fake Parking Meter",
                content: "[Sticker on parking meter]: Scan to pay for parking. Quick, contactless payment accepted. [QR code links to phishing site that steals credit card information]"
            },
            {
                type: "Phishing Email",
                content: "Your package could not be delivered. Scan the QR code below to update your delivery address and reschedule. [QR code embedded in email to bypass text-based spam filters]"
            }
        ],
        preventionSteps: [
            {
                title: "Preview QR code URLs before opening",
                description: "Most phone cameras show the URL preview before opening it. Check that the URL matches the expected organization before tapping to open."
            },
            {
                title: "Look for tampered QR codes",
                description: "Before scanning QR codes in public places, check if the code appears to be a sticker placed over an original code. Tampered codes may have different textures or edges."
            },
            {
                title: "Use your phone's built-in camera",
                description: "Use your phone's native camera app rather than third-party QR scanner apps, as the built-in camera provides better URL previews and security warnings."
            },
            {
                title: "Be skeptical of QR codes in emails",
                description: "QR codes in emails are often used to bypass spam filters. If an email contains a QR code, it is likely more trustworthy to navigate to the company's website directly."
            },
            {
                title: "Use the GetCyberRight GCR Scam Guard",
                description: "Our scam checker tool can analyze QR code contents and URLs for known phishing indicators before you visit the link."
            }
        ],
        faq: [
            {
                question: "Can scanning a QR code hack my phone?",
                answer: "Simply scanning a QR code is generally safe. The danger comes from what happens next: visiting a malicious website, downloading malware, or entering personal information. Always check the URL before proceeding."
            },
            {
                question: "How do I check if a QR code is safe?",
                answer: "Preview the URL that the QR code links to before opening it. Verify the domain matches the expected organization. Use our GCR Scam Guard tool to analyze suspicious URLs. Look for HTTPS and legitimate domain names."
            },
            {
                question: "Why are QR code scams increasing?",
                answer: "QR code adoption surged during the pandemic. People are accustomed to scanning codes without thinking about security. Additionally, QR codes bypass email security filters that scan text-based phishing links."
            }
        ],
        relatedScams: [
            "phishing",
            "smishing",
            "delivery-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "elder-abuse-scam",
        title: "Financial Elder Abuse: Protecting Seniors from Exploitation",
        metaTitle: "Financial Elder Abuse: Protect Seniors from Scams | GetCyberRight",
        metaDescription: "Learn about financial elder abuse and how to protect senior family members. Identify warning signs, prevention strategies, and reporting resources.",
        keywords: [
            "elder abuse scam",
            "senior financial abuse",
            "elder fraud",
            "elderly scam",
            "financial exploitation seniors"
        ],
        cluster: "cyber-safety-seniors",
        overview: "Financial elder abuse costs seniors billions of dollars annually and is committed by both strangers and trusted individuals, including family members, caregivers, and financial advisors. Seniors are targeted because they often have accumulated savings, may be isolated, and may have cognitive vulnerabilities that make them susceptible to manipulation. Protecting seniors requires awareness, open communication, and proactive safeguards.",
        howItWorks: [
            "Trusted individuals such as family members, caregivers, or financial advisors misuse their access to exploit an elder's finances through theft, coercion, or manipulation.",
            "Scammers target seniors through phone calls, posing as grandchildren in trouble, government officials, or tech support representatives.",
            "Power of attorney abuse occurs when appointed individuals use their authority for personal gain rather than the elder's benefit.",
            "Romance scammers specifically target widowed or lonely seniors on social media and dating sites, building relationships before requesting money."
        ],
        warningSigns: [
            "Unexplained withdrawals or transfers from bank accounts",
            "New names added to bank accounts or property titles",
            "Sudden changes to wills, trusts, or power of attorney documents",
            "Unpaid bills despite having adequate income",
            "Isolation from family and friends by a new caregiver or companion",
            "Fear, anxiety, or reluctance to discuss financial matters",
            "Missing personal belongings, cash, or valuables"
        ],
        exampleMessages: [
            {
                type: "Caregiver Manipulation",
                content: "I am the only one who truly cares about you. Your children do not visit. Let me help manage your finances so you do not have to worry. I just need access to your checking account to pay your bills."
            },
            {
                type: "Grandchild Impersonation",
                content: "Grandma, it is me. I got arrested and I need $5,000 for bail right now. Please do not tell Mom and Dad, they will be so disappointed in me. Can you go to Walmart and get money orders?"
            }
        ],
        preventionSteps: [
            {
                title: "Stay connected with elderly family members",
                description: "Regular contact helps you notice changes in behavior, finances, or living situation. Isolation is a major risk factor for elder financial abuse."
            },
            {
                title: "Set up account monitoring",
                description: "Help seniors set up bank alerts for large transactions, balance changes, and new payees. Consider joint account monitoring where appropriate."
            },
            {
                title: "Discuss common scams openly",
                description: "Talk with elderly family members about common scams targeting seniors. Make it safe for them to ask questions about suspicious contacts without feeling embarrassed."
            },
            {
                title: "Protect legal documents",
                description: "Keep copies of wills, trusts, and power of attorney documents. Ensure that the appointed agents are trustworthy and that appropriate oversight mechanisms are in place."
            },
            {
                title: "Know the reporting resources",
                description: "Adult Protective Services (APS) is available in every state. The Elder Fraud Hotline at 1-833-FRAUD-11 provides help for seniors who have been victimized."
            }
        ],
        faq: [
            {
                question: "How common is financial elder abuse?",
                answer: "Financial exploitation is the most common form of elder abuse. The National Council on Aging estimates that 1 in 10 Americans over 60 experience some form of elder abuse, with financial exploitation affecting millions each year."
            },
            {
                question: "What should I do if I suspect elder financial abuse?",
                answer: "Contact Adult Protective Services (APS) in your state, report to local law enforcement, and call the Elder Fraud Hotline at 1-833-FRAUD-11. If the senior is in immediate danger, call 911."
            },
            {
                question: "Can a power of attorney be revoked?",
                answer: "Yes, a competent adult can revoke power of attorney at any time. If the elder is no longer competent, a court can appoint a guardian or conservator and revoke the existing power of attorney if abuse is found."
            }
        ],
        relatedScams: [
            "grandparent-scam",
            "romance-scam",
            "medicare-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "travel-scam",
        title: "Travel Scams: Fake Vacation Deals and Booking Fraud",
        metaTitle: "Travel Scams: Spot Fake Vacation Deals & Booking Fraud | GetCyberRight",
        metaDescription: "Learn about travel scams including fake vacation packages, fraudulent booking sites, and timeshare fraud. Protect your money when planning trips.",
        keywords: [
            "travel scam",
            "fake vacation deal",
            "booking scam",
            "timeshare scam",
            "travel fraud"
        ],
        cluster: "online-scams",
        overview: "Travel scams exploit vacation excitement by offering too-good-to-be-true deals on flights, hotels, vacation rentals, and tour packages. Scammers create fake booking websites, send phishing emails mimicking legitimate travel companies, and use high-pressure tactics to sell fraudulent vacation packages. Victims discover the fraud when they arrive at their destination to find their reservation does not exist.",
        howItWorks: [
            "Fake booking websites mimic legitimate travel platforms, collecting payment for reservations that do not exist.",
            "Phishing emails offer exclusive travel deals that lead to credential-stealing websites.",
            "Timeshare exit scams charge large upfront fees to help owners exit timeshare contracts, then deliver no results.",
            "Free vacation offers require you to attend high-pressure sales presentations or pay hidden fees."
        ],
        warningSigns: [
            "Travel deals significantly below market rates",
            "Websites that closely mimic legitimate booking platforms",
            "Pressure to book immediately before the price increases",
            "Requests for payment via wire transfer or gift cards",
            "Free vacation offers that require attending presentations or paying fees",
            "No clear cancellation or refund policy"
        ],
        exampleMessages: [
            {
                type: "Email",
                content: "FLASH SALE: 7-night all-inclusive Cancun resort package for just $299 per person! This exclusive deal expires in 24 hours. Book now with just a $99 deposit via wire transfer to lock in your rate."
            },
            {
                type: "Phone Call",
                content: "Congratulations! You have been selected for a complimentary 3-night stay in Orlando. All you need to do is attend a brief 90-minute presentation and pay the $49 processing fee with a credit card."
            }
        ],
        preventionSteps: [
            {
                title: "Book through reputable platforms",
                description: "Use well-known booking sites or contact hotels and airlines directly. Verify website URLs carefully, as scam sites often use similar domain names."
            },
            {
                title: "Research properties independently",
                description: "Search for the property name and address separately from the booking platform. Read reviews on multiple sites. Check Google Maps street view."
            },
            {
                title: "Pay with credit cards",
                description: "Credit cards offer purchase protection and chargeback options. Never pay for travel with wire transfers, gift cards, or cryptocurrency."
            },
            {
                title: "Be skeptical of deeply discounted deals",
                description: "If a travel deal seems impossibly cheap, it probably is. Compare prices across multiple legitimate platforms to gauge fair market rates."
            }
        ],
        faq: [
            {
                question: "How do I verify a vacation rental is real?",
                answer: "Cross-reference the listing on multiple platforms. Search for the property address independently. Read reviews on several sites. Use Google Maps to verify the location exists. Contact the property directly through independently verified contact information."
            },
            {
                question: "Are free vacation offers legitimate?",
                answer: "Free vacation offers almost always come with strings attached, typically high-pressure timeshare presentations. The accommodations are usually substandard, and there may be hidden fees. It is rarely worth the time and stress."
            },
            {
                question: "What should I do if I booked through a fake site?",
                answer: "Contact your credit card company to dispute the charge. File a complaint with the FTC and your state attorney general. Report the fake website to the legitimate company being impersonated."
            }
        ],
        relatedScams: [
            "shopping-scam",
            "phishing",
            "rental-scam"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "insurance-scam",
        title: "Insurance Scams: Fake Policies and Fraudulent Claims",
        metaTitle: "Insurance Scams: Spot Fake Policies & Insurance Fraud | GetCyberRight",
        metaDescription: "Learn about insurance scams including fake policies, ghost brokers, and fraudulent claims. Protect yourself from insurance fraud schemes.",
        keywords: [
            "insurance scam",
            "fake insurance",
            "ghost broker",
            "insurance fraud",
            "fake policy scam"
        ],
        cluster: "online-scams",
        overview: "Insurance scams take many forms, from ghost brokers selling fake or doctored insurance policies at below-market prices to scammers posing as insurance agents to collect personal information. Victims may believe they have coverage until they need to file a claim, only to discover their policy is invalid. These scams target health insurance, auto insurance, homeowners insurance, and life insurance.",
        howItWorks: [
            "Ghost brokers sell fake or modified legitimate insurance policies at discounted prices, often targeting people who find standard rates unaffordable.",
            "Scammers impersonate insurance companies to collect personal information, including Social Security numbers and bank details, during fake application processes.",
            "Fraudulent insurance comparison websites collect your data and sell it to marketers or identity thieves rather than providing actual quotes.",
            "After natural disasters, scammers pose as insurance adjusters or contractors, collecting fees for work they never perform."
        ],
        warningSigns: [
            "Insurance prices significantly below market rates",
            "Pressure to purchase immediately without time to review the policy",
            "Agents who cannot provide a valid license number",
            "Payment required only in cash, wire transfer, or prepaid cards",
            "Policy documents with errors, misspellings, or inconsistent formatting",
            "No way to verify the policy through the insurance company directly"
        ],
        exampleMessages: [
            {
                type: "Social Media Ad",
                content: "Full coverage auto insurance for just $29/month! No credit check, no down payment. All drivers accepted. Call now for an instant quote. [Unlicensed ghost broker]"
            },
            {
                type: "Post-Disaster Call",
                content: "Hello, I am an insurance adjuster sent by your insurance company to assess the storm damage. I can expedite your claim for a $500 processing fee. Cash or money order only."
            }
        ],
        preventionSteps: [
            {
                title: "Verify the agent's license",
                description: "Check the insurance agent or broker's license through your state's Department of Insurance website. All legitimate agents must be licensed."
            },
            {
                title: "Contact the insurance company directly",
                description: "Verify any policy by calling the insurance company's official number. Provide your policy number and confirm it is active and valid."
            },
            {
                title: "Be wary of prices far below market rate",
                description: "If insurance prices seem too good to be true, the policy may be fake, modified, or from an unlicensed company."
            },
            {
                title: "Review policy documents carefully",
                description: "Read the full policy before purchasing. Verify the insurance company's name, your coverage details, and contact information match legitimate records."
            }
        ],
        faq: [
            {
                question: "What is a ghost broker?",
                answer: "A ghost broker is an unlicensed person who sells fake, modified, or fraudulently obtained insurance policies. They may take a real policy and alter the details, or create entirely fake documents. Victims believe they are insured until they need to file a claim."
            },
            {
                question: "How do I check if my insurance is real?",
                answer: "Contact the insurance company directly using their official phone number (not one provided by the agent). Provide your policy number and verify your coverage details, effective dates, and premium amounts."
            },
            {
                question: "What should I do after a natural disaster to avoid scams?",
                answer: "Only work with contractors and adjusters sent by your insurance company. Verify identities through your insurer. Never pay upfront fees for claims assistance. Document all damage with photos before any work begins."
            }
        ],
        relatedScams: [
            "government-impersonation-scam",
            "phishing",
            "identity-theft"
        ],
        lastUpdated: "2026-03-01"
    },
    {
        slug: "moving-scam",
        title: "Moving Scams: How to Avoid Fraudulent Moving Companies",
        metaTitle: "Moving Scams: Spot Fake Movers & Avoid Moving Fraud | GetCyberRight",
        metaDescription: "Protect yourself from moving scams. Learn to identify fraudulent moving companies, hostage loads, and bait-and-switch pricing before your move.",
        keywords: [
            "moving scam",
            "fake moving company",
            "moving fraud",
            "hostage load scam",
            "rogue movers"
        ],
        cluster: "online-scams",
        overview: "Moving scams target people during one of life's most stressful transitions. Rogue moving companies offer low estimates to win business, then dramatically increase prices once your belongings are loaded on the truck. Some hold possessions hostage until additional fees are paid. Others simply disappear with your belongings. Knowing how to vet moving companies and understand your rights can protect you from these devastating scams.",
        howItWorks: [
            "Movers provide extremely low initial estimates to win the contract, then significantly increase the price after loading your belongings.",
            "Hostage load scams involve movers refusing to deliver your possessions until you pay substantially more than the agreed price.",
            "Fly-by-night companies accept deposits, set a moving date, then never show up or answer calls.",
            "Some scammers operate under constantly changing company names to avoid negative reviews and legal action."
        ],
        warningSigns: [
            "Estimates significantly lower than other reputable companies",
            "No in-person or virtual assessment of your belongings before quoting",
            "Large deposit required before the move",
            "Company has no physical address or uses a P.O. box only",
            "No USDOT number for interstate moves",
            "Cash-only payment requirements"
        ],
        exampleMessages: [
            {
                type: "Online Quote",
                content: "2-bedroom apartment move from Chicago to New York: Only $999! Guaranteed lowest price. Book today with just a $200 deposit."
            },
            {
                type: "Moving Day Surprise",
                content: "Due to the actual volume of items, your adjusted price is $4,500. We need payment before we can unload. If you do not pay, your items will go to storage and daily fees will apply."
            }
        ],
        preventionSteps: [
            {
                title: "Get in-home estimates from multiple companies",
                description: "Legitimate movers provide estimates based on in-person or detailed video assessments. Phone or email-only estimates are unreliable and often used by scammers."
            },
            {
                title: "Verify licensing and insurance",
                description: "For interstate moves, check the company's USDOT number at protectyourmove.gov. For local moves, verify state licensing."
            },
            {
                title: "Read reviews and check complaints",
                description: "Check the BBB, Google Reviews, and FMCSA complaint history. Be cautious of companies with few reviews or only recent ones."
            },
            {
                title: "Get everything in writing",
                description: "Ensure your estimate, terms, and final price are documented in a binding contract. Understand the difference between binding and non-binding estimates."
            }
        ],
        faq: [
            {
                question: "How do I find a reputable moving company?",
                answer: "Get recommendations from friends, verify USDOT numbers at protectyourmove.gov, read reviews on multiple platforms, get at least three in-home estimates, and check BBB ratings. Avoid companies that only provide phone estimates."
            },
            {
                question: "What should I do if movers are holding my belongings hostage?",
                answer: "File a complaint with the FMCSA (Federal Motor Carrier Safety Administration) for interstate moves. Contact your state attorney general for local moves. File a police report if theft is involved. Document everything."
            },
            {
                question: "What are my rights during a move?",
                answer: "For interstate moves, the FMCSA requires movers to provide a written estimate, honor binding estimates, and deliver within agreed timelines. Your rights are detailed in the FMCSA's 'Your Rights and Responsibilities When You Move' booklet."
            }
        ],
        relatedScams: [
            "rental-scam",
            "shopping-scam",
            "wire-fraud-scam"
        ],
        lastUpdated: "2026-03-01"
    }
];
function getScamBySlug(slug) {
    return SCAM_PAGES.find((page)=>page.slug === slug);
}
function getAllScamSlugs() {
    return SCAM_PAGES.map((page)=>page.slug);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/related-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RelatedContent",
    ()=>RelatedContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wouter/src/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$seo$2d$keywords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/seo-keywords.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$scam$2d$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/scam-content.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
;
;
;
;
;
function RelatedContent({ currentCluster, currentPath, relatedSlugs, maxItems = 6 }) {
    const links = [];
    if (relatedSlugs && relatedSlugs.length > 0) {
        for (const slug of relatedSlugs){
            const scamPage = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$scam$2d$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SCAM_PAGES"].find((p)=>p.slug === slug);
            if (scamPage && `/scams/${scamPage.slug}` !== currentPath) {
                links.push({
                    path: `/scams/${scamPage.slug}`,
                    title: scamPage.title,
                    description: scamPage.overview.substring(0, 120) + "..."
                });
            }
        }
    }
    const cluster = currentCluster;
    if (__TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$seo$2d$keywords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLUSTER_RELATIONSHIPS"][cluster]) {
        const relatedClusters = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$seo$2d$keywords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLUSTER_RELATIONSHIPS"][cluster];
        for (const relCluster of relatedClusters){
            const pages = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$seo$2d$keywords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLUSTER_TARGET_PAGES"][relCluster];
            if (pages) {
                for (const page of pages){
                    if (page.path !== currentPath && !links.some((l)=>l.path === page.path)) {
                        const label = __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$seo$2d$keywords$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLUSTER_LABELS"][relCluster];
                        links.push({
                            path: page.path,
                            title: page.title,
                            description: `Related ${label} resource`
                        });
                    }
                }
            }
        }
    }
    const displayLinks = links.slice(0, maxItems);
    if (displayLinks.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "mt-10 pt-8 border-t border-slate-200 dark:border-slate-700",
        "data-testid": "section-related-content",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xl font-bold mb-4 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                        className: "h-5 w-5 text-teal-600"
                    }, void 0, false, {
                        fileName: "[project]/client/src/components/related-content.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    "Related Resources"
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/components/related-content.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                children: displayLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                        href: link.path,
                        className: "group flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all",
                        "data-testid": `link-related-${link.path.replace(/\//g, "-")}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-medium text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate",
                                        children: link.title
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/related-content.tsx",
                                        lineNumber: 68,
                                        columnNumber: 15
                                    }, this),
                                    link.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground mt-1 truncate",
                                        children: link.description
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/related-content.tsx",
                                        lineNumber: 70,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/related-content.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                className: "h-4 w-4 text-muted-foreground group-hover:text-teal-600 flex-shrink-0 ml-2 transition-colors"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/related-content.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this)
                        ]
                    }, link.path, true, {
                        fileName: "[project]/client/src/components/related-content.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/client/src/components/related-content.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/components/related-content.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_c = RelatedContent;
var _c;
__turbopack_context__.k.register(_c, "RelatedContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" + " hover-elevate active-elevate-2", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground border border-primary-border",
            destructive: "bg-destructive text-destructive-foreground border border-destructive-border",
            outline: " border [border-color:var(--button-outline)]  shadow-xs active:shadow-none ",
            secondary: "border bg-secondary text-secondary-foreground border border-secondary-border ",
            ghost: "border border-transparent"
        },
        size: {
            default: "min-h-9 px-4 py-2",
            sm: "min-h-8 px-3 text-xs",
            lg: "min-h-11 px-8",
            icon: "h-9 w-9 min-w-[44px] min-h-[44px] rounded-md"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/button.tsx",
        lineNumber: 46,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/ui/sheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sheet",
    ()=>Sheet,
    "SheetClose",
    ()=>SheetClose,
    "SheetContent",
    ()=>SheetContent,
    "SheetDescription",
    ()=>SheetDescription,
    "SheetFooter",
    ()=>SheetFooter,
    "SheetHeader",
    ()=>SheetHeader,
    "SheetOverlay",
    ()=>SheetOverlay,
    "SheetPortal",
    ()=>SheetPortal,
    "SheetTitle",
    ()=>SheetTitle,
    "SheetTrigger",
    ()=>SheetTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
const Sheet = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const SheetTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const SheetClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"];
const SheetPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const SheetOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/sheet.tsx",
        lineNumber: 22,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c = SheetOverlay;
SheetOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const sheetVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500", {
    variants: {
        side: {
            top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
            bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
            right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
        }
    },
    defaultVariants: {
        side: "right"
    }
});
const SheetContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = ({ side = "right", className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetOverlay, {}, void 0, false, {
                fileName: "[project]/client/src/components/ui/sheet.tsx",
                lineNumber: 61,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(sheetVariants({
                    side
                }), className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/ui/sheet.tsx",
                                lineNumber: 69,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/ui/sheet.tsx",
                                lineNumber: 70,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/ui/sheet.tsx",
                        lineNumber: 68,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/components/ui/sheet.tsx",
                lineNumber: 62,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/components/ui/sheet.tsx",
        lineNumber: 60,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = SheetContent;
SheetContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const SheetHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/sheet.tsx",
        lineNumber: 81,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c3 = SheetHeader;
SheetHeader.displayName = "SheetHeader";
const SheetFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/sheet.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c4 = SheetFooter;
SheetFooter.displayName = "SheetFooter";
const SheetTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold text-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/sheet.tsx",
        lineNumber: 109,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c6 = SheetTitle;
SheetTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const SheetDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/sheet.tsx",
        lineNumber: 121,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c8 = SheetDescription;
SheetDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "SheetOverlay");
__turbopack_context__.k.register(_c1, "SheetContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "SheetContent");
__turbopack_context__.k.register(_c3, "SheetHeader");
__turbopack_context__.k.register(_c4, "SheetFooter");
__turbopack_context__.k.register(_c5, "SheetTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "SheetTitle");
__turbopack_context__.k.register(_c7, "SheetDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "SheetDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shared/models/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FREE_ACCESS_UNTIL",
    ()=>FREE_ACCESS_UNTIL,
    "SUBSCRIPTION_TIERS",
    ()=>SUBSCRIPTION_TIERS,
    "TIER_HIERARCHY",
    ()=>TIER_HIERARCHY,
    "changePasswordSchema",
    ()=>changePasswordSchema,
    "hasTierAccess",
    ()=>hasTierAccess,
    "isFreeAccessPeriod",
    ()=>isFreeAccessPeriod,
    "loginSchema",
    ()=>loginSchema,
    "mfaVerifySchema",
    ()=>mfaVerifySchema,
    "passwordResetRequestSchema",
    ()=>passwordResetRequestSchema,
    "passwordResetSchema",
    ()=>passwordResetSchema,
    "registerSchema",
    ()=>registerSchema,
    "sessions",
    ()=>sessions,
    "users",
    ()=>users
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/indexes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/jsonb.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/table.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/varchar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/boolean.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
;
;
const sessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pgTable"])("sessions", {
    sid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("sid").primaryKey(),
    sess: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsonb"])("sess").notNull(),
    expire: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timestamp"])("expire").notNull()
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["index"])("IDX_session_expire").on(table.expire)
    ]);
const SUBSCRIPTION_TIERS = {
    FREE: "free",
    ESSENTIAL: "essential",
    PROFESSIONAL: "professional",
    ENTERPRISE: "enterprise"
};
const TIER_HIERARCHY = {
    [SUBSCRIPTION_TIERS.FREE]: 0,
    [SUBSCRIPTION_TIERS.ESSENTIAL]: 1,
    [SUBSCRIPTION_TIERS.PROFESSIONAL]: 2,
    [SUBSCRIPTION_TIERS.ENTERPRISE]: 3
};
const FREE_ACCESS_UNTIL = new Date("2026-10-01T00:00:00Z");
function isFreeAccessPeriod() {
    return new Date() < FREE_ACCESS_UNTIL;
}
function hasTierAccess(userTier, requiredTier) {
    if (isFreeAccessPeriod()) return true;
    const userRank = TIER_HIERARCHY[userTier] ?? 0;
    const requiredRank = TIER_HIERARCHY[requiredTier];
    if (requiredRank === undefined) {
        return false;
    }
    return userRank >= requiredRank;
}
const users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pgTable"])("users", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("id").primaryKey().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sql"]`gen_random_uuid()`),
    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("email").unique().notNull(),
    passwordHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["text"])("password_hash"),
    firstName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("first_name"),
    lastName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("last_name"),
    profileImageUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("profile_image_url"),
    // Email verification
    emailVerified: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolean"])("email_verified").default(false),
    emailVerificationToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("email_verification_token"),
    emailVerificationExpires: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timestamp"])("email_verification_expires"),
    // Password reset
    passwordResetToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("password_reset_token"),
    passwordResetExpires: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timestamp"])("password_reset_expires"),
    // MFA (TOTP)
    mfaEnabled: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolean"])("mfa_enabled").default(false),
    mfaSecret: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("mfa_secret"),
    mfaBackupCodes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["text"])("mfa_backup_codes"),
    // Account security
    failedLoginAttempts: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("failed_login_attempts").default("0"),
    lockedUntil: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timestamp"])("locked_until"),
    lastLoginAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timestamp"])("last_login_at"),
    lastLoginIp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("last_login_ip"),
    // Force password change on first login
    mustChangePassword: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolean"])("must_change_password").default(false),
    // Scam Guard Subscription
    subscriptionTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("subscription_tier").default("free"),
    subscriptionExpiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timestamp"])("subscription_expires_at"),
    stripeCustomerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("stripe_customer_id"),
    // Data Shield Subscription
    shieldSubscriptionTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("shield_subscription_tier").default("free"),
    shieldSubscriptionExpiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timestamp"])("shield_subscription_expires_at"),
    // GCR Data Shield trial
    shieldTrialStartedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timestamp"])("shield_trial_started_at"),
    // Admin
    isAdmin: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["boolean"])("is_admin").default(false),
    role: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["varchar"])("role").default("user"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").defaultNow()
});
const registerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(12, "Password must be at least 12 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    firstName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "First name is required").max(50),
    lastName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Last name is required").max(50)
});
const loginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Password is required"),
    mfaCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const passwordResetRequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address")
});
const passwordResetSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    token: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Token is required"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(12, "Password must be at least 12 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});
const changePasswordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    currentPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Current password is required"),
    newPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(12, "Password must be at least 12 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});
const mfaVerifySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().length(6, "MFA code must be 6 digits")
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/assets/logo.webp (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.q("/_next/static/media/logo.0-61v0hjvalyd.webp");}),
"[project]/client/src/assets/logo.webp.mjs { IMAGE => \"[project]/client/src/assets/logo.webp (static in ecmascript, tag client)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$assets$2f$logo$2e$webp__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/client/src/assets/logo.webp (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$assets$2f$logo$2e$webp__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 200,
    height: 200,
    blurWidth: 8,
    blurHeight: 8,
    blurDataURL: "data:image/webp;base64,UklGRmABAABXRUJQVlA4TFQBAAAvB8ABEM1VICICHggwDAIAAIDlTgWFg5DiAOAAAUAAASAAEgAAgRAIABAAIJAAIIAQEMABEEiooAYAAPBAQHAQAAAAzv+WElEFIYIAAAAAYAFgJiABAAAAAAAAAACEKAEgAAAgQRAwsUggPA8EBAcBAADg/O+rUAYpAASCTAAAAAAAAAAAAAAAAAAAAACAAAAMAAAAgA0GW/z3HggIDgIAAMD531MpAFABBBAIDADyAALYBCAACASAIAQAAAAAgAIBACiADAgICJBJgABwBdGPF/In3kt53pAfAB2gOM00y7/Wk8753juhEAD0AkuMlH5sdZ+HumT61SD6MgBU9FzXuS2vOlTrMCXj1Sg/lQDo+yVK5zO9j93Y77DPFuvwnisA/IUg3xbiPBFVCaEaHwCAZyzvlG7b4p5zc/e1NuG4Mr8B8Ejk68w4tn3Qvlt1sOps4R4A"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const ThemeProviderContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ThemeProvider({ children }) {
    _s();
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ThemeProvider.useState": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const stored = localStorage.getItem("theme");
                if (stored) return stored;
                return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            }
            //TURBOPACK unreachable
            ;
        }
    }["ThemeProvider.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            const root = document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(theme);
            localStorage.setItem("theme", theme);
        }
    }["ThemeProvider.useEffect"], [
        theme
    ]);
    const toggleTheme = ()=>{
        setTheme(theme === "light" ? "dark" : "light");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeProviderContext.Provider, {
        value: {
            theme,
            setTheme,
            toggleTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/client/src/components/theme-provider.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(ThemeProvider, "QFHRqj8Z5C9gKryVfgx8WFXDbhc=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeProviderContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/theme-toggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/theme-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function ThemeToggle() {
    _s();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        variant: "ghost",
        size: "icon",
        onClick: toggleTheme,
        "data-testid": "button-theme-toggle",
        children: [
            theme === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/client/src/components/theme-toggle.tsx",
                lineNumber: 16,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                className: "w-5 h-5"
            }, void 0, false, {
                fileName: "[project]/client/src/components/theme-toggle.tsx",
                lineNumber: 18,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "sr-only",
                children: "Toggle theme"
            }, void 0, false, {
                fileName: "[project]/client/src/components/theme-toggle.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/components/theme-toggle.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_s(ThemeToggle, "Q4eAjrIZ0CuRuhycs6byifK2KBk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/ui/navigation-menu.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavigationMenu",
    ()=>NavigationMenu,
    "NavigationMenuContent",
    ()=>NavigationMenuContent,
    "NavigationMenuIndicator",
    ()=>NavigationMenuIndicator,
    "NavigationMenuItem",
    ()=>NavigationMenuItem,
    "NavigationMenuLink",
    ()=>NavigationMenuLink,
    "NavigationMenuList",
    ()=>NavigationMenuList,
    "NavigationMenuTrigger",
    ()=>NavigationMenuTrigger,
    "NavigationMenuViewport",
    ()=>NavigationMenuViewport,
    "navigationMenuTriggerStyle",
    ()=>navigationMenuTriggerStyle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-navigation-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
;
const NavigationMenu = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative z-10 flex max-w-max flex-1 items-center justify-center", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavigationMenuViewport, {}, void 0, false, {
                fileName: "[project]/client/src/components/ui/navigation-menu.tsx",
                lineNumber: 21,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/components/ui/navigation-menu.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = NavigationMenu;
NavigationMenu.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const NavigationMenuList = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group flex flex-1 list-none items-center justify-center space-x-1", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/navigation-menu.tsx",
        lineNumber: 30,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = NavigationMenuList;
NavigationMenuList.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"].displayName;
const NavigationMenuItem = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"];
const navigationMenuTriggerStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent");
const NavigationMenuTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(navigationMenuTriggerStyle(), "group", className),
        ...props,
        children: [
            children,
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                className: "relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/client/src/components/ui/navigation-menu.tsx",
                lineNumber: 57,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/components/ui/navigation-menu.tsx",
        lineNumber: 51,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = NavigationMenuTrigger;
NavigationMenuTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const NavigationMenuContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/navigation-menu.tsx",
        lineNumber: 69,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = NavigationMenuContent;
NavigationMenuContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const NavigationMenuLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"];
const NavigationMenuViewport = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute left-0 top-full flex justify-center"),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]", className),
            ref: ref,
            ...props
        }, void 0, false, {
            fileName: "[project]/client/src/components/ui/navigation-menu.tsx",
            lineNumber: 87,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/navigation-menu.tsx",
        lineNumber: 86,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c8 = NavigationMenuViewport;
NavigationMenuViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const NavigationMenuIndicator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c9 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md"
        }, void 0, false, {
            fileName: "[project]/client/src/components/ui/navigation-menu.tsx",
            lineNumber: 112,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/navigation-menu.tsx",
        lineNumber: 104,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c10 = NavigationMenuIndicator;
NavigationMenuIndicator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$navigation$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "NavigationMenu$React.forwardRef");
__turbopack_context__.k.register(_c1, "NavigationMenu");
__turbopack_context__.k.register(_c2, "NavigationMenuList$React.forwardRef");
__turbopack_context__.k.register(_c3, "NavigationMenuList");
__turbopack_context__.k.register(_c4, "NavigationMenuTrigger$React.forwardRef");
__turbopack_context__.k.register(_c5, "NavigationMenuTrigger");
__turbopack_context__.k.register(_c6, "NavigationMenuContent$React.forwardRef");
__turbopack_context__.k.register(_c7, "NavigationMenuContent");
__turbopack_context__.k.register(_c8, "NavigationMenuViewport");
__turbopack_context__.k.register(_c9, "NavigationMenuIndicator$React.forwardRef");
__turbopack_context__.k.register(_c10, "NavigationMenuIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navigation",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/sheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/graduation-cap.js [app-client] (ecmascript) <export default as GraduationCap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$newspaper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Newspaper$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/newspaper.js [app-client] (ecmascript) <export default as Newspaper>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chromium$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chrome$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chromium.js [app-client] (ecmascript) <export default as Chrome>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/radio.js [app-client] (ecmascript) <export default as Radio>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$baby$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Baby$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/baby.js [app-client] (ecmascript) <export default as Baby>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-client] (ecmascript) <export default as ClipboardCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-alert.js [app-client] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wouter/src/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$models$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/models/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$assets$2f$logo$2e$webp$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$client$2f$src$2f$assets$2f$logo$2e$webp__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/client/src/assets/logo.webp.mjs { IMAGE => "[project]/client/src/assets/logo.webp (static in ecmascript, tag client)" } [app-client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/theme-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/navigation-menu.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
const whoWeHelp = [
    {
        title: "Parents Hub",
        description: "Protect your kids and manage family devices safely",
        href: "/parents",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        featured: true,
        color: "text-blue-500"
    },
    {
        title: "Kids Safety Hub",
        description: "Fun, interactive lessons for ages 8 to 16",
        href: "/kids",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
        featured: true,
        color: "text-purple-500"
    },
    {
        title: "Seniors Hub",
        description: "Protect against phone scams, fraud, and tech tricks",
        href: "/seniors",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
        featured: true,
        color: "text-rose-500"
    }
];
const scamGuardNav = [
    {
        title: "AI Scam Scanner",
        description: "Check URLs, emails, phone numbers, and more",
        href: "/tools",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
        badge: "Popular"
    },
    {
        title: "Browser Extension",
        description: "Real-time protection while you browse",
        href: "/browser-extension",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chromium$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Chrome$3e$__["Chrome"]
    },
    {
        title: "Report a Scam",
        description: "Help protect the community by reporting threats",
        href: "/report-scam",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"]
    }
];
const dataShieldNav = [
    {
        title: "Data Exposure Scan",
        description: "Find your personal data across 500+ brokers",
        href: "/shield",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"]
    },
    {
        title: "Data Removal Center",
        description: "Identity Shield, Vault & Monitoring tools",
        href: "/data-removal",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"]
    },
    {
        title: "Breach Monitor",
        description: "Get alerted when your data appears in breaches",
        href: "/breach-dashboard",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"]
    }
];
const scamGuardNavFull = [
    ...scamGuardNav,
    {
        title: "Password Generator",
        description: "Create strong, unique passwords instantly",
        href: "/tools?tab=password",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"]
    },
    {
        title: "Voice Deepfake Detector",
        description: "Detect AI-generated voice clones",
        href: "/tools?tab=voice-clone",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$radio$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__["Radio"]
    }
];
const dataShieldNavFull = [
    ...dataShieldNav,
    {
        title: "Safety Score Assessment",
        description: "Check your overall online safety in minutes",
        href: "/quick-assessment",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"]
    },
    {
        title: "Cyber Hygiene Checklist",
        description: "Daily habits to keep your digital life secure",
        href: "/cyber-hygiene",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"]
    },
    {
        title: "Child Safety Scanner",
        description: "Check if sites and apps are safe for kids",
        href: "/parents/child-safety-scanner",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$baby$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Baby$3e$__["Baby"]
    }
];
const learnItems = [
    {
        title: "Training Academy",
        description: "Structured courses with quizzes & certificates",
        href: "/training",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"],
        color: "text-primary",
        featured: true
    },
    {
        title: "Awareness Hub",
        description: "Visual guides, checklists & safety resources",
        href: "/awareness-hub",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        color: "text-teal-500",
        featured: true
    },
    {
        title: "Cyber Threat Radar",
        description: "Real-time threat monitoring & alerts",
        href: "/cyber-threat-radar",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
        color: "text-red-500",
        featured: true
    },
    {
        title: "AI Safety Guide",
        description: "Spot deepfakes, AI scams & protect your privacy",
        href: "/ai-safety",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"],
        color: "text-purple-500",
        featured: true
    },
    {
        title: "AI Prompt Library",
        description: "Ready-to-use AI templates for everyday life",
        href: "/ai-prompts",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
        color: "text-amber-500",
        featured: true
    },
    {
        title: "Scam Intelligence",
        description: "Latest scam trends, tactics & intelligence reports",
        href: "/scam-intel",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
        color: "text-orange-500",
        featured: true
    }
];
const learnTopics = [
    {
        title: "Cyber Safety Guides",
        href: "/guides",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
    },
    {
        title: "Phishing & Email Scams",
        href: "/resources?category=phishing",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"]
    },
    {
        title: "Online Privacy",
        href: "/resources?category=privacy",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"]
    },
    {
        title: "Resource Library",
        href: "/resources",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
    }
];
function Navigation() {
    _s();
    const [isScrolled, setIsScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [location] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navigation.useEffect": ()=>{
            const handleScroll = {
                "Navigation.useEffect.handleScroll": ()=>{
                    setIsScrolled(window.scrollY > 10);
                }
            }["Navigation.useEffect.handleScroll"];
            window.addEventListener("scroll", handleScroll);
            return ({
                "Navigation.useEffect": ()=>window.removeEventListener("scroll", handleScroll)
            })["Navigation.useEffect"];
        }
    }["Navigation.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "#main-content",
                className: "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring",
                "data-testid": "link-skip-navigation",
                onClick: (e)=>{
                    e.preventDefault();
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.focus();
                        mainContent.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                },
                children: "Skip to main content"
            }, void 0, false, {
                fileName: "[project]/client/src/components/navigation.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: `sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-[#071A24]/98 backdrop-blur-md border-b border-white/10 shadow-lg" : "bg-[#071A24]"}`,
                "data-testid": "header-navigation",
                role: "banner",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-[72px] items-center justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                href: "/",
                                className: "flex items-center gap-2.5",
                                "data-testid": "link-logo",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$assets$2f$logo$2e$webp$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$client$2f$src$2f$assets$2f$logo$2e$webp__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                                        alt: "GetCyberRight",
                                        className: "w-11 h-11 object-contain",
                                        width: 44,
                                        height: 44,
                                        loading: "lazy"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/navigation.tsx",
                                        lineNumber: 107,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-xl text-white tracking-tight",
                                        children: "GetCyberRight"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/navigation.tsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/navigation.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenu"], {
                                className: "hidden lg:flex",
                                "aria-label": "Main navigation",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuList"], {
                                    className: "gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuItem"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuTrigger"], {
                                                    className: "bg-transparent text-white/90 hover:text-white data-[state=open]:text-white text-[15px]",
                                                    "data-testid": "nav-who-we-help",
                                                    children: "Who We Help"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 116,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-[600px] p-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-sm font-semibold text-foreground uppercase tracking-wide",
                                                                        children: "Find Your Path"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 122,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                        href: "/training",
                                                                        className: "text-sm text-primary flex items-center gap-1 hover:underline",
                                                                        children: [
                                                                            "View all training paths ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                                className: "w-3 h-3"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                                lineNumber: 124,
                                                                                columnNumber: 49
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 123,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 121,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid grid-cols-2 gap-3",
                                                                children: whoWeHelp.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuLink"], {
                                                                        asChild: true,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                            href: item.href,
                                                                            className: "flex items-start gap-3 rounded-lg p-3 transition-colors hover-elevate",
                                                                            "data-testid": `nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                                        className: "w-5 h-5 text-primary"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                        lineNumber: 136,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                    lineNumber: 135,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-sm font-medium text-foreground mb-0.5",
                                                                                            children: item.title
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 139,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs text-muted-foreground leading-snug",
                                                                                            children: item.description
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 142,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                    lineNumber: 138,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 130,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, item.title, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 129,
                                                                        columnNumber: 25
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 127,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 119,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/navigation.tsx",
                                            lineNumber: 115,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuItem"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuTrigger"], {
                                                    className: "bg-transparent text-white/90 hover:text-white data-[state=open]:text-white text-[15px]",
                                                    "data-testid": "nav-tools",
                                                    children: "Protection Hub"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-[680px] p-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-sm font-semibold text-foreground uppercase tracking-wide",
                                                                        children: "Protection Hub"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 161,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                        href: "/tools",
                                                                        className: "text-sm text-primary flex items-center gap-1 hover:underline",
                                                                        children: [
                                                                            "View all tools ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                                className: "w-3 h-3"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                                lineNumber: 163,
                                                                                columnNumber: 40
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 162,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 160,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid grid-cols-2 gap-6",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 mb-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                                        className: "w-4 h-4 text-accent"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                        lineNumber: 169,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                        className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                                                                                        children: "GCR Scam Guard"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                        lineNumber: 170,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                                lineNumber: 168,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "space-y-1",
                                                                                children: scamGuardNav.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuLink"], {
                                                                                        asChild: true,
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                                            href: item.href,
                                                                                            className: "flex items-start gap-2.5 rounded-lg p-2.5 transition-colors hover-elevate",
                                                                                            "data-testid": `nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`,
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex-shrink-0 w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center mt-0.5",
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                                                        className: "w-4 h-4 text-accent"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                        lineNumber: 181,
                                                                                                        columnNumber: 35
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                    lineNumber: 180,
                                                                                                    columnNumber: 33
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "flex items-center gap-2 mb-0.5",
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "text-sm font-medium text-foreground",
                                                                                                                    children: item.title
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                                    lineNumber: 185,
                                                                                                                    columnNumber: 37
                                                                                                                }, this),
                                                                                                                item.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                    className: "text-[10px] px-1.5 py-0.5 rounded bg-accent text-white font-medium",
                                                                                                                    children: item.badge
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                                    lineNumber: 187,
                                                                                                                    columnNumber: 39
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                            lineNumber: 184,
                                                                                                            columnNumber: 35
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                            className: "text-xs text-muted-foreground leading-snug",
                                                                                                            children: item.description
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                            lineNumber: 190,
                                                                                                            columnNumber: 35
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                    lineNumber: 183,
                                                                                                    columnNumber: 33
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 175,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    }, item.title, false, {
                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                        lineNumber: 174,
                                                                                        columnNumber: 29
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                                lineNumber: 172,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 167,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 mb-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                                        className: "w-4 h-4 text-teal-500"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                        lineNumber: 199,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                        className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                                                                                        children: "GCR Data Shield"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                        lineNumber: 200,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                                lineNumber: 198,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "space-y-1",
                                                                                children: dataShieldNav.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuLink"], {
                                                                                        asChild: true,
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                                            href: item.href,
                                                                                            className: "flex items-start gap-2.5 rounded-lg p-2.5 transition-colors hover-elevate",
                                                                                            "data-testid": `nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`,
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex-shrink-0 w-8 h-8 rounded-md bg-teal-500/10 flex items-center justify-center mt-0.5",
                                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                                                        className: "w-4 h-4 text-teal-500"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                        lineNumber: 211,
                                                                                                        columnNumber: 35
                                                                                                    }, this)
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                    lineNumber: 210,
                                                                                                    columnNumber: 33
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-sm font-medium text-foreground",
                                                                                                            children: item.title
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                            lineNumber: 214,
                                                                                                            columnNumber: 35
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                            className: "text-xs text-muted-foreground leading-snug",
                                                                                                            children: item.description
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                            lineNumber: 215,
                                                                                                            columnNumber: 35
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                    lineNumber: 213,
                                                                                                    columnNumber: 33
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 205,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    }, item.title, false, {
                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                        lineNumber: 204,
                                                                                        columnNumber: 29
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                                lineNumber: 202,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 197,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 166,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-4 pt-4 border-t",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-muted-foreground",
                                                                    children: "Core tools are free. No signup required to get started."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 224,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 223,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                        lineNumber: 159,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/navigation.tsx",
                                            lineNumber: 154,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuItem"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuTrigger"], {
                                                    className: "bg-transparent text-white/90 hover:text-white data-[state=open]:text-white text-[15px]",
                                                    "data-testid": "nav-learn",
                                                    children: "Learning Hub"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-[550px] p-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-4",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-sm font-semibold text-foreground uppercase tracking-wide",
                                                                    children: "Learning Hub"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 239,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 238,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid grid-cols-2 gap-3 mb-5",
                                                                children: learnItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuLink"], {
                                                                        asChild: true,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                            href: item.href,
                                                                            className: "flex flex-col items-center gap-2 rounded-lg p-4 text-center transition-colors hover-elevate",
                                                                            "data-testid": `nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-12 h-12 rounded-lg bg-muted flex items-center justify-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                                        className: `w-6 h-6 ${item.color}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                        lineNumber: 250,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                    lineNumber: 249,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-sm font-medium text-foreground",
                                                                                            children: item.title
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 253,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs text-muted-foreground leading-snug mt-0.5",
                                                                                            children: item.description
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 256,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                    lineNumber: 252,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 244,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, item.title, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 243,
                                                                        columnNumber: 25
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 241,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "pt-4 border-t",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3",
                                                                        children: "Browse by Topic"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 265,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-wrap gap-2",
                                                                        children: learnTopics.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuLink"], {
                                                                                asChild: true,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                                    href: item.href,
                                                                                    className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-muted/50 text-foreground transition-colors hover-elevate",
                                                                                    "data-testid": `nav-link-${item.title.toLowerCase().replace(/\s/g, "-")}`,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                                            className: "w-3.5 h-3.5"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 274,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        item.title
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                    lineNumber: 269,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, item.title, false, {
                                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                                lineNumber: 268,
                                                                                columnNumber: 27
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 266,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 264,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/navigation.tsx",
                                            lineNumber: 232,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuItem"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuLink"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                    href: "/news",
                                                    className: `group inline-flex h-9 w-max items-center justify-center gap-1.5 rounded-md bg-transparent px-4 py-2 text-[15px] font-medium transition-colors focus:outline-none hover-elevate text-white/90 hover:text-white ${location === '/news' || location.startsWith('/news/') ? 'text-primary' : ''}`,
                                                    "data-testid": "nav-news",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$newspaper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Newspaper$3e$__["Newspaper"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 292,
                                                            columnNumber: 21
                                                        }, this),
                                                        "News"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 287,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                lineNumber: 286,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/navigation.tsx",
                                            lineNumber: 285,
                                            columnNumber: 15
                                        }, this),
                                        !(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$models$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFreeAccessPeriod"])() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuItem"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuTrigger"], {
                                                    className: "bg-transparent text-white/90 hover:text-white data-[state=open]:text-white text-[15px]",
                                                    "data-testid": "nav-pricing",
                                                    children: "Pricing"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 300,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-[400px] p-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-sm font-semibold text-foreground uppercase tracking-wide mb-4",
                                                                children: "Plans & Pricing"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 305,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuLink"], {
                                                                        asChild: true,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                            href: "/pricing",
                                                                            className: "flex items-start gap-3 rounded-lg p-3 transition-colors hover-elevate",
                                                                            "data-testid": "nav-link-bundle-pricing",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                                                                        className: "w-5 h-5 text-primary"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                        lineNumber: 314,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                    lineNumber: 313,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "flex items-center gap-2 mb-0.5",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-sm font-medium text-foreground",
                                                                                                    children: "Bundle Plans"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                    lineNumber: 318,
                                                                                                    columnNumber: 31
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                    className: "text-[10px] px-1.5 py-0.5 rounded bg-accent text-white font-medium",
                                                                                                    children: "Best Value"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                                    lineNumber: 319,
                                                                                                    columnNumber: 31
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 317,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs text-muted-foreground leading-snug",
                                                                                            children: "Scam Guard + Data Shield together. Save up to 23%."
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 321,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                    lineNumber: 316,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 308,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 307,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuLink"], {
                                                                        asChild: true,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                            href: "/gcr-guard-pricing",
                                                                            className: "flex items-start gap-3 rounded-lg p-3 transition-colors hover-elevate",
                                                                            "data-testid": "nav-link-guard-pricing",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                                        className: "w-5 h-5 text-accent"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                        lineNumber: 334,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                    lineNumber: 333,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-sm font-medium text-foreground mb-0.5",
                                                                                            children: "GCR Scam Guard"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 337,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs text-muted-foreground leading-snug",
                                                                                            children: "Real-time scam detection & browser protection."
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 338,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                    lineNumber: 336,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 328,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 327,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuLink"], {
                                                                        asChild: true,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                            href: "/data-shield-pricing",
                                                                            className: "flex items-start gap-3 rounded-lg p-3 transition-colors hover-elevate",
                                                                            "data-testid": "nav-link-shield-pricing",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                                        className: "w-5 h-5 text-accent"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                                        lineNumber: 351,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                    lineNumber: 350,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-sm font-medium text-foreground mb-0.5",
                                                                                            children: "GCR Data Shield"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 354,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-xs text-muted-foreground leading-snug",
                                                                                            children: "Personal data removal from 500+ broker sites."
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                                            lineNumber: 355,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                                    lineNumber: 353,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 345,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 344,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 306,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                        lineNumber: 304,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/navigation.tsx",
                                            lineNumber: 299,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuItem"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$navigation$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavigationMenuLink"], {
                                                asChild: true,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                    href: "/about",
                                                    className: `group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-[15px] font-medium transition-colors focus:outline-none hover-elevate text-white/90 hover:text-white ${location === '/about' ? 'text-primary' : ''}`,
                                                    "data-testid": "nav-about",
                                                    children: "About Us"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                lineNumber: 368,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/navigation.tsx",
                                            lineNumber: 367,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/navigation.tsx",
                                    lineNumber: 114,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/navigation.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden lg:flex items-center gap-3 text-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                                        fileName: "[project]/client/src/components/navigation.tsx",
                                        lineNumber: 382,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                        href: "/tools",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "default",
                                            size: "default",
                                            "data-testid": "button-get-protection",
                                            children: "Check If It's a Scam"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/navigation.tsx",
                                            lineNumber: 384,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/navigation.tsx",
                                        lineNumber: 383,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/navigation.tsx",
                                lineNumber: 381,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sheet"], {
                                open: mobileMenuOpen,
                                onOpenChange: setMobileMenuOpen,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "icon",
                                            "aria-label": "Open navigation menu",
                                            "data-testid": "button-mobile-menu",
                                            className: "lg:hidden text-white hover:bg-white/10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                                    className: "h-5 w-5",
                                                    "aria-hidden": "true"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "sr-only",
                                                    children: "Toggle menu"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/navigation.tsx",
                                            lineNumber: 392,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/navigation.tsx",
                                        lineNumber: 391,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetContent"], {
                                        side: "right",
                                        className: "w-[300px] sm:w-[400px] overflow-y-auto",
                                        "aria-label": "Mobile navigation menu",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                            className: "flex flex-col gap-4 mt-8",
                                            "aria-label": "Mobile navigation",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                    className: "w-4 h-4 text-muted-foreground"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 401,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "font-medium text-sm text-muted-foreground uppercase tracking-wider",
                                                                    children: "Who We Help"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 402,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 400,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground -mt-1 ml-6",
                                                            children: "Guides, resources & training"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 404,
                                                            columnNumber: 19
                                                        }, this),
                                                        whoWeHelp.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                href: item.href,
                                                                className: "flex items-center gap-3 py-2 text-foreground transition-colors",
                                                                onClick: ()=>setMobileMenuOpen(false),
                                                                "data-testid": `mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                        className: `w-4 h-4 ${item.color}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 413,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium",
                                                                        children: item.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 414,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, item.title, true, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 406,
                                                                columnNumber: 21
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-px bg-border"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 419,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                    className: "w-4 h-4 text-muted-foreground"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 423,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "font-medium text-sm text-muted-foreground uppercase tracking-wider",
                                                                    children: "Protection Hub"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 424,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 422,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground -mt-1 ml-6",
                                                            children: "Core tools are free"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 426,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-3 ml-6",
                                                            children: "GCR Scam Guard"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 427,
                                                            columnNumber: 19
                                                        }, this),
                                                        scamGuardNavFull.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                href: item.href,
                                                                className: "flex items-center gap-3 py-2 text-foreground transition-colors",
                                                                onClick: ()=>setMobileMenuOpen(false),
                                                                "data-testid": `mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                        className: "w-4 h-4 text-accent"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 436,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    item.title,
                                                                    item.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] px-1.5 py-0.5 rounded bg-accent text-white font-medium",
                                                                        children: item.badge
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 439,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, item.title, true, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 429,
                                                                columnNumber: 21
                                                            }, this)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-3 ml-6",
                                                            children: "GCR Data Shield"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 445,
                                                            columnNumber: 19
                                                        }, this),
                                                        dataShieldNavFull.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                href: item.href,
                                                                className: "flex items-center gap-3 py-2 text-foreground transition-colors",
                                                                onClick: ()=>setMobileMenuOpen(false),
                                                                "data-testid": `mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                        className: "w-4 h-4 text-teal-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 454,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    item.title
                                                                ]
                                                            }, item.title, true, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 447,
                                                                columnNumber: 21
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 421,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-px bg-border"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 460,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                                    className: "w-4 h-4 text-muted-foreground"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 464,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "font-medium text-sm text-muted-foreground uppercase tracking-wider",
                                                                    children: "Learning Hub"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 465,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 19
                                                        }, this),
                                                        learnItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                href: item.href,
                                                                className: "flex items-center gap-3 py-2 text-foreground transition-colors",
                                                                onClick: ()=>setMobileMenuOpen(false),
                                                                "data-testid": `mobile-link-${item.title.toLowerCase().replace(/\s/g, "-")}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                        className: `w-4 h-4 ${item.color}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 475,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium",
                                                                        children: item.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/navigation.tsx",
                                                                        lineNumber: 476,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, item.title, true, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 468,
                                                                columnNumber: 21
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 462,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-px bg-border"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 481,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                    href: "/news",
                                                    className: "flex items-center gap-3 py-2 text-foreground transition-colors",
                                                    onClick: ()=>setMobileMenuOpen(false),
                                                    "data-testid": "mobile-link-news",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$newspaper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Newspaper$3e$__["Newspaper"], {
                                                            className: "w-4 h-4 text-teal-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 489,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "News"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 490,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 483,
                                                    columnNumber: 17
                                                }, this),
                                                !(0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$models$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFreeAccessPeriod"])() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-px bg-border"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 495,
                                                            columnNumber: 17
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                                                            className: "w-4 h-4 text-muted-foreground"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 499,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                            className: "font-medium text-sm text-muted-foreground uppercase tracking-wider",
                                                                            children: "Pricing"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 500,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 498,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                    href: "/pricing",
                                                                    className: "flex items-center gap-3 py-2 text-foreground transition-colors",
                                                                    onClick: ()=>setMobileMenuOpen(false),
                                                                    "data-testid": "mobile-link-bundle-pricing",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                                                            className: "w-4 h-4 text-primary"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 508,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: "Bundle Plans"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 509,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[10px] px-1.5 py-0.5 rounded bg-accent text-white font-medium",
                                                                            children: "Best Value"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 510,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 502,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                    href: "/gcr-guard-pricing",
                                                                    className: "flex items-center gap-3 py-2 text-foreground transition-colors",
                                                                    onClick: ()=>setMobileMenuOpen(false),
                                                                    "data-testid": "mobile-link-guard-pricing",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                            className: "w-4 h-4 text-accent"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 518,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: "GCR Scam Guard"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 519,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 512,
                                                                    columnNumber: 19
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                                    href: "/data-shield-pricing",
                                                                    className: "flex items-center gap-3 py-2 text-foreground transition-colors",
                                                                    onClick: ()=>setMobileMenuOpen(false),
                                                                    "data-testid": "mobile-link-shield-pricing",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                            className: "w-4 h-4 text-accent"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 527,
                                                                            columnNumber: 21
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: "GCR Data Shield"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                                            lineNumber: 528,
                                                                            columnNumber: 21
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                                    lineNumber: 521,
                                                                    columnNumber: 19
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 497,
                                                            columnNumber: 17
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-px bg-border"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 534,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                            href: "/about",
                                                            className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
                                                            onClick: ()=>setMobileMenuOpen(false),
                                                            "data-testid": "mobile-link-about",
                                                            children: "About Us"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 537,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                            href: "/contact",
                                                            className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
                                                            onClick: ()=>setMobileMenuOpen(false),
                                                            "data-testid": "mobile-link-contact",
                                                            children: "Contact"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 545,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 536,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-px bg-border"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 555,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between pt-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 558,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                            href: "/tools",
                                                            onClick: ()=>setMobileMenuOpen(false),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                "data-testid": "mobile-button-get-protection",
                                                                children: "Check If It's a Scam"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/navigation.tsx",
                                                                lineNumber: 560,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/navigation.tsx",
                                                            lineNumber: 559,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/navigation.tsx",
                                                    lineNumber: 557,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/navigation.tsx",
                                            lineNumber: 398,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/navigation.tsx",
                                        lineNumber: 397,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/navigation.tsx",
                                lineNumber: 390,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/navigation.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/client/src/components/navigation.tsx",
                    lineNumber: 104,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/client/src/components/navigation.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Navigation, "kA9EyEUx5p85f1N5GMV2a1Zee5M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"]
    ];
});
_c = Navigation;
var _c;
__turbopack_context__.k.register(_c, "Navigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-check.js [app-client] (ecmascript) <export default as FileCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$si$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/si/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wouter/src/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$assets$2f$logo$2e$webp$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$client$2f$src$2f$assets$2f$logo$2e$webp__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/client/src/assets/logo.webp.mjs { IMAGE => "[project]/client/src/assets/logo.webp (static in ecmascript, tag client)" } [app-client] (structured image object with data url, ecmascript)');
;
;
;
;
;
const footerLinks = {
    learning: [
        {
            name: "Training Academy",
            href: "/training"
        },
        {
            name: "Awareness Hub",
            href: "/awareness-hub"
        },
        {
            name: "Cyber Safety Guides",
            href: "/guides"
        },
        {
            name: "AI Safety Guide",
            href: "/ai-safety"
        },
        {
            name: "AI Prompt Library",
            href: "/ai-prompts"
        },
        {
            name: "Scam Intelligence",
            href: "/scam-intel"
        },
        {
            name: "Cyber Threat Radar",
            href: "/cyber-threat-radar"
        },
        {
            name: "Resource Library",
            href: "/resources"
        }
    ],
    protection: [
        {
            name: "GCR Scam Guard",
            href: "/tools"
        },
        {
            name: "Browser Extension",
            href: "/browser-extension"
        },
        {
            name: "GCR Data Shield",
            href: "/shield"
        },
        {
            name: "Data Removal Center",
            href: "/data-removal"
        },
        {
            name: "Breach Monitor",
            href: "/breach-dashboard"
        },
        {
            name: "All Tools",
            href: "/tools"
        }
    ],
    forYou: [
        {
            name: "Parents & Families",
            href: "/parents"
        },
        {
            name: "Kids Safety",
            href: "/kids"
        },
        {
            name: "Seniors",
            href: "/seniors"
        },
        {
            name: "Small Business",
            href: "/small-business"
        },
        {
            name: "Educators",
            href: "/educators"
        }
    ],
    company: [
        {
            name: "About",
            href: "/about"
        },
        {
            name: "Our Mission",
            href: "/our-mission"
        },
        {
            name: "Emergency Help",
            href: "/emergency-help"
        },
        {
            name: "Contact",
            href: "/contact"
        },
        {
            name: "FAQ",
            href: "/faq"
        }
    ]
};
const socialLinks = [
    {
        name: "LinkedIn",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$si$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SiLinkedin"],
        href: "https://www.linkedin.com/company/getcyberright",
        color: "text-[#0A66C2]",
        hoverBg: "hover:bg-[#0A66C2]"
    },
    {
        name: "Facebook",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$si$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SiFacebook"],
        href: "https://www.facebook.com/getcyberright",
        color: "text-[#1877F2]",
        hoverBg: "hover:bg-[#1877F2]"
    },
    {
        name: "Instagram",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$si$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SiInstagram"],
        href: "https://www.instagram.com/getcyberright",
        color: "text-[#E4405F]",
        hoverBg: "hover:bg-[#E4405F]"
    },
    {
        name: "YouTube",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$si$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SiYoutube"],
        href: "https://www.youtube.com/@getcyberright",
        color: "text-[#FF0000]",
        hoverBg: "hover:bg-[#FF0000]"
    }
];
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bg-[#081C26] text-slate-300",
        role: "contentinfo",
        "aria-label": "Site footer",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-2 md:col-span-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                    href: "/",
                                    className: "flex items-center gap-2 mb-4",
                                    "data-testid": "footer-link-logo",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$assets$2f$logo$2e$webp$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$client$2f$src$2f$assets$2f$logo$2e$webp__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                                            alt: "GetCyberRight",
                                            className: "w-8 h-8 object-contain"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 55,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-white",
                                            children: "GetCyberRight"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm leading-relaxed mb-4",
                                    children: "Protecting families from online scams, identity theft, and digital threats."
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: socialLinks.map((social)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: social.href,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: `w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center ${social.color} hover:text-white ${social.hoverBg} transition-colors`,
                                            "aria-label": social.name,
                                            "data-testid": `social-link-${social.name.toLowerCase()}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(social.icon, {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/footer.tsx",
                                                lineNumber: 72,
                                                columnNumber: 19
                                            }, this)
                                        }, social.name, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 63,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/footer.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-semibold text-white text-sm mb-3",
                                    children: "Learning Hub"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: footerLinks.learning.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                href: link.href,
                                                className: "text-sm hover:text-white transition-colors",
                                                "data-testid": `footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`,
                                                children: link.name
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/footer.tsx",
                                                lineNumber: 83,
                                                columnNumber: 19
                                            }, this)
                                        }, link.name, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 82,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/footer.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-semibold text-white text-sm mb-3",
                                    children: "Protection Hub"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 96,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: footerLinks.protection.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                href: link.href,
                                                className: "text-sm hover:text-white transition-colors",
                                                "data-testid": `footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`,
                                                children: link.name
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/footer.tsx",
                                                lineNumber: 100,
                                                columnNumber: 19
                                            }, this)
                                        }, link.name, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 99,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/footer.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-semibold text-white text-sm mb-3",
                                    children: "For You"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: footerLinks.forYou.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                href: link.href,
                                                className: "text-sm hover:text-white transition-colors",
                                                "data-testid": `footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`,
                                                children: link.name
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/footer.tsx",
                                                lineNumber: 117,
                                                columnNumber: 19
                                            }, this)
                                        }, link.name, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 116,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 114,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/footer.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-semibold text-white text-sm mb-3",
                                    children: "Company"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: footerLinks.company.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                href: link.href,
                                                className: "text-sm hover:text-white transition-colors",
                                                "data-testid": `footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`,
                                                children: link.name
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/footer.tsx",
                                                lineNumber: 134,
                                                columnNumber: 19
                                            }, this)
                                        }, link.name, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 133,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/footer.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/components/footer.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-10 pt-6 border-t border-slate-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6",
                            "data-testid": "footer-compliance-badges",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5 text-xs text-slate-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 150,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "OWASP Aligned"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 151,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5 text-xs text-slate-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCheck$3e$__["FileCheck"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 154,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "NIST Framework"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 155,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5 text-xs text-slate-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 158,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "SSL Encrypted"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 157,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5 text-xs text-slate-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 162,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "No Data Sold"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 163,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/footer.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    "data-testid": "text-copyright",
                                    children: [
                                        "© ",
                                        new Date().getFullYear(),
                                        " GetCyberRight. All rights reserved."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 168,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center justify-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                            href: "/privacy",
                                            className: "hover:text-slate-300 transition-colors",
                                            children: "Privacy"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 172,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                            href: "/terms",
                                            className: "hover:text-slate-300 transition-colors",
                                            children: "Terms"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 173,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                            href: "/support",
                                            className: "hover:text-slate-300 transition-colors",
                                            children: "Support"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 174,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                            href: "/contact",
                                            className: "hover:text-slate-300 transition-colors",
                                            children: "Contact"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 175,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                localStorage.removeItem("gcr_cookie_consent");
                                                window.dispatchEvent(new CustomEvent("cookie-consent-reopen", {
                                                    detail: null
                                                }));
                                            },
                                            className: "hover:text-slate-300 transition-colors cursor-pointer",
                                            "data-testid": "link-cookie-settings",
                                            children: "Cookie Settings"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/footer.tsx",
                                            lineNumber: 176,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/footer.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 text-center text-xs text-slate-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "www.GetCyberRight.com is powered by "
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://colorcodesolutions.com",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "text-slate-400 hover:text-white transition-colors",
                                    children: "ColorCode Solutions"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/footer.tsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/footer.tsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/components/footer.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/client/src/components/footer.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/client/src/components/footer.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("shadcn-card rounded-xl border bg-card border-card-border text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/card.tsx",
        lineNumber: 9,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/card.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-2xl font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/card.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/card.tsx",
        lineNumber: 51,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/card.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/card.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])(// Whitespace-nowrap: Badges should never wrap.
"whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" + " hover-elevate ", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground shadow-xs",
            secondary: "border-transparent bg-secondary text-secondary-foreground",
            destructive: "border-transparent bg-destructive text-destructive-foreground shadow-xs",
            outline: " border [border-color:var(--badge-outline)] shadow-xs"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/badge.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/components/ui/accordion.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Accordion",
    ()=>Accordion,
    "AccordionContent",
    ()=>AccordionContent,
    "AccordionItem",
    ()=>AccordionItem,
    "AccordionTrigger",
    ()=>AccordionTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-accordion/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const Accordion = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const AccordionItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/accordion.tsx",
        lineNumber: 13,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = AccordionItem;
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {
        className: "flex",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180", className),
            ...props,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 shrink-0 transition-transform duration-200"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/ui/accordion.tsx",
                    lineNumber: 35,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/client/src/components/ui/accordion.tsx",
            lineNumber: 26,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/accordion.tsx",
        lineNumber: 25,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = AccordionTrigger;
AccordionTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const AccordionContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        ref: ref,
        className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pb-4 pt-0", className),
            children: children
        }, void 0, false, {
            fileName: "[project]/client/src/components/ui/accordion.tsx",
            lineNumber: 50,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/client/src/components/ui/accordion.tsx",
        lineNumber: 45,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = AccordionContent;
AccordionContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "AccordionItem$React.forwardRef");
__turbopack_context__.k.register(_c1, "AccordionItem");
__turbopack_context__.k.register(_c2, "AccordionTrigger$React.forwardRef");
__turbopack_context__.k.register(_c3, "AccordionTrigger");
__turbopack_context__.k.register(_c4, "AccordionContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "AccordionContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/src/pages/scam-page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScamPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wouter/src/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$seo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/hooks/use-seo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$structured$2d$data$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/structured-data.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$related$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/related-content.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/navigation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$scam$2d$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shared/scam-content.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2d$warning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquareWarning$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square-warning.js [app-client] (ecmascript) <export default as MessageSquareWarning>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/accordion.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
function ScamPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const scamType = params.scamType || "";
    const scam = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shared$2f$scam$2d$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScamBySlug"])(scamType);
    const { data: relatedIntel = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "/api/scam-intel/cross-link",
            scamType
        ],
        queryFn: {
            "ScamPage.useQuery": async ()=>{
                const res = await fetch(`/api/scam-intel/cross-link/${scamType}`);
                if (!res.ok) return [];
                return res.json();
            }
        }["ScamPage.useQuery"],
        enabled: !!scam
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$seo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSEO"])({
        title: scam?.metaTitle || "Scam Guide | GetCyberRight",
        description: scam?.metaDescription || "Learn about common scams and how to protect yourself.",
        keywords: scam?.keywords?.join(", ") || "scam prevention, fraud protection"
    });
    if (!scam) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Navigation"], {}, void 0, false, {
                    fileName: "[project]/client/src/pages/scam-page.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 py-20 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "h-16 w-16 text-orange-500 mx-auto mb-4"
                        }, void 0, false, {
                            fileName: "[project]/client/src/pages/scam-page.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold mb-4",
                            "data-testid": "text-not-found",
                            children: "Scam Guide Not Found"
                        }, void 0, false, {
                            fileName: "[project]/client/src/pages/scam-page.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground mb-8",
                            children: "The scam guide you are looking for does not exist or has been moved."
                        }, void 0, false, {
                            fileName: "[project]/client/src/pages/scam-page.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                            href: "/scam-checker",
                            className: "inline-flex items-center text-teal-600 hover:text-teal-700 font-medium",
                            "data-testid": "link-scam-checker",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                "Try GCR Scam Guard"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/pages/scam-page.tsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/pages/scam-page.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
                    fileName: "[project]/client/src/pages/scam-page.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/client/src/pages/scam-page.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, this);
    }
    const blogPosting = {
        type: "BlogPosting",
        headline: scam.title,
        description: scam.metaDescription,
        datePublished: scam.lastUpdated,
        dateModified: scam.lastUpdated,
        author: {
            name: "GetCyberRight",
            url: "https://www.getcyberright.com"
        },
        publisher: {
            name: "GetCyberRight",
            logo: "https://www.getcyberright.com/favicon.svg"
        },
        articleSection: "Scam Prevention",
        keywords: scam.keywords,
        wordCount: Math.round(JSON.stringify(scam).length / 5)
    };
    const faqSchema = {
        type: "FAQPage",
        items: scam.faq
    };
    const breadcrumbs = {
        type: "BreadcrumbList",
        items: [
            {
                name: "Home",
                url: "https://www.getcyberright.com/"
            },
            {
                name: "GCR Scam Guard",
                url: "https://www.getcyberright.com/scam-checker"
            },
            {
                name: scam.title,
                url: `https://www.getcyberright.com/scams/${scam.slug}`
            }
        ]
    };
    const tocItems = [
        {
            id: "overview",
            label: "Overview"
        },
        {
            id: "how-it-works",
            label: "How It Works"
        },
        {
            id: "warning-signs",
            label: "Warning Signs"
        },
        {
            id: "examples",
            label: "Real Examples"
        },
        {
            id: "prevention",
            label: "Prevention Steps"
        },
        {
            id: "faq",
            label: "FAQ"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$structured$2d$data$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StructuredData"], {
                data: [
                    blogPosting,
                    faqSchema,
                    breadcrumbs
                ]
            }, void 0, false, {
                fileName: "[project]/client/src/pages/scam-page.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Navigation"], {}, void 0, false, {
                fileName: "[project]/client/src/pages/scam-page.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#0A2A3C] text-white relative overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#0A2A3C] to-[#00293C]"
                    }, void 0, false, {
                        fileName: "[project]/client/src/pages/scam-page.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute pointer-events-none hidden md:block",
                        "aria-hidden": "true",
                        style: {
                            top: 0,
                            right: 0,
                            width: "55%",
                            height: "100%",
                            overflow: "hidden"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "absolute",
                                    top: "-40%",
                                    right: "2%",
                                    width: "50px",
                                    height: "220%",
                                    background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)",
                                    transform: "rotate(20deg)",
                                    transformOrigin: "top center"
                                }
                            }, void 0, false, {
                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "absolute",
                                    top: "-40%",
                                    right: "10%",
                                    width: "2px",
                                    height: "220%",
                                    background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)",
                                    transform: "rotate(20deg)",
                                    transformOrigin: "top center"
                                }
                            }, void 0, false, {
                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "absolute",
                                    top: "-35%",
                                    right: "18%",
                                    width: "35px",
                                    height: "220%",
                                    background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)",
                                    transform: "rotate(20deg)",
                                    transformOrigin: "top center",
                                    opacity: 0.55
                                }
                            }, void 0, false, {
                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "absolute",
                                    top: "-35%",
                                    right: "26%",
                                    width: "2px",
                                    height: "220%",
                                    background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)",
                                    transform: "rotate(20deg)",
                                    transformOrigin: "top center"
                                }
                            }, void 0, false, {
                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "absolute",
                                    top: "-30%",
                                    right: "32%",
                                    width: "50px",
                                    height: "220%",
                                    background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)",
                                    transform: "rotate(20deg)",
                                    transformOrigin: "top center",
                                    opacity: 0.5
                                }
                            }, void 0, false, {
                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/pages/scam-page.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "container mx-auto px-4 py-12 relative z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                href: "/scam-checker",
                                className: "inline-flex items-center text-white/60 hover:text-white text-sm mb-6 transition-colors",
                                "data-testid": "link-back-scam-checker",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "h-4 w-4 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, this),
                                    "Back to GCR Scam Guard"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-4 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 bg-orange-500/20 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "h-8 w-8 text-orange-400"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 118,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                        lineNumber: 117,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-[1.75rem] sm:text-3xl md:text-4xl font-extrabold tracking-[-0.025em]",
                                                "data-testid": "text-scam-title",
                                                children: scam.title
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                lineNumber: 121,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white/60 mt-2",
                                                children: [
                                                    "Last updated: ",
                                                    new Date(scam.lastUpdated).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric"
                                                    })
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                lineNumber: 122,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2 mt-4",
                                children: scam.keywords.slice(0, 4).map((kw)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "outline",
                                        className: "border-white/20 text-white/70",
                                        children: kw
                                    }, kw, false, {
                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/pages/scam-page.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/pages/scam-page.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container mx-auto px-4 py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: "hidden lg:block",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sticky top-24",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3",
                                        children: "Table of Contents"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                        className: "space-y-1",
                                        "data-testid": "nav-toc",
                                        children: tocItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `#${item.id}`,
                                                className: "block text-sm text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 py-1 transition-colors",
                                                "data-testid": `link-toc-${item.id}`,
                                                children: item.label
                                            }, item.id, false, {
                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                lineNumber: 141,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                className: "h-5 w-5 text-teal-600 mb-2"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                lineNumber: 153,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-medium text-sm mb-1",
                                                children: "Got a suspicious message?"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                lineNumber: 154,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground mb-3",
                                                children: "Paste it into our AI-powered GCR Scam Guard for instant analysis."
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                lineNumber: 155,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                href: "/scam-checker",
                                                className: "text-sm text-teal-600 hover:text-teal-700 font-medium",
                                                "data-testid": "link-sidebar-scam-checker",
                                                children: "Check Now →"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                lineNumber: 156,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/pages/scam-page.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-3 space-y-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    id: "overview",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold mb-4 flex items-center gap-2",
                                            "data-testid": "heading-overview",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                    className: "h-6 w-6 text-teal-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 17
                                                }, this),
                                                "Overview"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 165,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-muted-foreground leading-relaxed text-lg",
                                            "data-testid": "text-overview",
                                            children: scam.overview
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 169,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    id: "how-it-works",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold mb-4 flex items-center gap-2",
                                            "data-testid": "heading-how-it-works",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "h-6 w-6 text-teal-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 174,
                                                    columnNumber: 17
                                                }, this),
                                                "How This Scam Works"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 173,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: scam.howItWorks.map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-3 items-start",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex-shrink-0 w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-sm font-bold",
                                                            children: i + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                                            lineNumber: 180,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-muted-foreground",
                                                            "data-testid": `text-step-${i}`,
                                                            children: step
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                                            lineNumber: 181,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 177,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    id: "warning-signs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold mb-4 flex items-center gap-2",
                                            "data-testid": "heading-warning-signs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                    className: "h-6 w-6 text-orange-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 189,
                                                    columnNumber: 17
                                                }, this),
                                                "Warning Signs"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 188,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                                            children: scam.warningSigns.map((sign, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                                    className: "border-orange-200 dark:border-orange-800/40",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                        className: "p-4 flex items-start gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-orange-500 mt-0.5",
                                                                children: "⚠"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                lineNumber: 196,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-muted-foreground",
                                                                "data-testid": `text-warning-${i}`,
                                                                children: sign
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                lineNumber: 197,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                                        lineNumber: 195,
                                                        columnNumber: 21
                                                    }, this)
                                                }, i, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 194,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 192,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    id: "examples",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold mb-4 flex items-center gap-2",
                                            "data-testid": "heading-examples",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2d$warning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquareWarning$3e$__["MessageSquareWarning"], {
                                                    className: "h-6 w-6 text-red-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 206,
                                                    columnNumber: 17
                                                }, this),
                                                "Real Scam Examples"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 205,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground mb-4",
                                            children: "These are examples of messages used in this type of scam. Recognizing the patterns helps you stay safe."
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 209,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: scam.exampleMessages.map((example, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                                    className: "border-red-200 dark:border-red-800/40 bg-red-50/50 dark:bg-red-900/10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                        className: "p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: "outline",
                                                                className: "mb-2 border-red-300 text-red-700 dark:text-red-400",
                                                                children: example.type
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                lineNumber: 214,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm italic text-muted-foreground",
                                                                "data-testid": `text-example-${i}`,
                                                                children: [
                                                                    '"',
                                                                    example.content,
                                                                    '"'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                lineNumber: 215,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                                        lineNumber: 213,
                                                        columnNumber: 21
                                                    }, this)
                                                }, i, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 210,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                    lineNumber: 204,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    id: "prevention",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold mb-4 flex items-center gap-2",
                                            "data-testid": "heading-prevention",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                    className: "h-6 w-6 text-green-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 17
                                                }, this),
                                                "How to Protect Yourself"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 223,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: scam.preventionSteps.map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                        className: "p-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-semibold mb-1 flex items-center gap-2",
                                                                "data-testid": `text-prevention-title-${i}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold flex-shrink-0",
                                                                        children: i + 1
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                        lineNumber: 232,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    step.title
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                lineNumber: 231,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-muted-foreground ml-8",
                                                                "data-testid": `text-prevention-desc-${i}`,
                                                                children: step.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                lineNumber: 235,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 21
                                                    }, this)
                                                }, i, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 227,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                    lineNumber: 222,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    id: "faq",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold mb-4 flex items-center gap-2",
                                            "data-testid": "heading-faq",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                                    className: "h-6 w-6 text-teal-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 17
                                                }, this),
                                                "Frequently Asked Questions"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 243,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Accordion"], {
                                            type: "single",
                                            collapsible: true,
                                            className: "w-full",
                                            children: scam.faq.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionItem"], {
                                                    value: `faq-${i}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionTrigger"], {
                                                            className: "text-left",
                                                            "data-testid": `btn-faq-${i}`,
                                                            children: item.question
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$accordion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccordionContent"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-muted-foreground",
                                                                "data-testid": `text-faq-answer-${i}`,
                                                                children: item.answer
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                lineNumber: 252,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                                            lineNumber: 251,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 249,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 247,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                    lineNumber: 242,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                            className: "h-10 w-10 text-teal-600 mx-auto mb-3"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 260,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-bold mb-2",
                                            children: "Think you have received a scam like this?"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 261,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground mb-4",
                                            children: "Paste the suspicious message into our free AI-powered GCR Scam Guard for instant analysis."
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 262,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap justify-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                    href: "/scam-checker",
                                                    className: "inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium",
                                                    "data-testid": "link-cta-scam-checker",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                            className: "h-4 w-4 mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                                            lineNumber: 265,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Check a Suspicious Message"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                    href: "/emergency-help",
                                                    className: "inline-flex items-center px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors text-sm font-medium",
                                                    "data-testid": "link-cta-emergency",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                            className: "h-4 w-4 mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                                            lineNumber: 269,
                                                            columnNumber: 19
                                                        }, this),
                                                        "I Have Been Scammed"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 263,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                    lineNumber: 259,
                                    columnNumber: 13
                                }, this),
                                relatedIntel.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: "mt-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                                    className: "h-5 w-5 text-teal-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl font-bold",
                                                    children: "Live Intelligence Reports"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 279,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 277,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground mb-4",
                                            children: "Our Scam Intelligence Center tracks real-time data on active scams related to this topic."
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 281,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                                            children: relatedIntel.map((intel)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Link"], {
                                                    href: `/scam-intel/${intel.slug}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                                        className: "hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-teal-500",
                                                        "data-testid": `link-intel-${intel.slug}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                            className: "p-4 flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-medium",
                                                                            children: intel.scamName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                            lineNumber: 290,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 mt-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                    variant: "outline",
                                                                                    className: "text-xs capitalize",
                                                                                    children: [
                                                                                        intel.riskLevel,
                                                                                        " risk"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                                    lineNumber: 292,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                intel.reportCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs text-muted-foreground",
                                                                                    children: [
                                                                                        intel.reportCount.toLocaleString(),
                                                                                        " reports"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                                    lineNumber: 294,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                            lineNumber: 291,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                    lineNumber: 289,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                                    className: "h-4 w-4 text-muted-foreground flex-shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                                    lineNumber: 298,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                                            lineNumber: 288,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/pages/scam-page.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 23
                                                    }, this)
                                                }, intel.slug, false, {
                                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                                    lineNumber: 286,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/pages/scam-page.tsx",
                                            lineNumber: 284,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                    lineNumber: 276,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$related$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RelatedContent"], {
                                    currentCluster: scam.cluster,
                                    currentPath: `/scams/${scam.slug}`,
                                    relatedSlugs: scam.relatedScams
                                }, void 0, false, {
                                    fileName: "[project]/client/src/pages/scam-page.tsx",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/pages/scam-page.tsx",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/pages/scam-page.tsx",
                    lineNumber: 135,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/client/src/pages/scam-page.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
                fileName: "[project]/client/src/pages/scam-page.tsx",
                lineNumber: 316,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/pages/scam-page.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_s(ScamPage, "SivCW0uvaHMbNgeCdShSIpj+ttU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$seo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSEO"]
    ];
});
_c = ScamPage;
var _c;
__turbopack_context__.k.register(_c, "ScamPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0rbyjqq._.js.map