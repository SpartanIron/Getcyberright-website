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
"[project]/client/src/pages/feedback.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Feedback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wouter/src/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$seo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/src/hooks/use-seo.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function Feedback() {
    _s();
    const [, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$seo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSEO"])({
        title: "Feedback - Help Us Improve | GetCyberRight",
        description: "Share your feedback to help us improve GetCyberRight. Your voice matters in building a safer digital world for everyone.",
        keywords: "getcyberright feedback, cybersecurity suggestions, improve online safety"
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Feedback.useEffect": ()=>{
            setLocation("/contact?topic=feedback");
        }
    }["Feedback.useEffect"], [
        setLocation
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-muted-foreground",
            children: "Redirecting to contact form..."
        }, void 0, false, {
            fileName: "[project]/client/src/pages/feedback.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/client/src/pages/feedback.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_s(Feedback, "Z+EHkMsoBSSuk9755iXFBwviTqE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$src$2f$hooks$2f$use$2d$seo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSEO"]
    ];
});
_c = Feedback;
var _c;
__turbopack_context__.k.register(_c, "Feedback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/regexparam/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @param {string|RegExp} input The route pattern
 * @param {boolean} [loose] Allow open-ended matching. Ignored with `RegExp` input.
 */ __turbopack_context__.s([
    "inject",
    ()=>inject,
    "parse",
    ()=>parse
]);
function parse(input, loose) {
    if (input instanceof RegExp) return {
        keys: false,
        pattern: input
    };
    var c, o, tmp, ext, keys = [], pattern = '', arr = input.split('/');
    arr[0] || arr.shift();
    while(tmp = arr.shift()){
        c = tmp[0];
        if (c === '*') {
            keys.push(c);
            pattern += tmp[1] === '?' ? '(?:/(.*))?' : '/(.*)';
        } else if (c === ':') {
            o = tmp.indexOf('?', 1);
            ext = tmp.indexOf('.', 1);
            keys.push(tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length));
            pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
            if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
        } else {
            pattern += '/' + tmp;
        }
    }
    return {
        keys: keys,
        pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    };
}
var RGX = /(\/|^)([:*][^/]*?)(\?)?(?=[/.]|$)/g;
function inject(route, values) {
    return route.replace(RGX, (x, lead, key, optional)=>{
        x = values[key == '*' ? key : key.substring(1)];
        return x ? '/' + x : optional || key == '*' ? '' : '/' + key;
    });
}
}),
"[project]/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    function useSyncExternalStore$2(subscribe, getSnapshot) {
        didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
        var value = getSnapshot();
        if (!didWarnUncachedGetSnapshot) {
            var cachedValue = getSnapshot();
            objectIs(value, cachedValue) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
        }
        cachedValue = useState({
            inst: {
                value: value,
                getSnapshot: getSnapshot
            }
        });
        var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
        useLayoutEffect({
            "useSyncExternalStore$2.useLayoutEffect": function() {
                inst.value = value;
                inst.getSnapshot = getSnapshot;
                checkIfSnapshotChanged(inst) && forceUpdate({
                    inst: inst
                });
            }
        }["useSyncExternalStore$2.useLayoutEffect"], [
            subscribe,
            value,
            getSnapshot
        ]);
        useEffect({
            "useSyncExternalStore$2.useEffect": function() {
                checkIfSnapshotChanged(inst) && forceUpdate({
                    inst: inst
                });
                return subscribe({
                    "useSyncExternalStore$2.useEffect": function() {
                        checkIfSnapshotChanged(inst) && forceUpdate({
                            inst: inst
                        });
                    }
                }["useSyncExternalStore$2.useEffect"]);
            }
        }["useSyncExternalStore$2.useEffect"], [
            subscribe
        ]);
        useDebugValue(value);
        return value;
    }
    function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        inst = inst.value;
        try {
            var nextValue = latestGetSnapshot();
            return !objectIs(inst, nextValue);
        } catch (error) {
            return !0;
        }
    }
    function useSyncExternalStore$1(subscribe, getSnapshot) {
        return getSnapshot();
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = !1, didWarnUncachedGetSnapshot = !1, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
    exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
}();
}),
"[project]/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/wouter/src/use-sync-external-store.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)");
;
}),
"[project]/node_modules/wouter/src/react-deps.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEvent",
    ()=>useEvent,
    "useInsertionEffect",
    ()=>useInsertionEffect,
    "useIsomorphicLayoutEffect",
    ()=>useIsomorphicLayoutEffect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// To resolve webpack 5 errors, while not presenting problems for native,
