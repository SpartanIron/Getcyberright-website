(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/client/src/components/scam-checker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScamChecker",
    ()=>ScamChecker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/lib/analytics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$signup$2d$encouragement$2d$banner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/signup-encouragement-banner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$queryClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/lib/queryClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/hooks/use-auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.js [app-client] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/qr-code.js [app-client] (ecmascript) <export default as QrCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image-plus.js [app-client] (ecmascript) <export default as ImagePlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thumbs-up.js [app-client] (ecmascript) <export default as ThumbsUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flag.js [app-client] (ecmascript) <export default as Flag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2d$warning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquareWarning$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square-warning.js [app-client] (ecmascript) <export default as MessageSquareWarning>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/video.js [app-client] (ecmascript) <export default as Video>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
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
const threatPatterns = [
    // Urgency & Pressure Tactics
    {
        pattern: /\b(urgent|immediately|right now|act fast|don't wait|hurry|expires? today|limited time|only \d+ left)\b/i,
        category: "Pressure Tactics",
        indicator: "Urgency language detected",
        severity: "medium",
        explanation: "Scammers create artificial urgency to prevent you from thinking critically. Legitimate organizations give you time to make decisions."
    },
    {
        pattern: /\b(final warning|last chance|account will be (closed|suspended|terminated)|action required immediately)\b/i,
        category: "Pressure Tactics",
        indicator: "Threatening deadline",
        severity: "high",
        explanation: "Fear-based deadlines are a classic manipulation technique. Real companies don't threaten immediate account closure via unsolicited messages."
    },
    // Prize & Lottery Scams
    {
        pattern: /\b(you('ve| have)? won|winner|lottery|sweepstakes|prize|reward|jackpot|million(s)? dollars?|grand prize)\b/i,
        category: "Lottery/Prize Scam",
        indicator: "Prize or lottery claim",
        severity: "high",
        explanation: "You cannot win a lottery you didn't enter. Legitimate lotteries never contact winners via email or text asking for fees."
    },
    {
        pattern: /\b(claim (your|the) (prize|reward|winnings)|collect your|redeem (your )?prize)\b/i,
        category: "Lottery/Prize Scam",
        indicator: "Prize claim language",
        severity: "high",
        explanation: "Requests to 'claim' prizes are almost always scams. Real winnings are processed directly, not through email links."
    },
    // Credential Phishing
    {
        pattern: /\b(verify (your )?(account|identity|email|payment)|confirm (your )?(account|identity|password|payment))\b/i,
        category: "Credential Phishing",
        indicator: "Verification request",
        severity: "critical",
        explanation: "Legitimate companies never ask you to verify credentials via email links. Always go directly to the official website."
    },
    {
        pattern: /\b(password|ssn|social security|bank account|credit card|routing number|pin code)\b/i,
        category: "Credential Phishing",
        indicator: "Sensitive data request",
        severity: "critical",
        explanation: "No legitimate organization asks for passwords or SSN via email. This is a direct attempt to steal your identity."
    },
    {
        pattern: /\b(update (your )?(billing|payment|card)|payment (method )?failed|card (on file )?(expired|declined))\b/i,
        category: "Credential Phishing",
        indicator: "Payment update request",
        severity: "high",
        explanation: "Payment update requests via email are a common phishing tactic. Log into your account directly to check payment status."
    },
    // Financial Fraud
    {
        pattern: /\b(wire transfer|western union|moneygram|gift card|itunes card|google play card|bitcoin|crypto(currency)?|zelle|venmo|cashapp)\b/i,
        category: "Financial Fraud",
        indicator: "Unusual payment method",
        severity: "critical",
        explanation: "Requests for gift cards, wire transfers, or crypto are major red flags. These payment methods are untraceable and preferred by scammers."
    },
    {
        pattern: /\b(investment opportunity|guaranteed returns?|double your money|risk[- ]?free|passive income|financial freedom)\b/i,
        category: "Investment Scam",
        indicator: "Investment scheme language",
        severity: "high",
        explanation: "Guaranteed returns and risk-free investments don't exist. These are hallmarks of Ponzi schemes and investment fraud."
    },
    {
        pattern: /\b(make money (fast|quick|from home)|work from home|easy money|earn \$?\d+k?\+? (per|a) (week|month|day))\b/i,
        category: "Employment Scam",
        indicator: "Get-rich-quick promises",
        severity: "medium",
        explanation: "Unrealistic income promises are used to lure victims. Legitimate jobs have clear descriptions and realistic compensation."
    },
    // Impersonation Scams
    {
        pattern: /\b(irs|internal revenue|tax refund|government grant|social security (administration)?|medicare|medicaid)\b/i,
        category: "Government Impersonation",
        indicator: "Government agency mention",
        severity: "high",
        explanation: "Government agencies don't initiate contact via email/text for sensitive matters. They use official mail."
    },
    {
        pattern: /\b(microsoft|apple|amazon|google|paypal|netflix|facebook|instagram|tiktok).{0,20}(support|security|team|department|help|service)/i,
        category: "Tech Support Scam",
        indicator: "Company impersonation",
        severity: "high",
        explanation: "Tech companies don't proactively contact users about problems. Always contact support through official channels."
    },
    {
        pattern: /\b(ceo|cfo|president|director).{0,30}(urgent|wire|transfer|payment|invoice)/i,
        category: "Business Email Compromise",
        indicator: "Executive impersonation",
        severity: "critical",
        explanation: "CEO fraud is extremely common. Always verify unusual requests from executives through a separate communication channel."
    },
    // Romance & Relationship Scams
    {
        pattern: /\b(i love you|my (dear|love|darling)|soul ?mate|meant to be|fallen in love|true love)\b/i,
        category: "Romance Scam",
        indicator: "Romantic language from stranger",
        severity: "medium",
        explanation: "Romance scammers build emotional connections quickly to extract money. Be wary of people professing love before meeting in person."
    },
    {
        pattern: /\b(military|deployed|oil rig|overseas|stuck in|need money to (come home|visit|travel))\b/i,
        category: "Romance Scam",
        indicator: "Classic romance scam story",
        severity: "high",
        explanation: "These are textbook romance scam scenarios. Military and overseas workers are commonly impersonated."
    },
    // Malicious Links
    {
        pattern: /\b(click (here|this|below)|follow (this )?link|open (this )?attachment|download (this )?file)\b/i,
        category: "Malicious Link",
        indicator: "Click-bait language",
        severity: "medium",
        explanation: "Urgent requests to click links are suspicious. Hover over links to see the real destination before clicking."
    },
    {
        pattern: /bit\.ly\/|tinyurl\.com|\/\/t\.co\/|goo\.gl\/|ow\.ly\/|is\.gd\/|buff\.ly\/|adf\.ly\/|shorturl\.at|v\.gd\/|rb\.gy\/|cutt\.ly\/|trib\.al\//i,
        category: "Malicious Link",
        indicator: "URL shortener detected",
        severity: "medium",
        explanation: "URL shorteners hide the true destination. Legitimate businesses use their own domains in official communications."
    },
    // Advance Fee Fraud
    {
        pattern: /\b(processing fee|handling fee|shipping fee|insurance fee|customs fee|release fee|tax fee)\b/i,
        category: "Advance Fee Fraud",
        indicator: "Upfront fee request",
        severity: "high",
        explanation: "Requests for fees to release prizes, inheritances, or packages are classic advance-fee fraud. You should never pay to receive money."
    },
    {
        pattern: /\b(nigerian|prince|inheritance|barrister|next of kin|beneficiary|estate|deceased)\b/i,
        category: "Advance Fee Fraud",
        indicator: "419 scam indicators",
        severity: "critical",
        explanation: "This is a classic advance-fee (419) scam pattern. No legitimate inheritance comes through unsolicited emails."
    },
    // Account Security Threats
    {
        pattern: /\b(account (has been |is )?(hacked|compromised|breached|suspended|locked|frozen))\b/i,
        category: "Account Compromise Scam",
        indicator: "Account threat claim",
        severity: "high",
        explanation: "Claims that your account is compromised are often lies to steal your credentials. Check directly with the company."
    },
    {
        pattern: /\b(unusual (activity|login|sign[- ]?in)|unrecognized device|security alert)\b/i,
        category: "Account Compromise Scam",
        indicator: "Security alert language",
        severity: "medium",
        explanation: "While sometimes legitimate, these alerts are often spoofed. Always navigate directly to the service to verify."
    },
    // === SCENARIO-BASED SCAM DETECTION ===
    // These patterns catch conversational descriptions of common scams
    // Overpayment / Accidental Money Transfer Scam
    {
        pattern: /\b(mistakenly|accidentally|by mistake|by accident|wrong person)\b.{0,80}(sent|transfer|paid|money|payment)/i,
        category: "Overpayment Scam",
        indicator: "Accidental money transfer claim",
        severity: "critical",
        explanation: "This is a classic overpayment scam. Scammers claim they accidentally sent you money and ask you to 'return' it. The original payment is fake or will be reversed, leaving you out the money you 'returned'. Never send money back to strangers."
    },
    {
        pattern: /\b(sent|transfer|paid|money|payment).{0,80}(mistakenly|accidentally|by mistake|by accident|wrong person)/i,
        category: "Overpayment Scam",
        indicator: "Accidental payment narrative",
        severity: "critical",
        explanation: "This is a classic overpayment scam. Scammers claim they accidentally sent you money and ask you to 'return' it. The original payment is fake or will be reversed, leaving you out the money you 'returned'. Never send money back to strangers."
    },
    {
        pattern: /\b(send|return|give).{0,40}(back|refund).{0,40}(money|payment|funds|amount|difference)/i,
        category: "Overpayment Scam",
        indicator: "Request to return money",
        severity: "critical",
        explanation: "Requests to 'send back' or 'return' money are a hallmark of overpayment scams. Even if money appears in your account, it may be from a stolen account or fraudulent check and will be reversed."
    },
    {
        pattern: /\b(overpay|overpaid|over-?payment|too much money|extra money|excess (funds|payment|amount))\b/i,
        category: "Overpayment Scam",
        indicator: "Overpayment language",
        severity: "critical",
        explanation: "Overpayment scams involve sending you more than owed (via fake check or stolen card) and asking you to refund the difference. The original payment bounces, but your refund is real and gone."
    },
    {
        pattern: /\b(random|stranger|unknown|don'?t know).{0,40}(person|people|someone|number|text|message|contact)/i,
        category: "Social Engineering",
        indicator: "Contact from unknown person",
        severity: "medium",
        explanation: "Unsolicited contact from strangers is a common starting point for scams including wrong-number scams, pig butchering, and romance fraud. Be cautious about engaging with unknown contacts."
    },
    {
        pattern: /\b(wrong number|wrong person|didn'?t mean to|not who I meant)\b/i,
        category: "Wrong Number Scam",
        indicator: "Wrong number/person claim",
        severity: "high",
        explanation: "The 'wrong number' text is a calculated social engineering tactic. Scammers pretend to contact you by accident to start a conversation, then build trust before eventually asking for money or promoting fake investments."
    },
    // Pig Butchering / Investment Romance Scam
    {
        pattern: /\b(invest(ment|ing)?|trad(e|ing)|crypto|forex).{0,60}(profit|return|earn|make money|guaranteed|platform)/i,
        category: "Pig Butchering Scam",
        indicator: "Investment opportunity from contact",
        severity: "high",
        explanation: "This matches the pattern of 'pig butchering' scams where someone befriends you then lures you into a fake investment platform. All profits shown are fake, and you cannot withdraw real money."
    },
    {
        pattern: /\b(special|private|exclusive|insider).{0,30}(opportunity|platform|group|access|trading)/i,
        category: "Investment Scam",
        indicator: "Exclusive opportunity claim",
        severity: "high",
        explanation: "Claims of exclusive or insider access to investment opportunities are red flags. Legitimate investments don't recruit through texts or social media messages."
    },
    // Cash Flipping / Money Multiplication
    {
        pattern: /\b(flip|double|triple|multiply|turn).{0,30}(money|cash|\$\d+|funds|payment)/i,
        category: "Cash Flipping Scam",
        indicator: "Money multiplication promise",
        severity: "critical",
        explanation: "Cash flipping scams promise to multiply your money through a 'method' or 'system.' There is no legitimate way to multiply money instantly. You will lose everything you send."
    },
    {
        pattern: /\b(send|give|transfer).{0,20}\$?\d+.{0,30}(get|receive|back).{0,20}\$?\d+/i,
        category: "Cash Flipping Scam",
        indicator: "Send-to-receive money scheme",
        severity: "critical",
        explanation: "Any scheme asking you to send money first to receive more back is a scam. This is the fundamental pattern behind cash flipping, advance fee fraud, and blessing circles."
    },
    // Sextortion / Blackmail
    {
        pattern: /\b(nude|naked|intimate|explicit|compromising).{0,60}(photo|picture|image|video|recording|content)/i,
        category: "Sextortion",
        indicator: "Intimate content threat",
        severity: "critical",
        explanation: "Sextortion scammers claim to have compromising images/videos and threaten to share them unless you pay. Often they have nothing. Never pay. It only leads to more demands."
    },
    {
        pattern: /\b(recorded|captured|hacked).{0,40}(webcam|camera|screen|browsing|activity)/i,
        category: "Sextortion",
        indicator: "Webcam/device recording claim",
        severity: "critical",
        explanation: "Claims of having recorded you through your webcam are almost always false. This is a mass-sent extortion email. Do not respond or pay."
    },
    {
        pattern: /\b(share|send|post|release|publish).{0,40}(contacts|friends|family|everyone|public)/i,
        category: "Blackmail Scam",
        indicator: "Threat to share with contacts",
        severity: "high",
        explanation: "Threats to share information with your contacts or publicly are a blackmail tactic. Do not engage or pay. Report to law enforcement."
    },
    // Rental / Housing Scam
    {
        pattern: /\b(rent|rental|apartment|house|room).{0,60}(deposit|payment|wire|hold|reserve|secure)/i,
        category: "Rental Scam",
        indicator: "Rental deposit request",
        severity: "high",
        explanation: "Rental scams ask for deposits or payments before you can see the property. Never pay for a rental you haven't visited in person. Scammers list properties they don't own."
    },
    {
        pattern: /\b(can'?t (show|meet)|out of (town|country|state)).{0,60}(property|apartment|house|rental|place)/i,
        category: "Rental Scam",
        indicator: "Landlord unavailable to show property",
        severity: "high",
        explanation: "A landlord who can't show the property in person is a major red flag. Scammers invent excuses to avoid in-person meetings while collecting deposits for properties they don't control."
    },
    // Fake Check / Money Order Scam
    {
        pattern: /\b(check|cheque|money order|cashier'?s check).{0,60}(deposit|cash|send|difference|extra|overpay)/i,
        category: "Fake Check Scam",
        indicator: "Check deposit scheme",
        severity: "critical",
        explanation: "Fake check scams involve depositing a check, then sending part of the money elsewhere. The check bounces days later, but the money you sent is gone forever. Banks hold you responsible."
    },
    // Charity / Disaster Scam
    {
        pattern: /\b(donat|charit|relief|disaster|hurricane|earthquake|flood|wildfire|victim).{0,60}(send|give|transfer|payment|donate|help|contribute)/i,
        category: "Charity Scam",
        indicator: "Unsolicited charity request",
        severity: "medium",
        explanation: "Scammers exploit disasters and tragedies to collect fake donations. Only donate through established charities you've researched. Verify at give.org or charitynavigator.org."
    },
    // Brushing / Unsolicited Package Scam
    {
        pattern: /\b(package|parcel|delivery).{0,40}(didn'?t order|never ordered|unexpected|unsolicited)/i,
        category: "Brushing Scam",
        indicator: "Unsolicited package",
        severity: "medium",
        explanation: "Receiving packages you didn't order may be a 'brushing' scam where sellers use your address to post fake reviews. Don't scan any QR codes on these packages and report to the retailer."
    },
    {
        pattern: /\b(scan|open).{0,20}(qr|code|barcode).{0,40}(package|delivery|parcel|gift)/i,
        category: "QR Code Scam",
        indicator: "QR code on unsolicited item",
        severity: "high",
        explanation: "QR codes on unexpected packages or mail can lead to phishing sites or malware. Never scan QR codes from unknown sources."
    },
    // Impersonation of Friends/Family
    {
        pattern: /\b(grandma|grandpa|grandson|granddaughter|grandchild|nephew|niece|family member).{0,60}(trouble|jail|hospital|accident|emergency|arrested|help|money)/i,
        category: "Grandparent Scam",
        indicator: "Family emergency scam",
        severity: "critical",
        explanation: "The grandparent scam involves someone pretending to be a family member in an emergency needing money. Always verify by calling the family member directly on their known phone number."
    },
    {
        pattern: /\b(it'?s me|this is me|new (number|phone)).{0,40}(help|money|emergency|trouble|stuck)/i,
        category: "Impersonation Scam",
        indicator: "New number impersonation",
        severity: "high",
        explanation: "Scammers text from unknown numbers claiming to be someone you know with a 'new number' before asking for money. Always verify by calling the person's old number."
    },
    // SIM Swap / Account Takeover Indicators
    {
        pattern: /\b(sim|phone|number).{0,30}(swap|port|transfer|change).{0,30}(carrier|provider|service)/i,
        category: "SIM Swap Attack",
        indicator: "SIM swap attempt",
        severity: "critical",
        explanation: "SIM swapping is when criminals transfer your phone number to their device to intercept 2FA codes and access your accounts. Contact your carrier immediately if you suspect this."
    },
    // Task/Job Scam (Pay to Start)
    {
        pattern: /\b(job|work|task|position).{0,40}(pay|fee|buy|purchase|invest|deposit).{0,30}(start|begin|training|equipment|supplies)/i,
        category: "Job Scam",
        indicator: "Pay-to-start job offer",
        severity: "high",
        explanation: "Legitimate employers never ask you to pay to start working. Requirements to buy equipment, pay for training, or make deposits before starting are always scams."
    },
    {
        pattern: /\b(like|review|rate|follow|subscribe).{0,30}(earn|make|get paid|\$\d+|money|commission)/i,
        category: "Task Scam",
        indicator: "Paid social media task scam",
        severity: "high",
        explanation: "Task scams promise easy money for liking, reviewing, or rating content online. They start with small real payments to build trust, then ask you to 'invest' larger amounts that you'll never get back."
    },
    // Loan / Debt Relief Scam
    {
        pattern: /\b(pre-?approved|guaranteed approval|no credit check|bad credit ok)\b.{0,40}(loan|credit|card|mortgage)/i,
        category: "Loan Scam",
        indicator: "Guaranteed loan approval",
        severity: "high",
        explanation: "No legitimate lender guarantees approval without checking credit. These scams collect upfront fees and personal information without ever providing a real loan."
    },
    {
        pattern: /\b(student loan|debt).{0,40}(forgive|forgiveness|relief|eliminate|wipe|cancel)/i,
        category: "Debt Relief Scam",
        indicator: "Debt forgiveness promise",
        severity: "medium",
        explanation: "Debt relief scams charge fees for services that are free through official government programs. Never pay a company to apply for student loan forgiveness or debt relief."
    },
    // === PACKAGE / DELIVERY SCAMS ===
    // UPS / USPS / FedEx / DHL Delivery Notification Scams
    {
        pattern: /\b(ups|usps|fedex|dhl|amazon|royal mail|canada post|australia post)\b.{0,60}(deliver|package|parcel|shipment|tracking)/i,
        category: "Package Delivery Scam",
        indicator: "Carrier name with delivery language",
        severity: "high",
        explanation: "Scammers impersonate major shipping carriers like UPS, USPS, FedEx, and DHL to trick you into clicking malicious links. Legitimate carriers will never text you asking for payment or personal information."
    },
    {
        pattern: /\b(deliver|package|parcel|shipment|order)\b.{0,60}(ups|usps|fedex|dhl|royal mail|canada post)\b/i,
        category: "Package Delivery Scam",
        indicator: "Delivery language with carrier name",
        severity: "high",
        explanation: "Fake delivery notifications impersonating shipping carriers are among the most common text scams. Always check tracking directly on the carrier's official website, not through links in texts."
    },
    {
        pattern: /\b(package|parcel|delivery|shipment)\b.{0,40}(fail|unable|cannot|couldn'?t|could not|attempt|missed|undeliver)/i,
        category: "Delivery Failure Scam",
        indicator: "Failed delivery notification",
        severity: "high",
        explanation: "Failed delivery notifications are a top phishing tactic. Real carriers leave physical notices; they don't text you links. Never click links claiming your delivery failed."
    },
    {
        pattern: /\b(fail|unable|cannot|couldn'?t|could not|missed|attempt)\b.{0,40}(deliver|package|parcel|shipment|drop off)/i,
        category: "Delivery Failure Scam",
        indicator: "Failed delivery attempt claim",
        severity: "high",
        explanation: "Texts about missed or failed delivery attempts are almost always scams. USPS, UPS, and FedEx leave door tags for missed deliveries; they don't ask you to click links or pay fees."
    },
    {
        pattern: /\b(reschedul|re-schedul|schedul|arrange).{0,40}(deliver|package|pickup|drop.?off)/i,
        category: "Delivery Scam",
        indicator: "Reschedule delivery request",
        severity: "high",
        explanation: "Messages asking you to reschedule a delivery by clicking a link are phishing attempts. If you're expecting a package, go directly to the carrier's website or app to manage deliveries."
    },
    {
        pattern: /\b(tracking|track your|track the|shipment).{0,30}(number|#|id|code|update|status|info)/i,
        category: "Package Tracking Scam",
        indicator: "Tracking information bait",
        severity: "medium",
        explanation: "Unsolicited tracking notifications with links are often phishing. If you're expecting a package, go directly to the carrier's official website and enter any tracking number there."
    },
    {
        pattern: /\b(deliver|package|parcel|shipment|order).{0,40}(confirm|verify|update|provide).{0,30}(address|info|information|details)/i,
        category: "Delivery Phishing",
        indicator: "Address confirmation request for delivery",
        severity: "high",
        explanation: "Legitimate carriers already have your address from the sender. Requests to 'confirm' or 'update' your address for a delivery are phishing attempts to steal your personal information."
    },
    {
        pattern: /\b(customs?|import|clearance|duty|duties)\b.{0,40}(fee|charge|pay|payment|hold|release)/i,
        category: "Customs Fee Scam",
        indicator: "Fake customs/duty fee",
        severity: "high",
        explanation: "Fake customs fee notices claim you must pay duties to release a package. Real customs fees are handled through the carrier's official channels, not via random texts or emails with payment links."
    },
    {
        pattern: /\b(deliver|package|parcel).{0,40}(pay|fee|charge|cost|\$\d+).{0,30}(deliver|release|complete|process)/i,
        category: "Delivery Fee Scam",
        indicator: "Delivery payment demand",
        severity: "critical",
        explanation: "Scammers demand small fees ($1-5) to 'release' or 'complete' a delivery. This is always a scam designed to steal your credit card information. Legitimate delivery fees are paid at purchase time."
    },
    {
        pattern: /\b(your (order|package|parcel|item|shipment) (is|has been|was))\b.{0,40}(hold|held|stuck|delayed|stopped|pending)/i,
        category: "Package Status Scam",
        indicator: "Package on hold notification",
        severity: "high",
        explanation: "Messages claiming your package is 'on hold' or 'stuck' and needs action are scams. Check the status directly with the carrier using their official app or website."
    },
    {
        pattern: /\b(return to sender|returned|undeliverable|unclaimed)\b.{0,40}(package|parcel|shipment|item|order)/i,
        category: "Return to Sender Scam",
        indicator: "Return to sender threat",
        severity: "high",
        explanation: "Threats that your package will be returned to sender unless you take immediate action are a pressure tactic used in delivery scams. Verify directly with the carrier's official website."
    },
    // Toll / Traffic / Parking Fine Scams
    {
        pattern: /\b(toll|ez.?pass|sun.?pass|i.?pass|fastrak|fast.?track|pike.?pass)\b.{0,40}(unpaid|outstanding|balance|owe|due|overdue|payment)/i,
        category: "Toll Scam",
        indicator: "Fake toll payment demand",
        severity: "critical",
        explanation: "Fake toll collection texts impersonating EZPass, SunPass, and other systems are extremely common scams. Toll authorities do not send payment demands via text with links. Check your toll account directly."
    },
    {
        pattern: /\b(parking|traffic|speed|red light)\b.{0,40}(ticket|fine|violation|citation|penalty|infraction)/i,
        category: "Traffic Fine Scam",
        indicator: "Fake traffic violation notice",
        severity: "high",
        explanation: "Scam texts about parking tickets, speeding fines, or traffic violations always include phishing links. Real traffic citations are delivered by mail or in person; never via text or email links."
    },
    // Subscription / Renewal Scams
    {
        pattern: /\b(subscription|membership|account|service)\b.{0,40}(renew|renewal|expir|cancel|auto.?charge|billing)/i,
        category: "Subscription Scam",
        indicator: "Fake subscription renewal",
        severity: "high",
        explanation: "Fake subscription renewal notices for services like antivirus, streaming, or tech support are designed to get you to call a scam number or click a phishing link. Check your account directly with the service provider."
    },
    {
        pattern: /\b(auto.?renew|charged|billed|debit)\b.{0,40}\$\d+/i,
        category: "Subscription Scam",
        indicator: "Fake auto-renewal charge",
        severity: "high",
        explanation: "Notifications about upcoming charges you don't recognize are designed to panic you into calling a fake support number. Check your bank statement and the service provider's website directly."
    },
    // Tech Support / Virus Alert Scams
    {
        pattern: /\b(computer|device|phone|system|pc|mac)\b.{0,40}(infect|virus|malware|trojan|hack|compromis|at risk)/i,
        category: "Tech Support Scam",
        indicator: "Device infection claim",
        severity: "high",
        explanation: "Pop-ups or messages claiming your device is infected are tech support scams. Real security software doesn't contact you through browser pop-ups or unsolicited messages. Never call numbers from these alerts."
    },
    {
        pattern: /\b(call|contact|reach).{0,20}(support|tech|help|service).{0,20}(number|line|desk|team|immediately)/i,
        category: "Tech Support Scam",
        indicator: "Fake support number",
        severity: "high",
        explanation: "Messages directing you to call a 'support number' are tech support scams. Scammers will try to gain remote access to your device and steal your money. Only use support numbers from official websites."
    },
    // Government Impersonation Scams
    {
        pattern: /\b(irs|social security|ssa|dhs|immigration|dea|fbi|cia|homeland)\b.{0,40}(call|contact|arrest|warrant|suspend|owe|legal action)/i,
        category: "Government Impersonation",
        indicator: "Government agency threat",
        severity: "critical",
        explanation: "Government agencies like the IRS and SSA never threaten arrest or demand payment by phone, text, or email. They communicate by official mail. This is a very common and dangerous scam."
    },
    {
        pattern: /\b(tax refund|stimulus|benefit|social security).{0,40}(claim|verify|confirm|update|pending|deposit)/i,
        category: "Government Benefits Scam",
        indicator: "Fake government benefit claim",
        severity: "high",
        explanation: "Government benefits are never distributed via text or email links. Scammers impersonate the IRS, SSA, or other agencies to steal personal information. Visit official .gov websites directly."
    },
    // Prize / Sweepstakes (Conversational)
    {
        pattern: /\b(won|winner|selected|chosen|picked|congrat)\b.{0,40}(prize|gift|reward|sweepstake|lottery|giveaway|raffle)/i,
        category: "Prize Scam",
        indicator: "Unsolicited prize notification",
        severity: "critical",
        explanation: "You cannot win a contest you never entered. Prize and lottery scams ask for fees or personal information to claim fake winnings. Legitimate contests never require payment to receive prizes."
    },
    // Romance Scam Indicators
    {
        pattern: /\b(deploy|station|military|overseas|oil rig|ship|platform)\b.{0,40}(can'?t (access|get|reach|come)|need (help|money|funds))/i,
        category: "Romance Scam",
        indicator: "Deployed/overseas money request",
        severity: "critical",
        explanation: "Romance scammers create fake identities claiming to be military, offshore workers, or overseas professionals who need money. Real romantic interests don't ask for money before meeting in person."
    },
    {
        pattern: /\b(love|loving|marry|relationship|together|future)\b.{0,40}(send|transfer|wire|money|funds|help|gift card|bitcoin|crypto)/i,
        category: "Romance Scam",
        indicator: "Love combined with money request",
        severity: "critical",
        explanation: "Mixing declarations of love with requests for money is the hallmark of romance scams. Never send money to someone you haven't met in person, no matter how genuine the relationship feels."
    },
    // Gift Card Payment Scams
    {
        pattern: /\b(buy|purchase|get)\b.{0,30}(gift card|itunes|google play|steam|amazon card)/i,
        category: "Gift Card Scam",
        indicator: "Gift card purchase request",
        severity: "critical",
        explanation: "No legitimate business, government agency, or person will ask you to pay with gift cards. Gift card payment requests are always scams: once you share the card numbers, the money is gone instantly and cannot be recovered."
    },
    {
        pattern: /\b(gift card|itunes|google play|steam card|amazon card)\b.{0,30}(code|number|pin|scratch|back|photo|picture|send)/i,
        category: "Gift Card Scam",
        indicator: "Gift card code sharing request",
        severity: "critical",
        explanation: "Being asked to buy gift cards and share the codes is one of the most common scam payment methods. Scammers choose gift cards because they're nearly impossible to trace or reverse."
    },
    // Cryptocurrency Scams
    {
        pattern: /\b(bitcoin|crypto|ethereum|btc|eth|wallet)\b.{0,40}(send|transfer|deposit|invest|pay|required)/i,
        category: "Cryptocurrency Scam",
        indicator: "Cryptocurrency payment demand",
        severity: "critical",
        explanation: "Demands for cryptocurrency payments are a major red flag. Scammers prefer crypto because transactions are irreversible. No legitimate entity demands payment exclusively in cryptocurrency."
    },
    {
        pattern: /\b(mining|staking|yield|airdrop|nft)\b.{0,40}(earn|profit|return|free|guaranteed|passive)/i,
        category: "Crypto Investment Scam",
        indicator: "Crypto investment promise",
        severity: "high",
        explanation: "Promises of guaranteed returns from crypto mining, staking, or airdrops are investment scams. There are no guaranteed returns in cryptocurrency. You will lose your initial investment."
    },
    // Utility / Service Shut-off Scams
    {
        pattern: /\b(electric|power|gas|water|internet|utility|service)\b.{0,40}(shut.?off|disconnect|terminat|suspend|cut off|overdue)/i,
        category: "Utility Scam",
        indicator: "Utility shut-off threat",
        severity: "high",
        explanation: "Utility companies don't call or text threatening immediate shut-off and demanding payment by phone. They send written notices by mail with grace periods. Contact your utility company directly using the number on your bill."
    },
    // Jury Duty / Court Scam
    {
        pattern: /\b(jury duty|court|subpoena|summons|bench warrant)\b.{0,40}(miss|missed|fail|no.?show|fine|penalty|arrest)/i,
        category: "Jury Duty Scam",
        indicator: "Fake jury duty/court threat",
        severity: "high",
        explanation: "Courts do not call about missed jury duty or threaten arrest over the phone. Real jury duty notices come by mail. Scammers use this fear to collect 'fines' or steal personal information."
    },
    // Two-Factor / Verification Code Theft
    {
        pattern: /\b(verification|security|login|one.?time|2fa|otp|mfa)\b.{0,30}(code|pin|number|token)/i,
        category: "Verification Code Theft",
        indicator: "Verification code request",
        severity: "critical",
        explanation: "Never share verification codes or one-time passwords with anyone. Scammers who have your password may contact you pretending to be support to get your 2FA code and take over your account."
    },
    {
        pattern: /\b(code|pin|otp)\b.{0,30}(sent|text|messag|receiv).{0,30}(share|give|tell|send|read|forward)/i,
        category: "Verification Code Theft",
        indicator: "Request to share received code",
        severity: "critical",
        explanation: "If someone asks you to share a code that was sent to your phone, it's a scam. They're trying to take over one of your accounts. No legitimate service will ever ask you to forward your security codes."
    },
    // Fake Refund / Overpayment via Remote Access
    {
        pattern: /\b(refund|reimburse|return|credit)\b.{0,40}(remote|teamviewer|anydesk|screen share|connect|access)/i,
        category: "Remote Access Scam",
        indicator: "Refund via remote access",
        severity: "critical",
        explanation: "Scammers offer fake refunds and ask you to install remote access software. Once connected, they manipulate your screen to make it look like they 'accidentally' refunded too much, then demand you return the 'extra' money."
    },
    // Zelle / Venmo / CashApp Specific Scams
    {
        pattern: /\b(zelle|venmo|cash.?app|paypal)\b.{0,40}(verify|confirm|secure|protect|fraud|suspicious|unusual)/i,
        category: "Payment App Scam",
        indicator: "Payment app security scam",
        severity: "high",
        explanation: "Scammers impersonate Zelle, Venmo, CashApp, or PayPal claiming suspicious activity on your account. These payment services will never text you asking for login credentials or to send money to 'secure' your account."
    },
    {
        pattern: /\b(zelle|venmo|cash.?app|paypal)\b.{0,40}(limit|upgrade|increase|business|premium)/i,
        category: "Payment App Scam",
        indicator: "Payment app upgrade scam",
        severity: "high",
        explanation: "Fake messages claiming you need to 'upgrade' or 'verify' your payment app account to increase limits are phishing attempts. Always manage your account through the official app."
    },
    // === REGIONAL & INTERNATIONAL SCAM PATTERNS ===
    // African Mobile Money Scams (M-Pesa, MTN, Airtel, etc.)
    {
        pattern: /\b(m-?pesa|mpesa|mobile money|momo|airtel money|mtn money|tigo pesa|ecocash|orange money)\b.{0,60}(send|sent|transfer|receive|reverse|confirm|pin|verify|upgrade|money|pay|back)/i,
        category: "Mobile Money Scam",
        indicator: "Mobile money platform mentioned",
        severity: "high",
        explanation: "Mobile money scams are extremely common across Africa. Scammers impersonate M-Pesa, MTN MoMo, Airtel Money, or EcoCash to trick you into sharing PINs, confirming fake transfers, or 'reversing' transactions. Never share your mobile money PIN with anyone."
    },
    {
        pattern: /\b(send|sent|money|transfer|pay|receive|reverse|back)\b.{0,60}(m-?pesa|mpesa|mobile money|momo|airtel money|mtn money|tigo pesa|ecocash|orange money)\b/i,
        category: "Mobile Money Scam",
        indicator: "Money transaction involving mobile money",
        severity: "high",
        explanation: "Mobile money scams are extremely common across Africa. Scammers claim to have sent money by mistake, ask for PINs, or trick you into confirming fake transfers. Never send money back to strangers and never share your PIN."
    },
    {
        pattern: /\b(reverse|reversal|refund|return)\b.{0,40}(m-?pesa|mpesa|mobile money|momo|transaction|transfer)/i,
        category: "Mobile Money Reversal Scam",
        indicator: "Mobile money reversal request",
        severity: "critical",
        explanation: "The reversal scam is one of the most common in Africa. Scammers claim they sent money to you by mistake and ask you to reverse or return it. The original 'transfer' is fake: either a manipulated screenshot or an SMS spoof. Never send money back without verifying with your provider."
    },
    {
        pattern: /\b(m-?pesa|mpesa|momo|mobile money)\b.{0,40}(pin|password|secret|code)/i,
        category: "Mobile Money PIN Theft",
        indicator: "Mobile money PIN request",
        severity: "critical",
        explanation: "No mobile money operator will ever ask for your PIN. Scammers pretending to be M-Pesa, MTN, or Airtel support will ask for your PIN to 'fix' or 'upgrade' your account, then drain your balance. Your PIN is private. Never share it."
    },
    {
        pattern: /\b(sim|line|number)\b.{0,30}(registration|register|re-?register|expir|deactivat|block)/i,
        category: "SIM Registration Scam",
        indicator: "SIM registration threat",
        severity: "high",
        explanation: "Fake SIM registration messages threaten that your number will be blocked unless you click a link or provide personal details. While some countries require SIM registration, the process is done in-person at official outlets; never through text links."
    },
    {
        pattern: /\b(safaricom|mtn|airtel|vodacom|glo|9mobile|econet|telkom|orange)\b.{0,60}(won|winner|prize|reward|bonus|promotion|loyalty|cashback)/i,
        category: "Telecom Promotion Scam",
        indicator: "Fake telecom carrier promotion",
        severity: "high",
        explanation: "Fake promotions claiming you won a prize from your mobile carrier (Safaricom, MTN, Airtel, Vodacom, etc.) are scams. They ask for fees to 'claim' your prize. Real carrier promotions never require upfront payments."
    },
    {
        pattern: /\b(kwese|dstv|gotv|startimes|showmax)\b.{0,40}(free|subscription|decoder|won|prize|activate)/i,
        category: "Pay-TV Scam",
        indicator: "Fake pay-TV promotion",
        severity: "medium",
        explanation: "Scams impersonating DStv, GOtv, StarTimes, or other pay-TV services offer free subscriptions or decoders. They collect 'shipping fees' or personal information. Always verify promotions on the official website or store."
    },
    // Advance Fee / 419 Scam Variants (Africa-focused)
    {
        pattern: /\b(contract|procurement|ministry|government).{0,60}(award|allocat|approv|fund|grant|tender|commission)/i,
        category: "Contract Scam",
        indicator: "Fake government contract/tender",
        severity: "high",
        explanation: "Fake government contract or tender scams are common across Africa and the Middle East. Scammers claim you've been awarded a contract or that funds are waiting for you, then ask for 'processing fees.' Government contracts are awarded through official procurement processes."
    },
    {
        pattern: /\b(gold|diamond|crude oil|mineral|cocoa|timber)\b.{0,60}(buyer|invest|ship|export|deal|opportunity|partner)/i,
        category: "Commodity Scam",
        indicator: "Commodity trading scam",
        severity: "high",
        explanation: "Scams involving gold, diamonds, crude oil, or other commodities from Africa promise huge profits for helping with export or investment. These are advance-fee scams: you'll pay various 'fees' but never receive any commodities."
    },
    {
        pattern: /\b(refugee|displaced|war|conflict|asylum)\b.{0,60}(fund|money|gold|treasure|inheritance|help|escape)/i,
        category: "Refugee Fund Scam",
        indicator: "Refugee/conflict fund scheme",
        severity: "high",
        explanation: "Scammers create emotional stories about being refugees or conflict victims with hidden funds that need your help to move. This is a variant of the advance-fee scam designed to exploit compassion."
    },
    {
        pattern: /\b(diplomat|consignment|trunk|box|package)\b.{0,40}(deliver|ship|clear|customs|airport|security)/i,
        category: "Consignment Scam",
        indicator: "Diplomatic consignment fraud",
        severity: "high",
        explanation: "The 'diplomatic consignment' scam claims a box of money, gold, or valuables is being shipped to you but is stuck at customs or an airport. You're asked to pay clearance fees. This is a classic advance-fee fraud. No consignment exists."
    },
    {
        pattern: /\b(united nations|un|unicef|who|world bank|imf|african union|ecowas)\b.{0,40}(fund|grant|compensation|payment|benefit)/i,
        category: "International Organization Scam",
        indicator: "Fake international organization offer",
        severity: "high",
        explanation: "Scammers impersonate the UN, WHO, World Bank, IMF, or regional organizations to offer fake grants, funds, or compensation. These organizations do not distribute money to individuals via email or text."
    },
    // South Asian Scams (India, Pakistan, Bangladesh, etc.)
    {
        pattern: /\b(aadhaar|aadhar|pan card|pan number|kyc)\b.{0,40}(update|verify|link|expir|suspend|block|deactivat)/i,
        category: "KYC/Identity Scam",
        indicator: "Fake KYC/Aadhaar update request",
        severity: "critical",
        explanation: "Fake Aadhaar, PAN card, or KYC update messages are extremely common in India. Banks and the government never ask you to update KYC through links in SMS. Visit your bank branch or the official UIDAI website directly."
    },
    {
        pattern: /\b(upi|paytm|phonepe|google pay|gpay|bhim|razorpay)\b.{0,40}(verify|confirm|cashback|reward|pin|limit|block|suspicious)/i,
        category: "UPI Payment Scam",
        indicator: "UPI/digital payment scam",
        severity: "high",
        explanation: "Scammers impersonate UPI apps like Paytm, PhonePe, or Google Pay to steal credentials. They may send fake 'collect' requests or claim your account needs verification. Never share your UPI PIN and never approve collect requests from unknown people."
    },
    {
        pattern: /\b(rbi|reserve bank|income tax|epfo|pf|provident fund)\b.{0,40}(refund|credit|payment|verify|update|claim)/i,
        category: "Government Impersonation (India)",
        indicator: "Fake RBI/tax authority message",
        severity: "critical",
        explanation: "Scams impersonating the RBI, Income Tax Department, or EPFO claim refunds or require verification. These institutions communicate through official portals and registered mail, never through SMS links or WhatsApp."
    },
    {
        pattern: /\b(electricity|bijli|gas|water)\b.{0,30}(bill|disconnect|cut|due|outstanding|pay).{0,30}(today|tonight|immediate)/i,
        category: "Utility Bill Scam (South Asia)",
        indicator: "Urgent utility disconnection threat",
        severity: "high",
        explanation: "Fake electricity or gas disconnection threats demanding immediate payment are common in South Asia. Utility companies send bills through official channels and provide adequate notice periods. Never pay through links in SMS."
    },
    // Southeast Asian Scams (Philippines, Indonesia, Malaysia, Thailand, etc.)
    {
        pattern: /\b(gcash|maya|grab|shopee|lazada|tokopedia|gojek)\b.{0,40}(verify|won|prize|reward|suspend|limit|upgrade)/i,
        category: "E-Wallet/E-Commerce Scam",
        indicator: "Fake e-wallet or marketplace notification",
        severity: "high",
        explanation: "Scams impersonating GCash, Maya, Grab, Shopee, Lazada, or other regional platforms are widespread in Southeast Asia. These services never ask for your PIN or password via SMS. Verify everything through the official app."
    },
    {
        pattern: /\b(olx|mudah|carousell|facebook marketplace)\b.{0,40}(buyer|seller|payment|transfer|shipping|scam)/i,
        category: "Marketplace Scam",
        indicator: "Online marketplace fraud",
        severity: "medium",
        explanation: "Marketplace scams on platforms like OLX, Mudah, or Carousell involve fake buyers who 'overpay' or fake sellers who collect payment but never ship items. Always use the platform's built-in payment protection."
    },
    {
        pattern: /\b(call center|bpo|data entry|typing|copy paste|form fill)\b.{0,30}(job|work|earn|income|home|online|remote)/i,
        category: "Fake Online Job Scam",
        indicator: "Work-from-home job scam",
        severity: "high",
        explanation: "Fake work-from-home job offers (data entry, typing, form filling) are common across Asia. They require 'registration fees' or 'security deposits' and promise unrealistic earnings. Legitimate employers never charge to hire you."
    },
    // Middle Eastern Scams
    {
        pattern: /\b(stc|du|etisalat|zain|ooredoo|mobily|vodafone egypt|we egypt)\b.{0,40}(won|prize|reward|bill|recharge|free|bonus|promotion)/i,
        category: "Telecom Scam (Middle East)",
        indicator: "Fake Middle Eastern telecom offer",
        severity: "high",
        explanation: "Scams impersonating STC, du, Etisalat, Zain, Ooredoo, or other Middle Eastern carriers offer fake prizes or claim billing issues. Always verify through the carrier's official app or customer service number."
    },
    {
        pattern: /\b(hajj|umrah|visa|work permit|kafala|iqama)\b.{0,40}(discount|cheap|guaranteed|fast|special offer|agent)/i,
        category: "Visa/Travel Scam",
        indicator: "Fake visa or travel offer",
        severity: "high",
        explanation: "Scams offering cheap Hajj/Umrah packages, guaranteed visas, or work permits at discount prices are common. They collect fees and deliver nothing. Use only authorized government channels and licensed agents."
    },
    {
        pattern: /\b(hawala|hundi|money transfer)\b.{0,40}(best rate|cheap|discount|special|guaranteed|fast)/i,
        category: "Money Transfer Scam",
        indicator: "Informal money transfer fraud",
        severity: "high",
        explanation: "Scams advertising unbeatable hawala or money transfer rates steal your money. Use licensed money transfer services. Unlicensed operators offer no protection if your money disappears."
    },
    // Latin American Scams
    {
        pattern: /\b(pix|boleto|nubank|mercado pago|mercado libre|nequi|daviplata|yape|bcp)\b.{0,40}(verify|confirm|block|suspend|prize|won|transfer|urgent)/i,
        category: "Payment Platform Scam (Latin America)",
        indicator: "Latin American payment platform scam",
        severity: "high",
        explanation: "Scams impersonating PIX, Nubank, Mercado Pago, Nequi, Daviplata, Yape, or other regional payment platforms are common in Latin America. These services never request your password or verification via SMS links."
    },
    {
        pattern: /\b(secuestr|kidnap|ransom|rescue|familia|family member)\b.{0,40}(pagar|pay|money|dinero|transfer|wire|deposit|enviar|send)/i,
        category: "Virtual Kidnapping Scam",
        indicator: "Virtual kidnapping/ransom demand",
        severity: "critical",
        explanation: "Virtual kidnapping scams claim a family member has been kidnapped and demand immediate ransom. The 'victim' is not actually in danger. Always try to contact the 'kidnapped' person directly and call the police. Never send money without verification."
    },
    // European Scams
    {
        pattern: /\b(hmrc|dvla|tv licen[sc]e|council tax|nhs)\b.{0,40}(refund|payment|owe|fine|penalty|verify|update)/i,
        category: "UK Government Scam",
        indicator: "Fake UK government notification",
        severity: "high",
        explanation: "Scams impersonating HMRC, DVLA, TV Licensing, or the NHS are common in the UK. These organizations never ask for payment or personal details via text or email links. Contact them through official .gov.uk websites."
    },
    {
        pattern: /\b(post office|royal mail|hermes|evri|dpd|yodel)\b.{0,40}(deliver|package|parcel|fee|pay|redeliver|missed)/i,
        category: "UK Delivery Scam",
        indicator: "Fake UK delivery notification",
        severity: "high",
        explanation: "Fake delivery texts impersonating Royal Mail, Evri, DPD, or Yodel are extremely common in the UK. Real delivery companies leave cards for missed deliveries. Never pay fees through text links."
    },
    {
        pattern: /\b(post\.?nl|dhl|postnord|posten|bpost|correos|poste italiane|la poste|deutsche post)\b.{0,40}(deliver|package|parcel|fee|pay|failed|customs)/i,
        category: "European Delivery Scam",
        indicator: "Fake European postal service notification",
        severity: "high",
        explanation: "Scams impersonating European postal services (PostNL, PostNord, bpost, Correos, etc.) demand fees for fake package deliveries. Real postal services don't demand payment via text links."
    },
    // Worldwide WhatsApp/Messaging Scams
    {
        pattern: /\b(whatsapp|telegram|signal|wechat|line app)\b.{0,40}(gold|premium|expir|pay|upgrade|verify|hack|clone)/i,
        category: "Messaging App Scam",
        indicator: "Fake messaging app notification",
        severity: "high",
        explanation: "Scams claiming your WhatsApp, Telegram, or other messaging app is expiring, needs upgrading to 'Gold,' or has been hacked are all fake. These apps don't have paid tiers or send such messages."
    },
    {
        pattern: /\b(hi (mom|dad|mum)|hello (mom|dad|mum)|it'?s (your )?(son|daughter|child))\b/i,
        category: "Family Impersonation (WhatsApp)",
        indicator: "'Hi Mom/Dad' impersonation scam",
        severity: "critical",
        explanation: "The 'Hi Mom/Dad' scam on WhatsApp involves scammers pretending to be your child texting from a new number, then urgently asking for money. Always call your child's real number to verify before sending anything."
    },
    // International Lottery & Inheritance Scams
    {
        pattern: /\b(euro.?millions?|el gordo|lotto|national lottery|powerball|mega.?millions?)\b.{0,40}(won|winner|selected|claim|ticket|prize)/i,
        category: "International Lottery Scam",
        indicator: "Fake international lottery win",
        severity: "critical",
        explanation: "You cannot win a lottery you never entered, regardless of which country it's from. International lottery scams ask for fees, taxes, or personal information to release fake winnings."
    },
    {
        pattern: /\b(uk|british|spanish|dutch|canadian|australian|swiss|hong kong|singapore)\b.{0,30}(lottery|lotto|sweepstake|prize draw)/i,
        category: "Foreign Lottery Scam",
        indicator: "Foreign lottery notification",
        severity: "critical",
        explanation: "Messages about winning a foreign lottery are always scams. It is illegal to participate in foreign lotteries in many countries, and these notifications are designed to steal your money through 'processing fees.'"
    },
    // International Romance/Dating Scams
    {
        pattern: /\b(dating|meet|beautiful|handsome|lonely|companion)\b.{0,40}(site|app|online|register|join|profile|click)/i,
        category: "Dating Scam",
        indicator: "Suspicious dating solicitation",
        severity: "medium",
        explanation: "Unsolicited dating site promotions or messages from 'beautiful/handsome' strangers are often lures for romance scams or malicious websites designed to steal personal information or money."
    },
    // Worldwide Fake Charity / Disaster Exploitation
    {
        pattern: /\b(earthquake|tsunami|cyclone|typhoon|famine|pandemic|war|crisis)\b.{0,60}(donat|help|relief|fund|contribute|support|save)/i,
        category: "Disaster Exploitation Scam",
        indicator: "Disaster relief exploitation",
        severity: "medium",
        explanation: "Scammers exploit international disasters to collect fake donations. Only donate through established, verified charities like the Red Cross. Check charities at give.org or charitynavigator.org before giving."
    },
    // Human Trafficking / Fake Job Abroad Scams
    {
        pattern: /\b(job|work|opportunity)\b.{0,30}(abroad|overseas|dubai|qatar|saudi|kuwait|bahrain|singapore|malaysia)/i,
        category: "Fake Job Abroad Scam",
        indicator: "Suspicious overseas job offer",
        severity: "high",
        explanation: "Fake overseas job offers, especially to Gulf countries or Southeast Asia, can be fronts for labor exploitation or trafficking. Verify through your country's labor ministry and only use licensed recruitment agencies."
    },
    {
        pattern: /\b(passport|travel document|visa)\b.{0,30}(hold|confiscat|surrender|give|hand over|keep)/i,
        category: "Trafficking Warning",
        indicator: "Document confiscation indicator",
        severity: "critical",
        explanation: "Anyone asking you to surrender your passport or travel documents is a major red flag for human trafficking or labor exploitation. Your documents belong to you. Never hand them over to employers or agents."
    }
];
const suspiciousUrlPatterns = [
    {
        pattern: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
        reason: "Uses a raw number address instead of a real website name"
    },
    {
        pattern: /@/,
        reason: "Contains a trick character that can redirect you to a different site"
    },
    {
        pattern: /paypal|amazon|apple|google|microsoft|facebook|netflix|bank/i,
        reason: "Mentions a major brand but may not be the real site"
    },
    {
        pattern: /\.(tk|ml|ga|cf|gq|xyz|top|club|online|site|website|buzz|work|link|click|info|biz|pw|cc|ws)$/i,
        reason: "Uses a web address type commonly associated with scams"
    },
    {
        pattern: /-login|-verify|-secure|-account|-update|-confirm/i,
        reason: "Uses words like 'login' or 'verify' in the address to seem official"
    },
    {
        pattern: /bit\.ly\/|tinyurl\.com|\/\/t\.co\/|goo\.gl\/|ow\.ly\/|is\.gd\/|buff\.ly\/|adf\.ly\/|shorturl\.at|v\.gd\/|rb\.gy\/|cutt\.ly\/|trib\.al\//i,
        reason: "Uses a link shortener to hide where it really goes"
    },
    {
        pattern: /\.(exe|zip|rar|scr|bat|cmd|msi|jar|vbs|js)$/i,
        reason: "Links to a file download that could contain harmful software"
    }
];
const legitDomains = [
    /^(https?:\/\/)?(www\.)?(google|microsoft|apple|amazon|facebook|twitter|linkedin|instagram|youtube|netflix|paypal|github|dropbox|zoom|slack)\.com/i,
    /^(https?:\/\/)?(www\.)?(gmail|outlook|hotmail|live|yahoo|aol|icloud|protonmail|proton)\.com/i,
    /^(https?:\/\/)?(www\.)?[a-z0-9-]+\.(gov|edu|mil)/i,
    /^(https?:\/\/)?(www\.)?getcyberright\.(com|org|net)/i,
    /^(https?:\/\/)?(mail\.)?google\.com/i,
    /^(https?:\/\/)?(www\.)?yahoo\.(com|co\.[a-z]+)/i
];
// Typosquatting detection - EXPANDED brand misspellings (200+ brands)
const typosquattingPatterns = [
    // Major Tech Companies
    {
        brand: "PayPal",
        variants: [
            /paypa[l1]|paypai|paypol|payp[a@]l|p[a@]ypal|paaypal|paypall/i
        ]
    },
    {
        brand: "Amazon",
        variants: [
            /amaz[o0]n|amazom|arnazon|amzon|amazn|amaazon|amazoon|amazonn/i
        ]
    },
    {
        brand: "Apple",
        variants: [
            /app[l1]e|appie|aple|applle|aaple|appel|apple[0-9]/i
        ]
    },
    {
        brand: "Google",
        variants: [
            /g[o0][o0]gle|googel|gogle|googlle|g00gle|googie|gooogle/i
        ]
    },
    {
        brand: "Microsoft",
        variants: [
            /micr[o0]s[o0]ft|mircosoft|microsft|micosoft|micros0ft|microsofit/i
        ]
    },
    {
        brand: "Netflix",
        variants: [
            /netf[l1]ix|netfiix|netfix|nettflix|netfl1x|netflex|netflx/i
        ]
    },
    {
        brand: "Facebook",
        variants: [
            /faceb[o0][o0]k|facebok|facbook|faceboook|fac3book|facebk/i
        ]
    },
    {
        brand: "Instagram",
        variants: [
            /[i1]nstagram|instagran|instgram|instagrem|1nstagram|instagarm/i
        ]
    },
    {
        brand: "Twitter/X",
        variants: [
            /tw[i1]tter|twiter|twtter|twittter|xtwitter/i
        ]
    },
    {
        brand: "LinkedIn",
        variants: [
            /l[i1]nked[i1]n|linkedn|linkdin|linkedinn|linkdln/i
        ]
    },
    {
        brand: "YouTube",
        variants: [
            /y[o0]utube|youtub|yuotube|youutube|youtbe/i
        ]
    },
    {
        brand: "WhatsApp",
        variants: [
            /whatsap|watsapp|whatsaap|whatapp|whattsapp/i
        ]
    },
    {
        brand: "Snapchat",
        variants: [
            /snapchat|snapcht|snpchat|snapchatt|snatchat/i
        ]
    },
    {
        brand: "TikTok",
        variants: [
            /t[i1]kt[o0]k|tiktoc|ticktok|tictok|tiktoik/i
        ]
    },
    {
        brand: "Spotify",
        variants: [
            /sp[o0]t[i1]fy|spotfy|spotiffy|spotifiy|spootify/i
        ]
    },
    {
        brand: "Discord",
        variants: [
            /d[i1]sc[o0]rd|discrod|discrd|dicord|discoord/i
        ]
    },
    {
        brand: "Zoom",
        variants: [
            /z[o0][o0]m|zom|zooom|zomm|zo0m/i
        ]
    },
    {
        brand: "Slack",
        variants: [
            /s[l1]ack|slak|slaack|slakc|slackk/i
        ]
    },
    {
        brand: "Dropbox",
        variants: [
            /dr[o0]pb[o0]x|dropbx|drpbox|dropboxx|drobox/i
        ]
    },
    {
        brand: "GitHub",
        variants: [
            /g[i1]thub|githb|githubb|gihub|gihtub/i
        ]
    },
    {
        brand: "Adobe",
        variants: [
            /ad[o0]be|adob|adobee|adoba|adope/i
        ]
    },
    {
        brand: "Salesforce",
        variants: [
            /salesf[o0]rce|salesfore|salesforc|saleforce|salesforse/i
        ]
    },
    {
        brand: "Oracle",
        variants: [
            /[o0]racle|oracl|oralce|oraclee|orecle/i
        ]
    },
    {
        brand: "Cisco",
        variants: [
            /c[i1]sc[o0]|cisoo|csco|ciscoo|sisco/i
        ]
    },
    {
        brand: "Intel",
        variants: [
            /[i1]nte[l1]|intell|intl|inteel|intle/i
        ]
    },
    {
        brand: "Samsung",
        variants: [
            /samsun[g9]|samsumg|samsungg|sumsang|samung/i
        ]
    },
    {
        brand: "Sony",
        variants: [
            /s[o0]ny|sonny|soney|soony|sonii/i
        ]
    },
    {
        brand: "eBay",
        variants: [
            /eb[a@]y|ebey|ebaay|ebayy|e-bay/i
        ]
    },
    {
        brand: "Alibaba",
        variants: [
            /al[i1]baba|alibab|alibbaba|alibabba|allibaba/i
        ]
    },
    // Major Banks & Financial
    {
        brand: "Bank of America",
        variants: [
            /bankofamer[i1]ca|bank0famerica|bankofamerica\d|bofa|bofamerica/i
        ]
    },
    {
        brand: "Chase",
        variants: [
            /chas[e3]bank|chase\d|chasecom|jpmchase|chasee/i
        ]
    },
    {
        brand: "Wells Fargo",
        variants: [
            /we[l1][l1]sfargo|wellsfarg0|weilsfargo|wellsfago|wellfarog/i
        ]
    },
    {
        brand: "Citibank",
        variants: [
            /c[i1]t[i1]bank|citibnk|citibamk|citiibank|citubank/i
        ]
    },
    {
        brand: "Capital One",
        variants: [
            /cap[i1]tal[o0]ne|capitalone\d|capitalon|capone|captial/i
        ]
    },
    {
        brand: "US Bank",
        variants: [
            /usbank\d|us-bank|usbankk|usbanc|u\.s\.bank/i
        ]
    },
    {
        brand: "PNC Bank",
        variants: [
            /pncbank|pnc\d|pncbamk|pncbnk|pncbanc/i
        ]
    },
    {
        brand: "TD Bank",
        variants: [
            /tdb[a@]nk|tdbank\d|td-bank|tdbankk|tdbamk/i
        ]
    },
    {
        brand: "HSBC",
        variants: [
            /hsb[c0]|hsbcc|hsbcbank|hbsc|hsbs/i
        ]
    },
    {
        brand: "Barclays",
        variants: [
            /barc[l1]ays|barclay|barclayss|barcleys|barclas/i
        ]
    },
    {
        brand: "Santander",
        variants: [
            /santand[e3]r|santandr|santanderr|santandar|santandeer/i
        ]
    },
    {
        brand: "Goldman Sachs",
        variants: [
            /g[o0]ldmansachs|goldmansach|goldmannsachs|goldmansax/i
        ]
    },
    {
        brand: "Morgan Stanley",
        variants: [
            /m[o0]rganstanley|morganstanly|morganstnley|morganstanely/i
        ]
    },
    {
        brand: "American Express",
        variants: [
            /amer[i1]canexpress|amex\d|americanexpres|amercanexpress/i
        ]
    },
    {
        brand: "Discover",
        variants: [
            /d[i1]sc[o0]ver|discovr|discoveer|disccover|dicover/i
        ]
    },
    {
        brand: "Venmo",
        variants: [
            /venm[o0]|venmoo|venmmo|vemo|venno/i
        ]
    },
    {
        brand: "CashApp",
        variants: [
            /cashap|cash-app|cashappp|cashspp|cashaap/i
        ]
    },
    {
        brand: "Zelle",
        variants: [
            /ze[l1][l1]e|zele|zellee|zella|zel1e/i
        ]
    },
    {
        brand: "Coinbase",
        variants: [
            /c[o0][i1]nbase|coinbas|coinbasee|coibase|coinnbase/i
        ]
    },
    {
        brand: "Binance",
        variants: [
            /b[i1]nance|binanc|binancee|binanse|binnance/i
        ]
    },
    {
        brand: "Robinhood",
        variants: [
            /r[o0]b[i1]nhood|robinhod|robinhoodd|robinood|robinhhood/i
        ]
    },
    {
        brand: "Fidelity",
        variants: [
            /f[i1]del[i1]ty|fidelty|fidelitty|fidelidy|fideltiy/i
        ]
    },
    {
        brand: "Charles Schwab",
        variants: [
            /charlesschwab|schwab\d|charleschwab|shwab/i
        ]
    },
    {
        brand: "E*TRADE",
        variants: [
            /etrade|e-trade\d|etraed|ettrade/i
        ]
    },
    {
        brand: "Vanguard",
        variants: [
            /vanguard\d|vangard|vangarud|vanguaard/i
        ]
    },
    // Retail & E-commerce
    {
        brand: "Walmart",
        variants: [
            /wa[l1]mart|walmrt|walmaart|walmart\d|wlamart|wamart/i
        ]
    },
    {
        brand: "Target",
        variants: [
            /t[a@]rget|targt|targett|targer|taarget/i
        ]
    },
    {
        brand: "Costco",
        variants: [
            /c[o0]stc[o0]|costc|costcco|costko|cosco/i
        ]
    },
    {
        brand: "Best Buy",
        variants: [
            /bestbuy|best-buy\d|bestbu|bestbyy|besbuy/i
        ]
    },
    {
        brand: "Home Depot",
        variants: [
            /homedep[o0]t|home-depot|homedepo|homeddepot/i
        ]
    },
    {
        brand: "Lowe's",
        variants: [
            /l[o0]wes|lowess|lowees|lowse|lows/i
        ]
    },
    {
        brand: "Macy's",
        variants: [
            /m[a@]cys|macyss|macis|maccys|maceys/i
        ]
    },
    {
        brand: "Nordstrom",
        variants: [
            /n[o0]rdstr[o0]m|nordstom|nordstromm|nortdstrom/i
        ]
    },
    {
        brand: "Kohl's",
        variants: [
            /k[o0]h[l1]s|kohls\d|kohlss|kohles|khols/i
        ]
    },
    {
        brand: "Sephora",
        variants: [
            /seph[o0]ra|sephor|sephoraa|sefora|sephorra/i
        ]
    },
    {
        brand: "Ulta",
        variants: [
            /u[l1]ta|ultaa|ultta|ulat|ulto/i
        ]
    },
    {
        brand: "Nike",
        variants: [
            /n[i1]ke|nikee|nieke|nikke|nik3/i
        ]
    },
    {
        brand: "Adidas",
        variants: [
            /ad[i1]das|addidas|adidass|adiidas|adidis/i
        ]
    },
    {
        brand: "Lululemon",
        variants: [
            /lu[l1]u[l1]em[o0]n|lulemon|lululemonn|lululemn/i
        ]
    },
    {
        brand: "Etsy",
        variants: [
            /etsy\d|estsy|etssy|etsi|esty/i
        ]
    },
    {
        brand: "Wayfair",
        variants: [
            /wayfa[i1]r|wayfar|wayfairr|wayfaie|wafair/i
        ]
    },
    {
        brand: "Chewy",
        variants: [
            /chewy\d|chewy|chewwy|chewey|chewe/i
        ]
    },
    // Streaming & Entertainment
    {
        brand: "Disney+",
        variants: [
            /d[i1]sney|disnye|disneey|diseny|dinsey/i
        ]
    },
    {
        brand: "HBO Max",
        variants: [
            /hb[o0]max|hbomax\d|hbomxa|hbomaxx|hbmax/i
        ]
    },
    {
        brand: "Hulu",
        variants: [
            /hu[l1]u|hullu|huluu|hlu|huulu/i
        ]
    },
    {
        brand: "Paramount+",
        variants: [
            /param[o0]unt|paramont|paramountt|paramout|parramount/i
        ]
    },
    {
        brand: "Peacock",
        variants: [
            /peacoc[k9]|peacok|peacocck|peacokc|peackock/i
        ]
    },
    {
        brand: "Twitch",
        variants: [
            /tw[i1]tch|twitc|twitcch|twich|twicth/i
        ]
    },
    {
        brand: "Steam",
        variants: [
            /st[e3]am|steem|steaam|stean|sream/i
        ]
    },
    {
        brand: "Epic Games",
        variants: [
            /ep[i1]cgames|epicgams|epicgamess|epicgame|epigames/i
        ]
    },
    {
        brand: "PlayStation",
        variants: [
            /playst[a@]t[i1][o0]n|playstaion|playstaton|playsation/i
        ]
    },
    {
        brand: "Xbox",
        variants: [
            /xb[o0]x|xboxx|xbbox|xobx|xbox\d/i
        ]
    },
    {
        brand: "Nintendo",
        variants: [
            /n[i1]ntend[o0]|ninteno|nintendoo|nitendo|nintedo/i
        ]
    },
    // Utilities & Telecom
    {
        brand: "AT&T",
        variants: [
            /[a@]t&t|att\d|atandt|attt|a\.t\.t/i
        ]
    },
    {
        brand: "Verizon",
        variants: [
            /ver[i1]z[o0]n|verizonn|verizon\d|verison|verzion/i
        ]
    },
    {
        brand: "T-Mobile",
        variants: [
            /t-m[o0]b[i1][l1]e|tmobil|t-mobilee|tmobille|t-moble/i
        ]
    },
    {
        brand: "Comcast",
        variants: [
            /c[o0]mcast|comcas|comcastt|comacast|comkast/i
        ]
    },
    {
        brand: "Spectrum",
        variants: [
            /spectr[u0]m|spectru|spectrumm|spektrum|sectrum/i
        ]
    },
    {
        brand: "Cox",
        variants: [
            /c[o0]x\d|coxx|cxo|coox|cox\./i
        ]
    },
    {
        brand: "Xfinity",
        variants: [
            /xf[i1]n[i1]ty|xfinty|xfinityy|xfinnity|xfintiy/i
        ]
    },
    {
        brand: "Sprint",
        variants: [
            /spr[i1]nt|sprintt|srpint|srint|spirnt/i
        ]
    },
    {
        brand: "Cricket",
        variants: [
            /cr[i1]cket|cricke|crickeet|crcket|criket/i
        ]
    },
    {
        brand: "Metro PCS",
        variants: [
            /metr[o0]pcs|metropc|metropcss|metrpcs|metorpcs/i
        ]
    },
    // Travel & Transportation
    {
        brand: "United Airlines",
        variants: [
            /un[i1]ted[a@][i1]r|unitedairlines\d|unitedair|unitde/i
        ]
    },
    {
        brand: "Delta",
        variants: [
            /de[l1]t[a@]|deltaa|dleta|delat|delta\d/i
        ]
    },
    {
        brand: "American Airlines",
        variants: [
            /amer[i1]can[a@][i1]r|americanairlines\d|aaairlines/i
        ]
    },
    {
        brand: "Southwest",
        variants: [
            /s[o0]uthwest|southwes|southwestt|soutwest|souhtwest/i
        ]
    },
    {
        brand: "JetBlue",
        variants: [
            /jetb[l1]ue|jetblu|jetbluee|jeblue|jtblue/i
        ]
    },
    {
        brand: "Uber",
        variants: [
            /ub[e3]r|uberr|ubr|ueber|uber\d/i
        ]
    },
    {
        brand: "Lyft",
        variants: [
            /[l1]yft|lyf|lyftt|lyift|llft/i
        ]
    },
    {
        brand: "DoorDash",
        variants: [
            /d[o0][o0]rdash|doordas|doordassh|doordah|dordash/i
        ]
    },
    {
        brand: "Grubhub",
        variants: [
            /grubhub\d|grubhu|grubhubb|gruhbub|grubhb/i
        ]
    },
    {
        brand: "Instacart",
        variants: [
            /[i1]nstacart|instacrt|instacartt|instcart|instacrat/i
        ]
    },
    {
        brand: "Airbnb",
        variants: [
            /a[i1]rbnb|airbnbb|airnbn|airbb|airbnd/i
        ]
    },
    {
        brand: "Booking.com",
        variants: [
            /b[o0][o0]k[i1]ng|bookng|bookingg|booikng|bokking/i
        ]
    },
    {
        brand: "Expedia",
        variants: [
            /exped[i1]a|expeda|expediaa|expedai|expidea/i
        ]
    },
    {
        brand: "Hotels.com",
        variants: [
            /h[o0]te[l1]s|hotelss|hotles|hotes|hotells/i
        ]
    },
    {
        brand: "USPS",
        variants: [
            /usps\d|u\.s\.p\.s|uspss|ussp|uspa/i
        ]
    },
    {
        brand: "FedEx",
        variants: [
            /fed[e3]x|fedx|fedxe|fedexx|feddex/i
        ]
    },
    {
        brand: "UPS",
        variants: [
            /ups\d|u\.p\.s|upss|usp|upps/i
        ]
    },
    {
        brand: "DHL",
        variants: [
            /dh[l1]|dhll|dlh|dhl\d/i
        ]
    },
    // Healthcare & Pharma
    {
        brand: "CVS",
        variants: [
            /cvs\d|c\.v\.s|cvss|csv|cvvs/i
        ]
    },
    {
        brand: "Walgreens",
        variants: [
            /wa[l1]greens|walgrees|walgreen|walrgeens|wlagreens/i
        ]
    },
    {
        brand: "UnitedHealthcare",
        variants: [
            /un[i1]tedhealth|unitedhealtcare|unitedhc|uhealthcare/i
        ]
    },
    {
        brand: "Cigna",
        variants: [
            /c[i1]gna|cigana|cignaa|cigma|cinga/i
        ]
    },
    {
        brand: "Aetna",
        variants: [
            /[a@]etna|aetana|aetnaa|aenta|aetne/i
        ]
    },
    {
        brand: "Blue Cross",
        variants: [
            /b[l1]uecross|bluecros|bluecorsss|bluecorss|bcbs/i
        ]
    },
    {
        brand: "Kaiser",
        variants: [
            /ka[i1]ser|kaser|kaiserr|kasier|kiaiser/i
        ]
    },
    {
        brand: "Humana",
        variants: [
            /hum[a@]na|humaan|huamna|humanna|humna/i
        ]
    },
    {
        brand: "Medicare",
        variants: [
            /med[i1]care|medicre|medicaree|medicar|medicrae/i
        ]
    },
    {
        brand: "Medicaid",
        variants: [
            /med[i1]caid|medicai|medicaidd|medcaid|mediciad/i
        ]
    },
    // Food & Beverage
    {
        brand: "McDonald's",
        variants: [
            /mcdon[a@][l1]ds|mcdonalds\d|mcdoanlds|mcdonlads|mcdnlds/i
        ]
    },
    {
        brand: "Starbucks",
        variants: [
            /st[a@]rbucks|starbuck|starbuckss|strabucks|starbuks/i
        ]
    },
    {
        brand: "Chipotle",
        variants: [
            /ch[i1]p[o0]t[l1]e|chipotel|chipotlee|chipotl|chipotel/i
        ]
    },
    {
        brand: "Domino's",
        variants: [
            /d[o0]m[i1]n[o0]s|dominos\d|dominoss|dominso|domnios/i
        ]
    },
    {
        brand: "Pizza Hut",
        variants: [
            /p[i1]zzahut|pizzahut\d|pizahut|pizzahu|pizzzahut/i
        ]
    },
    {
        brand: "Dunkin",
        variants: [
            /dunk[i1]n|dunkin\d|dunkinn|dunkin|dunkn/i
        ]
    },
    {
        brand: "Taco Bell",
        variants: [
            /t[a@]c[o0]be[l1][l1]|tacobell\d|tacobel|tacbell|tacobll/i
        ]
    },
    {
        brand: "Wendy's",
        variants: [
            /wendy[s']|wendys\d|wendis|wendyss|wendeys/i
        ]
    },
    {
        brand: "Burger King",
        variants: [
            /burgerking|bk\d|burgerking\d|brgerking|burgerkingg/i
        ]
    },
    {
        brand: "Subway",
        variants: [
            /subway\d|subwa|subwayy|subay|subwey/i
        ]
    },
    // Crypto & Web3
    {
        brand: "Kraken",
        variants: [
            /kr[a@]ken|kraken\d|krakenn|krken|krakne/i
        ]
    },
    {
        brand: "Gemini",
        variants: [
            /gem[i1]n[i1]|gemini\d|geminii|gemni|gemmini/i
        ]
    },
    {
        brand: "Crypto.com",
        variants: [
            /crypt[o0]com|crypto\.com\d|cryptoocm|crypot/i
        ]
    },
    {
        brand: "MetaMask",
        variants: [
            /met[a@]mask|metamsk|metamaskk|metamak|metamsak/i
        ]
    },
    {
        brand: "Ledger",
        variants: [
            /[l1]edger|ledgerr|legder|ledgr|ledge/i
        ]
    },
    {
        brand: "OpenSea",
        variants: [
            /[o0]pensea|opensea\d|opense|opnsea|opensae/i
        ]
    },
    // Insurance
    {
        brand: "State Farm",
        variants: [
            /st[a@]tefarm|statefarm\d|statefrm|statefram|sttaefarm/i
        ]
    },
    {
        brand: "Geico",
        variants: [
            /ge[i1]c[o0]|geicoo|geico\d|geioc|geco/i
        ]
    },
    {
        brand: "Progressive",
        variants: [
            /pr[o0]gressive|progressiv|progressivee|progresvie/i
        ]
    },
    {
        brand: "Allstate",
        variants: [
            /[a@][l1][l1]state|allstat|allstatee|alstate|allstae/i
        ]
    },
    {
        brand: "Liberty Mutual",
        variants: [
            /l[i1]bertymutual|liberymutual|libertymutua|libetry/i
        ]
    },
    {
        brand: "Farmers",
        variants: [
            /farmers\d|farmerss|farmrs|framers|farmres/i
        ]
    },
    {
        brand: "Nationwide",
        variants: [
            /nat[i1][o0]nwide|nationwid|nationwidee|natonwide/i
        ]
    },
    {
        brand: "USAA",
        variants: [
            /usaa\d|u\.s\.a\.a|usaaa|usa\d/i
        ]
    }
];
// Organization impersonation patterns (Government, Healthcare, Utilities)
const organizationImpersonationPatterns = [
    // Government Agencies
    {
        pattern: /\b(internal\s*revenue\s*service|irs)\b.{0,50}(refund|owe|payment|audit|verify)/i,
        category: "IRS Impersonation",
        indicator: "IRS tax scam language",
        severity: "critical"
    },
    {
        pattern: /\b(social\s*security\s*(administration|office)?|ssa)\b.{0,50}(suspend|benefit|verify|fraud)/i,
        category: "SSA Impersonation",
        indicator: "Social Security scam",
        severity: "critical"
    },
    {
        pattern: /\b(department\s*of\s*(homeland\s*security|justice|treasury)|dhs|doj)\b.{0,50}(warrant|arrest|investigation)/i,
        category: "Federal Agency Impersonation",
        indicator: "Federal agency threat",
        severity: "critical"
    },
    {
        pattern: /\b(fbi|federal\s*bureau)\b.{0,50}(warrant|arrest|investigation|illegal)/i,
        category: "FBI Impersonation",
        indicator: "FBI threat scam",
        severity: "critical"
    },
    {
        pattern: /\b(customs\s*(and\s*border)?|cbp|ice)\b.{0,50}(package|shipment|held|seized)/i,
        category: "Customs Impersonation",
        indicator: "Customs package scam",
        severity: "high"
    },
    {
        pattern: /\b(immigration|uscis|visa)\b.{0,50}(expired|status|verify|revoked)/i,
        category: "Immigration Impersonation",
        indicator: "Immigration status scam",
        severity: "critical"
    },
    {
        pattern: /\b(small\s*business\s*administration|sba)\b.{0,50}(loan|grant|approval|application)/i,
        category: "SBA Impersonation",
        indicator: "SBA loan scam",
        severity: "high"
    },
    {
        pattern: /\b(federal\s*trade\s*commission|ftc)\b.{0,50}(refund|settlement|claim)/i,
        category: "FTC Impersonation",
        indicator: "FTC refund scam",
        severity: "high"
    },
    // Healthcare & Medicare
    {
        pattern: /\b(medicare|medicaid)\b.{0,50}(new\s*card|verify|benefit|expire|enrollment)/i,
        category: "Medicare Impersonation",
        indicator: "Medicare card scam",
        severity: "critical"
    },
    {
        pattern: /\b(health\s*(and\s*human\s*services|department)|hhs)\b.{0,50}(benefit|payment|verify)/i,
        category: "HHS Impersonation",
        indicator: "Healthcare scam",
        severity: "high"
    },
    {
        pattern: /\b(affordable\s*care\s*act|obamacare|healthcare\.gov)\b.{0,50}(enroll|deadline|penalty)/i,
        category: "ACA Impersonation",
        indicator: "Healthcare enrollment scam",
        severity: "high"
    },
    {
        pattern: /\b(covid|vaccine|booster)\b.{0,50}(free|government|required|verify|appointment)/i,
        category: "COVID Scam",
        indicator: "COVID vaccine/relief scam",
        severity: "high"
    },
    {
        pattern: /\b(drug|prescription)\b.{0,50}(discount|free|medicare|covered|card)/i,
        category: "Prescription Scam",
        indicator: "Prescription drug scam",
        severity: "high"
    },
    // Utility Companies
    {
        pattern: /\b(electric|power|utility)\s*(company|service|provider)?\b.{0,50}(disconnect|payment\s*due|past\s*due|shut\s*off)/i,
        category: "Utility Impersonation",
        indicator: "Electric bill scam",
        severity: "high"
    },
    {
        pattern: /\b(gas|natural\s*gas)\s*(company|service)?\b.{0,50}(disconnect|service\s*interruption|payment)/i,
        category: "Utility Impersonation",
        indicator: "Gas bill scam",
        severity: "high"
    },
    {
        pattern: /\b(water|sewer)\s*(department|utility|company)?\b.{0,50}(disconnect|payment|service)/i,
        category: "Utility Impersonation",
        indicator: "Water bill scam",
        severity: "high"
    },
    {
        pattern: /\bpge|edison|duke\s*energy|dominion|xcel\b.{0,50}(disconnect|payment|overdue)/i,
        category: "Utility Impersonation",
        indicator: "Specific utility company scam",
        severity: "high"
    },
    // Tech Support
    {
        pattern: /\b(microsoft|windows|apple|mac)\s*(support|security|technician|helpdesk)\b/i,
        category: "Tech Support Scam",
        indicator: "Tech support impersonation",
        severity: "high"
    },
    {
        pattern: /\b(virus|malware|hacked)\s*(detected|found|alert)\b.{0,30}(call|contact|immediately)/i,
        category: "Tech Support Scam",
        indicator: "Fake virus alert",
        severity: "high"
    },
    {
        pattern: /\b(your\s*(computer|device|ip)\s*(has\s*been|is)\s*(compromised|infected|hacked))/i,
        category: "Tech Support Scam",
        indicator: "Device compromise scam",
        severity: "high"
    },
    // Delivery & Shipping
    {
        pattern: /\b(usps|ups|fedex|dhl|amazon)\b.{0,50}(package|delivery|tracking).{0,50}(failed|problem|redelivery|fee)/i,
        category: "Delivery Scam",
        indicator: "Package delivery scam",
        severity: "high"
    },
    {
        pattern: /\b(customs|import)\s*(fee|duty|charge)\b.{0,50}(pay|clear|release)/i,
        category: "Customs Scam",
        indicator: "Fake customs fee",
        severity: "high"
    },
    // Banking Regulators
    {
        pattern: /\b(fdic|federal\s*deposit|occ|cfpb)\b.{0,50}(verify|insurance|account|investigation)/i,
        category: "Banking Regulator Impersonation",
        indicator: "Bank regulator scam",
        severity: "high"
    },
    {
        pattern: /\b(federal\s*reserve|treasury\s*department)\b.{0,50}(transfer|fund|payment|seized)/i,
        category: "Treasury Impersonation",
        indicator: "Federal reserve scam",
        severity: "critical"
    },
    // Legal & Court
    {
        pattern: /\b(court|legal|lawsuit|subpoena|summons)\b.{0,50}(appear|failure|warrant|arrest)/i,
        category: "Legal Threat Scam",
        indicator: "Fake legal threat",
        severity: "high"
    },
    {
        pattern: /\b(jury\s*duty|grand\s*jury)\b.{0,50}(missed|failure|warrant|fine)/i,
        category: "Jury Duty Scam",
        indicator: "Jury duty scam",
        severity: "high"
    },
    {
        pattern: /\b(sheriff|marshal|police)\b.{0,50}(warrant|arrest|immediate)/i,
        category: "Law Enforcement Impersonation",
        indicator: "Fake law enforcement threat",
        severity: "critical"
    }
];
// Homograph attack detection - ONLY actual Unicode lookalike characters (not ASCII)
// This detects real homograph attacks using Cyrillic/Greek/Armenian characters that look like Latin
const homoglyphMap = {
    'a': [
        '\u0430',
        '\u03B1'
    ],
    'e': [
        '\u0435',
        '\u0454'
    ],
    'o': [
        '\u043e',
        '\u03BF'
    ],
    'i': [
        '\u0456',
        '\u0269'
    ],
    'c': [
        '\u0441',
        '\u03F2'
    ],
    's': [
        '\u0455'
    ],
    'p': [
        '\u0440',
        '\u03C1'
    ],
    'x': [
        '\u0445',
        '\u03C7'
    ],
    'y': [
        '\u0443',
        '\u03C5'
    ],
    'n': [
        '\u0578'
    ],
    'g': [
        '\u0261'
    ],
    'h': [
        '\u04BB'
    ],
    'k': [
        '\u043A'
    ],
    'm': [
        '\u043C'
    ],
    'w': [
        '\u0461'
    ]
};
function detectHomoglyphs(text) {
    const examples = [];
    const lowerText = text.toLowerCase();
    for (const [latin, homoglyphs] of Object.entries(homoglyphMap)){
        for (const homoglyph of homoglyphs){
            if (text.includes(homoglyph)) {
                examples.push(`"${homoglyph}" looks like "${latin}"`);
            }
        }
    }
    // Check for mixed scripts (Cyrillic + Latin in same word)
    const cyrillicPattern = /[\u0400-\u04FF]/;
    const latinPattern = /[a-zA-Z]/;
    const words = text.split(/\s+/);
    for (const word of words){
        if (cyrillicPattern.test(word) && latinPattern.test(word) && word.length > 3) {
            examples.push(`Mixed scripts in "${word}"`);
        }
    }
    return {
        found: examples.length > 0,
        examples: examples.slice(0, 3)
    };
}
function detectTyposquatting(url) {
    const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
    for (const { brand, variants } of typosquattingPatterns){
        for (const variant of variants){
            if (variant.test(domain) && !domain.includes(brand.toLowerCase().replace(/\s/g, ''))) {
                return {
                    brand,
                    found: true
                };
            }
        }
    }
    return null;
}
// Cryptocurrency address patterns
const cryptoPatterns = [
    {
        name: "Bitcoin",
        pattern: /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/,
        severity: "high"
    },
    {
        name: "Bitcoin (Bech32)",
        pattern: /\bbc1[a-z0-9]{39,59}\b/,
        severity: "high"
    },
    {
        name: "Ethereum",
        pattern: /\b0x[a-fA-F0-9]{40}\b/,
        severity: "high"
    },
    {
        name: "Monero",
        pattern: /\b4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}\b/,
        severity: "high"
    }
];
function detectCryptoAddresses(text) {
    const found = [];
    for (const { name, pattern } of cryptoPatterns){
        const matches = text.match(pattern);
        if (matches) {
            for (const match of matches){
                found.push({
                    type: name,
                    address: match.slice(0, 20) + '...'
                });
            }
        }
    }
    return found;
}
// Phone number extraction
const phonePatterns = [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    /\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/g,
    /\b\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    /\b1[-.\s]?800[-.\s]?\d{3}[-.\s]?\d{4}\b/gi,
    /\b1[-.\s]?888[-.\s]?\d{3}[-.\s]?\d{4}\b/gi,
    /\b1[-.\s]?877[-.\s]?\d{3}[-.\s]?\d{4}\b/gi,
    /\b1[-.\s]?866[-.\s]?\d{3}[-.\s]?\d{4}\b/gi
];
function extractPhoneNumbers(text) {
    const phones = new Set();
    for (const pattern of phonePatterns){
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach((m)=>phones.add(m.replace(/\s+/g, '')));
        }
    }
    return Array.from(phones);
}
// Grammar and spelling red flags common in scam messages
const grammarRedFlags = [
    {
        pattern: /\bdear\s+(customer|user|member|valued|sir\/madam|friend)\b/i,
        issue: "Generic greeting often used in mass phishing"
    },
    {
        pattern: /\b(kindly|please to|do the needful|revert back)\b/i,
        issue: "Unusual phrasing common in scam emails"
    },
    {
        pattern: /\b(your account have been|your account has been compromise|you has won|you has been selected)\b/i,
        issue: "Grammar errors suggesting non-native scammer"
    },
    {
        pattern: /\b(click bellow|click belllow|clik here|clck here)\b/i,
        issue: "Misspelled call-to-action"
    },
    {
        pattern: /!!!+|\?\?\?+|\.\.\.\.+/g,
        issue: "Excessive punctuation"
    },
    {
        pattern: /[A-Z]{5,}/g,
        issue: "Excessive capitalization"
    },
    {
        pattern: /\$\s*\d{1,3}(,\d{3})*(\.\d{2})?\s*(million|billion|thousand)/i,
        issue: "Large money amount mentioned"
    }
];
// Normalize URL to ensure it has a protocol
function normalizeUrl(url) {
    let normalized = url.trim();
    // Remove trailing punctuation that's likely not part of the URL
    normalized = normalized.replace(/[.,;:!?]+$/, '');
    // Add https:// if no protocol
    if (!normalized.match(/^https?:\/\//i)) {
        if (normalized.startsWith('www.')) {
            normalized = 'https://' + normalized;
        } else if (normalized.match(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}/)) {
            // Looks like a domain without www
            normalized = 'https://' + normalized;
        }
    }
    return normalized;
}
function extractUrls(content) {
    const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+|www\.[^\s<>"{}|\\^`\[\]]+|[a-zA-Z0-9][a-zA-Z0-9-]*\.(com|org|net|io|co|gov|edu|info|biz)[^\s<>"{}|\\^`\[\]]*/gi;
    const matches = content.match(urlPattern) || [];
    // Normalize all extracted URLs to have https://
    return matches.map(normalizeUrl);
}
// Calculate Shannon entropy for randomness detection
function calculateEntropy(text) {
    if (!text || text.length === 0) return 0;
    const freq = {};
    for (const char of text.toLowerCase()){
        freq[char] = (freq[char] || 0) + 1;
    }
    let entropy = 0;
    const len = text.length;
    for(const char in freq){
        const p = freq[char] / len;
        entropy -= p * Math.log2(p);
    }
    return entropy;
}
// Analyze URL entropy - high entropy indicates random/malicious URLs
function analyzeUrlEntropy(url) {
    // Extract the path and query parts for entropy analysis
    const urlParts = url.replace(/^https?:\/\//, '').split('/');
    const pathAndQuery = urlParts.slice(1).join('/');
    if (!pathAndQuery || pathAndQuery.length < 10) {
        return {
            isHigh: false,
            entropy: 0,
            reason: ""
        };
    }
    const entropy = calculateEntropy(pathAndQuery);
    // High entropy (> 4.5) suggests random strings often used in malicious URLs
    if (entropy > 4.5 && pathAndQuery.length > 20) {
        return {
            isHigh: true,
            entropy,
            reason: `This link contains a suspicious jumble of random characters, a common trick used in scam links`
        };
    }
    return {
        isHigh: false,
        entropy,
        reason: ""
    };
}
// Detect excessive subdomain depth
function analyzeSubdomainDepth(url) {
    const domain = url.replace(/^https?:\/\//, '').split('/')[0];
    const subdomains = domain.split('.');
    // Remove TLD and main domain, count subdomains
    const depth = Math.max(0, subdomains.length - 2);
    if (depth >= 3) {
        return {
            isDeep: true,
            depth,
            reason: `The web address has an unusually complex structure. Scammers use this to hide the real destination`
        };
    }
    return {
        isDeep: false,
        depth,
        reason: ""
    };
}
// Detect Base64 encoded content in URLs
function detectBase64Payload(url) {
    // Look for Base64-like patterns in URL (long strings of alphanumeric + /+=)
    const base64Pattern = /[A-Za-z0-9+/=]{40,}/;
    const match = url.match(base64Pattern);
    if (match && match[0].length >= 40) {
        // Verify it looks like valid Base64
        const candidate = match[0];
        if (candidate.length % 4 === 0 || candidate.endsWith('=')) {
            return {
                found: true,
                reason: "This link contains hidden encoded data, often used to bypass security filters"
            };
        }
    }
    return {
        found: false,
        reason: ""
    };
}
// Detect Punycode (internationalized domain) spoofing
function detectPunycode(url) {
    const domain = url.replace(/^https?:\/\//, '').split('/')[0];
    // Punycode domains start with "xn--"
    if (domain.includes('xn--')) {
        return {
            found: true,
            domain,
            reason: "This address uses special characters to impersonate a real website, a known scam technique"
        };
    }
    return {
        found: false,
        domain: "",
        reason: ""
    };
}
// Levenshtein distance for brand similarity
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for(let i = 0; i <= b.length; i++){
        matrix[i] = [
            i
        ];
    }
    for(let j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }
    for(let i = 1; i <= b.length; i++){
        for(let j = 1; j <= a.length; j++){
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[b.length][a.length];
}
// EXPANDED Known brands for similarity checking (200+ brands)
const knownBrands = [
    // Tech Giants (60+ brands)
    "paypal",
    "amazon",
    "apple",
    "google",
    "microsoft",
    "facebook",
    "meta",
    "instagram",
    "netflix",
    "twitter",
    "linkedin",
    "youtube",
    "ebay",
    "alibaba",
    "whatsapp",
    "snapchat",
    "tiktok",
    "spotify",
    "discord",
    "zoom",
    "slack",
    "dropbox",
    "github",
    "adobe",
    "salesforce",
    "oracle",
    "cisco",
    "intel",
    "samsung",
    "sony",
    "nvidia",
    "amd",
    "dell",
    "hp",
    "lenovo",
    "asus",
    "ibm",
    "vmware",
    "sap",
    "intuit",
    "turbotax",
    "quickbooks",
    "mailchimp",
    "hubspot",
    "zendesk",
    "atlassian",
    "jira",
    "confluence",
    "trello",
    "notion",
    "monday",
    "asana",
    "figma",
    "canva",
    "grammarly",
    "evernote",
    "todoist",
    "1password",
    "lastpass",
    "dashlane",
    "bitwarden",
    "nordvpn",
    "expressvpn",
    "surfshark",
    "protonvpn",
    "protonmail",
    "tutanota",
    "signal",
    "telegram",
    "wechat",
    "line",
    "viber",
    "skype",
    "teams",
    "webex",
    "gotomeeting",
    "docusign",
    "hellosign",
    "pandadoc",
    "airtable",
    "coda",
    "clickup",
    "basecamp",
    "freshdesk",
    "intercom",
    "drift",
    "crisp",
    "olark",
    "livechat",
    "shopify",
    "woocommerce",
    "bigcommerce",
    "magento",
    "squarespace",
    "wix",
    "godaddy",
    "namecheap",
    "cloudflare",
    "digitalocean",
    "aws",
    "azure",
    "googlecloud",
    "heroku",
    "netlify",
    "vercel",
    "render",
    "railway",
    // Banks & Financial - US (80+ brands)
    "chase",
    "wellsfargo",
    "bankofamerica",
    "citibank",
    "usbank",
    "capitalone",
    "americanexpress",
    "amex",
    "discover",
    "venmo",
    "cashapp",
    "zelle",
    "coinbase",
    "binance",
    "robinhood",
    "fidelity",
    "schwab",
    "vanguard",
    "etrade",
    "tdameritrade",
    "pnc",
    "tdbank",
    "hsbc",
    "barclays",
    "santander",
    "goldmansachs",
    "morganstanley",
    "jpmorgan",
    "mastercard",
    "visa",
    "kraken",
    "gemini",
    "metamask",
    "ledger",
    "opensea",
    "uniswap",
    "citizensbank",
    "fifththird",
    "keybank",
    "regions",
    "huntington",
    "ally",
    "marcus",
    "sofi",
    "chime",
    "current",
    "varo",
    "monzo",
    "revolut",
    "n26",
    "wise",
    "transferwise",
    "worldremit",
    "remitly",
    "xoom",
    "westernunion",
    "moneygram",
    "payoneer",
    "skrill",
    "neteller",
    "paysafe",
    "stripe",
    "square",
    "clover",
    "toast",
    "lightspeed",
    "shopkeep",
    "revel",
    "suntrust",
    "bbt",
    "truist",
    "synovus",
    "firsthorizon",
    "umpqua",
    "webull",
    "acorns",
    "betterment",
    "wealthfront",
    "personalcapital",
    "creditkarma",
    "experian",
    "equifax",
    "transunion",
    "annualcreditreport",
    "mint",
    "ynab",
    "pocketguard",
    "honeydue",
    "copilot",
    "rocket",
    // Banks & Financial - International
    "natwest",
    "lloyds",
    "halifax",
    "nationwide",
    "rbs",
    "tsb",
    "virgin",
    "starling",
    "tandem",
    "atom",
    "triodos",
    "metro",
    "handelsbanken",
    "deutschebank",
    "commerzbank",
    "bnpparibas",
    "creditagricole",
    "societe",
    "unicredit",
    "intesa",
    "ing",
    "abn",
    "rabobank",
    "bunq",
    "knab",
    "ubs",
    "creditsuisse",
    "postfinance",
    "raiffeisen",
    "erste",
    "bawag",
    "nordea",
    "swedbank",
    "seb",
    "handelsbanken",
    "danske",
    "dnb",
    "storebrand",
    "commonwealth",
    "westpac",
    "anz",
    "nab",
    "macquarie",
    "bendigo",
    "bankwest",
    "icbc",
    "ccb",
    "abc",
    "boc",
    "bocom",
    "cmbchina",
    "spdb",
    "citic",
    "mizuho",
    "mufg",
    "smbc",
    "resona",
    "shinsei",
    "aozora",
    "suruga",
    "dbs",
    "ocbc",
    "uob",
    "maybank",
    "cimb",
    "rhb",
    "publicbank",
    "hongleong",
    "kotak",
    "hdfc",
    "icici",
    "axis",
    "sbi",
    "pnb",
    "bob",
    "canara",
    // Banks & Financial - Africa (80+ brands)
    // South Africa
    "fnb",
    "firstnationalbank",
    "standardbank",
    "absa",
    "nedbank",
    "capitec",
    "investec",
    "africanbank",
    "bidvest",
    "grindrod",
    "sasfin",
    "mercantile",
    "tymebank",
    "bankzero",
    "discovery",
    "oldmutual",
    "sanlam",
    "liberty",
    // Nigeria
    "gtbank",
    "guarantytrust",
    "firstbank",
    "zenithbank",
    "accessbank",
    "ubabank",
    "fidelitybank",
    "unionbank",
    "sterlingbank",
    "wemabank",
    "keystonebank",
    "polaris",
    "jaiz",
    "stanbic",
    "ecobank",
    "fcmb",
    "providus",
    "rubies",
    "opay",
    "palmpay",
    "kuda",
    "moniepoint",
    "carbon",
    "fairmoney",
    "branch",
    // Kenya
    "kcb",
    "equitybank",
    "coopbank",
    "abcbank",
    "dtbbank",
    "familybank",
    "ncba",
    "imbank",
    "stanbickenya",
    "standardchartered",
    "barclayskenya",
    "mpesa",
    "safaricom",
    "airtel",
    "telkom",
    "mshwari",
    "fuliza",
    "tala",
    // Ghana
    "gcb",
    "ecobank",
    "stanbicghana",
    "absa",
    "fidelity",
    "calbank",
    "zenith",
    "uba",
    "accessghana",
    "prudential",
    "societe",
    "republic",
    "mtn",
    "vodafone",
    "airteltigo",
    "momo",
    "mobilemoney",
    "zeepay",
    // Egypt
    "nbe",
    "banquemisr",
    "cib",
    "qnb",
    "alexbank",
    "arabbank",
    "faisal",
    "hsbc",
    "scb",
    "audi",
    "blom",
    "saib",
    "aaib",
    "mashreq",
    "emirates",
    "vodafonecash",
    "etisalat",
    "orange",
    "wepay",
    "fawry",
    "paymob",
    // Other African Countries
    "attijariwafa",
    "bmce",
    "cih",
    "sgmb",
    "creditagricole",
    "biat",
    "stb",
    "bh",
    "amen",
    "bt",
    "bte",
    "zitouna",
    "bea",
    "bna",
    "cnep",
    "cpa",
    "badr",
    "bdl",
    "gulf",
    "equity",
    "crdb",
    "nmb",
    "dtb",
    "exim",
    "tpb",
    "ncb",
    "zanaco",
    "stanbiczambia",
    "fnbzambia",
    "barclays",
    "ab",
    "access",
    "cbz",
    "steward",
    "zb",
    "fbc",
    "nmb",
    "agribank",
    "fnbnam",
    "bankwindhoek",
    "standardnam",
    "nednam",
    "letshego",
    "fnbbots",
    "stanbicbots",
    "barclays",
    "absa",
    "firstcapital",
    "gtbankrw",
    "bk",
    "cogebanque",
    "equity",
    "imbank",
    "accessrw",
    "dfcu",
    "stanbicug",
    "centenary",
    "housingfinance",
    "postbank",
    // African Telecom & Mobile Money (50+ brands)
    "mtn",
    "safaricom",
    "airtel",
    "vodacom",
    "orange",
    "glo",
    "9mobile",
    "ethiotelecom",
    "maroctelecom",
    "ooredoo",
    "tunisietelecom",
    "djezzy",
    "econet",
    "telecel",
    "africell",
    "tigo",
    "millicom",
    "sonatel",
    "mpesa",
    "momo",
    "airtelmoney",
    "orangemoney",
    "ecocash",
    "tigocash",
    "paga",
    "flutterwave",
    "paystack",
    "interswitch",
    "cellulant",
    "chipper",
    "wave",
    "mfs",
    "yup",
    "geopay",
    "zamtel",
    "movitel",
    "tmcel",
    "mascom",
    "bemagosi",
    "mcel",
    "vodafone",
    "tmcel",
    "ethiotel",
    // Retail - Major (100+ brands)
    "walmart",
    "target",
    "costco",
    "bestbuy",
    "homedepot",
    "lowes",
    "macys",
    "nordstrom",
    "kohls",
    "sephora",
    "ulta",
    "nike",
    "adidas",
    "lululemon",
    "underarmour",
    "gap",
    "oldnavy",
    "zara",
    "hm",
    "forever21",
    "asos",
    "shein",
    "temu",
    "wish",
    "etsy",
    "wayfair",
    "chewy",
    "petco",
    "petsmart",
    "jcpenney",
    "belk",
    "dillards",
    "bloomingdales",
    "neiman",
    "saks",
    "barneys",
    "anthropologie",
    "freepeople",
    "urbanoutfitters",
    "ae",
    "abercrombie",
    "hollister",
    "express",
    "jcrew",
    "bananarepublic",
    "athleta",
    "uniqlo",
    "primark",
    "topshop",
    "boohoo",
    "prettylittlething",
    "missguided",
    "fashionnova",
    "romwe",
    "zaful",
    "puma",
    "newbalance",
    "asics",
    "reebok",
    "vans",
    "converse",
    "skechers",
    "footlocker",
    "finishline",
    "champssports",
    "dickssporting",
    "academy",
    "rei",
    "bass",
    "cabelas",
    "sportsmans",
    "scheels",
    "dunhams",
    "hibbett",
    "ikea",
    "williams-sonoma",
    "pottery",
    "westelm",
    "crateandbarrel",
    "cb2",
    "bedbathandbeyond",
    "pier1",
    "zgallerie",
    "worldmarket",
    "roomandboard",
    "restorationhardware",
    "arhaus",
    "ethanallen",
    "lazyboy",
    "ashleyfurniture",
    "overstock",
    "hayneedle",
    "houzz",
    "allmodern",
    "jossandmain",
    "birch",
    "autozone",
    "oreilly",
    "advanceauto",
    "pepboys",
    "napa",
    "carquest",
    "staples",
    "officemax",
    "officedepot",
    "uline",
    "quill",
    "vistaprint",
    "michaels",
    "joann",
    "hobbylobby",
    "blick",
    "dickblick",
    "jerrysartarama",
    "gamestop",
    "thinkgeek",
    "newegg",
    "microcenter",
    "bhphoto",
    "adorama",
    // Streaming & Entertainment (50+ brands)
    "disney",
    "disneyplus",
    "hbomax",
    "hulu",
    "paramount",
    "peacock",
    "twitch",
    "steam",
    "epicgames",
    "playstation",
    "xbox",
    "nintendo",
    "roblox",
    "activision",
    "electronicarts",
    "ubisoft",
    "bethesda",
    "rockstar",
    "valorant",
    "fortnite",
    "primevideo",
    "appletv",
    "discovery",
    "showtime",
    "starz",
    "britbox",
    "acorn",
    "criterion",
    "mubi",
    "shudder",
    "amc",
    "sundancenow",
    "crunchyroll",
    "funimation",
    "hidive",
    "vrv",
    "roosterteeth",
    "dropout",
    "dazn",
    "espn",
    "fubo",
    "sling",
    "youtubetv",
    "directv",
    "dish",
    "pandora",
    "deezer",
    "tidal",
    "amazonmusic",
    "applemusic",
    "soundcloud",
    "bandcamp",
    "audiomack",
    "mixcloud",
    "beatport",
    "traxsource",
    "blizzard",
    "riot",
    "bungie",
    "square-enix",
    "capcom",
    "konami",
    "sega",
    "bandainamco",
    "2k",
    "take2",
    "thq",
    "paradox",
    "cdprojekt",
    "devolver",
    // Telecom & Utilities (40+ brands)
    "att",
    "verizon",
    "tmobile",
    "sprint",
    "comcast",
    "xfinity",
    "spectrum",
    "cox",
    "cricket",
    "boost",
    "metro",
    "visible",
    "mint",
    "ting",
    "straighttalk",
    "tracfone",
    "consumer",
    "pageplus",
    "redpocket",
    "ultramobile",
    "googlefi",
    "usmobile",
    "tello",
    "textnow",
    "freedompop",
    "republic",
    "frontier",
    "centurylink",
    "lumen",
    "windstream",
    "consolidated",
    "cincinnati",
    "atlantic",
    "optimum",
    "altice",
    "mediacom",
    "suddenlink",
    "wow",
    "sce",
    "pge",
    "edison",
    "duke",
    "dominion",
    "entergy",
    "xcel",
    "firstenergy",
    "aep",
    "southern",
    "nextera",
    "evergy",
    "ameren",
    "nationalfuel",
    "atmos",
    "spire",
    "southwest",
    "cenpoint",
    "onegas",
    // Travel & Transportation (60+ brands)
    "unitedairlines",
    "delta",
    "americanairlines",
    "southwest",
    "jetblue",
    "uber",
    "lyft",
    "doordash",
    "grubhub",
    "instacart",
    "postmates",
    "airbnb",
    "booking",
    "expedia",
    "hotels",
    "kayak",
    "tripadvisor",
    "usps",
    "fedex",
    "ups",
    "dhl",
    "hertz",
    "enterprise",
    "avis",
    "alaskaair",
    "spirit",
    "frontier",
    "allegiant",
    "hawaiian",
    "sun",
    "british",
    "lufthansa",
    "airfrance",
    "klm",
    "emirates",
    "qatar",
    "etihad",
    "singapore",
    "cathay",
    "ana",
    "jal",
    "korean",
    "asiana",
    "qantas",
    "virgin",
    "ryanair",
    "easyjet",
    "vueling",
    "norwegian",
    "priceline",
    "hotwire",
    "orbitz",
    "travelocity",
    "cheapoair",
    "momondo",
    "skyscanner",
    "google flights",
    "kiwi",
    "hopper",
    "scott",
    "going",
    "marriott",
    "hilton",
    "hyatt",
    "ihg",
    "wyndham",
    "choice",
    "bestwestern",
    "radisson",
    "accor",
    "fourseasons",
    "ritz",
    "waldorf",
    "conrad",
    "doubletree",
    "homewood",
    "hampton",
    "residence",
    "springhill",
    "fairfield",
    "courtyard",
    "budget",
    "national",
    "alamo",
    "thrifty",
    "dollar",
    "sixt",
    "europcar",
    "turo",
    "getaround",
    "zipcar",
    "maven",
    "car2go",
    "lime",
    "bird",
    "spin",
    // Healthcare & Pharma (50+ brands)
    "cvs",
    "walgreens",
    "riteaid",
    "unitedhealth",
    "cigna",
    "aetna",
    "anthem",
    "bluecross",
    "kaiser",
    "humana",
    "optum",
    "express-scripts",
    "caremark",
    "centene",
    "molina",
    "wellcare",
    "healthnet",
    "oscar",
    "clover",
    "bright",
    "devoted",
    "alignment",
    "carelon",
    "magellan",
    "beacon",
    "evicore",
    "pfizer",
    "moderna",
    "jnj",
    "merck",
    "abbvie",
    "bms",
    "lilly",
    "amgen",
    "gilead",
    "regeneron",
    "vertex",
    "biogen",
    "alexion",
    "incyte",
    "seagen",
    "novartis",
    "roche",
    "sanofi",
    "gsk",
    "astrazeneca",
    "bayer",
    "boehringer",
    "teladoc",
    "amwell",
    "mdlive",
    "doctor",
    "zocdoc",
    "healthgrades",
    "vitals",
    "onemedical",
    "forward",
    "parsley",
    "carbon",
    "cityblock",
    "oak",
    "galileo",
    "pillpack",
    "capsule",
    "alto",
    "medly",
    "nimble",
    "truepill",
    "amazon pharmacy",
    // Food & Beverage (60+ brands)
    "mcdonalds",
    "starbucks",
    "chipotle",
    "dominos",
    "pizzahut",
    "dunkin",
    "tacobell",
    "wendys",
    "burgerking",
    "subway",
    "chickfila",
    "kfc",
    "papajohns",
    "littlecaesars",
    "panera",
    "noodles",
    "panerabread",
    "coca-cola",
    "pepsi",
    "redbull",
    "monster",
    "gatorade",
    "popeyes",
    "arbys",
    "sonic",
    "jackinthebox",
    "carls",
    "hardees",
    "fiveguys",
    "shakeshack",
    "innout",
    "whataburger",
    "culvers",
    "cookout",
    "wingstop",
    "buffalowild",
    "hooters",
    "applebees",
    "chilis",
    "tgifridays",
    "olivegarden",
    "redlobster",
    "outback",
    "texas",
    "longhorn",
    "ruth",
    "cheesecakefactory",
    "pf",
    "benihana",
    "maggianos",
    "capital",
    "mortons",
    "denny",
    "ihop",
    "waffle",
    "cracker",
    "bobevans",
    "perkins",
    "shoneys",
    "sweetgreen",
    "cava",
    "tender",
    "portillos",
    "jasons",
    "potbelly",
    "firehouse",
    "jersymikes",
    "jimmyjohns",
    "whichwich",
    "quiznos",
    "schlotzskys",
    "mcalisters",
    "smoothie",
    "jamba",
    "tropical",
    "nekter",
    "juice",
    "pressed",
    "suja",
    "krispy",
    "cinnabon",
    "auntie",
    "wetzel",
    "greatamerican",
    "insomnia",
    // Insurance (40+ brands)
    "statefarm",
    "geico",
    "progressive",
    "allstate",
    "libertymutual",
    "farmers",
    "nationwide",
    "usaa",
    "travelers",
    "metlife",
    "prudential",
    "aflac",
    "hartford",
    "chubb",
    "aig",
    "zurich",
    "cna",
    "tokio",
    "sompo",
    "mitsui",
    "erie",
    "american",
    "safeco",
    "mercury",
    "esurance",
    "21st",
    "kemper",
    "lemonade",
    "root",
    "hippo",
    "next",
    "pie",
    "coterie",
    "vouch",
    "cowbell",
    "newfront",
    "embroker",
    "founder",
    "brex",
    "ramp",
    "divvy",
    "airbase",
    "northwestern",
    "newyork",
    "massmutal",
    "principal",
    "lincoln",
    "transamerica",
    "voya",
    "brighthouse",
    "athene",
    "equitable",
    "jackson",
    "ameriprise",
    "edward",
    // Government & Organizations (30+ brands)
    "irs",
    "ssa",
    "medicare",
    "medicaid",
    "usps",
    "dmv",
    "uscis",
    "fbi",
    "cia",
    "nsa",
    "dhs",
    "ice",
    "cbp",
    "tsa",
    "atf",
    "dea",
    "marshals",
    "fda",
    "cdc",
    "nih",
    "hhs",
    "epa",
    "dot",
    "faa",
    "nhtsa",
    "fcc",
    "ftc",
    "sec",
    "finra",
    "cfpb",
    "occ",
    "fdic",
    "ncua",
    "fhfa",
    "fannie",
    "freddie",
    "va",
    "hud",
    "sba",
    "gsa",
    "opm",
    "ssa",
    "uscourts",
    "supremecourt",
    // Crypto & Web3 (40+ brands)
    "bitcoin",
    "ethereum",
    "solana",
    "cardano",
    "polkadot",
    "avalanche",
    "cosmos",
    "polygon",
    "arbitrum",
    "optimism",
    "base",
    "linea",
    "zksync",
    "starknet",
    "rarible",
    "foundation",
    "superrare",
    "nifty",
    "async",
    "catalog",
    "sound",
    "aave",
    "compound",
    "makerdao",
    "lido",
    "rocketpool",
    "frax",
    "curve",
    "sushiswap",
    "pancakeswap",
    "quickswap",
    "velodrome",
    "aerodrome",
    "balancer",
    "fantom",
    "near",
    "algorand",
    "hedera",
    "tezos",
    "flow",
    "aptos",
    "sui",
    "trustwallet",
    "phantom",
    "keplr",
    "rainbow",
    "argent",
    "safe",
    "gnosis",
    // Education & Learning (30+ brands)
    "coursera",
    "udemy",
    "edx",
    "linkedin",
    "skillshare",
    "masterclass",
    "brilliant",
    "khan",
    "duolingo",
    "babbel",
    "rosetta",
    "busuu",
    "memrise",
    "anki",
    "chegg",
    "quizlet",
    "studyblue",
    "bartleby",
    "course",
    "studocu",
    "scribd",
    "codecademy",
    "freecodecamp",
    "treehouse",
    "pluralsight",
    "udacity",
    "datacamp",
    "leetcode",
    "hackerrank",
    "codewars",
    "exercism",
    "frontendmentor",
    "scrimba"
];
// Check for brand similarity (catch subtle misspellings)
function detectBrandSimilarity(domain) {
    // Clean domain - remove TLD and subdomains
    const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];
    const domainParts = cleanDomain.split('.');
    const mainDomain = domainParts.length >= 2 ? domainParts[domainParts.length - 2] : domainParts[0];
    for (const brand of knownBrands){
        // Skip exact matches (those are legit)
        if (mainDomain === brand) continue;
        const distance = levenshteinDistance(mainDomain.toLowerCase(), brand);
        const similarity = 1 - distance / Math.max(mainDomain.length, brand.length);
        // If 80%+ similar but not exact, it's suspicious
        if (similarity >= 0.75 && similarity < 1 && distance <= 3) {
            return {
                found: true,
                brand,
                distance,
                reason: `This website name "${mainDomain}" is very close to "${brand}" - it may be a fake version trying to trick you`
            };
        }
    }
    return {
        found: false,
        brand: "",
        distance: 0,
        reason: ""
    };
}
// Calculate urgency/pressure score
function calculateUrgencyScore(content) {
    const triggers = [];
    let score = 0;
    const urgencyPatterns = [
        {
            pattern: /\b(urgent|urgently|emergency|immediately|right now|asap)\b/gi,
            weight: 3,
            label: "Urgent language"
        },
        {
            pattern: /\b(act (fast|now)|don't (wait|delay)|hurry|quick|fast)\b/gi,
            weight: 2,
            label: "Pressure to act quickly"
        },
        {
            pattern: /\b(expires?|expiring|deadline|final|last chance|limited time)\b/gi,
            weight: 2,
            label: "Time pressure"
        },
        {
            pattern: /\b(warning|alert|notice|attention|important)\b/gi,
            weight: 1,
            label: "Warning language"
        },
        {
            pattern: /\b(suspended|terminated|closed|frozen|locked|disabled)\b/gi,
            weight: 3,
            label: "Account threat"
        },
        {
            pattern: /\b(verify|confirm|validate|update).{0,20}(now|immediately|today)/gi,
            weight: 3,
            label: "Immediate action request"
        },
        {
            pattern: /\b(only \d+ (left|remaining|available)|while supplies last)\b/gi,
            weight: 2,
            label: "Scarcity tactics"
        },
        {
            pattern: /!!+|\?\?+/g,
            weight: 1,
            label: "Excessive punctuation"
        },
        {
            pattern: /[A-Z]{4,}/g,
            weight: 1,
            label: "Shouting (all caps)"
        },
        {
            pattern: /\b(risk|danger|threat|compromise|breach)\b/gi,
            weight: 2,
            label: "Fear language"
        }
    ];
    for (const { pattern, weight, label } of urgencyPatterns){
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
            score += weight * Math.min(matches.length, 3); // Cap at 3 matches per pattern
            if (!triggers.includes(label)) {
                triggers.push(label);
            }
        }
    }
    // Normalize score to 0-100
    const normalizedScore = Math.min(100, Math.round(score / 30 * 100));
    let level = "Low";
    if (normalizedScore >= 70) level = "Critical";
    else if (normalizedScore >= 50) level = "High";
    else if (normalizedScore >= 30) level = "Moderate";
    return {
        score: normalizedScore,
        level,
        triggers
    };
}
// Analyze email headers for security issues
function analyzeEmailHeaders(headers) {
    const findings = [];
    const recommendations = [];
    const parsedHeaders = {
        receivedChain: []
    };
    const lines = headers.split(/\r?\n/);
    let currentHeader = "";
    let currentValue = "";
    const headerMap = {};
    // Common header names to detect even with leading whitespace
    const knownHeaders = /^(from|to|reply-to|return-path|received|subject|date|message-id|x-mailer|x-originating-ip|authentication-results|content-type|mime-version|dkim-signature|arc-authentication-results):/i;
    // Parse headers (handling line continuations but also recognizing headers with accidental indentation)
    for (const line of lines){
        const trimmedLine = line.trim();
        // Check if this line looks like a new header (even if indented)
        const looksLikeNewHeader = knownHeaders.test(trimmedLine) || /^[a-zA-Z][a-zA-Z0-9-]*:/.test(trimmedLine);
        if (/^\s/.test(line) && currentHeader && !looksLikeNewHeader) {
            // True continuation - starts with space and doesn't look like a header
            currentValue += " " + trimmedLine;
        } else {
            // Save current header
            if (currentHeader) {
                const key = currentHeader.toLowerCase();
                if (key === "received") {
                    parsedHeaders.receivedChain.push(currentValue);
                } else {
                    headerMap[key] = currentValue;
                }
            }
            // Start new header
            const colonIndex = trimmedLine.indexOf(":");
            if (colonIndex > 0) {
                currentHeader = trimmedLine.substring(0, colonIndex).trim();
                currentValue = trimmedLine.substring(colonIndex + 1).trim();
            }
        }
    }
    // Don't forget the last header
    if (currentHeader) {
        const key = currentHeader.toLowerCase();
        if (key === "received") {
            parsedHeaders.receivedChain.push(currentValue);
        } else {
            headerMap[key] = currentValue;
        }
    }
    // Extract key headers
    parsedHeaders.from = headerMap["from"];
    parsedHeaders.replyTo = headerMap["reply-to"];
    parsedHeaders.returnPath = headerMap["return-path"];
    parsedHeaders.xMailer = headerMap["x-mailer"];
    parsedHeaders.xOriginatingIP = headerMap["x-originating-ip"];
    parsedHeaders.contentType = headerMap["content-type"];
    parsedHeaders.mimeVersion = headerMap["mime-version"];
    // Check authentication results
    const authResults = headerMap["authentication-results"] || "";
    // SPF Check
    if (/spf=pass/i.test(authResults)) {
        parsedHeaders.spf = "pass";
        findings.push({
            category: "SPF (Sender Policy Framework)",
            status: "pass",
            detail: "SPF verification passed",
            explanation: "The sending server is authorized to send emails for this domain."
        });
    } else if (/spf=fail/i.test(authResults) || /spf=softfail/i.test(authResults)) {
        parsedHeaders.spf = "fail";
        findings.push({
            category: "SPF (Sender Policy Framework)",
            status: "fail",
            detail: "SPF verification failed",
            explanation: "The sending server may not be authorized to send emails for this domain. This is a major red flag."
        });
        recommendations.push("Be very cautious. SPF failure means the sender may be spoofing their email address.");
    } else if (/spf=/i.test(authResults)) {
        parsedHeaders.spf = "neutral";
        findings.push({
            category: "SPF (Sender Policy Framework)",
            status: "warning",
            detail: "SPF result is neutral or unknown",
            explanation: "The domain's SPF record doesn't clearly authorize or reject this server."
        });
    }
    // DKIM Check
    if (/dkim=pass/i.test(authResults)) {
        parsedHeaders.dkim = "pass";
        findings.push({
            category: "DKIM (Domain Keys)",
            status: "pass",
            detail: "DKIM signature verified",
            explanation: "The email's cryptographic signature is valid, confirming it hasn't been altered."
        });
    } else if (/dkim=fail/i.test(authResults)) {
        parsedHeaders.dkim = "fail";
        findings.push({
            category: "DKIM (Domain Keys)",
            status: "fail",
            detail: "DKIM verification failed",
            explanation: "The email's signature is invalid. The message may have been altered or forged."
        });
        recommendations.push("DKIM failure suggests the email may have been tampered with or is fraudulent.");
    }
    // DMARC Check
    if (/dmarc=pass/i.test(authResults)) {
        parsedHeaders.dmarc = "pass";
        findings.push({
            category: "DMARC Policy",
            status: "pass",
            detail: "DMARC policy passed",
            explanation: "The email passes the domain's anti-spoofing policy."
        });
    } else if (/dmarc=fail/i.test(authResults)) {
        parsedHeaders.dmarc = "fail";
        findings.push({
            category: "DMARC Policy",
            status: "fail",
            detail: "DMARC policy failed",
            explanation: "The email violates the domain's anti-spoofing policy. Likely fraudulent."
        });
        recommendations.push("DMARC failure is a strong indicator of email spoofing.");
    }
    // Check From vs Reply-To mismatch
    if (parsedHeaders.from && parsedHeaders.replyTo) {
        const fromDomain = parsedHeaders.from.match(/@([a-zA-Z0-9.-]+)/)?.[1]?.toLowerCase();
        const replyToDomain = parsedHeaders.replyTo.match(/@([a-zA-Z0-9.-]+)/)?.[1]?.toLowerCase();
        if (fromDomain && replyToDomain && fromDomain !== replyToDomain) {
            findings.push({
                category: "Reply-To Mismatch",
                status: "warning",
                detail: `From domain (${fromDomain}) differs from Reply-To (${replyToDomain})`,
                explanation: "Scammers often set a different reply-to address to capture your responses while impersonating someone else."
            });
            recommendations.push("Be cautious when the reply address differs from the sender address.");
        }
    }
    // Check Return-Path vs From mismatch
    if (parsedHeaders.from && parsedHeaders.returnPath) {
        const fromDomain = parsedHeaders.from.match(/@([a-zA-Z0-9.-]+)/)?.[1]?.toLowerCase();
        const returnPathDomain = parsedHeaders.returnPath.match(/@([a-zA-Z0-9.-]+)/)?.[1]?.toLowerCase();
        if (fromDomain && returnPathDomain && fromDomain !== returnPathDomain) {
            findings.push({
                category: "Return-Path Mismatch",
                status: "warning",
                detail: `From domain differs from Return-Path`,
                explanation: "The bounce address differs from the displayed sender. Could indicate a forwarded or spoofed email."
            });
        }
    }
    // Check received chain for suspicious patterns
    const receivedChain = parsedHeaders.receivedChain;
    if (receivedChain.length > 0) {
        findings.push({
            category: "Email Path",
            status: "info",
            detail: `Email passed through ${receivedChain.length} server(s)`,
            explanation: "This shows the route the email took to reach you."
        });
        // Check for suspicious countries or services in path
        const suspiciousPatterns = [
            {
                pattern: /\b(tor|onion|vpn|proxy)\b/i,
                reason: "anonymizing service"
            },
            {
                pattern: /\b(tempmail|guerrilla|mailinator|10minute|throwaway)\b/i,
                reason: "disposable email service"
            }
        ];
        for (const received of receivedChain){
            for (const { pattern, reason } of suspiciousPatterns){
                if (pattern.test(received)) {
                    findings.push({
                        category: "Suspicious Relay",
                        status: "warning",
                        detail: `Possible ${reason} in email path`,
                        explanation: "The email passed through infrastructure commonly used to hide identity."
                    });
                    break;
                }
            }
        }
    }
    // Check X-Mailer for suspicious clients
    if (parsedHeaders.xMailer) {
        const suspiciousMailers = [
            /^PHPMailer/i,
            /swiftmailer/i,
            /mass\s?mail/i,
            /bulk\s?mail/i
        ];
        for (const pattern of suspiciousMailers){
            if (pattern.test(parsedHeaders.xMailer)) {
                findings.push({
                    category: "Bulk Mailer Detected",
                    status: "warning",
                    detail: `Email client: ${parsedHeaders.xMailer}`,
                    explanation: "This email appears to be sent via a bulk mailing system, common with marketing or spam."
                });
                break;
            }
        }
    }
    // Check for missing critical headers
    if (!parsedHeaders.from) {
        findings.push({
            category: "Missing From Header",
            status: "fail",
            detail: "No From header found",
            explanation: "A legitimate email should always have a From header."
        });
    }
    // Calculate overall risk
    const failCount = findings.filter((f)=>f.status === "fail").length;
    const warnCount = findings.filter((f)=>f.status === "warning").length;
    let overallRisk = "safe";
    if (failCount >= 2) overallRisk = "critical";
    else if (failCount >= 1) overallRisk = "high";
    else if (warnCount >= 2) overallRisk = "medium";
    else if (warnCount >= 1) overallRisk = "low";
    // Add general recommendations
    if (findings.length === 0) {
        findings.push({
            category: "No Authentication Headers",
            status: "info",
            detail: "No SPF/DKIM/DMARC results found",
            explanation: "Email authentication headers may be missing or the headers provided are incomplete."
        });
        recommendations.push("If possible, view the full email headers to get complete authentication results.");
    }
    return {
        overallRisk,
        findings,
        recommendations,
        parsedHeaders
    };
}
function analyzeUrl(url) {
    const reasons = [];
    let isSuspicious = false;
    // Check if it's a known legitimate domain first
    let isLegit = false;
    for (const legit of legitDomains){
        if (legit.test(url)) {
            isLegit = true;
            break;
        }
    }
    // Skip all suspicious checks for known legitimate domains
    if (isLegit) {
        return {
            url,
            isSuspicious: false,
            reasons: []
        };
    }
    // Check for suspicious patterns
    for (const { pattern, reason } of suspiciousUrlPatterns){
        if (pattern.test(url)) {
            reasons.push(reason);
            isSuspicious = true;
        }
    }
    // Check for typosquatting
    const typosquat = detectTyposquatting(url);
    if (typosquat) {
        reasons.push(`Fake ${typosquat.brand} website. The address is slightly misspelled to trick you`);
        isSuspicious = true;
    }
    // Check for homograph attacks
    const homoglyphs = detectHomoglyphs(url);
    if (homoglyphs.found) {
        reasons.push(`Uses deceptive characters that look real but aren't, designed to fool you`);
        isSuspicious = true;
    }
    // Check URL entropy (randomness)
    const entropyResult = analyzeUrlEntropy(url);
    if (entropyResult.isHigh) {
        reasons.push(entropyResult.reason);
        isSuspicious = true;
    }
    // Check subdomain depth
    const subdomainResult = analyzeSubdomainDepth(url);
    if (subdomainResult.isDeep) {
        reasons.push(subdomainResult.reason);
        isSuspicious = true;
    }
    // Check for Base64 encoded payloads
    const base64Result = detectBase64Payload(url);
    if (base64Result.found) {
        reasons.push(base64Result.reason);
        isSuspicious = true;
    }
    // Check for Punycode domains
    const punycodeResult = detectPunycode(url);
    if (punycodeResult.found) {
        reasons.push(punycodeResult.reason);
        isSuspicious = true;
    }
    // Check brand similarity (Levenshtein distance)
    const brandSimilarity = detectBrandSimilarity(url);
    if (brandSimilarity.found) {
        reasons.push(brandSimilarity.reason);
        isSuspicious = true;
    }
    // Override suspicious flag if it's a known legitimate domain
    if (isLegit && reasons.length === 0) {
        isSuspicious = false;
    }
    return {
        url,
        isSuspicious,
        reasons
    };
}
const deepfakePatterns = [
    {
        pattern: /(?:boss|ceo|manager|supervisor|director).*(?:called|phoned|video)/i,
        label: "Authority figure impersonation call"
    },
    {
        pattern: /(?:grandma|grandpa|grandchild|grandson|granddaughter|family member).*(?:called|said|told|begged)/i,
        label: "Family emergency voice scam"
    },
    {
        pattern: /(?:voice|video|face).*(?:sounded? (?:just )?like|looked? (?:just )?like|identical)/i,
        label: "Identity mimicry description"
    },
    {
        pattern: /(?:ai|artificial|deep\s?fake|cloned?).*(?:voice|video|call|face)/i,
        label: "AI-generated media reference"
    },
    {
        pattern: /(?:wire|transfer|send|zelle|venmo|cashapp).*(?:immediately|right now|urgent|asap)/i,
        label: "Urgent money transfer request"
    },
    {
        pattern: /(?:don't tell|keep.*secret|between us|don't mention)/i,
        label: "Secrecy demand"
    },
    {
        pattern: /(?:kidnapped|arrested|hospital|accident|jail|emergency).*(?:need money|wire|transfer|bail)/i,
        label: "Emergency money extraction"
    },
    {
        pattern: /(?:verify|confirm).*(?:it's really me|my voice|identity)/i,
        label: "False identity verification"
    }
];
const smsShortCodeDb = {
    "722733": "T-Mobile",
    "73304": "AT&T",
    "611611": "T-Mobile",
    "22395": "USPS",
    "28818": "FedEx",
    "32665": "Facebook",
    "89203": "Google",
    "40404": "Twitter/X",
    "47272": "Apple",
    "78156": "Chase Bank",
    "56278": "Bank of America",
    "97781": "Citibank",
    "20575": "Wells Fargo",
    "95577": "Walmart",
    "234567": "Amazon",
    "277365": "Amazon",
    "72788": "Costco"
};
const smsScamPatterns = [
    {
        pattern: /(?:toll|parking|ez\s?pass).*(?:unpaid|overdue|balance)/i,
        label: "Toll/parking fee scam"
    },
    {
        pattern: /(?:package|parcel|shipment).*(?:could not be delivered|delivery failed|reschedule)/i,
        label: "Delivery notification scam"
    },
    {
        pattern: /(?:irs|tax|refund).*(?:claim|pending|verify)/i,
        label: "Tax/IRS impersonation"
    },
    {
        pattern: /(?:account|card).*(?:suspended|locked|unusual activity|verify)/i,
        label: "Account suspension scam"
    },
    {
        pattern: /(?:won|winner|prize|lottery|selected|congratulations).*(?:claim|click|visit|redeem)/i,
        label: "Prize/lottery scam"
    },
    {
        pattern: /(?:bit\.ly|tinyurl|t\.co|goo\.gl|short\.io|is\.gd|rebrand\.ly)\/\w+/i,
        label: "Shortened URL in SMS"
    },
    {
        pattern: /txt\s*(?:stop|help|cancel)\s*to\s*\d+/i,
        label: "Legitimate opt-out language"
    }
];
function analyzeContent(content) {
    if (!content.trim()) {
        return {
            overallRisk: "safe",
            confidenceScore: 0,
            title: "",
            summary: "",
            threats: [],
            urls: [],
            recommendations: [],
            educationalTips: []
        };
    }
    const threats = [];
    const severityScores = {
        low: 1,
        medium: 2,
        high: 3,
        critical: 4
    };
    for (const pattern of threatPatterns){
        if (pattern.pattern.test(content)) {
            threats.push({
                category: pattern.category,
                indicator: pattern.indicator,
                severity: pattern.severity,
                explanation: pattern.explanation
            });
        }
    }
    // Check for organization impersonation (government, healthcare, utilities)
    for (const { pattern, category, indicator, severity } of organizationImpersonationPatterns){
        if (pattern.test(content)) {
            threats.push({
                category,
                indicator,
                severity,
                explanation: `This message appears to impersonate a ${category.toLowerCase().replace(' impersonation', '')}. ${category.includes('IRS') ? 'The IRS never initiates contact via email or text for tax matters.' : category.includes('SSA') ? 'Social Security never threatens to suspend your benefits via email/text.' : category.includes('Medicare') ? 'Medicare will never call/text asking for your Medicare number.' : category.includes('Utility') ? 'Utility companies provide proper notice before service disconnection.' : category.includes('FBI') || category.includes('Law Enforcement') ? 'Law enforcement does not contact people via email/text for arrest warrants.' : category.includes('Tech Support') ? 'Tech companies never proactively contact users about security issues.' : 'Verify by contacting the organization directly through official channels.'}`
            });
        }
    }
    const urls = extractUrls(content);
    const urlAnalyses = urls.map(analyzeUrl);
    const suspiciousUrls = urlAnalyses.filter((u)=>u.isSuspicious);
    if (suspiciousUrls.length > 0) {
        threats.push({
            category: "Suspicious URLs",
            indicator: `${suspiciousUrls.length} suspicious URL(s) detected`,
            severity: "high",
            explanation: "The message contains links that may lead to malicious websites. Never click links in suspicious messages."
        });
    }
    // Check for cryptocurrency addresses
    const cryptoAddresses = detectCryptoAddresses(content);
    if (cryptoAddresses.length > 0) {
        threats.push({
            category: "Cryptocurrency Request",
            indicator: `${cryptoAddresses.length} cryptocurrency address(es) found: ${cryptoAddresses.map((c)=>c.type).join(', ')}`,
            severity: "critical",
            explanation: "Cryptocurrency addresses in unsolicited messages are a major red flag. Legitimate businesses rarely request crypto payments, and these transactions cannot be reversed."
        });
    }
    // Check for phone numbers
    const phoneNumbers = extractPhoneNumbers(content);
    if (phoneNumbers.length > 0) {
        threats.push({
            category: "Phone Number Detected",
            indicator: `${phoneNumbers.length} phone number(s) found`,
            severity: "medium",
            explanation: "Phone numbers in suspicious messages may connect you to scam call centers. Never call numbers provided in unsolicited messages. Verify numbers through official websites."
        });
    }
    // Check for grammar red flags
    for (const { pattern, issue } of grammarRedFlags){
        if (pattern.test(content)) {
            threats.push({
                category: "Writing Style Red Flag",
                indicator: issue,
                severity: "low",
                explanation: "This writing pattern is commonly seen in scam messages. Professional organizations typically use proper grammar and personalized greetings."
            });
            break; // Only add one grammar warning
        }
    }
    // Check for homograph attacks in the full content
    const contentHomoglyphs = detectHomoglyphs(content);
    if (contentHomoglyphs.found) {
        threats.push({
            category: "Homograph Attack",
            indicator: `Deceptive characters detected: ${contentHomoglyphs.examples.join(', ')}`,
            severity: "high",
            explanation: "This message contains characters designed to look like normal letters but are actually different. Scammers use this trick to create fake website addresses."
        });
    }
    // Calculate risk score
    let totalScore = threats.reduce((sum, t)=>sum + severityScores[t.severity], 0);
    totalScore += suspiciousUrls.length * 2;
    totalScore += cryptoAddresses.length * 3;
    // Determine overall risk
    let overallRisk;
    let confidenceScore;
    let title;
    let summary;
    if (totalScore === 0) {
        overallRisk = "safe";
        confidenceScore = 75;
        title = "Verified Safe";
        summary = "Our scan checked for known scam patterns, suspicious links, and deceptive tactics, and none were found. As always, verify unexpected messages through official channels.";
    } else if (totalScore <= 2) {
        overallRisk = "low";
        confidenceScore = 60;
        title = "Low Risk";
        summary = "We found a couple of minor items worth noting, but nothing that indicates a scam. If anything feels off, verify through the official source.";
    } else if (totalScore <= 5) {
        overallRisk = "medium";
        confidenceScore = 70;
        title = "Caution Advised";
        summary = "Our analysis found several warning signs. Don't click links or share personal information until you've confirmed this is legitimate through official channels.";
    } else if (totalScore <= 10) {
        overallRisk = "high";
        confidenceScore = 85;
        title = "High Risk Detected";
        summary = "This content contains multiple red flags commonly found in scams. We strongly recommend you do not engage with this message or click any links.";
    } else {
        overallRisk = "critical";
        confidenceScore = 95;
        title = "Confirmed Threat";
        summary = "This matches known scam patterns in our database. Do not reply, click any links, or enter any information. Delete it immediately.";
    }
    // Generate recommendations based on threats
    const recommendations = [];
    const categories = new Set(threats.map((t)=>t.category));
    if (categories.has("Credential Phishing") || categories.has("Account Compromise Scam")) {
        recommendations.push("Never enter login credentials through email links. Navigate directly to the official website.");
    }
    if (categories.has("Financial Fraud") || categories.has("Advance Fee Fraud")) {
        recommendations.push("Never send money via wire transfer, gift cards, or cryptocurrency to someone you haven't met in person.");
    }
    if (categories.has("Tech Support Scam") || categories.has("Government Impersonation")) {
        recommendations.push("Contact the organization directly using the phone number on their official website, not numbers provided in the message.");
    }
    if (suspiciousUrls.length > 0) {
        recommendations.push("Do not click any links in this message. If you need to visit a website, type the address directly in your browser.");
    }
    if (recommendations.length === 0) {
        recommendations.push("When in doubt, verify through official channels before taking any action.");
    }
    recommendations.push("Report this to the FTC at reportfraud.ftc.gov if you believe it's a scam.");
    // Educational tips
    const educationalTips = [
        "Legitimate organizations never ask for passwords or SSN via email or text",
        "If an offer seems too good to be true, it almost certainly is",
        "Scammers create urgency to prevent you from thinking critically",
        "Always verify requests for money or information through a separate, trusted channel"
    ];
    // Calculate urgency/manipulation score
    const urgencyAnalysis = calculateUrgencyScore(content);
    // Add urgency as a threat if significant
    if (urgencyAnalysis.score >= 30) {
        threats.push({
            category: "Manipulation Tactics",
            indicator: `${urgencyAnalysis.level} pressure level detected (Score: ${urgencyAnalysis.score}/100)`,
            severity: urgencyAnalysis.score >= 70 ? "critical" : urgencyAnalysis.score >= 50 ? "high" : "medium",
            explanation: `This message uses ${urgencyAnalysis.triggers.slice(0, 3).join(', ').toLowerCase()} to pressure you into quick action. Take your time to verify independently.`
        });
    }
    return {
        overallRisk,
        confidenceScore,
        title,
        summary,
        threats,
        urls: urlAnalyses,
        recommendations,
        educationalTips,
        urgencyAnalysis
    };
}
function detectEmailHeaders(content) {
    const headerPatterns = [
        /^Received:/m,
        /^From:/m,
        /^Reply-To:/m,
        /^Return-Path:/m,
        /^Authentication-Results:/m,
        /^DKIM-Signature:/m,
        /^X-Mailer:/m,
        /^X-Originating-IP:/m,
        /^Content-Type:/m,
        /^MIME-Version:/m,
        /^Message-ID:/m,
        /^Date:/m,
        /^Subject:/m,
        /^To:/m
    ];
    let matchCount = 0;
    for (const p of headerPatterns){
        if (p.test(content)) matchCount++;
        if (matchCount >= 2) return true;
    }
    return false;
}
function getAIRiskColor(level) {
    switch(level){
        case "Low":
            return "text-green-600 dark:text-green-400";
        case "Moderate":
            return "text-amber-600 dark:text-amber-400";
        case "High":
            return "text-orange-600 dark:text-orange-400";
        case "Critical":
            return "text-red-600 dark:text-red-400";
        default:
            return "text-muted-foreground";
    }
}
function getAIRiskBg(level) {
    switch(level){
        case "Low":
            return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
        case "Moderate":
            return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
        case "High":
            return "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
        case "Critical":
            return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
        default:
            return "bg-muted";
    }
}
function getAIRiskIcon(level) {
    switch(level){
        case "Low":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                className: "w-6 h-6 text-green-600 dark:text-green-400"
            }, void 0, false, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 1818,
                columnNumber: 24
            }, this);
        case "Moderate":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                className: "w-6 h-6 text-amber-600 dark:text-amber-400"
            }, void 0, false, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 1819,
                columnNumber: 29
            }, this);
        case "High":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                className: "w-6 h-6 text-orange-600 dark:text-orange-400"
            }, void 0, false, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 1820,
                columnNumber: 25
            }, this);
        case "Critical":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                className: "w-6 h-6 text-red-600 dark:text-red-400"
            }, void 0, false, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 1821,
                columnNumber: 29
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                className: "w-6 h-6 text-muted-foreground"
            }, void 0, false, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 1822,
                columnNumber: 21
            }, this);
    }
}
function getFriendlyRiskTitle(level) {
    switch(level){
        case "Critical":
            return "Confirmed Threat";
        case "High":
            return "High Risk Detected";
        case "Moderate":
            return "Caution Advised";
        case "Low":
            return "Low Risk";
        default:
            return "Caution Advised";
    }
}
function getFriendlyVerdict(level) {
    switch(level){
        case "Critical":
            return "Our scan identified this as a known scam. Do not interact with it.";
        case "High":
            return "This shows strong indicators of a scam. We recommend you avoid it entirely.";
        case "Moderate":
            return "We found some warning signs. Verify through official channels before you trust it.";
        case "Low":
            return "Nothing alarming detected. This appears legitimate.";
        default:
            return "Verify through official channels before taking action.";
    }
}
function getFriendlyWarningsLabel(level) {
    switch(level){
        case "Critical":
            return "What Our Scan Found";
        case "High":
            return "Red Flags Detected";
        case "Moderate":
            return "Warning Signs";
        case "Low":
            return "Minor Notes";
        default:
            return "What We Found";
    }
}
function getFriendlyFlagIcon(level) {
    switch(level){
        case "Critical":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                className: "w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
            }, void 0, false, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 1858,
                columnNumber: 29
            }, this);
        case "High":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                className: "w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5"
            }, void 0, false, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 1859,
                columnNumber: 25
            }, this);
        case "Moderate":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                className: "w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
            }, void 0, false, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 1860,
                columnNumber: 29
            }, this);
        case "Low":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                className: "w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
            }, void 0, false, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 1861,
                columnNumber: 24
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                className: "w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
            }, void 0, false, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 1862,
                columnNumber: 21
            }, this);
    }
}
function getFriendlyContentType(type) {
    const map = {
        "URL": "Website Link",
        "email": "Email Message",
        "phone": "Phone Number",
        "sms": "Text Message",
        "message": "Message",
        "text": "Text Content"
    };
    const first = type.split(" ")[0];
    return map[first] || type;
}
function ScamChecker() {
    _s();
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ScamChecker.useState": ()=>{
            try {
                const stored = sessionStorage.getItem("gcr_scam_input");
                if (stored) {
                    sessionStorage.removeItem("gcr_scam_input");
                    return stored;
                }
            } catch  {}
            return "";
        }
    }["ScamChecker.useState"]);
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isChecking, setIsChecking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [headerResult, setHeaderResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [aiResult, setAiResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAiAnalyzing, setIsAiAnalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [aiError, setAiError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [urlReputations, setUrlReputations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [isCheckingReputation, setIsCheckingReputation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [sslResults, setSslResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [isCheckingSSL, setIsCheckingSSL] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const autoScanRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const scanTokenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const aiAbortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const qrInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const imageInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isProcessingQR, setIsProcessingQR] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isProcessingImage, setIsProcessingImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHistory, setShowHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copiedShareLink, setCopiedShareLink] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shareId, setShareId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [deepfakeWarnings, setDeepfakeWarnings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [smsAnalysis, setSmsAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showContextQuestions, setShowContextQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contextAnswers, setContextAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        didInitiate: null,
        hasAccount: null,
        expectingEmail: null,
        madeRecentPurchase: null,
        recognizeSender: null
    });
    const [contextResult, setContextResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isContextScanning, setIsContextScanning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showTimeline, setShowTimeline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const scanHistoryQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "/api/scan-history"
        ],
        enabled: !!user && showHistory
    });
    const communityReportsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "/api/community-reports",
            "confirmed"
        ],
        queryFn: {
            "ScamChecker.useQuery[communityReportsQuery]": ()=>fetch("/api/community-reports?status=confirmed&limit=5").then({
                    "ScamChecker.useQuery[communityReportsQuery]": (r)=>r.json()
                }["ScamChecker.useQuery[communityReportsQuery]"])
        }["ScamChecker.useQuery[communityReportsQuery]"]
    });
    const saveScanHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "ScamChecker.useMutation[saveScanHistory]": (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$queryClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("POST", "/api/scan-history", data)
        }["ScamChecker.useMutation[saveScanHistory]"],
        onSuccess: {
            "ScamChecker.useMutation[saveScanHistory]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$queryClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryClient"].invalidateQueries({
                    queryKey: [
                        "/api/scan-history"
                    ]
                })
        }["ScamChecker.useMutation[saveScanHistory]"]
    });
    const createShareReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "ScamChecker.useMutation[createShareReport]": (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$queryClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("POST", "/api/scan-reports", data)
        }["ScamChecker.useMutation[createShareReport]"],
        onSuccess: {
            "ScamChecker.useMutation[createShareReport]": async (response)=>{
                const data = await response.json();
                setShareId(data.shareId);
            }
        }["ScamChecker.useMutation[createShareReport]"]
    });
    const submitCommunityReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "ScamChecker.useMutation[submitCommunityReport]": (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$queryClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("POST", "/api/community-reports", data)
        }["ScamChecker.useMutation[submitCommunityReport]"],
        onSuccess: {
            "ScamChecker.useMutation[submitCommunityReport]": ()=>{
                toast({
                    title: "Report submitted",
                    description: "Thank you for helping keep the community safe!"
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$queryClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryClient"].invalidateQueries({
                    queryKey: [
                        "/api/community-reports"
                    ]
                });
            }
        }["ScamChecker.useMutation[submitCommunityReport]"]
    });
    const voteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "ScamChecker.useMutation[voteMutation]": (id)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$queryClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("POST", `/api/community-reports/${id}/vote`)
        }["ScamChecker.useMutation[voteMutation]"],
        onSuccess: {
            "ScamChecker.useMutation[voteMutation]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$queryClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryClient"].invalidateQueries({
                    queryKey: [
                        "/api/community-reports"
                    ]
                })
        }["ScamChecker.useMutation[voteMutation]"]
    });
    const threatTimelineQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "/api/security/threat-timeline"
        ],
        enabled: !!user && showTimeline,
        queryFn: {
            "ScamChecker.useQuery[threatTimelineQuery]": ()=>fetch("/api/security/threat-timeline").then({
                    "ScamChecker.useQuery[threatTimelineQuery]": (r)=>r.json()
                }["ScamChecker.useQuery[threatTimelineQuery]"])
        }["ScamChecker.useQuery[threatTimelineQuery]"]
    });
    const handleQRUpload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScamChecker.useCallback[handleQRUpload]": async (e)=>{
            const file = e.target.files?.[0];
            if (!file) return;
            setIsProcessingQR(true);
            try {
                const jsQR = (await __turbopack_context__.A("[project]/node_modules/jsqr/dist/jsQR.js [app-client] (ecmascript, async loader)")).default;
                const img = new Image();
                const url = URL.createObjectURL(file);
                img.onload = ({
                    "ScamChecker.useCallback[handleQRUpload]": ()=>{
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        URL.revokeObjectURL(url);
                        if (code) {
                            setContent(code.data);
                            toast({
                                title: "QR Code decoded",
                                description: "Content extracted. Click 'Scan for Threats' to analyze."
                            });
                        } else {
                            toast({
                                title: "No QR code found",
                                description: "Could not detect a QR code in the image.",
                                variant: "destructive"
                            });
                        }
                        setIsProcessingQR(false);
                    }
                })["ScamChecker.useCallback[handleQRUpload]"];
                img.onerror = ({
                    "ScamChecker.useCallback[handleQRUpload]": ()=>{
                        URL.revokeObjectURL(url);
                        toast({
                            title: "Error",
                            description: "Could not read the image file.",
                            variant: "destructive"
                        });
                        setIsProcessingQR(false);
                    }
                })["ScamChecker.useCallback[handleQRUpload]"];
                img.src = url;
            } catch  {
                toast({
                    title: "Error",
                    description: "Failed to process QR code.",
                    variant: "destructive"
                });
                setIsProcessingQR(false);
            }
            if (qrInputRef.current) qrInputRef.current.value = "";
        }
    }["ScamChecker.useCallback[handleQRUpload]"], [
        toast
    ]);
    const handleImageUpload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScamChecker.useCallback[handleImageUpload]": async (e)=>{
            const file = e.target.files?.[0];
            if (!file) return;
            setIsProcessingImage(true);
            try {
                const reader = new FileReader();
                reader.onload = ({
                    "ScamChecker.useCallback[handleImageUpload]": async ()=>{
                        try {
                            const response = await fetch("/api/security/analyze-image", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    imageData: reader.result
                                })
                            });
                            if (!response.ok) throw new Error("Failed to analyze image");
                            const data = await response.json();
                            if (data.text) {
                                setContent(data.text);
                                toast({
                                    title: "Text extracted",
                                    description: "Content extracted from image. Click 'Scan for Threats' to analyze."
                                });
                            } else {
                                toast({
                                    title: "No text found",
                                    description: "Could not find readable text in the image.",
                                    variant: "destructive"
                                });
                            }
                        } catch  {
                            toast({
                                title: "Error",
                                description: "Failed to analyze the image.",
                                variant: "destructive"
                            });
                        }
                        setIsProcessingImage(false);
                    }
                })["ScamChecker.useCallback[handleImageUpload]"];
                reader.readAsDataURL(file);
            } catch  {
                toast({
                    title: "Error",
                    description: "Failed to read the image file.",
                    variant: "destructive"
                });
                setIsProcessingImage(false);
            }
            if (imageInputRef.current) imageInputRef.current.value = "";
        }
    }["ScamChecker.useCallback[handleImageUpload]"], [
        toast
    ]);
    const handleShareReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScamChecker.useCallback[handleShareReport]": ()=>{
            if (!result) return;
            createShareReport.mutate({
                contentSnippet: content.substring(0, 200),
                contentType: "text",
                riskLevel: result.overallRisk,
                riskScore: result.confidenceScore,
                resultSummary: result.summary,
                flagsFound: result.threats.length,
                flagDetails: JSON.stringify(result.threats.slice(0, 5).map({
                    "ScamChecker.useCallback[handleShareReport]": (t)=>t.category
                }["ScamChecker.useCallback[handleShareReport]"])),
                aiAnalysis: aiResult ? JSON.stringify({
                    riskLevel: aiResult.scamRiskLevel,
                    keyFindings: aiResult.keyRedFlags?.slice(0, 3)
                }) : null
            });
        }
    }["ScamChecker.useCallback[handleShareReport]"], [
        result,
        content,
        aiResult,
        createShareReport
    ]);
    const handleCopyShareLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScamChecker.useCallback[handleCopyShareLink]": ()=>{
            if (!shareId) return;
            const link = `${window.location.origin}/report/${shareId}`;
            navigator.clipboard.writeText(link);
            setCopiedShareLink(true);
            setTimeout({
                "ScamChecker.useCallback[handleCopyShareLink]": ()=>setCopiedShareLink(false)
            }["ScamChecker.useCallback[handleCopyShareLink]"], 2000);
        }
    }["ScamChecker.useCallback[handleCopyShareLink]"], [
        shareId
    ]);
    const analyzeDeepfakePatterns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScamChecker.useCallback[analyzeDeepfakePatterns]": (text)=>{
            const warnings = [];
            for (const dp of deepfakePatterns){
                if (dp.pattern.test(text)) {
                    warnings.push(dp.label);
                }
            }
            setDeepfakeWarnings(warnings);
        }
    }["ScamChecker.useCallback[analyzeDeepfakePatterns]"], []);
    const analyzeSmsContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScamChecker.useCallback[analyzeSmsContent]": (text)=>{
            const shortCodeMatch = text.match(/(?:from|sender|sent by)[:\s]*(\d{4,6})/i);
            const patterns = [];
            let isLegitOptOut = false;
            for (const sp of smsScamPatterns){
                if (sp.pattern.test(text)) {
                    if (sp.label === "Legitimate opt-out language") {
                        isLegitOptOut = true;
                    } else {
                        patterns.push(sp.label);
                    }
                }
            }
            if (shortCodeMatch || patterns.length > 0) {
                const code = shortCodeMatch?.[1];
                setSmsAnalysis({
                    shortCode: code,
                    service: code ? smsShortCodeDb[code] : undefined,
                    patterns,
                    isLegitOptOut
                });
            } else {
                setSmsAnalysis(null);
            }
        }
    }["ScamChecker.useCallback[analyzeSmsContent]"], []);
    const handleScan = ()=>{
        if (!content.trim()) return;
        if (aiAbortRef.current) {
            aiAbortRef.current.abort();
        }
        const currentToken = ++scanTokenRef.current;
        const abortController = new AbortController();
        aiAbortRef.current = abortController;
        setIsChecking(true);
        setResult(null);
        setHeaderResult(null);
        setAiResult(null);
        setAiError(null);
        setUrlReputations({});
        setSslResults({});
        setShareId(null);
        setDeepfakeWarnings([]);
        setSmsAnalysis(null);
        analyzeDeepfakePatterns(content);
        analyzeSmsContent(content);
        setTimeout(()=>{
            if (scanTokenRef.current !== currentToken) return;
            const patternResult = analyzeContent(content);
            setResult(patternResult);
            setIsChecking(false);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackToolUsage"])('scam-checker', true, {
                type: 'content-analysis'
            });
            if (user) {
                saveScanHistory.mutate({
                    userId: user.id,
                    contentSnippet: content.substring(0, 200),
                    contentType: "text",
                    riskLevel: patternResult.overallRisk,
                    riskScore: patternResult.confidenceScore,
                    resultSummary: patternResult.summary,
                    flagsFound: patternResult.threats.length
                });
            }
        }, 1200);
        if (detectEmailHeaders(content)) {
            setTimeout(()=>{
                if (scanTokenRef.current !== currentToken) return;
                setHeaderResult(analyzeEmailHeaders(content));
            }, 800);
        }
        setIsAiAnalyzing(true);
        fetch("/api/security/ai-scam-analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content,
                contentType: "auto"
            }),
            signal: abortController.signal
        }).then(async (response)=>{
            if (scanTokenRef.current !== currentToken) return;
            if (!response.ok) {
                throw new Error("AI analysis failed");
            }
            const data = await response.json();
            if (data.success && data.result) {
                setAiResult(data.result);
            } else {
                throw new Error("AI analysis returned no results");
            }
        }).catch((err)=>{
            if (scanTokenRef.current !== currentToken) return;
            if (err.name === 'AbortError') return;
            setAiError("AI analysis is currently unavailable. Pattern-based results are shown above.");
        }).finally(()=>{
            if (scanTokenRef.current !== currentToken) return;
            setIsAiAnalyzing(false);
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScamChecker.useEffect": ()=>{
            if (content.trim() && !autoScanRef.current) {
                autoScanRef.current = true;
                const timer = setTimeout({
                    "ScamChecker.useEffect.timer": ()=>handleScan()
                }["ScamChecker.useEffect.timer"], 500);
                return ({
                    "ScamChecker.useEffect": ()=>clearTimeout(timer)
                })["ScamChecker.useEffect"];
            }
        }
    }["ScamChecker.useEffect"], []);
    const handleClear = ()=>{
        setContent("");
        setResult(null);
        setHeaderResult(null);
        setAiResult(null);
        setAiError(null);
        setIsChecking(false);
        setIsAiAnalyzing(false);
        setUrlReputations({});
        setSslResults({});
        setIsCheckingReputation({});
        setIsCheckingSSL({});
        setShareId(null);
        setDeepfakeWarnings([]);
        setSmsAnalysis(null);
        setShowContextQuestions(false);
        setContextAnswers({
            didInitiate: null,
            hasAccount: null,
            expectingEmail: null,
            madeRecentPurchase: null,
            recognizeSender: null
        });
        setContextResult(null);
        setIsContextScanning(false);
    };
    const handleContextScan = async ()=>{
        setIsContextScanning(true);
        try {
            const response = await fetch("/api/security/context-scan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content,
                    context: contextAnswers,
                    senderDomain: content.match(/@([\w.-]+)/)?.[1] || undefined
                })
            });
            if (!response.ok) throw new Error("Context scan failed");
            const data = await response.json();
            if (data.success) {
                setContextResult(data);
                setShowContextQuestions(false);
            }
        } catch (err) {
            toast({
                title: "Analysis error",
                description: "Could not complete context-aware analysis. Please try again.",
                variant: "destructive"
            });
        } finally{
            setIsContextScanning(false);
        }
    };
    const checkUrlReputation = async (url)=>{
        setIsCheckingReputation((prev)=>({
                ...prev,
                [url]: true
            }));
        try {
            const response = await fetch('/api/security/check-url-reputation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url
                })
            });
            if (!response.ok) throw new Error('Failed to check URL reputation');
            const data = await response.json();
            setUrlReputations((prev)=>({
                    ...prev,
                    [url]: data
                }));
        } catch  {
            setUrlReputations((prev)=>({
                    ...prev,
                    [url]: {
                        url,
                        threatLevel: 'unknown',
                        phishTank: {
                            checked: false,
                            isPhishing: null,
                            error: 'Service unavailable'
                        },
                        urlhaus: {
                            checked: false,
                            isMalware: null,
                            error: 'Service unavailable'
                        },
                        checkedAt: new Date().toISOString()
                    }
                }));
        } finally{
            setIsCheckingReputation((prev)=>({
                    ...prev,
                    [url]: false
                }));
        }
    };
    const checkSSL = async (url)=>{
        if (!url.startsWith('https://')) {
            setSslResults((prev)=>({
                    ...prev,
                    [url]: {
                        success: false,
                        url,
                        checked: true,
                        valid: false,
                        isExpired: false,
                        isEV: false,
                        isSelfSigned: false,
                        riskLevel: 'high',
                        error: 'Site does not use HTTPS'
                    }
                }));
            return;
        }
        setIsCheckingSSL((prev)=>({
                ...prev,
                [url]: true
            }));
        try {
            const response = await fetch('/api/security/check-ssl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url
                })
            });
            if (!response.ok) throw new Error('Failed to check SSL');
            const data = await response.json();
            setSslResults((prev)=>({
                    ...prev,
                    [url]: data
                }));
        } catch  {
            setSslResults((prev)=>({
                    ...prev,
                    [url]: {
                        success: false,
                        url,
                        checked: false,
                        valid: false,
                        isExpired: false,
                        isEV: false,
                        isSelfSigned: false,
                        riskLevel: 'high',
                        error: 'Check failed'
                    }
                }));
        } finally{
            setIsCheckingSSL((prev)=>({
                    ...prev,
                    [url]: false
                }));
        }
    };
    const checkAllUrlReputations = async (urls)=>{
        const urlsToCheck = urls.filter((u)=>!urlReputations[u.url] && !isCheckingReputation[u.url]);
        const sslToCheck = urls.filter((u)=>!sslResults[u.url] && !isCheckingSSL[u.url]);
        await Promise.all([
            ...urlsToCheck.map((u)=>checkUrlReputation(u.url)),
            ...sslToCheck.map((u)=>checkSSL(u.url))
        ]);
    };
    const getRiskColor = (risk)=>{
        switch(risk){
            case "safe":
                return "text-green-600 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
            case "low":
                return "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
            case "medium":
                return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
            case "high":
                return "text-orange-600 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
            case "critical":
                return "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
            default:
                return "";
        }
    };
    const getRiskIcon = (risk)=>{
        switch(risk){
            case "safe":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "w-8 h-8 text-green-500"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/scam-checker.tsx",
                    lineNumber: 2319,
                    columnNumber: 27
                }, this);
            case "low":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                    className: "w-8 h-8 text-blue-500"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/scam-checker.tsx",
                    lineNumber: 2320,
                    columnNumber: 26
                }, this);
            case "medium":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                    className: "w-8 h-8 text-yellow-500"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/scam-checker.tsx",
                    lineNumber: 2321,
                    columnNumber: 29
                }, this);
            case "high":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: "w-8 h-8 text-orange-500"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/scam-checker.tsx",
                    lineNumber: 2322,
                    columnNumber: 27
                }, this);
            case "critical":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                    className: "w-8 h-8 text-red-500"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/scam-checker.tsx",
                    lineNumber: 2323,
                    columnNumber: 31
                }, this);
            default:
                return null;
        }
    };
    const getSeverityColor = (severity)=>{
        switch(severity){
            case "low":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
            case "medium":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300";
            case "high":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300";
            case "critical":
                return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300";
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "w-full",
        "data-testid": "card-scam-checker",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                className: "pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "w-6 h-6 text-primary"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2343,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/components/scam-checker.tsx",
                            lineNumber: 2342,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-xl",
                                    children: "GCR Scam Guard"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 2346,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: "Paste anything suspicious and we'll analyze it instantly with pattern matching and AI"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 2347,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/scam-checker.tsx",
                            lineNumber: 2345,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/components/scam-checker.tsx",
                    lineNumber: 2341,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 2340,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                        placeholder: "Paste anything suspicious here: a text message, email, email headers, URL, or any combination.\n\nWe'll automatically detect the content type and analyze it for threats using pattern matching and AI.\n\nExamples:\n\u2022 'URGENT: Your bank account has been compromised! Click bit.ly/secure-now'\n\u2022 A full email with headers and body\n\u2022 https://amaz0n-security.com/verify-account",
                        value: content,
                        onChange: (e)=>setContent(e.target.value),
                        className: "min-h-[180px] resize-none text-sm",
                        "aria-label": "Enter suspicious content to analyze",
                        "data-testid": "input-scan-content"
                    }, void 0, false, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 2352,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 -mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: qrInputRef,
                                type: "file",
                                accept: "image/*",
                                className: "hidden",
                                onChange: handleQRUpload,
                                "data-testid": "input-qr-upload"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2362,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: imageInputRef,
                                type: "file",
                                accept: "image/*",
                                className: "hidden",
                                onChange: handleImageUpload,
                                "data-testid": "input-image-upload"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2363,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "gap-1.5 text-xs",
                                onClick: ()=>qrInputRef.current?.click(),
                                disabled: isProcessingQR,
                                "data-testid": "button-upload-qr",
                                children: [
                                    isProcessingQR ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-3.5 h-3.5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2372,
                                        columnNumber: 31
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__["QrCode"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2372,
                                        columnNumber: 82
                                    }, this),
                                    "Scan QR Code"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2364,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "gap-1.5 text-xs",
                                onClick: ()=>imageInputRef.current?.click(),
                                disabled: isProcessingImage,
                                "data-testid": "button-upload-screenshot",
                                children: [
                                    isProcessingImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-3.5 h-3.5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2383,
                                        columnNumber: 34
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__["ImagePlus"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2383,
                                        columnNumber: 85
                                    }, this),
                                    "Scan Screenshot"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2375,
                                columnNumber: 11
                            }, this),
                            user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        className: "gap-1.5 text-xs ml-auto",
                                        onClick: ()=>{
                                            setShowTimeline(!showTimeline);
                                            if (!showTimeline) setShowHistory(false);
                                        },
                                        "data-testid": "button-toggle-timeline",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2395,
                                                columnNumber: 17
                                            }, this),
                                            showTimeline ? "Hide Timeline" : "Threat Timeline"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2388,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        className: "gap-1.5 text-xs",
                                        onClick: ()=>{
                                            setShowHistory(!showHistory);
                                            if (!showHistory) setShowTimeline(false);
                                        },
                                        "data-testid": "button-toggle-history",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2405,
                                                columnNumber: 17
                                            }, this),
                                            showHistory ? "Hide History" : "Scan History"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2398,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 2361,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                className: "flex-1 gap-2",
                                onClick: handleScan,
                                disabled: !content.trim() || isChecking,
                                size: "lg",
                                "aria-label": isChecking ? "Scanning content for threats" : "Scan content for threats",
                                "aria-busy": isChecking,
                                "data-testid": "button-scan-threats",
                                children: isChecking ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin",
                                            role: "status",
                                            "aria-label": "Scanning"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 2424,
                                            columnNumber: 17
                                        }, this),
                                        "Scanning..."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                            className: "w-4 h-4",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 2429,
                                            columnNumber: 17
                                        }, this),
                                        "Scan for Threats"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2413,
                                columnNumber: 11
                            }, this),
                            (content || result || aiResult) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                onClick: handleClear,
                                size: "lg",
                                "data-testid": "button-clear-scan",
                                children: "Clear"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2435,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 2412,
                        columnNumber: 9
                    }, this),
                    showHistory && user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        "data-testid": "section-scan-history",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-semibold flex items-center gap-2 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2449,
                                        columnNumber: 15
                                    }, this),
                                    "Recent Scans"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2448,
                                columnNumber: 13
                            }, this),
                            scanHistoryQuery.isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-sm text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-4 h-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2454,
                                        columnNumber: 17
                                    }, this),
                                    " Loading history..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2453,
                                columnNumber: 15
                            }, this) : scanHistoryQuery.data?.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 max-h-60 overflow-y-auto",
                                children: scanHistoryQuery.data.map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted/80 transition-colors",
                                        onClick: ()=>{
                                            setContent(entry.contentSnippet);
                                            setShowHistory(false);
                                        },
                                        "data-testid": `history-entry-${entry.id}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm truncate flex-1 mr-3",
                                                        children: entry.contentSnippet
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2466,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                        className: entry.riskLevel === "critical" || entry.riskLevel === "high" ? "bg-red-500 text-white" : entry.riskLevel === "medium" ? "bg-yellow-500 text-black" : "bg-green-500 text-white",
                                                        children: entry.riskLevel
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2467,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2465,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground mt-1",
                                                children: [
                                                    new Date(entry.createdAt).toLocaleDateString(),
                                                    " · ",
                                                    entry.flagsFound,
                                                    " flags found"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2475,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, entry.id, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2459,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2457,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: "No scan history yet. Your scans will appear here."
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2482,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 2447,
                        columnNumber: 11
                    }, this),
                    showTimeline && user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        "data-testid": "section-threat-timeline",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-semibold flex items-center gap-2 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                        className: "w-4 h-4 text-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2490,
                                        columnNumber: 15
                                    }, this),
                                    "Threat Timeline (Last 30 Days)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2489,
                                columnNumber: 13
                            }, this),
                            threatTimelineQuery.isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-sm text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-4 h-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2495,
                                        columnNumber: 17
                                    }, this),
                                    " Loading timeline..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2494,
                                columnNumber: 15
                            }, this) : threatTimelineQuery.data?.success && threatTimelineQuery.data.timeline?.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    threatTimelineQuery.data.summary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 bg-muted/50 rounded-lg text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-2xl font-bold",
                                                        children: threatTimelineQuery.data.summary.totalScans
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2502,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Total Scans"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2503,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2501,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 bg-red-50 dark:bg-red-950/30 rounded-lg text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-2xl font-bold text-red-600",
                                                        children: threatTimelineQuery.data.summary.highRiskScans
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2506,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "High Risk"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2507,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2505,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 bg-muted/50 rounded-lg text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-2xl font-bold",
                                                        children: threatTimelineQuery.data.summary.brandsTargeted?.length || 0
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2510,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Brands Targeted"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2511,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2509,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-2xl font-bold text-orange-600",
                                                        children: threatTimelineQuery.data.summary.activeCampaigns?.length || 0
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2514,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Active Campaigns"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2515,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2513,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2500,
                                        columnNumber: 19
                                    }, this),
                                    threatTimelineQuery.data.summary?.activeCampaigns?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                className: "text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2523,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Active Campaign Alerts"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2522,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: threatTimelineQuery.data.summary.activeCampaigns.map((campaign, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-orange-600 dark:text-orange-400",
                                                                children: campaign.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 2529,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                        variant: "outline",
                                                                        className: "text-xs",
                                                                        children: [
                                                                            "Step ",
                                                                            campaign.latestStep,
                                                                            "/",
                                                                            campaign.totalSteps
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2531,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                        className: "bg-orange-500 text-white text-xs",
                                                                        children: [
                                                                            campaign.scanCount,
                                                                            " related scans"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2532,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 2530,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2528,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2526,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2521,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 max-h-80 overflow-y-auto",
                                        children: threatTimelineQuery.data.timeline.map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `p-3 rounded-lg border ${entry.riskLevel === "critical" || entry.riskLevel === "high" ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800" : entry.campaignMatch ? "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800" : "bg-muted/50"}`,
                                                "data-testid": `timeline-entry-${entry.id}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between gap-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm truncate",
                                                                children: entry.contentSnippet
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 2555,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap items-center gap-2 mt-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                        className: entry.riskLevel === "critical" || entry.riskLevel === "high" ? "bg-red-500 text-white" : entry.riskLevel === "medium" || entry.riskLevel === "moderate" ? "bg-yellow-500 text-black" : "bg-green-500 text-white",
                                                                        children: entry.riskLevel
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2557,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    entry.brandDetected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                        variant: "outline",
                                                                        className: "text-xs",
                                                                        children: entry.brandDetected
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2565,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    entry.campaignMatch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                        className: "bg-orange-500 text-white text-xs",
                                                                        children: [
                                                                            entry.campaignMatch.name,
                                                                            " (Step ",
                                                                            entry.campaignMatch.step,
                                                                            "/",
                                                                            entry.campaignMatch.totalSteps,
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2568,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs text-muted-foreground",
                                                                        children: entry.scannedAt ? new Date(entry.scannedAt).toLocaleDateString() : ""
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2572,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 2556,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2554,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2553,
                                                    columnNumber: 23
                                                }, this)
                                            }, entry.id, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2542,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2540,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2498,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: "No scan history yet. Start scanning to build your threat timeline."
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2583,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 2488,
                        columnNumber: 11
                    }, this),
                    result && result.overallRisk && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        role: "region",
                        "aria-label": "Pattern analysis results",
                        "aria-live": "polite",
                        "data-testid": "result-pattern-analysis",
                        children: [
                            (!aiResult || isAiAnalyzing) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `p-6 rounded-xl border-2 ${getRiskColor(result.overallRisk)}`,
                                role: "alert",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-shrink-0",
                                            children: getRiskIcon(result.overallRisk)
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 2593,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "font-bold text-lg",
                                                            children: result.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2598,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "secondary",
                                                            className: "font-mono",
                                                            children: [
                                                                result.confidenceScore,
                                                                "% confidence"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2599,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2597,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm opacity-90",
                                                    children: result.summary
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2603,
                                                    columnNumber: 21
                                                }, this),
                                                (result.overallRisk === "critical" || result.overallRisk === "high") && !isAiAnalyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-3 flex flex-wrap gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            size: "sm",
                                                            variant: "destructive",
                                                            className: "font-semibold",
                                                            onClick: ()=>{
                                                                const url = content.match(/https?:\/\/[^\s]+/)?.[0];
                                                                navigator.clipboard.writeText(`GCR Scam Guard Scan Result: ${result.title}\n\n${result.summary}\n\n${url ? "Link scanned: " + url + "\n\n" : ""}Protect yourself and your family. Getcyberright.com`);
                                                                toast({
                                                                    title: "Copied to clipboard",
                                                                    description: "Share this warning with others to keep them safe."
                                                                });
                                                            },
                                                            "data-testid": "button-warn-others-pattern",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                    className: "w-4 h-4 mr-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2619,
                                                                    columnNumber: 27
                                                                }, this),
                                                                "Warn Others"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2606,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            size: "sm",
                                                            variant: "outline",
                                                            onClick: ()=>{
                                                                const reportSection = document.querySelector('[data-testid="button-report-community"]');
                                                                if (reportSection) reportSection.scrollIntoView({
                                                                    behavior: 'smooth'
                                                                });
                                                            },
                                                            "data-testid": "button-report-threat-pattern",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                    className: "w-4 h-4 mr-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2631,
                                                                    columnNumber: 27
                                                                }, this),
                                                                "Report This Threat"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2622,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2605,
                                                    columnNumber: 23
                                                }, this),
                                                isAiAnalyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground mt-2 flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                            className: "w-3 h-3 animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2638,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Running deep AI analysis for more detail..."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2637,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 2596,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 2592,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2591,
                                columnNumber: 15
                            }, this),
                            aiResult && !isAiAnalyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                "data-testid": "result-ai-analysis-inline",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    className: "border-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "pt-5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `p-4 rounded-lg border ${getAIRiskBg(aiResult.scamRiskLevel)}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-shrink-0 mt-0.5",
                                                                children: getAIRiskIcon(aiResult.scamRiskLevel)
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 2654,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-wrap items-center gap-2 mb-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                className: `text-lg font-bold ${getAIRiskColor(aiResult.scamRiskLevel)}`,
                                                                                children: getFriendlyRiskTitle(aiResult.scamRiskLevel)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                lineNumber: 2659,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "outline",
                                                                                className: "text-xs",
                                                                                children: getFriendlyContentType(aiResult.contentTypeDetected)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                lineNumber: 2662,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "secondary",
                                                                                className: "text-xs font-mono",
                                                                                children: aiResult.confidenceLevel
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                lineNumber: 2665,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2658,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm font-medium text-foreground mb-1",
                                                                        children: getFriendlyVerdict(aiResult.scamRiskLevel)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2669,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-muted-foreground",
                                                                        children: aiResult.summary
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2670,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    (aiResult.scamRiskLevel === "Critical" || aiResult.scamRiskLevel === "High") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-3 flex flex-wrap gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "destructive",
                                                                                className: "font-semibold",
                                                                                onClick: ()=>{
                                                                                    const url = content.match(/https?:\/\/[^\s]+/)?.[0];
                                                                                    if (url) {
                                                                                        navigator.clipboard.writeText(`GCR Scam Guard Scan Result: ${getFriendlyRiskTitle(aiResult.scamRiskLevel)}\n\n${aiResult.summary}\n\nLink scanned: ${url}\n\nProtect yourself and your family. Getcyberright.com`);
                                                                                        toast({
                                                                                            title: "Copied to clipboard",
                                                                                            description: "Share this warning with others to keep them safe."
                                                                                        });
                                                                                    }
                                                                                },
                                                                                "data-testid": "button-warn-others",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                                        className: "w-4 h-4 mr-1"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                        lineNumber: 2688,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    "Warn Others"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                lineNumber: 2673,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "outline",
                                                                                onClick: ()=>{
                                                                                    const reportSection = document.querySelector('[data-testid="button-report-community"]');
                                                                                    if (reportSection) reportSection.scrollIntoView({
                                                                                        behavior: 'smooth'
                                                                                    });
                                                                                },
                                                                                "data-testid": "button-report-threat",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                                        className: "w-4 h-4 mr-1"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                        lineNumber: 2700,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    "Report This Threat"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                lineNumber: 2691,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2672,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 2657,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2653,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2652,
                                                    columnNumber: 23
                                                }, this),
                                                aiResult.keyRedFlags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-sm flex items-center gap-2 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                    className: "w-4 h-4 text-amber-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2712,
                                                                    columnNumber: 29
                                                                }, this),
                                                                getFriendlyWarningsLabel(aiResult.scamRiskLevel)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2711,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "space-y-1.5",
                                                            children: aiResult.keyRedFlags.map((flag, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex items-start gap-2 text-sm",
                                                                    children: [
                                                                        getFriendlyFlagIcon(aiResult.scamRiskLevel),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-foreground",
                                                                            children: flag
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 2719,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, i, true, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2717,
                                                                    columnNumber: 31
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2715,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2710,
                                                    columnNumber: 25
                                                }, this),
                                                aiResult.recommendedActions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-sm flex items-center gap-2 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                    className: "w-4 h-4 text-primary"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2729,
                                                                    columnNumber: 29
                                                                }, this),
                                                                aiResult.scamRiskLevel === "Low" ? "Good to Know" : "Recommended Actions"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2728,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "space-y-1.5",
                                                            children: aiResult.recommendedActions.map((action, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex items-start gap-2 text-sm p-2 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-800",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                            className: "w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 2735,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-foreground",
                                                                            children: action
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 2736,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, i, true, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2734,
                                                                    columnNumber: 31
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2732,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2727,
                                                    columnNumber: 25
                                                }, this),
                                                aiResult.technicalObservations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-sm flex items-center gap-2 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                    className: "w-4 h-4 text-blue-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2746,
                                                                    columnNumber: 29
                                                                }, this),
                                                                "What We Checked"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2745,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "space-y-1.5",
                                                            children: aiResult.technicalObservations.map((obs, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex items-start gap-2 text-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                            className: "w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 2752,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-foreground",
                                                                            children: obs
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 2753,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, i, true, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2751,
                                                                    columnNumber: 31
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2749,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2744,
                                                    columnNumber: 25
                                                }, this),
                                                !contextResult && !showContextQuestions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "pt-2 border-t",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "outline",
                                                        size: "sm",
                                                        className: "w-full gap-2",
                                                        onClick: ()=>setShowContextQuestions(true),
                                                        "data-testid": "button-answer-context",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 2769,
                                                                columnNumber: 29
                                                            }, this),
                                                            "Help us analyze this better — answer a few questions"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2762,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2761,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 pt-2 border-t text-xs text-muted-foreground",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                            className: "w-3.5 h-3.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2776,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Scanned against known scam patterns, phishing databases, and deceptive URL techniques"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2777,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2775,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 2651,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2650,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 2649,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2648,
                                columnNumber: 15
                            }, this),
                            showContextQuestions && !contextResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                className: "border-2 border-primary/30",
                                "data-testid": "section-context-questions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        className: "pb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                className: "text-base flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "w-5 h-5 text-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2789,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Help Us Understand Your Situation"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2788,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Your answers help detect sophisticated attacks where scammers use real company emails to trick you."
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2792,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2787,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        className: "space-y-4",
                                        children: [
                                            [
                                                {
                                                    key: "didInitiate",
                                                    question: "Did you initiate this action?",
                                                    detail: "Did you sign up, make a purchase, or request something?"
                                                },
                                                {
                                                    key: "hasAccount",
                                                    question: "Do you have an account with this company?",
                                                    detail: "Have you ever created an account with them?"
                                                },
                                                {
                                                    key: "expectingEmail",
                                                    question: "Were you expecting this message?",
                                                    detail: "Were you waiting for a confirmation, receipt, or notification?"
                                                },
                                                {
                                                    key: "madeRecentPurchase",
                                                    question: "Did you make a recent purchase?",
                                                    detail: "Have you bought anything from them in the last few days?"
                                                },
                                                {
                                                    key: "recognizeSender",
                                                    question: "Do you recognize the sender?",
                                                    detail: "Is this from someone or a company you know?"
                                                }
                                            ].map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium",
                                                            children: q.question
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2805,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground",
                                                            children: q.detail
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2806,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    size: "sm",
                                                                    variant: contextAnswers[q.key] === true ? "default" : "outline",
                                                                    onClick: ()=>setContextAnswers((prev)=>({
                                                                                ...prev,
                                                                                [q.key]: true
                                                                            })),
                                                                    "data-testid": `button-context-${q.key}-yes`,
                                                                    children: "Yes"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2808,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    size: "sm",
                                                                    variant: contextAnswers[q.key] === false ? "destructive" : "outline",
                                                                    onClick: ()=>setContextAnswers((prev)=>({
                                                                                ...prev,
                                                                                [q.key]: false
                                                                            })),
                                                                    "data-testid": `button-context-${q.key}-no`,
                                                                    children: "No"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2816,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    size: "sm",
                                                                    variant: contextAnswers[q.key] === null ? "secondary" : "ghost",
                                                                    onClick: ()=>setContextAnswers((prev)=>({
                                                                                ...prev,
                                                                                [q.key]: null
                                                                            })),
                                                                    "data-testid": `button-context-${q.key}-unsure`,
                                                                    children: "Not sure"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2824,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2807,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, q.key, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2804,
                                                    columnNumber: 21
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2 pt-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        className: "flex-1 gap-2",
                                                        onClick: handleContextScan,
                                                        disabled: isContextScanning || Object.values(contextAnswers).every((v)=>v === null),
                                                        "data-testid": "button-run-context-scan",
                                                        children: isContextScanning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                    className: "w-4 h-4 animate-spin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2845,
                                                                    columnNumber: 27
                                                                }, this),
                                                                "Analyzing with context..."
                                                            ]
                                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2850,
                                                                    columnNumber: 27
                                                                }, this),
                                                                "Run Deep Analysis"
                                                            ]
                                                        }, void 0, true)
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2837,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "ghost",
                                                        size: "sm",
                                                        onClick: ()=>setShowContextQuestions(false),
                                                        "data-testid": "button-cancel-context",
                                                        children: "Skip"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 2855,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 2836,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2796,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2786,
                                columnNumber: 15
                            }, this),
                            contextResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                "data-testid": "section-context-results",
                                children: [
                                    contextResult.contextAnalysis.isAccountWeaponization && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "border-2 border-red-500/50 bg-red-50/50 dark:bg-red-950/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "pt-4 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-bold flex items-center gap-2 text-red-700 dark:text-red-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2869,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Account Weaponization Detected"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2868,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-red-600 dark:text-red-400",
                                                    children: "This appears to be an attack where someone used your email to create a real account or trigger a real notification from a legitimate company. The email may be genuine, but the situation is a scam."
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2872,
                                                    columnNumber: 23
                                                }, this),
                                                contextResult.brandDetected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "outline",
                                                    className: "text-red-600 border-red-300",
                                                    children: [
                                                        "Target brand: ",
                                                        contextResult.brandDetected.name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2876,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 2867,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2866,
                                        columnNumber: 19
                                    }, this),
                                    contextResult.playbookMatch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "border-2 border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20",
                                        "data-testid": "section-campaign-match",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "pt-4 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-bold flex items-center gap-2 text-orange-700 dark:text-orange-300",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                    className: "w-5 h-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2889,
                                                                    columnNumber: 27
                                                                }, this),
                                                                "Known Attack Campaign Detected"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2888,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            className: "bg-orange-500 text-white",
                                                            children: [
                                                                contextResult.playbookMatch.confidence,
                                                                "% match"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2892,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2887,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-orange-800 dark:text-orange-200",
                                                    children: contextResult.playbookMatch.name
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2894,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-orange-700 dark:text-orange-300",
                                                    children: contextResult.playbookMatch.description
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2897,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "outline",
                                                            children: [
                                                                "Step ",
                                                                contextResult.playbookMatch.currentStep,
                                                                " of ",
                                                                contextResult.playbookMatch.totalSteps
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2901,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "outline",
                                                            children: [
                                                                contextResult.playbookMatch.sophistication,
                                                                " sophistication"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2902,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "outline",
                                                            children: contextResult.playbookMatch.prevalence
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2903,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2900,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-orange-800 dark:text-orange-200",
                                                            children: "Attack Timeline:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2907,
                                                            columnNumber: 25
                                                        }, this),
                                                        contextResult.playbookMatch.steps.map((step)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `p-2 rounded-lg border text-sm ${step.isCurrentStep ? "bg-orange-200/50 dark:bg-orange-900/30 border-orange-400" : step.order < contextResult.playbookMatch.currentStep ? "bg-muted/50 border-muted opacity-60" : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-800"}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: step.isCurrentStep ? "default" : "secondary",
                                                                                className: "text-xs",
                                                                                children: [
                                                                                    "Step ",
                                                                                    step.order
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                lineNumber: 2917,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            step.isCurrentStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                className: "bg-orange-500 text-white text-xs",
                                                                                children: "You are here"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                lineNumber: 2920,
                                                                                columnNumber: 54
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2916,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1",
                                                                        children: step.description
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2922,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    (step.isCurrentStep || step.order > contextResult.playbookMatch.currentStep) && step.nextStepWarning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 text-xs text-orange-600 dark:text-orange-400 font-medium",
                                                                        children: step.nextStepWarning
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2924,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, step.order, true, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 2909,
                                                                columnNumber: 27
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2906,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 2886,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2885,
                                        columnNumber: 19
                                    }, this),
                                    contextResult.contextAnalysis.insights.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        "data-testid": "section-context-insights",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "pt-4 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold flex items-center gap-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "w-4 h-4 text-primary"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2939,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Context-Aware Insights"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2938,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: contextResult.contextAnalysis.insights.map((insight, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-2 text-sm p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-200 dark:border-blue-800",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                                    className: "w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2945,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: insight
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2946,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2944,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2942,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 2937,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2936,
                                        columnNumber: 19
                                    }, this),
                                    contextResult.contextAnalysis.responseProtocol.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "border-green-200 dark:border-green-800",
                                        "data-testid": "section-response-protocol",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "pt-4 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold flex items-center gap-2 text-green-700 dark:text-green-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2958,
                                                            columnNumber: 25
                                                        }, this),
                                                        "What You Should Do Right Now"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2957,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                                    className: "space-y-2",
                                                    children: contextResult.contextAnalysis.responseProtocol.map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-start gap-2 text-sm p-2 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-800",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-bold text-green-700 dark:text-green-300 flex-shrink-0",
                                                                    children: [
                                                                        i + 1,
                                                                        "."
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2964,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: step
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 2965,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2963,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2961,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 2956,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2955,
                                        columnNumber: 19
                                    }, this),
                                    contextResult.phantomAccountProtocol && contextResult.phantomAccountProtocol.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "border-2 border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20",
                                        "data-testid": "section-phantom-account",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "pt-4 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-bold flex items-center gap-2 text-purple-700 dark:text-purple-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2977,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Phantom Account Alert"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2976,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: contextResult.phantomAccountProtocol.filter((s)=>s.trim()).map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `text-sm ${step.startsWith("PHANTOM") || step.startsWith("WHY") ? "font-semibold text-purple-700 dark:text-purple-300" : "text-foreground"}`,
                                                            children: step.startsWith("Step") ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-2 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        className: "w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2985,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: step
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 2986,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 2984,
                                                                columnNumber: 31
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: step.startsWith("  ") ? "ml-6 text-sm" : "",
                                                                children: step
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 2989,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, i, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 2982,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 2980,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 2975,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2974,
                                        columnNumber: 19
                                    }, this),
                                    contextResult.result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        "data-testid": "section-context-ai-result",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            className: "pt-4 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `p-4 rounded-lg border ${getAIRiskBg(contextResult.result.scamRiskLevel)}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-shrink-0 mt-0.5",
                                                                children: getAIRiskIcon(contextResult.result.scamRiskLevel)
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 3003,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-wrap items-center gap-2 mb-1",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: `text-lg font-bold ${getAIRiskColor(contextResult.result.scamRiskLevel)}`,
                                                                            children: [
                                                                                "Context-Aware Assessment: ",
                                                                                getFriendlyRiskTitle(contextResult.result.scamRiskLevel)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 3006,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 3005,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm",
                                                                        children: contextResult.result.summary
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 3010,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 3004,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3002,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3001,
                                                    columnNumber: 23
                                                }, this),
                                                contextResult.result.contextualInsights && contextResult.result.contextualInsights.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: contextResult.result.contextualInsights.map((insight, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-2 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                                    className: "w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3018,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: insight
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3019,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3017,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3015,
                                                    columnNumber: 25
                                                }, this),
                                                contextResult.result.recommendedActions && contextResult.result.recommendedActions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-sm flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                    className: "w-4 h-4 text-primary"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3027,
                                                                    columnNumber: 29
                                                                }, this),
                                                                "Recommended Actions"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3026,
                                                            columnNumber: 27
                                                        }, this),
                                                        contextResult.result.recommendedActions.map((action, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-2 text-sm p-2 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-800",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        className: "w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 3032,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: action
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                        lineNumber: 3033,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 3031,
                                                                columnNumber: 29
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3025,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3000,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 2999,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 2864,
                                columnNumber: 15
                            }, this),
                            result.urgencyAnalysis && result.urgencyAnalysis.score > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-muted/50 rounded-lg border",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-semibold flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                        className: "w-4 h-4 text-yellow-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3048,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Pressure Tactics Detected"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3047,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                className: result.urgencyAnalysis.score >= 70 ? "bg-red-500 text-white" : result.urgencyAnalysis.score >= 50 ? "bg-orange-500 text-white" : result.urgencyAnalysis.score >= 30 ? "bg-yellow-500 text-black" : "bg-blue-500 text-white",
                                                children: result.urgencyAnalysis.level
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3051,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3046,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-sm mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "How Hard They're Pushing You"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3063,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium",
                                                        children: [
                                                            result.urgencyAnalysis.score,
                                                            "/100"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3064,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3062,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `h-full rounded-full transition-all ${result.urgencyAnalysis.score >= 70 ? "bg-red-500" : result.urgencyAnalysis.score >= 50 ? "bg-orange-500" : result.urgencyAnalysis.score >= 30 ? "bg-yellow-500" : "bg-blue-500"}`,
                                                    style: {
                                                        width: `${result.urgencyAnalysis.score}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3067,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3066,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3061,
                                        columnNumber: 17
                                    }, this),
                                    result.urgencyAnalysis.triggers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground mb-2",
                                                children: "Detected manipulation tactics:"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3081,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-2",
                                                children: result.urgencyAnalysis.triggers.map((trigger, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: "outline",
                                                        className: "text-xs",
                                                        children: trigger
                                                    }, idx, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3084,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3082,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3080,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 3045,
                                columnNumber: 15
                            }, this),
                            result.threats.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                className: "w-4 h-4 text-orange-500"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3097,
                                                columnNumber: 19
                                            }, this),
                                            "Detected Threats (",
                                            result.threats.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3096,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: result.threats.map((threat, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-muted/50 rounded-lg border",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                className: getSeverityColor(threat.severity),
                                                                children: threat.severity.toUpperCase()
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 3104,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-sm",
                                                                children: threat.category
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 3107,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3103,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-medium mb-1",
                                                        children: threat.indicator
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3109,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-muted-foreground",
                                                        children: threat.explanation
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3110,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3102,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3100,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 3095,
                                columnNumber: 15
                            }, this),
                            result.urls.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-semibold flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                        className: "w-4 h-4 text-blue-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3121,
                                                        columnNumber: 21
                                                    }, this),
                                                    "URL Analysis (",
                                                    result.urls.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3120,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                size: "sm",
                                                onClick: ()=>checkAllUrlReputations(result.urls),
                                                disabled: Object.values(isCheckingReputation).some((v)=>v),
                                                "data-testid": "button-check-url-reputation",
                                                children: Object.values(isCheckingReputation).some((v)=>v) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3133,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Checking Databases..."
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                            className: "w-3 h-3 mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3138,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Check Threat Databases"
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3124,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3119,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: result.urls.map((urlAnalysis, idx)=>{
                                            const reputation = urlReputations[urlAnalysis.url];
                                            const isUrlChecking = isCheckingReputation[urlAnalysis.url];
                                            const sslResult = sslResults[urlAnalysis.url];
                                            const isSslChecking = isCheckingSSL[urlAnalysis.url];
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `p-3 rounded-lg border ${urlAnalysis.isSuspicious ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        urlAnalysis.isSuspicious ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                            className: "w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3155,
                                                            columnNumber: 29
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                            className: "w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3157,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "min-w-0 flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-mono break-all",
                                                                    children: urlAnalysis.url
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3160,
                                                                    columnNumber: 29
                                                                }, this),
                                                                urlAnalysis.reasons.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap gap-1 mt-1",
                                                                    children: urlAnalysis.reasons.map((reason, ridx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                            variant: "secondary",
                                                                            className: "text-xs",
                                                                            children: reason
                                                                        }, ridx, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 3164,
                                                                            columnNumber: 35
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3162,
                                                                    columnNumber: 31
                                                                }, this),
                                                                isUrlChecking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-2 p-2 bg-muted/50 rounded border flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 3173,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: "Checking threat databases..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 3174,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3172,
                                                                    columnNumber: 31
                                                                }, this),
                                                                reputation && !isUrlChecking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-2 p-2 bg-muted/30 rounded border space-y-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-medium",
                                                                                    children: "Threat Database Check:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                    lineNumber: 3181,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                reputation.threatLevel === 'dangerous' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                    className: "bg-red-500 text-white text-xs",
                                                                                    children: "DANGEROUS"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                    lineNumber: 3183,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                reputation.threatLevel === 'safe' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                    className: "bg-blue-500 text-white text-xs",
                                                                                    children: "Not in known threat lists"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                    lineNumber: 3186,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                reputation.threatLevel === 'unknown' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                    variant: "secondary",
                                                                                    className: "text-xs",
                                                                                    children: "Check failed"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                    lineNumber: 3189,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 3180,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: `p-1.5 rounded ${reputation.phishTank.isPhishing ? 'bg-red-100 dark:bg-red-950/50' : reputation.phishTank.checked ? 'bg-green-100 dark:bg-green-950/50' : 'bg-gray-100 dark:bg-gray-800'}`,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "font-medium flex items-center gap-1",
                                                                                            children: [
                                                                                                reputation.phishTank.isPhishing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                                                    className: "w-3 h-3 text-red-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3203,
                                                                                                    columnNumber: 41
                                                                                                }, this) : reputation.phishTank.checked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                                    className: "w-3 h-3 text-green-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3205,
                                                                                                    columnNumber: 41
                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                                                                    className: "w-3 h-3 text-gray-400"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3207,
                                                                                                    columnNumber: 41
                                                                                                }, this),
                                                                                                "Phishing"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                            lineNumber: 3201,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-muted-foreground",
                                                                                            children: reputation.phishTank.isPhishing ? 'DANGER. Fake site' : reputation.phishTank.checked ? 'Not flagged' : 'Pending'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                            lineNumber: 3211,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                    lineNumber: 3194,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: `p-1.5 rounded ${reputation.urlhaus.isMalware ? 'bg-red-100 dark:bg-red-950/50' : reputation.urlhaus.checked ? 'bg-green-100 dark:bg-green-950/50' : 'bg-gray-100 dark:bg-gray-800'}`,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "font-medium flex items-center gap-1",
                                                                                            children: [
                                                                                                reputation.urlhaus.isMalware ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                                                    className: "w-3 h-3 text-red-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3229,
                                                                                                    columnNumber: 41
                                                                                                }, this) : reputation.urlhaus.checked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                                    className: "w-3 h-3 text-green-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3231,
                                                                                                    columnNumber: 41
                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                                                                    className: "w-3 h-3 text-gray-400"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3233,
                                                                                                    columnNumber: 41
                                                                                                }, this),
                                                                                                "Malware"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                            lineNumber: 3227,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-muted-foreground",
                                                                                            children: reputation.urlhaus.isMalware ? `DANGER - ${reputation.urlhaus.threat || 'Harmful'}` : reputation.urlhaus.checked ? 'Not flagged' : 'Pending'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                            lineNumber: 3237,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                    lineNumber: 3220,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: `p-1.5 rounded ${sslResult?.valid === false ? 'bg-red-100 dark:bg-red-950/50' : sslResult?.valid ? 'bg-green-100 dark:bg-green-950/50' : isSslChecking ? 'bg-blue-50 dark:bg-blue-950/50' : 'bg-gray-100 dark:bg-gray-800'}`,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "font-medium flex items-center gap-1",
                                                                                            children: [
                                                                                                isSslChecking ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3257,
                                                                                                    columnNumber: 41
                                                                                                }, this) : sslResult?.valid === false ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                                                    className: "w-3 h-3 text-red-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3259,
                                                                                                    columnNumber: 41
                                                                                                }, this) : sslResult?.valid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                                                    className: "w-3 h-3 text-green-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3261,
                                                                                                    columnNumber: 41
                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                                                    className: "w-3 h-3 text-gray-400"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3263,
                                                                                                    columnNumber: 41
                                                                                                }, this),
                                                                                                "Secure"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                            lineNumber: 3255,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-muted-foreground",
                                                                                            children: isSslChecking ? 'Checking...' : sslResult?.error?.includes('HTTPS') ? 'Not secure' : sslResult?.valid ? sslResult.isEV ? 'Verified' : 'Yes' : sslResult?.isExpired ? 'Expired' : sslResult?.isSelfSigned ? 'Unverified' : 'Pending'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                            lineNumber: 3267,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                    lineNumber: 3246,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                reputation.googleSafeBrowsing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: `p-1.5 rounded ${reputation.googleSafeBrowsing.isThreat ? 'bg-red-100 dark:bg-red-950/50' : reputation.googleSafeBrowsing.checked ? 'bg-green-100 dark:bg-green-950/50' : 'bg-gray-100 dark:bg-gray-800'}`,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "font-medium flex items-center gap-1",
                                                                                            children: [
                                                                                                reputation.googleSafeBrowsing.isThreat ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                                                    className: "w-3 h-3 text-red-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3292,
                                                                                                    columnNumber: 43
                                                                                                }, this) : reputation.googleSafeBrowsing.checked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                                    className: "w-3 h-3 text-green-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3294,
                                                                                                    columnNumber: 43
                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                                                                    className: "w-3 h-3 text-gray-400"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3296,
                                                                                                    columnNumber: 43
                                                                                                }, this),
                                                                                                "Google"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                            lineNumber: 3290,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-muted-foreground",
                                                                                            children: reputation.googleSafeBrowsing.isThreat ? 'FLAGGED' : reputation.googleSafeBrowsing.checked ? 'Clean' : 'N/A'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                            lineNumber: 3300,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                    lineNumber: 3283,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                reputation.domainAge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: `p-1.5 rounded ${reputation.domainAge.isNew ? 'bg-yellow-100 dark:bg-yellow-950/50' : 'bg-green-100 dark:bg-green-950/50'}`,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "font-medium flex items-center gap-1",
                                                                                            children: [
                                                                                                reputation.domainAge.isNew ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                                                    className: "w-3 h-3 text-yellow-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3318,
                                                                                                    columnNumber: 43
                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                                    className: "w-3 h-3 text-green-500"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                                    lineNumber: 3320,
                                                                                                    columnNumber: 43
                                                                                                }, this),
                                                                                                "Age"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                            lineNumber: 3316,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "text-muted-foreground",
                                                                                            children: reputation.domainAge.isNew ? 'New domain' : reputation.domainAge.ageInDays ? `${Math.floor(reputation.domainAge.ageInDays / 365)}+ yrs` : 'Established'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                            lineNumber: 3324,
                                                                                            columnNumber: 39
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                                    lineNumber: 3311,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 3193,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        (reputation.phishTank.isPhishing || reputation.urlhaus.isMalware || reputation.googleSafeBrowsing?.isThreat) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs text-red-600 dark:text-red-400 font-medium p-1 bg-red-100/50 dark:bg-red-900/30 rounded",
                                                                            children: "This URL is in known threat databases. Do NOT visit this link."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 3336,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3179,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3159,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3153,
                                                    columnNumber: 25
                                                }, this)
                                            }, idx, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3152,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3144,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-muted-foreground p-2 bg-muted/30 rounded flex items-start gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                className: "w-3 h-3 flex-shrink-0 mt-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3350,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Links are checked against multiple trusted safety sources including VirusTotal, Google Safe Browsing, and domain registration records. New threats take time to be reported. Always exercise caution with unfamiliar links."
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3351,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3349,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 3118,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                className: "w-4 h-4 text-green-500"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3361,
                                                columnNumber: 17
                                            }, this),
                                            result.overallRisk === "safe" || result.overallRisk === "low" ? "Good to Know" : "Recommended Actions"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3360,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-2",
                                        children: result.recommendations.map((rec, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-start gap-2 text-sm p-2 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-800",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                        className: "w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3367,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: rec
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3368,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3366,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3364,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 3359,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 2589,
                        columnNumber: 11
                    }, this),
                    (isAiAnalyzing || aiError) && !aiResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "data-testid": "result-ai-analysis",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    className: "pb-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        className: "text-base flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                                className: "w-5 h-5 text-primary"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3381,
                                                columnNumber: 19
                                            }, this),
                                            "AI Deep Analysis"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3380,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3379,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    children: [
                                        isAiAnalyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 py-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "w-5 h-5 animate-spin text-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3388,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-foreground",
                                                            children: "AI is analyzing your content..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3390,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground",
                                                            children: "This typically takes a few seconds"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3391,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3389,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3387,
                                            columnNumber: 19
                                        }, this),
                                        aiError && !isAiAnalyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-2 text-sm text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                    className: "w-4 h-4 flex-shrink-0 mt-0.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3398,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: aiError
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3399,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3397,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3385,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/scam-checker.tsx",
                            lineNumber: 3378,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 3377,
                        columnNumber: 11
                    }, this),
                    headerResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        role: "region",
                        "aria-label": "Email header analysis results",
                        "aria-live": "polite",
                        "data-testid": "result-header-analysis",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    className: "pb-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        className: "text-base flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                className: "w-5 h-5 text-primary"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3412,
                                                columnNumber: 19
                                            }, this),
                                            "Email Header Analysis"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3411,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3410,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `p-4 rounded-xl border-2 ${getRiskColor(headerResult.overallRisk)}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    getRiskIcon(headerResult.overallRisk),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-lg",
                                                                children: headerResult.overallRisk === "safe" ? "Headers Look Legitimate" : headerResult.overallRisk === "low" ? "Minor Concerns Found" : headerResult.overallRisk === "medium" ? "Some Issues Detected" : headerResult.overallRisk === "high" ? "Significant Issues Found" : "Critical Authentication Failures"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 3421,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm opacity-90",
                                                                children: [
                                                                    headerResult.findings.length,
                                                                    " finding(s) from email header analysis"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                lineNumber: 3428,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3420,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3418,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3417,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-3 gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `p-3 rounded-lg text-center ${headerResult.parsedHeaders.spf === "pass" ? "bg-green-50 dark:bg-green-950/30" : headerResult.parsedHeaders.spf === "fail" ? "bg-red-50 dark:bg-red-950/30" : "bg-muted/50"}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground mb-1",
                                                            children: "SPF"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3441,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: headerResult.parsedHeaders.spf === "pass" ? "default" : headerResult.parsedHeaders.spf === "fail" ? "destructive" : "secondary",
                                                            children: headerResult.parsedHeaders.spf || "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3442,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3436,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `p-3 rounded-lg text-center ${headerResult.parsedHeaders.dkim === "pass" ? "bg-green-50 dark:bg-green-950/30" : headerResult.parsedHeaders.dkim === "fail" ? "bg-red-50 dark:bg-red-950/30" : "bg-muted/50"}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground mb-1",
                                                            children: "DKIM"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3451,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: headerResult.parsedHeaders.dkim === "pass" ? "default" : headerResult.parsedHeaders.dkim === "fail" ? "destructive" : "secondary",
                                                            children: headerResult.parsedHeaders.dkim || "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3452,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3446,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `p-3 rounded-lg text-center ${headerResult.parsedHeaders.dmarc === "pass" ? "bg-green-50 dark:bg-green-950/30" : headerResult.parsedHeaders.dmarc === "fail" ? "bg-red-50 dark:bg-red-950/30" : "bg-muted/50"}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-muted-foreground mb-1",
                                                            children: "DMARC"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3461,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: headerResult.parsedHeaders.dmarc === "pass" ? "default" : headerResult.parsedHeaders.dmarc === "fail" ? "destructive" : "secondary",
                                                            children: headerResult.parsedHeaders.dmarc || "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3462,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3456,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3435,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3470,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Analysis Findings"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3469,
                                                    columnNumber: 19
                                                }, this),
                                                headerResult.findings.map((finding, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `p-3 rounded-lg border ${finding.status === "pass" ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : finding.status === "fail" ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800" : finding.status === "warning" ? "bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800" : "bg-muted/30 border-muted"}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start gap-2",
                                                            children: [
                                                                finding.status === "pass" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3484,
                                                                    columnNumber: 55
                                                                }, this),
                                                                finding.status === "fail" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                    className: "w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3485,
                                                                    columnNumber: 55
                                                                }, this),
                                                                finding.status === "warning" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                    className: "w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3486,
                                                                    columnNumber: 58
                                                                }, this),
                                                                finding.status === "info" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                                    className: "w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3487,
                                                                    columnNumber: 55
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-medium text-sm",
                                                                            children: finding.category
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 3489,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-muted-foreground",
                                                                            children: finding.detail
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 3490,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-muted-foreground mt-1",
                                                                            children: finding.explanation
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                            lineNumber: 3491,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3488,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3483,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, idx, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3474,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3468,
                                            columnNumber: 17
                                        }, this),
                                        headerResult.recommendations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3501,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Recommendations"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3500,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-1",
                                                    children: headerResult.recommendations.map((rec, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "mt-1",
                                                                    children: "•"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3507,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: rec
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3508,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, idx, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3506,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3504,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3499,
                                            columnNumber: 19
                                        }, this),
                                        headerResult.parsedHeaders.from && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-3 bg-muted/50 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground mb-2",
                                                    children: "Extracted Information"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3517,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "From:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3519,
                                                                    columnNumber: 26
                                                                }, this),
                                                                " ",
                                                                headerResult.parsedHeaders.from
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3519,
                                                            columnNumber: 23
                                                        }, this),
                                                        headerResult.parsedHeaders.replyTo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "Reply-To:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3521,
                                                                    columnNumber: 28
                                                                }, this),
                                                                " ",
                                                                headerResult.parsedHeaders.replyTo
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3521,
                                                            columnNumber: 25
                                                        }, this),
                                                        headerResult.parsedHeaders.xMailer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "Mailer:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3524,
                                                                    columnNumber: 28
                                                                }, this),
                                                                " ",
                                                                headerResult.parsedHeaders.xMailer
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3524,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-muted-foreground",
                                                                    children: "Hops:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3526,
                                                                    columnNumber: 26
                                                                }, this),
                                                                " ",
                                                                headerResult.parsedHeaders.receivedChain.length,
                                                                " server(s)"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3526,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3518,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3516,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3416,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/scam-checker.tsx",
                            lineNumber: 3409,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 3408,
                        columnNumber: 11
                    }, this),
                    deepfakeWarnings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20",
                        "data-testid": "section-deepfake-warning",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "pt-4 space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3539,
                                            columnNumber: 17
                                        }, this),
                                        "Deepfake / AI Voice Scam Warning"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3538,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-purple-600 dark:text-purple-400",
                                    children: "This content contains patterns commonly seen in AI voice cloning and deepfake video scams. Criminals use AI to mimic the voice or appearance of people you trust."
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3542,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: deepfakeWarnings.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                    className: "w-4 h-4 text-purple-500 flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3548,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: w
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3549,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3547,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3545,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-purple-800 dark:text-purple-200 mb-1",
                                            children: "How to protect yourself:"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3554,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "text-xs text-purple-700 dark:text-purple-300 space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "• Hang up and call the person back using a number you already have saved"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3556,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "• Use your family's pre-agreed codeword to verify identity"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3557,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "• Never send money based on a phone or video call alone"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3558,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: "• AI can now clone voices from just a few seconds of audio"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3559,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3555,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3553,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/scam-checker.tsx",
                            lineNumber: 3537,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 3536,
                        columnNumber: 11
                    }, this),
                    smsAnalysis && (smsAnalysis.patterns.length > 0 || smsAnalysis.shortCode) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "border-cyan-200 dark:border-cyan-800 bg-cyan-50/50 dark:bg-cyan-950/20",
                        "data-testid": "section-sms-analysis",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "pt-4 space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-semibold flex items-center gap-2 text-cyan-700 dark:text-cyan-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3570,
                                            columnNumber: 17
                                        }, this),
                                        "SMS / Text Message Analysis"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3569,
                                    columnNumber: 15
                                }, this),
                                smsAnalysis.shortCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 bg-muted/50 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-muted-foreground",
                                                children: "Short code:"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3576,
                                                columnNumber: 21
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono font-semibold",
                                                children: smsAnalysis.shortCode
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3577,
                                                columnNumber: 21
                                            }, this),
                                            smsAnalysis.service ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                className: "ml-2 bg-green-500 text-white",
                                                children: [
                                                    smsAnalysis.service,
                                                    " (Verified)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3579,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                className: "ml-2 bg-yellow-500 text-black",
                                                children: "Unrecognized"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3581,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3575,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3574,
                                    columnNumber: 17
                                }, this),
                                smsAnalysis.patterns.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-cyan-600 dark:text-cyan-400",
                                            children: "Detected SMS scam patterns:"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3588,
                                            columnNumber: 19
                                        }, this),
                                        smsAnalysis.patterns.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                        className: "w-4 h-4 text-cyan-500 flex-shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3591,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: p
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3592,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3590,
                                                columnNumber: 21
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3587,
                                    columnNumber: 17
                                }, this),
                                smsAnalysis.isLegitOptOut && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-sm text-green-600 dark:text-green-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3599,
                                            columnNumber: 19
                                        }, this),
                                        "Contains standard opt-out language (common in legitimate messages)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3598,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/scam-checker.tsx",
                            lineNumber: 3568,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 3567,
                        columnNumber: 11
                    }, this),
                    result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        role: "region",
                        "aria-label": "Result actions",
                        "aria-live": "polite",
                        "data-testid": "section-result-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "gap-1.5",
                                onClick: handleShareReport,
                                disabled: createShareReport.isPending || !!shareId,
                                "data-testid": "button-share-report",
                                children: [
                                    createShareReport.isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-3.5 h-3.5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3617,
                                        columnNumber: 46
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3617,
                                        columnNumber: 97
                                    }, this),
                                    shareId ? "Report Created" : "Share Report"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 3609,
                                columnNumber: 13
                            }, this),
                            shareId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "gap-1.5",
                                onClick: handleCopyShareLink,
                                "data-testid": "button-copy-share-link",
                                children: [
                                    copiedShareLink ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3628,
                                        columnNumber: 36
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3628,
                                        columnNumber: 72
                                    }, this),
                                    copiedShareLink ? "Copied!" : "Copy Link"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 3621,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "gap-1.5",
                                onClick: ()=>submitCommunityReport.mutate({
                                        content: content.substring(0, 500),
                                        reportType: result.overallRisk === "critical" || result.overallRisk === "high" ? "confirmed_scam" : "suspicious",
                                        url: result.urls?.[0]?.url || null
                                    }),
                                disabled: submitCommunityReport.isPending,
                                "data-testid": "button-report-community",
                                children: [
                                    submitCommunityReport.isPending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-3.5 h-3.5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3644,
                                        columnNumber: 50
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flag$3e$__["Flag"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3644,
                                        columnNumber: 101
                                    }, this),
                                    "Report to Community"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 3632,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 3608,
                        columnNumber: 11
                    }, this),
                    Array.isArray(communityReportsQuery.data) && communityReportsQuery.data.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        "data-testid": "section-community-reports",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "pt-4 space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-semibold flex items-center gap-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2d$warning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquareWarning$3e$__["MessageSquareWarning"], {
                                            className: "w-4 h-4 text-orange-500"
                                        }, void 0, false, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3654,
                                            columnNumber: 17
                                        }, this),
                                        "Recent Community-Reported Scams"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3653,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: communityReportsQuery.data.slice(0, 5).map((report)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-3 bg-muted/50 rounded-lg border flex items-start justify-between gap-3",
                                            "data-testid": `community-report-${report.id}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm truncate",
                                                            children: report.content
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3661,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 mt-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: "outline",
                                                                    className: "text-xs",
                                                                    children: report.reportType
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3663,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-muted-foreground",
                                                                    children: new Date(report.createdAt).toLocaleDateString()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                                    lineNumber: 3664,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3662,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3660,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "sm",
                                                    className: "gap-1 text-xs flex-shrink-0",
                                                    onClick: ()=>voteMutation.mutate(report.id),
                                                    "data-testid": `button-vote-${report.id}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__["ThumbsUp"], {
                                                            className: "w-3 h-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                                            lineNumber: 3674,
                                                            columnNumber: 23
                                                        }, this),
                                                        report.votes
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                                    lineNumber: 3667,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, report.id, true, {
                                            fileName: "[project]/client/src/components/scam-checker.tsx",
                                            lineNumber: 3659,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/scam-checker.tsx",
                                    lineNumber: 3657,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/scam-checker.tsx",
                            lineNumber: 3652,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 3651,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$signup$2d$encouragement$2d$banner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SignupEncouragementBanner"], {
                        toolName: "scam-checker",
                        show: !!(result || aiResult || headerResult),
                        contextMessage: "Save this scan to your history?"
                    }, void 0, false, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 3684,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3 p-4 bg-muted/50 rounded-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                className: "w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 3691,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-2",
                                        children: "This tool uses advanced pattern matching and AI to detect scam indicators. While highly accurate, no automated tool is 100% reliable. When in doubt, don't engage and verify through official channels."
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3693,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://reportfraud.ftc.gov/",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "text-primary flex items-center gap-1 hover:underline",
                                                children: [
                                                    "Report to FTC ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3704,
                                                        columnNumber: 31
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3698,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://www.ic3.gov/",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "text-primary flex items-center gap-1 hover:underline",
                                                children: [
                                                    "Report to FBI IC3 ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                                        lineNumber: 3712,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                                lineNumber: 3706,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/scam-checker.tsx",
                                        lineNumber: 3697,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/scam-checker.tsx",
                                lineNumber: 3692,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/scam-checker.tsx",
                        lineNumber: 3690,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/components/scam-checker.tsx",
                lineNumber: 2351,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/components/scam-checker.tsx",
        lineNumber: 2339,
        columnNumber: 5
    }, this);
}
_s(ScamChecker, "X0QLvQufdlcIqrCDD69ZliM5myU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
_c = ScamChecker;
var _c;
__turbopack_context__.k.register(_c, "ScamChecker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=client_src_components_scam-checker_tsx_0mjgx07._.js.map