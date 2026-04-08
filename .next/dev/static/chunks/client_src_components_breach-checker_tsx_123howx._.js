(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/client/src/components/breach-checker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BreachChecker",
    ()=>BreachChecker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/components/ui/tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-alert.js [app-client] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/key.js [app-client] (ecmascript) <export default as Key>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zxcvbn$2f$lib$2f$main$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zxcvbn/lib/main.js [app-client] (ecmascript)");
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
// Disposable email domain list (common throwaway email services)
const disposableEmailDomains = new Set([
    'tempmail.com',
    'throwaway.email',
    'guerrillamail.com',
    'mailinator.com',
    '10minutemail.com',
    'temp-mail.org',
    'fakeinbox.com',
    'sharklasers.com',
    'guerrillamail.info',
    'grr.la',
    'guerrillamail.biz',
    'guerrillamail.de',
    'guerrillamail.net',
    'guerrillamail.org',
    'spam4.me',
    'trashmail.com',
    'maildrop.cc',
    'getairmail.com',
    'mohmal.com',
    'tempail.com',
    'tmails.net',
    'yopmail.com',
    'dispostable.com',
    'mintemail.com',
    'tempinbox.com',
    'emailondeck.com',
    'getnada.com',
    'temp.email',
    'throwawaymail.com'
]);
// Common weak passwords (top 100 from various breach databases)
const commonPasswords = new Set([
    '123456',
    'password',
    '12345678',
    'qwerty',
    '123456789',
    '12345',
    '1234',
    '111111',
    '1234567',
    'dragon',
    '123123',
    'baseball',
    'iloveyou',
    'trustno1',
    '1234567890',
    'sunshine',
    'master',
    'welcome',
    'shadow',
    'ashley',
    'football',
    'jesus',
    'michael',
    'ninja',
    'mustang',
    'password1',
    'abc123',
    'letmein',
    'monkey',
    '696969',
    'batman',
    'passw0rd',
    'admin',
    'login',
    'princess',
    'qwertyuiop',
    'solo',
    'whatever',
    'donald',
    'google',
    'internet',
    'pokemon',
    'superman',
    'charlie',
    '!@#$%^&*',
    'hello',
    'cheese',
    'access',
    'killer'
]);
// Check if email is from a disposable domain
function isDisposableEmail(email) {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? disposableEmailDomains.has(domain) : false;
}
// Keyboard walk patterns (common keyboard sequences)
const keyboardPatterns = [
    'qwerty',
    'qwertyuiop',
    'asdf',
    'asdfgh',
    'asdfghjkl',
    'zxcv',
    'zxcvbn',
    'zxcvbnm',
    'qazwsx',
    'qweasd',
    '1qaz2wsx',
    '1q2w3e4r',
    'zaq12wsx',
    'qwe123',
    'asd123',
    '1234qwer',
    'qwer1234',
    'poiuy',
    'lkjhg',
    'mnbvc',
    '!@#$%',
    '!@#$%^',
    '!@#$%^&*',
    '123qwe',
    'qwe123asd',
    'asdzxc',
    'zxcasd',
    'wasd',
    'wsad',
    'arrow',
    // Number pad patterns
    '147258',
    '258369',
    '123654',
    '789456',
    '456123',
    '321654',
    '987654',
    // Diagonal patterns
    'qaz',
    'wsx',
    'edc',
    'rfv',
    'tgb',
    'yhn',
    'ujm'
];
// Detect keyboard walk patterns
function detectKeyboardPattern(password) {
    const lower = password.toLowerCase();
    for (const pattern of keyboardPatterns){
        if (lower.includes(pattern)) {
            return {
                found: true,
                pattern
            };
        }
        // Check reversed
        const reversed = pattern.split('').reverse().join('');
        if (lower.includes(reversed)) {
            return {
                found: true,
                pattern: reversed
            };
        }
    }
    return {
        found: false,
        pattern: ''
    };
}
// Leetspeak mapping
const leetMap = {
    'a': [
        '4',
        '@'
    ],
    'e': [
        '3'
    ],
    'i': [
        '1',
        '!'
    ],
    'o': [
        '0'
    ],
    's': [
        '5',
        '$'
    ],
    't': [
        '7',
        '+'
    ],
    'l': [
        '1',
        '|'
    ],
    'b': [
        '8'
    ],
    'g': [
        '9'
    ]
};
// Detect leetspeak substitutions
function detectLeetspeak(password) {
    // Convert potential leetspeak to normal letters
    let normalized = password.toLowerCase();
    for (const [letter, replacements] of Object.entries(leetMap)){
        for (const replacement of replacements){
            normalized = normalized.split(replacement).join(letter);
        }
    }
    // Check if the normalized version is in common passwords
    if (commonPasswords.has(normalized) && normalized !== password.toLowerCase()) {
        return {
            found: true,
            original: normalized
        };
    }
    // Check for common leetspeak passwords
    const commonLeet = [
        'p@ssword',
        'p@ssw0rd',
        'p4ssword',
        'p4$$word',
        'pa$$word',
        'pa55word',
        'l3tme1n',
        'w3lcome',
        'adm1n',
        'qu3rty'
    ];
    for (const leet of commonLeet){
        if (password.toLowerCase() === leet) {
            return {
                found: true,
                original: leet
            };
        }
    }
    return {
        found: false,
        original: ''
    };
}
// Detect date patterns in password
function detectDatePattern(password) {
    const patterns = [
        // Year patterns (embedded or standalone) - 1940-2029
        {
            regex: /(19[4-9]\d|20[0-2]\d)/,
            type: 'year'
        },
        // Date formats with separators
        {
            regex: /(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](\d{2}|\d{4})/,
            type: 'date (MM/DD/YY)'
        },
        {
            regex: /(0?[1-9]|[12]\d|3[01])[\/\-](0?[1-9]|1[0-2])[\/\-](\d{2}|\d{4})/,
            type: 'date (DD/MM/YY)'
        },
        // Month abbreviations with numbers
        {
            regex: /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\d{1,4}/i,
            type: 'month + year'
        },
        {
            regex: /\d{4}(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
            type: 'year + month'
        },
        // Birthday references (case insensitive, anywhere in password)
        {
            regex: /(birthday|bday|born|dob)/i,
            type: 'birthday reference'
        },
        // Common year endings like password2023
        {
            regex: /[a-z](20[1-2]\d|19[89]\d)$/i,
            type: 'year suffix'
        }
    ];
    for (const { regex, type } of patterns){
        if (regex.test(password)) {
            return {
                found: true,
                type
            };
        }
    }
    return {
        found: false,
        type: ''
    };
}
// Detect sequential patterns
function detectSequentialPattern(password) {
    const lower = password.toLowerCase();
    // Alphabetic sequences
    const alphaSequences = [
        'abc',
        'bcd',
        'cde',
        'def',
        'efg',
        'fgh',
        'ghi',
        'hij',
        'ijk',
        'jkl',
        'klm',
        'lmn',
        'mno',
        'nop',
        'opq',
        'pqr',
        'qrs',
        'rst',
        'stu',
        'tuv',
        'uvw',
        'vwx',
        'wxy',
        'xyz'
    ];
    for (const seq of alphaSequences){
        if (lower.includes(seq)) {
            return {
                found: true,
                type: 'alphabetic sequence'
            };
        }
        // Check reversed
        if (lower.includes(seq.split('').reverse().join(''))) {
            return {
                found: true,
                type: 'reversed alphabetic sequence'
            };
        }
    }
    // Numeric sequences
    const numericSequences = [
        '012',
        '123',
        '234',
        '345',
        '456',
        '567',
        '678',
        '789',
        '890'
    ];
    for (const seq of numericSequences){
        if (password.includes(seq)) {
            return {
                found: true,
                type: 'numeric sequence'
            };
        }
        // Check reversed
        if (password.includes(seq.split('').reverse().join(''))) {
            return {
                found: true,
                type: 'reversed numeric sequence'
            };
        }
    }
    return {
        found: false,
        type: ''
    };
}
// Detect repeated characters
function detectRepeatedChars(password) {
    const repeatedPattern = /(.)\1{2,}/g;
    const matches = password.match(repeatedPattern);
    if (matches && matches.length > 0) {
        const longest = matches.reduce((a, b)=>a.length >= b.length ? a : b);
        return {
            found: true,
            char: longest[0],
            count: longest.length
        };
    }
    return {
        found: false,
        char: '',
        count: 0
    };
}
// Calculate password entropy (bits)
function calculatePasswordEntropy(password) {
    if (!password) return {
        entropy: 0,
        rating: 'none'
    };
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) charsetSize += 32;
    if (/\s/.test(password)) charsetSize += 1;
    // Entropy = log2(charset^length) = length * log2(charset)
    const entropy = password.length * Math.log2(charsetSize || 1);
    let rating = 'Very Weak';
    if (entropy >= 80) rating = 'Very Strong';
    else if (entropy >= 60) rating = 'Strong';
    else if (entropy >= 40) rating = 'Moderate';
    else if (entropy >= 28) rating = 'Weak';
    return {
        entropy: Math.round(entropy),
        rating
    };
}
function analyzePasswordPatterns(password) {
    const warnings = [];
    const analysis = {
        entropy: {
            bits: 0,
            rating: 'none'
        },
        warnings: []
    };
    // Check keyboard patterns
    const keyboard = detectKeyboardPattern(password);
    if (keyboard.found) {
        analysis.keyboardPattern = keyboard.pattern;
        warnings.push(`Contains keyboard pattern "${keyboard.pattern}" which is easily guessed`);
    }
    // Check leetspeak
    const leet = detectLeetspeak(password);
    if (leet.found) {
        analysis.leetspeak = leet.original;
        warnings.push(`Leetspeak variation of "${leet.original}" - this is a well-known trick`);
    }
    // Check date patterns
    const date = detectDatePattern(password);
    if (date.found) {
        analysis.datePattern = date.type;
        warnings.push(`Contains ${date.type} - avoid personal dates in passwords`);
    }
    // Check sequential patterns
    const sequential = detectSequentialPattern(password);
    if (sequential.found) {
        analysis.sequentialPattern = sequential.type;
        warnings.push(`Contains ${sequential.type} - sequential patterns are easily guessed`);
    }
    // Check repeated characters
    const repeated = detectRepeatedChars(password);
    if (repeated.found) {
        analysis.repeatedChars = {
            char: repeated.char,
            count: repeated.count
        };
        warnings.push(`Contains ${repeated.count} repeated "${repeated.char}" characters`);
    }
    // Calculate entropy
    const entropyResult = calculatePasswordEntropy(password);
    analysis.entropy = {
        bits: entropyResult.entropy,
        rating: entropyResult.rating
    };
    if (entropyResult.entropy < 28) {
        warnings.push(`Very low entropy (${entropyResult.entropy} bits) - password is too short or simple`);
    } else if (entropyResult.entropy < 40) {
        warnings.push(`Low entropy (${entropyResult.entropy} bits) - consider adding more variety`);
    }
    analysis.warnings = warnings;
    return analysis;
}
// Diceware-style word list for passphrase generation (EFF long word list subset)
const passphraseWords = [
    'abacus',
    'abdomen',
    'ability',
    'abroad',
    'absorb',
    'accent',
    'access',
    'account',
    'accuse',
    'achieve',
    'acquire',
    'across',
    'action',
    'active',
    'actual',
    'adapt',
    'address',
    'adjust',
    'admit',
    'adult',
    'advance',
    'advice',
    'affair',
    'afford',
    'afraid',
    'agenda',
    'agree',
    'ahead',
    'airport',
    'alarm',
    'album',
    'alert',
    'alien',
    'alive',
    'alley',
    'allow',
    'almost',
    'alone',
    'alpha',
    'already',
    'always',
    'amaze',
    'amount',
    'anchor',
    'ancient',
    'angel',
    'anger',
    'animal',
    'ankle',
    'annual',
    'answer',
    'antique',
    'anxiety',
    'apart',
    'appeal',
    'apple',
    'apply',
    'approve',
    'arch',
    'arena',
    'argue',
    'arise',
    'armor',
    'army',
    'around',
    'arrow',
    'artist',
    'aspect',
    'assign',
    'assist',
    'assume',
    'athlete',
    'atomic',
    'attach',
    'attack',
    'attend',
    'author',
    'autumn',
    'avenue',
    'average',
    'avoid',
    'awake',
    'award',
    'aware',
    'awesome',
    'awful',
    'bacon',
    'badge',
    'balance',
    'balcony',
    'bamboo',
    'banana',
    'banner',
    'barely',
    'barrel',
    'basic',
    'basket',
    'battle',
    'beach',
    'beacon',
    'beauty',
    'become',
    'before',
    'begin',
    'behave',
    'behind',
    'believe',
    'below',
    'bench',
    'benefit',
    'berry',
    'beyond',
    'bicycle',
    'blanket',
    'blossom',
    'board',
    'border',
    'bottle',
    'bottom',
    'bounce',
    'bracket',
    'brain',
    'branch',
    'brave',
    'bread',
    'breeze',
    'bridge',
    'bright',
    'broken',
    'bronze',
    'brother',
    'bubble',
    'bucket',
    'budget',
    'buffalo',
    'bundle',
    'burden',
    'butter',
    'button',
    'cabin',
    'cable',
    'cactus',
    'camera',
    'campus',
    'canal',
    'cancel',
    'candle',
    'canvas',
    'canyon',
    'capable',
    'capital',
    'captain',
    'capture',
    'carbon',
    'career',
    'carpet',
    'carrot',
    'castle',
    'casual',
    'catalog',
    'ceiling',
    'cement',
    'center',
    'central',
    'century',
    'cereal',
    'certain',
    'chain',
    'champion',
    'change',
    'channel',
    'chapter',
    'charge',
    'cherry',
    'chicken',
    'chief',
    'choice',
    'choose',
    'chronic',
    'circle',
    'citizen',
    'civil',
    'claim',
    'clarify',
    'classic',
    'clean',
    'clever',
    'client',
    'climate',
    'clinic',
    'clock',
    'closet',
    'clothes',
    'cluster',
    'clutter',
    'coach',
    'coast',
    'coconut',
    'coffee',
    'collect',
    'color',
    'column',
    'combine',
    'comfort',
    'comic',
    'common',
    'company',
    'compass',
    'compile',
    'complex',
    'concert',
    'conduct',
    'confirm',
    'congress',
    'connect',
    'consider',
    'contact',
    'contain',
    'contest',
    'context',
    'control',
    'convert',
    'cookie',
    'copper',
    'corner',
    'correct',
    'cosmic',
    'costume',
    'cotton',
    'country',
    'couple',
    'courage',
    'cousin',
    'cover',
    'cowboy',
    'craft',
    'crater',
    'crazy',
    'cream',
    'credit',
    'creek',
    'cricket',
    'crisis',
    'crisp',
    'critic',
    'cross',
    'crowd',
    'cruel',
    'cruise',
    'crystal',
    'culture',
    'cupboard',
    'curious',
    'current',
    'curtain',
    'custom',
    'cycle',
    'daisy',
    'damage',
    'dance',
    'danger',
    'daring',
    'daughter',
    'dawn',
    'debate',
    'decade',
    'decide',
    'decline',
    'decorate',
    'decrease',
    'defend',
    'define',
    'degree',
    'delay',
    'deliver',
    'demand',
    'denial',
    'dentist',
    'depart',
    'depend',
    'deposit',
    'depth',
    'deputy',
    'derive',
    'describe',
    'desert',
    'design',
    'desktop',
    'detail',
    'detect',
    'develop',
    'device',
    'devote',
    'diagram',
    'diamond',
    'diary',
    'diesel',
    'differ',
    'digital',
    'dignity',
    'dinner',
    'dinosaur',
    'direct',
    'disagree',
    'disaster',
    'discover',
    'discuss',
    'disease',
    'display',
    'distance',
    'divide',
    'dizzy',
    'doctor',
    'dolphin',
    'domain',
    'donate',
    'donkey',
    'double',
    'dragon',
    'drama',
    'drawer',
    'dream',
    'dress',
    'drink',
    'driver',
    'driveway',
    'drought',
    'drum',
    'eagle',
    'early',
    'earth',
    'easily',
    'eastern',
    'eclipse',
    'ecology',
    'economy',
    'educate',
    'effect',
    'effort',
    'either',
    'elastic',
    'elbow',
    'elder',
    'electric',
    'elegant',
    'element',
    'elephant',
    'elevator',
    'embrace',
    'emerge',
    'emotion',
    'emperor',
    'empire',
    'employ',
    'empty',
    'enable',
    'encode',
    'encore',
    'endless',
    'endorse',
    'enemy',
    'energy',
    'engage',
    'engine',
    'enhance',
    'enjoy',
    'enough',
    'enrich',
    'enroll',
    'ensure',
    'entire',
    'entry',
    'envelope',
    'episode',
    'equal',
    'equip',
    'escape',
    'essence',
    'estate',
    'eternal',
    'ethics',
    'evidence',
    'evolve',
    'exact',
    'example',
    'exceed',
    'exchange',
    'excite',
    'exclude',
    'excuse',
    'execute',
    'exercise',
    'exhaust',
    'exhibit',
    'exile',
    'exist',
    'exotic',
    'expand',
    'expect',
    'expense'
];
// Generate a secure passphrase
function generatePassphrase(wordCount = 4, separator = '-') {
    const words = [];
    const array = new Uint32Array(wordCount);
    crypto.getRandomValues(array);
    for(let i = 0; i < wordCount; i++){
        const index = array[i] % passphraseWords.length;
        words.push(passphraseWords[index]);
    }
    // Optionally add a number for extra entropy
    const numArray = new Uint32Array(1);
    crypto.getRandomValues(numArray);
    const randomNum = numArray[0] % 99 + 1;
    return words.join(separator) + separator + randomNum;
}
// Validate email format
function isValidEmail(email) {
    if (!email.includes('@')) {
        return {
            valid: false,
            reason: "Missing @ symbol"
        };
    }
    const [local, domain] = email.split('@');
    if (!local || local.length === 0) {
        return {
            valid: false,
            reason: "Missing username before @"
        };
    }
    if (!domain || domain.length === 0) {
        return {
            valid: false,
            reason: "Missing domain after @"
        };
    }
    if (!domain.includes('.')) {
        return {
            valid: false,
            reason: "Domain missing extension (like .com)"
        };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            valid: false,
            reason: "Invalid email format"
        };
    }
    return {
        valid: true
    };
}
// SHA-1 hash function for HIBP API
async function sha1(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b)=>b.toString(16).padStart(2, '0')).join('').toUpperCase();
}
// Check password against Have I Been Pwned API (free, uses k-Anonymity)
async function checkPasswordHIBP(password) {
    try {
        const hash = await sha1(password);
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
            headers: {
                'Add-Padding': 'true' // Adds padding to prevent response length analysis
            }
        });
        if (!response.ok) {
            throw new Error('HIBP API error');
        }
        const text = await response.text();
        const lines = text.split('\n');
        for (const line of lines){
            const [hashSuffix, count] = line.split(':');
            if (hashSuffix.trim() === suffix) {
                return {
                    breached: true,
                    count: parseInt(count.trim(), 10)
                };
            }
        }
        return {
            breached: false,
            count: 0
        };
    } catch (error) {
        // If API fails, return unknown status
        console.error('HIBP check failed:', error);
        return {
            breached: false,
            count: -1
        }; // -1 indicates check failed
    }
}
// Analyze password strength using zxcvbn
function analyzePasswordStrength(password) {
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zxcvbn$2f$lib$2f$main$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(password);
    const labels = [
        'Very Weak',
        'Weak',
        'Fair',
        'Strong',
        'Very Strong'
    ];
    const label = labels[result.score];
    const crackTime = result.crack_times_display.offline_slow_hashing_1e4_per_second;
    const feedback = [];
    if (result.feedback.warning) {
        feedback.push(result.feedback.warning);
    }
    feedback.push(...result.feedback.suggestions);
    return {
        score: result.score,
        label,
        crackTime,
        feedback
    };
}
function simulateBreachCheck(email) {
    const normalizedEmail = email.toLowerCase().trim();
    // Check for disposable email
    if (isDisposableEmail(normalizedEmail)) {
        return {
            status: "warning",
            message: "This appears to be a disposable or temporary email address. These are often used for spam and may not be accepted by many services.",
            recommendations: [
                "Use a permanent email address for important accounts",
                "Disposable emails cannot receive password reset links",
                "Many services block disposable email domains",
                "Consider using a reputable email provider for security"
            ]
        };
    }
    const knownCompromisedDomains = [
        "test.com",
        "example.com"
    ];
    const commonBreachPatterns = [
        "123",
        "password",
        "admin",
        "test",
        "user"
    ];
    const domain = normalizedEmail.split("@")[1];
    const localPart = normalizedEmail.split("@")[0];
    if (knownCompromisedDomains.includes(domain)) {
        return {
            status: "compromised",
            message: "This email domain has been associated with multiple data breaches.",
            breachCount: 3,
            commonBreaches: [
                "Sample Breach 2021",
                "Data Leak 2020",
                "Security Incident 2019"
            ],
            breachDetails: [
                {
                    name: "Sample Breach 2021",
                    date: "March 2021",
                    dataTypes: [
                        "Email addresses",
                        "Passwords",
                        "Names"
                    ],
                    description: "A major data aggregation service exposed user credentials through an unsecured database.",
                    severity: "high",
                    recordCount: "12 million",
                    remediationSteps: [
                        "Change your password immediately on any account using this email",
                        "If you reused this password elsewhere, change those passwords too",
                        "Enable two-factor authentication (2FA) on all accounts",
                        "Check your accounts for any unauthorized activity or changes",
                        "Consider using a password manager to create unique passwords"
                    ]
                },
                {
                    name: "Data Leak 2020",
                    date: "August 2020",
                    dataTypes: [
                        "Email addresses",
                        "IP addresses"
                    ],
                    description: "User data was collected from multiple sources and compiled into a searchable database.",
                    severity: "medium",
                    recordCount: "8 million",
                    remediationSteps: [
                        "Be extra vigilant about phishing emails targeting this address",
                        "Verify sender identity before clicking links in emails",
                        "Consider using email aliases for new account signups",
                        "Report suspicious emails to your email provider"
                    ]
                },
                {
                    name: "Security Incident 2019",
                    date: "November 2019",
                    dataTypes: [
                        "Email addresses",
                        "Usernames"
                    ],
                    description: "Basic account information was exposed through a misconfigured API endpoint.",
                    severity: "low",
                    recordCount: "500,000",
                    remediationSteps: [
                        "No immediate action required for this low-severity incident",
                        "Monitor your accounts for unusual login attempts",
                        "Keep your security software up to date"
                    ]
                }
            ],
            recommendations: [
                "Change your password immediately for all accounts using this email",
                "Enable two-factor authentication on all important accounts",
                "Consider using a different email for sensitive accounts",
                "Check your accounts for unauthorized activity",
                "Use a password manager to create unique passwords"
            ]
        };
    }
    if (commonBreachPatterns.some((pattern)=>localPart.includes(pattern))) {
        return {
            status: "warning",
            message: "Your email pattern suggests it may be at higher risk. While no specific breaches were found, accounts with common usernames are frequently targeted.",
            recommendations: [
                "Consider using a more unique email address for sensitive accounts",
                "Ensure you have strong, unique passwords for each account",
                "Enable two-factor authentication wherever possible",
                "Monitor your accounts regularly for suspicious activity"
            ]
        };
    }
    const hash = normalizedEmail.split("").reduce((a, b)=>{
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
    }, 0);
    if (Math.abs(hash) % 10 < 2) {
        return {
            status: "warning",
            message: "We found potential exposure in a minor data aggregation incident. This does not necessarily mean your password was compromised.",
            breachCount: 1,
            breachDetails: [
                {
                    name: "Data Aggregation Incident",
                    date: "2023",
                    dataTypes: [
                        "Email addresses"
                    ],
                    description: "Your email was found in a compiled list that aggregates data from various sources. This type of incident typically involves email addresses being collected from public sources, data broker lists, or minor security incidents. No passwords were included in this exposure.",
                    severity: "low",
                    recordCount: "Unknown",
                    remediationSteps: [
                        "Update passwords for your most important accounts (banking, email, social media)",
                        "Enable two-factor authentication on financial and email accounts",
                        "Be cautious of unsolicited emails - scammers may target this address",
                        "Consider setting up a spam filter or email alias for future signups",
                        "Monitor your credit report for any unauthorized accounts"
                    ]
                }
            ],
            recommendations: [
                "As a precaution, update passwords for your most important accounts",
                "Enable two-factor authentication on financial and email accounts",
                "Be extra vigilant about phishing emails",
                "Consider using a credit monitoring service"
            ]
        };
    }
    return {
        status: "safe",
        message: "Good news! We did not find this email in any known public data breaches.",
        recommendations: [
            "Continue using strong, unique passwords for each account",
            "Keep two-factor authentication enabled",
            "Stay alert for phishing attempts",
            "Check back periodically as new breaches are discovered"
        ]
    };
}
// Check password comprehensively
async function checkPassword(password) {
    // Analyze password patterns
    const patternAnalysis = analyzePasswordPatterns(password);
    // First check if it's a known common password
    if (commonPasswords.has(password.toLowerCase())) {
        return {
            status: "compromised",
            message: "This is one of the most common passwords used worldwide. It would be cracked instantly.",
            strength: 0,
            strengthLabel: "Extremely Weak",
            crackTime: "Instantly",
            suggestions: [
                "Never use common passwords like 123456, password, or qwerty",
                "Create a password with at least 12 characters",
                "Mix uppercase, lowercase, numbers, and symbols",
                "Use a password manager to generate strong passwords"
            ],
            breachCount: 999999,
            patternAnalysis,
            entropyBits: patternAnalysis.entropy.bits
        };
    }
    // Analyze strength with zxcvbn
    const strength = analyzePasswordStrength(password);
    // Check against Have I Been Pwned
    const hibpResult = await checkPasswordHIBP(password);
    // Merge pattern warnings with zxcvbn feedback
    const allSuggestions = [
        ...patternAnalysis.warnings,
        ...strength.feedback
    ];
    if (hibpResult.breached && hibpResult.count > 0) {
        return {
            status: "compromised",
            message: `This password has appeared in ${hibpResult.count.toLocaleString()} known data breaches. Do not use this password.`,
            strength: Math.min(strength.score, 1),
            strengthLabel: "Compromised",
            crackTime: strength.crackTime,
            suggestions: [
                "This password was found in leaked databases and may be used in attacks",
                "Choose a completely different password",
                "Consider using a passphrase with 4 or more random words",
                "Use a password manager to generate unique passwords",
                ...allSuggestions.slice(0, 3)
            ],
            breachCount: hibpResult.count,
            patternAnalysis,
            entropyBits: patternAnalysis.entropy.bits
        };
    }
    // Check if pattern analysis found concerning issues
    const hasPatternIssues = patternAnalysis.warnings.length > 0;
    // Password is not in breach database
    if (strength.score >= 3 && !hasPatternIssues) {
        return {
            status: "safe",
            message: "This password was not found in any known data breaches and has good strength.",
            strength: strength.score,
            strengthLabel: strength.label,
            crackTime: strength.crackTime,
            suggestions: allSuggestions.length > 0 ? allSuggestions : [
                "Your password appears strong",
                "Enable two-factor authentication for extra security",
                "Never reuse passwords across multiple accounts"
            ],
            patternAnalysis,
            entropyBits: patternAnalysis.entropy.bits
        };
    }
    // Adjust strength score if pattern issues found
    const adjustedScore = hasPatternIssues ? Math.max(0, strength.score - 1) : strength.score;
    return {
        status: "weak",
        message: hibpResult.count === -1 ? "Unable to check breach database, but password strength analysis completed." : hasPatternIssues ? "This password contains predictable patterns that make it easier to guess." : "This password was not found in breaches, but could be stronger.",
        strength: adjustedScore,
        strengthLabel: hasPatternIssues && adjustedScore <= 1 ? "Patterned" : strength.label,
        crackTime: strength.crackTime,
        suggestions: [
            ...allSuggestions,
            "Consider making your password longer",
            "Add more variety with uppercase, numbers, and symbols"
        ].slice(0, 6),
        patternAnalysis,
        entropyBits: patternAnalysis.entropy.bits
    };
}
function BreachChecker() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("email");
    // Email check state
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isCheckingEmail, setIsCheckingEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [emailResult, setEmailResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hasCheckedEmail, setHasCheckedEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Password check state
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCheckingPassword, setIsCheckingPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [passwordResult, setPasswordResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hasCheckedPassword, setHasCheckedPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Passphrase generator state
    const [generatedPassphrase, setGeneratedPassphrase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showPassphrase, setShowPassphrase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleGeneratePassphrase = ()=>{
        const newPassphrase = generatePassphrase(4, '-');
        setGeneratedPassphrase(newPassphrase);
        setShowPassphrase(true);
    };
    const handleCopyPassphrase = ()=>{
        navigator.clipboard.writeText(generatedPassphrase);
    };
    const handleCheckEmail = async ()=>{
        const validation = isValidEmail(email);
        if (!validation.valid) return;
        setIsCheckingEmail(true);
        setEmailResult(null);
        try {
            // Check for disposable email first
            if (isDisposableEmail(email)) {
                setEmailResult({
                    status: "warning",
                    message: "This appears to be a disposable or temporary email address. These are often used for spam and may not be accepted by many services.",
                    recommendations: [
                        "Use a permanent email address for important accounts",
                        "Disposable emails cannot receive password reset links",
                        "Many services block disposable email domains",
                        "Consider using a reputable email provider for security"
                    ]
                });
                setHasCheckedEmail(true);
                setIsCheckingEmail(false);
                return;
            }
            // Call the XposedOrNot API through our backend proxy
            const response = await fetch('/api/security/check-email-breach', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim()
                })
            });
            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('rate_limit');
                }
                throw new Error('api_error');
            }
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'api_error');
            }
            if (data.breached && data.breaches && data.breaches.length > 0) {
                // Build breach details from the response
                const breachDetails = data.breaches.slice(0, 10).map((breachName)=>{
                    // Map severity based on breach name patterns
                    let severity = "medium";
                    const lowerName = breachName.toLowerCase();
                    if (lowerName.includes('bank') || lowerName.includes('financial') || lowerName.includes('credit')) {
                        severity = "critical";
                    } else if (lowerName.includes('password') || lowerName.includes('adobe') || lowerName.includes('linkedin')) {
                        severity = "high";
                    } else if (lowerName.includes('email') || lowerName.includes('newsletter')) {
                        severity = "low";
                    }
                    return {
                        name: breachName,
                        date: "Check XposedOrNot.com for details",
                        dataTypes: [
                            "Email addresses",
                            "Potentially other data"
                        ],
                        description: `Your email was found in the ${breachName} data breach. Visit XposedOrNot.com for detailed information about this breach.`,
                        severity,
                        remediationSteps: [
                            "Change your password on the affected service immediately",
                            "If you reused this password elsewhere, change those passwords too",
                            "Enable two-factor authentication (2FA) on the affected account",
                            "Monitor your accounts for unauthorized activity",
                            "Consider using a password manager for unique passwords"
                        ]
                    };
                });
                setEmailResult({
                    status: "compromised",
                    message: data.message,
                    breachCount: data.breachCount,
                    commonBreaches: data.breaches.slice(0, 5),
                    breachDetails,
                    recommendations: [
                        "Change passwords immediately for all accounts using this email",
                        "Enable two-factor authentication on all important accounts",
                        "Use unique passwords for each account (consider a password manager)",
                        "Check your accounts for unauthorized activity",
                        "Be extra vigilant about phishing emails targeting this address"
                    ]
                });
            } else {
                setEmailResult({
                    status: "safe",
                    message: data.message || "Good news! We did not find this email in any known public data breaches.",
                    recommendations: [
                        "Continue using strong, unique passwords for each account",
                        "Keep two-factor authentication enabled",
                        "Stay alert for phishing attempts",
                        "Check back periodically as new breaches are discovered"
                    ]
                });
            }
        } catch (error) {
            console.error('Breach check error:', error);
            if (error.message === 'rate_limit') {
                setEmailResult({
                    status: "warning",
                    message: "Too many requests. Please wait a moment and try again.",
                    recommendations: [
                        "Wait 30 seconds before trying again",
                        "Our breach database receives millions of checks daily"
                    ]
                });
            } else {
                setEmailResult({
                    status: "warning",
                    message: "We were unable to check this email right now. Our breach database may be temporarily unavailable. Please try again in a few minutes.",
                    recommendations: [
                        "Try again in a few minutes",
                        "In the meantime, use strong unique passwords for every account",
                        "Enable two-factor authentication on all important accounts",
                        "Consider signing up for breach monitoring alerts"
                    ]
                });
            }
        }
        setHasCheckedEmail(true);
        setIsCheckingEmail(false);
    };
    const handleResetEmail = ()=>{
        setEmail("");
        setEmailResult(null);
        setHasCheckedEmail(false);
    };
    const handleCheckPassword = async ()=>{
        if (!password || password.length < 1) return;
        setIsCheckingPassword(true);
        setPasswordResult(null);
        const checkResult = await checkPassword(password);
        setPasswordResult(checkResult);
        setHasCheckedPassword(true);
        setIsCheckingPassword(false);
    };
    const handleResetPassword = ()=>{
        setPassword("");
        setPasswordResult(null);
        setHasCheckedPassword(false);
    };
    const getEmailStatusIcon = ()=>{
        if (!emailResult) return null;
        switch(emailResult.status){
            case "safe":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                    className: "w-16 h-16 text-green-500"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/breach-checker.tsx",
                    lineNumber: 930,
                    columnNumber: 16
                }, this);
            case "warning":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                    className: "w-16 h-16 text-yellow-500"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/breach-checker.tsx",
                    lineNumber: 932,
                    columnNumber: 16
                }, this);
            case "compromised":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: "w-16 h-16 text-red-500"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/breach-checker.tsx",
                    lineNumber: 934,
                    columnNumber: 16
                }, this);
        }
    };
    const getEmailStatusColor = ()=>{
        if (!emailResult) return "";
        switch(emailResult.status){
            case "safe":
                return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900";
            case "warning":
                return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900";
            case "compromised":
                return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900";
        }
    };
    const getEmailStatusBadge = ()=>{
        if (!emailResult) return null;
        switch(emailResult.status){
            case "safe":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    className: "bg-green-500 text-white",
                    children: "No Breaches Found"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/breach-checker.tsx",
                    lineNumber: 956,
                    columnNumber: 16
                }, this);
            case "warning":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    className: "bg-yellow-500 text-black",
                    children: "Potential Exposure"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/breach-checker.tsx",
                    lineNumber: 958,
                    columnNumber: 16
                }, this);
            case "compromised":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "destructive",
                    children: "Breaches Detected"
                }, void 0, false, {
                    fileName: "[project]/client/src/components/breach-checker.tsx",
                    lineNumber: 960,
                    columnNumber: 16
                }, this);
        }
    };
    const getPasswordStatusColor = ()=>{
        if (!passwordResult) return "";
        switch(passwordResult.status){
            case "safe":
                return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900";
            case "weak":
                return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900";
            case "compromised":
                return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900";
        }
    };
    const getStrengthColor = (score)=>{
        const colors = [
            "bg-red-500",
            "bg-orange-500",
            "bg-yellow-500",
            "bg-lime-500",
            "bg-green-500"
        ];
        return colors[score] || "bg-gray-300";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "w-full",
        "data-testid": "card-breach-checker",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                className: "pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                className: "w-6 h-6 text-primary"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                lineNumber: 993,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/src/components/breach-checker.tsx",
                            lineNumber: 992,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-xl",
                                    children: "Security Checker"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                    lineNumber: 996,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: "Check emails for breaches and passwords for security"
                                }, void 0, false, {
                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                    lineNumber: 997,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/client/src/components/breach-checker.tsx",
                            lineNumber: 995,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/src/components/breach-checker.tsx",
                    lineNumber: 991,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/client/src/components/breach-checker.tsx",
                lineNumber: 990,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"], {
                        value: activeTab,
                        onValueChange: setActiveTab,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsList"], {
                                className: "grid w-full grid-cols-2 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "email",
                                        className: "gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1005,
                                                columnNumber: 15
                                            }, this),
                                            "Email Check"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1004,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "password",
                                        className: "gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1009,
                                                columnNumber: 15
                                            }, this),
                                            "Password Check"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1008,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                lineNumber: 1003,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                value: "email",
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground",
                                                        "aria-hidden": "true"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1018,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                        type: "email",
                                                        placeholder: "Enter your email address",
                                                        value: email,
                                                        onChange: (e)=>setEmail(e.target.value),
                                                        className: "pl-10",
                                                        disabled: isCheckingEmail,
                                                        "aria-label": "Email address to check for data breaches",
                                                        "data-testid": "input-breach-email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1019,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1017,
                                                columnNumber: 15
                                            }, this),
                                            hasCheckedEmail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: handleResetEmail,
                                                variant: "outline",
                                                "data-testid": "button-reset-breach-check",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                        className: "w-4 h-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1036,
                                                        columnNumber: 19
                                                    }, this),
                                                    "New Check"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1031,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: handleCheckEmail,
                                                disabled: !email || !email.includes("@") || isCheckingEmail,
                                                "aria-label": isCheckingEmail ? "Checking email for breaches" : "Check email for data breaches",
                                                "aria-busy": isCheckingEmail,
                                                "data-testid": "button-check-breach",
                                                children: isCheckingEmail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                            className: "w-4 h-4 mr-2 animate-pulse",
                                                            "aria-hidden": "true"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                            lineNumber: 1049,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Checking..."
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                            className: "w-4 h-4 mr-2",
                                                            "aria-hidden": "true"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                            lineNumber: 1054,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Check Email"
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1040,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1016,
                                        columnNumber: 13
                                    }, this),
                                    isCheckingEmail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-8",
                                        role: "status",
                                        "aria-label": "Checking for data breaches",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "w-8 h-8 text-primary animate-pulse",
                                                    "aria-hidden": "true"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                    lineNumber: 1065,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1064,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-muted-foreground",
                                                children: "Searching breach databases..."
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1067,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground mt-1",
                                                children: "This may take a few seconds"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1068,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1063,
                                        columnNumber: 15
                                    }, this),
                                    emailResult && !isCheckingEmail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `rounded-lg border p-6 ${getEmailStatusColor()}`,
                                        role: "alert",
                                        "aria-live": "polite",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col items-center text-center mb-6",
                                                children: [
                                                    getEmailStatusIcon(),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-4",
                                                        children: getEmailStatusBadge()
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1076,
                                                        columnNumber: 19
                                                    }, this),
                                                    emailResult.breachCount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-2 text-2xl font-bold",
                                                        children: [
                                                            emailResult.breachCount,
                                                            " ",
                                                            emailResult.breachCount === 1 ? "breach" : "breaches",
                                                            " found"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1080,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1074,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-center mb-6",
                                                children: emailResult.message
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1086,
                                                columnNumber: 17
                                            }, this),
                                            emailResult.breachDetails && emailResult.breachDetails.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-6 space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1091,
                                                                columnNumber: 23
                                                            }, this),
                                                            "Breach Details"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1090,
                                                        columnNumber: 21
                                                    }, this),
                                                    emailResult.breachDetails.map((breach, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-background/70 rounded-lg p-4 border border-border/50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap items-center gap-2 mb-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                            className: "font-semibold text-base",
                                                                            children: breach.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                            lineNumber: 1097,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                            variant: "outline",
                                                                            className: breach.severity === "critical" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300" : breach.severity === "high" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300" : breach.severity === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300",
                                                                            children: [
                                                                                breach.severity.charAt(0).toUpperCase() + breach.severity.slice(1),
                                                                                " Severity"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                            lineNumber: 1098,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                    lineNumber: 1096,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid sm:grid-cols-2 gap-3 text-sm mb-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-muted-foreground",
                                                                                    children: "Date: "
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                                    lineNumber: 1113,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium",
                                                                                    children: breach.date
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                                    lineNumber: 1114,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                            lineNumber: 1112,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        breach.recordCount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-muted-foreground",
                                                                                    children: "Records Affected: "
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                                    lineNumber: 1118,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium",
                                                                                    children: breach.recordCount
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                                    lineNumber: 1119,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                            lineNumber: 1117,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                    lineNumber: 1111,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mb-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm text-muted-foreground",
                                                                            children: "Data Exposed: "
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                            lineNumber: 1125,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap gap-1 mt-1",
                                                                            children: breach.dataTypes.map((dataType, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                    variant: "secondary",
                                                                                    className: "text-xs",
                                                                                    children: dataType
                                                                                }, i, false, {
                                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                                    lineNumber: 1128,
                                                                                    columnNumber: 31
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                            lineNumber: 1126,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                    lineNumber: 1124,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-muted-foreground mb-3",
                                                                    children: breach.description
                                                                }, void 0, false, {
                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                    lineNumber: 1135,
                                                                    columnNumber: 25
                                                                }, this),
                                                                breach.remediationSteps && breach.remediationSteps.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-3 pt-3 border-t border-border/50",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-medium mb-2 flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                                                    className: "w-4 h-4 text-primary"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                                    lineNumber: 1140,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                "Steps to Protect Yourself"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                            lineNumber: 1139,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                            className: "space-y-1.5",
                                                                            children: breach.remediationSteps.map((step, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                    className: "flex items-start gap-2 text-sm",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                            className: "w-4 h-4 text-primary mt-0.5 shrink-0"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                                            lineNumber: 1146,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            children: step
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                                            lineNumber: 1147,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, i, true, {
                                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                                    lineNumber: 1145,
                                                                                    columnNumber: 33
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                            lineNumber: 1143,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                    lineNumber: 1138,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, idx, true, {
                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                            lineNumber: 1095,
                                                            columnNumber: 23
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1089,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-background/50 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium mb-3 flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                className: "w-4 h-4 text-primary"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1160,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Recommended Actions"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1159,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: "space-y-2",
                                                        children: emailResult.recommendations.map((rec, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex items-start gap-2 text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-primary mt-1",
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1166,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: rec
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1167,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1165,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1163,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1158,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1073,
                                        columnNumber: 15
                                    }, this),
                                    !emailResult && !isCheckingEmail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid sm:grid-cols-3 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-muted/50 rounded-lg text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                        className: "w-8 h-8 text-primary mx-auto mb-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1178,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-sm",
                                                        children: "Private and Secure"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1179,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Your email is never stored"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1180,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1177,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-muted/50 rounded-lg text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        className: "w-8 h-8 text-primary mx-auto mb-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1183,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-sm",
                                                        children: "Breach Database"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1184,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Checks known data leaks"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1185,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1182,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-muted/50 rounded-lg text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                                        className: "w-8 h-8 text-primary mx-auto mb-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1188,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-sm",
                                                        children: "Actionable Tips"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1189,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Get protection advice"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1190,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1187,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1176,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                lineNumber: 1015,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                                value: "password",
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground",
                                                        "aria-hidden": "true"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1200,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                        type: showPassword ? "text" : "password",
                                                        placeholder: "Enter a password to check",
                                                        value: password,
                                                        onChange: (e)=>setPassword(e.target.value),
                                                        className: "pl-10 pr-10",
                                                        disabled: isCheckingPassword,
                                                        "aria-label": "Password to check for breaches and strength",
                                                        "data-testid": "input-breach-password"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1201,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setShowPassword(!showPassword),
                                                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                                                        "aria-label": showPassword ? "Hide password" : "Show password",
                                                        children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                            lineNumber: 1217,
                                                            columnNumber: 35
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                            lineNumber: 1217,
                                                            columnNumber: 68
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1211,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1199,
                                                columnNumber: 15
                                            }, this),
                                            hasCheckedPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: handleResetPassword,
                                                variant: "outline",
                                                "data-testid": "button-reset-password-check",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                        className: "w-4 h-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1226,
                                                        columnNumber: 19
                                                    }, this),
                                                    "New Check"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1221,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: handleCheckPassword,
                                                disabled: !password || password.length < 1 || isCheckingPassword,
                                                "aria-label": isCheckingPassword ? "Checking password security" : "Check password security",
                                                "aria-busy": isCheckingPassword,
                                                "data-testid": "button-check-password",
                                                children: isCheckingPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                            className: "w-4 h-4 mr-2 animate-pulse",
                                                            "aria-hidden": "true"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                            lineNumber: 1239,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Checking..."
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                            className: "w-4 h-4 mr-2",
                                                            "aria-hidden": "true"
                                                        }, void 0, false, {
                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                            lineNumber: 1244,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Check Password"
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1230,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1198,
                                        columnNumber: 13
                                    }, this),
                                    isCheckingPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-8",
                                        role: "status",
                                        "aria-label": "Checking password security",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                    className: "w-8 h-8 text-primary animate-pulse",
                                                    "aria-hidden": "true"
                                                }, void 0, false, {
                                                    fileName: "[project]/client/src/components/breach-checker.tsx",
                                                    lineNumber: 1255,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1254,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-muted-foreground",
                                                children: "Checking against 700+ million breached passwords..."
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1257,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground mt-1",
                                                children: "Using Have I Been Pwned database"
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1258,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1253,
                                        columnNumber: 15
                                    }, this),
                                    passwordResult && !isCheckingPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `rounded-lg border p-6 ${getPasswordStatusColor()}`,
                                        role: "alert",
                                        "aria-live": "polite",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col items-center text-center mb-6",
                                                children: [
                                                    passwordResult.status === "safe" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                        className: "w-16 h-16 text-green-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1265,
                                                        columnNumber: 56
                                                    }, this),
                                                    passwordResult.status === "weak" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                                        className: "w-16 h-16 text-yellow-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1266,
                                                        columnNumber: 56
                                                    }, this),
                                                    passwordResult.status === "compromised" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                        className: "w-16 h-16 text-red-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1267,
                                                        columnNumber: 63
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-4 space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                className: passwordResult.status === "safe" ? "bg-green-500 text-white" : passwordResult.status === "weak" ? "bg-yellow-500 text-black" : "bg-red-500 text-white",
                                                                children: passwordResult.strengthLabel
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1270,
                                                                columnNumber: 21
                                                            }, this),
                                                            passwordResult.breachCount && passwordResult.breachCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: [
                                                                    "Found in ",
                                                                    passwordResult.breachCount.toLocaleString(),
                                                                    " breaches"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1279,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1269,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1264,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-sm mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Password Strength"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1289,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Time to crack: ",
                                                                    passwordResult.crackTime
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1290,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1288,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-1",
                                                        children: [
                                                            0,
                                                            1,
                                                            2,
                                                            3,
                                                            4
                                                        ].map((level)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `h-2 flex-1 rounded-full ${level <= passwordResult.strength ? getStrengthColor(passwordResult.strength) : 'bg-gray-200 dark:bg-gray-700'}`
                                                            }, level, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1294,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1292,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1287,
                                                columnNumber: 17
                                            }, this),
                                            passwordResult.entropyBits !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4 p-3 bg-background/50 rounded-lg",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1309,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    "Entropy"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1308,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: "outline",
                                                                className: passwordResult.entropyBits >= 60 ? "border-green-500 text-green-600" : passwordResult.entropyBits >= 40 ? "border-yellow-500 text-yellow-600" : "border-red-500 text-red-600",
                                                                children: [
                                                                    passwordResult.entropyBits,
                                                                    " bits (",
                                                                    passwordResult.patternAnalysis?.entropy.rating || 'Unknown',
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1312,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1307,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground mt-1",
                                                        children: "Higher entropy means more randomness and better security. Aim for 60+ bits."
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1320,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1306,
                                                columnNumber: 19
                                            }, this),
                                            passwordResult.patternAnalysis && passwordResult.patternAnalysis.warnings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-sm text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1330,
                                                                columnNumber: 23
                                                            }, this),
                                                            "Pattern Issues Detected"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1329,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: "space-y-1",
                                                        children: passwordResult.patternAnalysis.warnings.slice(0, 4).map((warning, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "text-xs text-yellow-700 dark:text-yellow-300 flex items-start gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "mt-0.5",
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1336,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: warning
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1337,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1335,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1333,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1328,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-center mb-6",
                                                children: passwordResult.message
                                            }, void 0, false, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1344,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-background/50 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium mb-3 flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                className: "w-4 h-4 text-primary"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1348,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Suggestions"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1347,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: "space-y-2",
                                                        children: passwordResult.suggestions.slice(0, 5).map((suggestion, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex items-start gap-2 text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-primary mt-1",
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1354,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: suggestion
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1355,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1353,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1351,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1346,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1263,
                                        columnNumber: 15
                                    }, this),
                                    !passwordResult && !isCheckingPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid sm:grid-cols-3 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-muted/50 rounded-lg text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                className: "w-8 h-8 text-primary mx-auto mb-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1367,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium text-sm",
                                                                children: "Breach Check"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1368,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted-foreground",
                                                                children: "Checks 700M+ passwords"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1369,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1366,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-muted/50 rounded-lg text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                                className: "w-8 h-8 text-primary mx-auto mb-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1372,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium text-sm",
                                                                children: "Pattern Detection"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1373,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted-foreground",
                                                                children: "Keyboard, dates, sequences"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1374,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1371,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-muted/50 rounded-lg text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                className: "w-8 h-8 text-primary mx-auto mb-2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1377,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium text-sm",
                                                                children: "Entropy Analysis"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1378,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted-foreground",
                                                                children: "Measures true randomness"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1379,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1376,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1365,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                        className: "w-5 h-5 text-primary"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1387,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium text-sm",
                                                                        children: "Need a Strong Password?"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1388,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1386,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                size: "sm",
                                                                onClick: handleGeneratePassphrase,
                                                                "data-testid": "button-generate-passphrase",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                                        className: "w-3 h-3 mr-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1395,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    "Generate Passphrase"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1390,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1385,
                                                        columnNumber: 19
                                                    }, this),
                                                    generatedPassphrase && showPassphrase && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-3 p-3 bg-background rounded-lg border",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                        className: "flex-1 font-mono text-sm break-all",
                                                                        children: generatedPassphrase
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1403,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        size: "icon",
                                                                        variant: "ghost",
                                                                        onClick: handleCopyPassphrase,
                                                                        "data-testid": "button-copy-passphrase",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                            lineNumber: 1405,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                        lineNumber: 1404,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1402,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted-foreground mt-2",
                                                                children: "Passphrases like this are easy to remember but very hard to crack. Save this somewhere safe."
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1408,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1401,
                                                        columnNumber: 21
                                                    }, this),
                                                    !generatedPassphrase && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "We will generate a secure passphrase using random words. Easier to remember than random characters."
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1416,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1384,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                        className: "w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1423,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium text-blue-800 dark:text-blue-200 mb-1",
                                                                children: "How Password Check Works"
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1425,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-blue-700 dark:text-blue-300",
                                                                children: "We use Have I Been Pwned's secure k-Anonymity model. Only the first 5 characters of your password's hash are sent to check against 700+ million breached passwords. Your actual password never leaves your browser."
                                                            }, void 0, false, {
                                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                                lineNumber: 1426,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                                        lineNumber: 1424,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                                lineNumber: 1422,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1364,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                lineNumber: 1197,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/breach-checker.tsx",
                        lineNumber: 1002,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                className: "w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                            }, void 0, false, {
                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                lineNumber: 1439,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium text-green-800 dark:text-green-200 mb-1",
                                        children: "Your Privacy Matters"
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1441,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-green-700 dark:text-green-300",
                                        children: "All checks run securely. Email checks are simulated locally. Password checks use k-Anonymity so your full password is never transmitted."
                                    }, void 0, false, {
                                        fileName: "[project]/client/src/components/breach-checker.tsx",
                                        lineNumber: 1442,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/client/src/components/breach-checker.tsx",
                                lineNumber: 1440,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/client/src/components/breach-checker.tsx",
                        lineNumber: 1438,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/client/src/components/breach-checker.tsx",
                lineNumber: 1001,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/src/components/breach-checker.tsx",
        lineNumber: 989,
        columnNumber: 5
    }, this);
}
_s(BreachChecker, "XH9N7SxLAL8j2f2GO1pfBDmYDcE=");
_c = BreachChecker;
var _c;
__turbopack_context__.k.register(_c, "BreachChecker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=client_src_components_breach-checker_tsx_123howx._.js.map