// we copy the approaches from https://github.com/TanStack/query/pull/3561
// and https://github.com/TanStack/query/pull/3601
// ~ Show this aging PR some love to remove the need for this hack:
//   https://github.com/facebook/react/pull/25231 ~
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$use$2d$sync$2d$external$2d$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/wouter/src/use-sync-external-store.js [app-client] (ecmascript) <locals>");
;
// React.useInsertionEffect is not available in React <18
// This hack fixes a transpilation issue on some apps
const useBuiltinInsertionEffect = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInsertion" + "Effect"];
;
;
// Copied from:
// https://github.com/facebook/react/blob/main/packages/shared/ExecutionEnvironment.js
const canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
const useIsomorphicLayoutEffect = canUseDOM ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useLayoutEffect : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useEffect;
const useInsertionEffect = useBuiltinInsertionEffect || useIsomorphicLayoutEffect;
const useEvent = (fn)=>{
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.useRef([
        fn,
        {
            "useEvent.useRef": (...args)=>ref[0](...args)
        }["useEvent.useRef"]
    ]).current;
    // Per Dan Abramov: useInsertionEffect executes marginally closer to the
    // correct timing for ref synchronization than useLayoutEffect on React 18.
    // See: https://github.com/facebook/react/pull/25881#issuecomment-1356244360
    useInsertionEffect({
        "useEvent.useInsertionEffect": ()=>{
            ref[0] = fn;
        }
    }["useEvent.useInsertionEffect"]);
    return ref[1];
};
}),
"[project]/node_modules/wouter/src/use-browser-location.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "navigate",
    ()=>navigate,
    "useBrowserLocation",
    ()=>useBrowserLocation,
    "useHistoryState",
    ()=>useHistoryState,
    "useLocationProperty",
    ()=>useLocationProperty,
    "usePathname",
    ()=>usePathname,
    "useSearch",
    ()=>useSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$react$2d$deps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/wouter/src/react-deps.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)");
;
/**
 * History API docs @see https://developer.mozilla.org/en-US/docs/Web/API/History
 */ const eventPopstate = "popstate";
const eventPushState = "pushState";
const eventReplaceState = "replaceState";
const eventHashchange = "hashchange";
const events = [
    eventPopstate,
    eventPushState,
    eventReplaceState,
    eventHashchange
];
const subscribeToLocationUpdates = (callback)=>{
    for (const event of events){
        addEventListener(event, callback);
    }
    return ()=>{
        for (const event of events){
            removeEventListener(event, callback);
        }
    };
};
const useLocationProperty = (fn, ssrFn)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeToLocationUpdates, fn, ssrFn);
const currentSearch = ()=>location.search;
const useSearch = ({ ssrSearch } = {})=>useLocationProperty(currentSearch, // != null checks for both null and undefined, but allows empty string ""
    // This allows proper hydration: server renders with ssrSearch="?foo",
    // client hydrates with just <Router /> and reads from location.search
    ssrSearch != null ? ({
        "useSearch.useLocationProperty": ()=>ssrSearch
    })["useSearch.useLocationProperty"] : currentSearch);
const currentPathname = ()=>location.pathname;
const usePathname = ({ ssrPath } = {})=>useLocationProperty(currentPathname, // != null checks for both null and undefined, but allows empty string ""
    // This allows proper hydration: server renders with ssrPath="/foo",
    // client hydrates with just <Router /> and reads from location.pathname
    ssrPath != null ? ({
        "usePathname.useLocationProperty": ()=>ssrPath
    })["usePathname.useLocationProperty"] : currentPathname);
const currentHistoryState = ()=>history.state;
const useHistoryState = ()=>useLocationProperty(currentHistoryState, {
        "useHistoryState.useLocationProperty": ()=>null
    }["useHistoryState.useLocationProperty"]);
const navigate = (to, { replace = false, state = null } = {})=>history[replace ? eventReplaceState : eventPushState](state, "", to);
const useBrowserLocation = (opts = {})=>[
        usePathname(opts),
        navigate
    ];
const patchKey = Symbol.for("wouter_v3");
// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031
if (typeof history !== "undefined" && typeof window[patchKey] === "undefined") {
    for (const type of [
        eventPushState,
        eventReplaceState
    ]){
        const original = history[type];
        // TODO: we should be using unstable_batchedUpdates to avoid multiple re-renders,
        // however that will require an additional peer dependency on react-dom.
        // See: https://github.com/reactwg/react-18/discussions/86#discussioncomment-1567149
        history[type] = function() {
            const result = original.apply(this, arguments);
            const event = new Event(type);
            event.arguments = arguments;
            dispatchEvent(event);
            return result;
        };
    }
    // patch history object only once
    // See: https://github.com/molefrog/wouter/issues/167
    Object.defineProperty(window, patchKey, {
        value: true
    });
}
}),
"[project]/node_modules/wouter/src/paths.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "absolutePath",
    ()=>absolutePath,
    "relativePath",
    ()=>relativePath,
    "sanitizeSearch",
    ()=>sanitizeSearch
]);
/*
 * Transforms `path` into its relative `base` version
 * If base isn't part of the path provided returns absolute path e.g. `~/app`
 */ const _relativePath = (base, path)=>!path.toLowerCase().indexOf(base.toLowerCase()) ? path.slice(base.length) || "/" : "~" + path;
/**
 * When basepath is `undefined` or '/' it is ignored (we assume it's empty string)
 */ const baseDefaults = (base = "")=>base === "/" ? "" : base;
const absolutePath = (to, base)=>to[0] === "~" ? to.slice(1) : baseDefaults(base) + to;
const relativePath = (base = "", path)=>_relativePath(unescape(baseDefaults(base)), unescape(path));
/*
 * Removes leading question mark
 */ const stripQm = (str)=>str[0] === "?" ? str.slice(1) : str;
/*
 * decodes escape sequences such as %20
 */ const unescape = (str)=>{
    try {
        return decodeURI(str);
    } catch (_e) {
        // fail-safe mode: if string can't be decoded do nothing
        return str;
    }
};
const sanitizeSearch = (search)=>unescape(stripQm(search));
}),
"[project]/node_modules/wouter/src/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Link",
    ()=>Link,
    "Redirect",
    ()=>Redirect,
    "Route",
    ()=>Route,
    "Router",
    ()=>Router,
    "Switch",
    ()=>Switch,
    "matchRoute",
    ()=>matchRoute,
    "useLocation",
    ()=>useLocation,
    "useParams",
    ()=>useParams,
    "useRoute",
    ()=>useRoute,
    "useRouter",
    ()=>useRouter,
    "useSearch",
    ()=>useSearch,
    "useSearchParams",
    ()=>useSearchParams
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$regexparam$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/regexparam/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$use$2d$browser$2d$location$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wouter/src/use-browser-location.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$react$2d$deps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/wouter/src/react-deps.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$paths$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/wouter/src/paths.js [app-client] (ecmascript)");
;
;
;
;
/*
 * Router and router context. Router is a lightweight object that represents the current
 * routing options: how location is managed, base path etc.
 *
 * There is a default router present for most of the use cases, however it can be overridden
 * via the <Router /> component.
 */ const defaultRouter = {
    hook: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$use$2d$browser$2d$location$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBrowserLocation"],
    searchHook: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$use$2d$browser$2d$location$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearch"],
    parser: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$regexparam$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parse"],
    base: "",
    // this option is used to override the current location during SSR
    ssrPath: undefined,
    ssrSearch: undefined,
    // optional context to track render state during SSR
    ssrContext: undefined,
    // customizes how `href` props are transformed for <Link />
    hrefs: (x)=>x,
    // wraps navigate calls, useful for view transitions
    aroundNav: (n, t, o)=>n(t, o)
};
const RouterCtx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(defaultRouter);
const useRouter = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(RouterCtx);
/**
 * Parameters context. Used by `useParams()` to get the
 * matched params from the innermost `Route` component.
 */ const Params0 = {}, ParamsCtx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(Params0);
const useParams = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ParamsCtx);
/*
 * Part 1, Hooks API: useRoute and useLocation
 */ // Internal version of useLocation to avoid redundant useRouter calls
const useLocationFromRouter = (router)=>{
    const [location, navigate] = router.hook(router);
    // the function reference should stay the same between re-renders, so that
    // it can be passed down as an element prop without any performance concerns.
    // (This is achieved via `useEvent`.)
    return [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$paths$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relativePath"])(router.base, location),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$react$2d$deps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEvent"])({
            "useLocationFromRouter.useEvent": (to, opts)=>router.aroundNav(navigate, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$paths$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absolutePath"])(to, router.base), opts)
        }["useLocationFromRouter.useEvent"])
    ];
};
const useLocation = ()=>useLocationFromRouter(useRouter());
const useSearch = ()=>{
    const router = useRouter();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$paths$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeSearch"])(router.searchHook(router));
};
const matchRoute = (parser, route, path, loose)=>{
    // if the input is a regexp, skip parsing
    const { pattern, keys } = route instanceof RegExp ? {
        keys: false,
        pattern: route
    } : parser(route || "*", loose);
    // array destructuring loses keys, so this is done in two steps
    const result = pattern.exec(path) || [];
    // when parser is in "loose" mode, `$base` is equal to the
    // first part of the route that matches the pattern
    // (e.g. for pattern `/a/:b` and path `/a/1/2/3` the `$base` is `a/1`)
    // we use this for route nesting
    const [$base, ...matches] = result;
    return $base !== undefined ? [
        true,
        (()=>{
            // for regex paths, `keys` will always be false
            // an object with parameters matched, e.g. { foo: "bar" } for "/:foo"
            // we "zip" two arrays here to construct the object
            // ["foo"], ["bar"] → { foo: "bar" }
            const groups = keys !== false ? Object.fromEntries(keys.map((key, i)=>[
                    key,
                    matches[i]
                ])) : result.groups;
            // convert the array to an instance of object
            // this makes it easier to integrate with the existing param implementation
            let obj = {
                ...matches
            };
            // merge named capture groups with matches array
            groups && Object.assign(obj, groups);
            return obj;
        })(),
        // the third value if only present when parser is in "loose" mode,
        // so that we can extract the base path for nested routes
        ...loose ? [
            $base
        ] : []
    ] : [
        false,
        null
    ];
};
const useRoute = (pattern)=>matchRoute(useRouter().parser, pattern, useLocation()[0]);
const Router = ({ children, ...props })=>{
    // the router we will inherit from - it is the closest router in the tree,
    // unless the custom `hook` is provided (in that case it's the default one)
    const parent_ = useRouter();
    const parent = props.hook ? defaultRouter : parent_;
    // holds to the context value: the router object
    let value = parent;
    // when `ssrPath` contains a `?` character, we can extract the search from it.
    // also, ensure ssrSearch is always defined when ssrPath is provided, so that
    // useSearch behavior matches usePathname (proper SSR hydration when client
    // renders <Router> without props after server rendered with ssrPath/ssrSearch)
    const [path, search = props.ssrSearch ?? ""] = props.ssrPath?.split("?") ?? [];
    if (path) props.ssrSearch = search, props.ssrPath = path;
    // hooks can define their own `href` formatter (e.g. for hash location)
    props.hrefs = props.hrefs ?? props.hook?.hrefs;
    // hooks can define their own search hook (e.g. for memory location)
    props.searchHook = props.searchHook ?? props.hook?.searchHook;
    // what is happening below: to avoid unnecessary rerenders in child components,
    // we ensure that the router object reference is stable, unless there are any
    // changes that require reload (e.g. `base` prop changes -> all components that
    // get the router from the context should rerender, even if the component is memoized).
    // the expected behaviour is:
    //
    //   1) when the resulted router is no different from the parent, use parent
    //   2) if the custom `hook` prop is provided, we always inherit from the
    //      default router instead. this resets all previously overridden options.
    //   3) when the router is customized here, it should stay stable between renders
    let ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({}), prev = ref.current, next = prev;
    for(let k in parent){
        const option = k === "base" ? /* base is special case, it is appended to the parent's base */ parent[k] + (props[k] ?? "") : props[k] ?? parent[k];
        if (prev === next && option !== next[k]) {
            ref.current = next = {
                ...next
            };
        }
        next[k] = option;
        // the new router is no different from the parent or from the memoized value, use parent
        if (option !== parent[k] || option !== value[k]) value = next;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(RouterCtx.Provider, {
        value,
        children
    });
};
const h_route = ({ children, component }, params)=>{
    // React-Router style `component` prop
    if (component) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(component, {
        params
    });
    // support render prop or plain children
    return typeof children === "function" ? children(params) : children;
};
// Cache params object between renders if values are shallow equal
const useCachedParams = (value)=>{
    let prev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(Params0);
    const curr = prev.current;
    return prev.current = // Update cache if number of params changed or any value changed
    Object.keys(value).length !== Object.keys(curr).length || Object.entries(value).some(([k, v])=>v !== curr[k]) ? value // Return new value if there are changes
     : curr; // Return cached value if nothing changed
};
function useSearchParams() {
    const [location, navigate] = useLocation();
    const search = useSearch();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSearchParams.useMemo[searchParams]": ()=>new URLSearchParams(search)
    }["useSearchParams.useMemo[searchParams]"], [
        search
    ]);
    // cached value before next render, so you can call setSearchParams multiple times
    let tempSearchParams = searchParams;
    const setSearchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$react$2d$deps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEvent"])({
        "useSearchParams.useEvent[setSearchParams]": (nextInit, options)=>{
            tempSearchParams = new URLSearchParams(typeof nextInit === "function" ? nextInit(tempSearchParams) : nextInit);
            navigate(location + "?" + tempSearchParams, options);
        }
    }["useSearchParams.useEvent[setSearchParams]"]);
    return [
        searchParams,
        setSearchParams
    ];
}
const Route = ({ path, nest, match, ...renderProps })=>{
    const router = useRouter();
    const [location] = useLocationFromRouter(router);
    const [matches, routeParams, base] = // `match` is a special prop to give up control to the parent,
    // it is used by the `Switch` to avoid double matching
    match ?? matchRoute(router.parser, path, location, nest);
    // when `routeParams` is `null` (there was no match), the argument
    // below becomes {...null} = {}, see the Object Spread specs
    // https://tc39.es/proposal-object-rest-spread/#AbstractOperations-CopyDataProperties
    const params = useCachedParams({
        ...useParams(),
        ...routeParams
    });
    if (!matches) return null;
    const children = base ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(Router, {
        base
    }, h_route(renderProps, params)) : h_route(renderProps, params);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(ParamsCtx.Provider, {
        value: params,
        children
    });
};
const Link = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const router = useRouter();
    const [currentPath, navigate] = useLocationFromRouter(router);
    const { to = "", href: targetPath = to, onClick: _onClick, asChild, children, className: cls, /* eslint-disable no-unused-vars */ replace/* ignore nav props */ , state/* ignore nav props */ , transition/* ignore nav props */ , /* eslint-enable no-unused-vars */ ...restProps } = props;
    const onClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$react$2d$deps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEvent"])({
        "Link.useEvent[onClick]": (event)=>{
            // ignores the navigation when clicked using right mouse button or
            // by holding a special modifier key: ctrl, command, win, alt, shift
            if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0) return;
            _onClick?.(event);
            if (!event.defaultPrevented) {
                event.preventDefault();
                navigate(targetPath, props);
            }
        }
    }["Link.useEvent[onClick]"]);
    // handle nested routers and absolute paths
    const href = router.hrefs(targetPath[0] === "~" ? targetPath.slice(1) : router.base + targetPath, router // pass router as a second argument for convinience
    );
    return asChild && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(children) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"])(children, {
        onClick,
        href
    }) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("a", {
        ...restProps,
        onClick,
        href,
        // `className` can be a function to apply the class if this link is active
        className: cls?.call ? cls(currentPath === targetPath) : cls,
        children,
        ref
    });
});
const flattenChildren = (children)=>Array.isArray(children) ? children.flatMap((c)=>flattenChildren(c && c.type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"] ? c.props.children : c)) : [
        children
    ];
const Switch = ({ children, location })=>{
    const router = useRouter();
    const [originalLocation] = useLocationFromRouter(router);
    for (const element of flattenChildren(children)){
        let match = 0;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(element) && // we don't require an element to be of type Route,
        // but we do require it to contain a truthy `path` prop.
        // this allows to use different components that wrap Route
        // inside of a switch, for example <AnimatedRoute />.
        (match = matchRoute(router.parser, element.props.path, location || originalLocation, element.props.nest))[0]) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"])(element, {
            match
        });
    }
    return null;
};
const Redirect = (props)=>{
    const { to, href = to } = props;
    const router = useRouter();
    const [, navigate] = useLocationFromRouter(router);
    const redirect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$react$2d$deps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEvent"])({
        "Redirect.useEvent[redirect]": ()=>navigate(to || href, props)
    }["Redirect.useEvent[redirect]"]);
    const { ssrContext } = router;
    // redirect is guaranteed to be stable since it is returned from useEvent
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wouter$2f$src$2f$react$2d$deps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useIsomorphicLayoutEffect"])({
        "Redirect.useIsomorphicLayoutEffect": ()=>{
            redirect();
        }
    }["Redirect.useIsomorphicLayoutEffect"], []); // eslint-disable-line react-hooks/exhaustive-deps
    if (ssrContext) {
        ssrContext.redirectTo = to;
    }
    return null;
};
}),
]);

//# sourceMappingURL=_0rwsqp6._.js.map