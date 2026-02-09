import { type DataBroker } from "@shared/schema";
import { createUniversalAdapter } from "./universalBrokerAdapters";

export interface ProfileSearchResult {
  found: boolean;
  profileUrl: string | null;
  nameMatch: boolean;
  cityMatch: boolean;
  stateMatch: boolean;
  ageMatch: boolean;
  matchScore: number;
  extractedName: string | null;
  extractedCity: string | null;
  extractedState: string | null;
  extractedAge: string | null;
  extractedRelatives: string[];
  rawSnippet: string | null;
  searchMethod: string;
  responseTimeMs: number;
}

export interface OptOutResult {
  success: boolean;
  method: "email" | "web_form" | "api" | "manual_required";
  confirmationRequired: boolean;
  confirmationMethod: string | null;
  referenceId: string | null;
  details: string;
  error: string | null;
}

export interface BrokerAdapter {
  brokerId: string;
  brokerName: string;
  capabilities: {
    canSearch: boolean;
    canAutoOptOut: boolean;
    optOutMethod: "email" | "web_form" | "api" | "manual_required";
    requiresCaptcha: boolean;
    requiresPhoneVerification: boolean;
    requiresIdVerification: boolean;
  };
  searchProfile(params: SearchParams): Promise<ProfileSearchResult>;
  submitOptOut?(params: OptOutParams): Promise<OptOutResult>;
}

export interface SearchParams {
  firstName: string;
  lastName: string;
  city?: string;
  state?: string;
  age?: string;
  middleName?: string;
}

export interface OptOutParams {
  profileUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  state?: string;
}

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");
}

function checkNameMatch(foundName: string, firstName: string, lastName: string): boolean {
  const normFound = normalizeText(foundName);
  const normFirst = normalizeText(firstName);
  const normLast = normalizeText(lastName);
  return normFound.includes(normFirst) && normFound.includes(normLast);
}

function checkCityMatch(foundCity: string, targetCity: string): boolean {
  if (!targetCity) return false;
  return normalizeText(foundCity).includes(normalizeText(targetCity));
}

function checkStateMatch(foundState: string, targetState: string): boolean {
  if (!targetState) return false;
  const stateAbbrevs: Record<string, string> = {
    "alabama": "al", "alaska": "ak", "arizona": "az", "arkansas": "ar", "california": "ca",
    "colorado": "co", "connecticut": "ct", "delaware": "de", "florida": "fl", "georgia": "ga",
    "hawaii": "hi", "idaho": "id", "illinois": "il", "indiana": "in", "iowa": "ia",
    "kansas": "ks", "kentucky": "ky", "louisiana": "la", "maine": "me", "maryland": "md",
    "massachusetts": "ma", "michigan": "mi", "minnesota": "mn", "mississippi": "ms",
    "missouri": "mo", "montana": "mt", "nebraska": "ne", "nevada": "nv", "new hampshire": "nh",
    "new jersey": "nj", "new mexico": "nm", "new york": "ny", "north carolina": "nc",
    "north dakota": "nd", "ohio": "oh", "oklahoma": "ok", "oregon": "or", "pennsylvania": "pa",
    "rhode island": "ri", "south carolina": "sc", "south dakota": "sd", "tennessee": "tn",
    "texas": "tx", "utah": "ut", "vermont": "vt", "virginia": "va", "washington": "wa",
    "west virginia": "wv", "wisconsin": "wi", "wyoming": "wy"
  };
  const normFound = normalizeText(foundState);
  const normTarget = normalizeText(targetState);
  if (normFound === normTarget) return true;
  if (normFound.length === 2 && normTarget.length === 2 && normFound === normTarget) return true;
  const foundAbbrev = stateAbbrevs[normFound] || normFound;
  const targetAbbrev = stateAbbrevs[normTarget] || normTarget;
  return foundAbbrev === targetAbbrev;
}

function calculateMatchScore(result: Partial<ProfileSearchResult>): number {
  let score = 0;
  if (result.nameMatch) score += 40;
  if (result.cityMatch) score += 25;
  if (result.stateMatch) score += 20;
  if (result.ageMatch) score += 15;
  return score;
}

function extractStateFromAddress(address: string): string | null {
  const statePattern = /\b([A-Z]{2})\b/;
  const match = address.match(statePattern);
  return match ? match[1] : null;
}

function extractCityFromAddress(address: string): string | null {
  const parts = address.split(",").map(p => p.trim());
  if (parts.length >= 2) return parts[0];
  return null;
}

function parseStateFromFullAddress(fullAddress: string): { city: string | null; state: string | null } {
  const parts = fullAddress.split(",").map(p => p.trim());
  if (parts.length >= 2) {
    const city = parts[0];
    const stateZip = parts[parts.length - 1];
    const stateMatch = stateZip.match(/^([A-Za-z\s]+)/);
    const state = stateMatch ? stateMatch[1].trim() : null;
    return { city, state };
  }
  return { city: null, state: null };
}

async function safeFetch(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        ...options.headers,
      },
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    return null;
  }
}

function createTruePeopleSearchAdapter(): BrokerAdapter {
  return {
    brokerId: "truepeoplesearch",
    brokerName: "TruePeopleSearch",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "web_form",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      const searchUrl = `https://www.truepeoplesearch.com/results?name=${encodeURIComponent(firstName + " " + lastName)}${city ? `&citystatezip=${encodeURIComponent(city + (state ? ", " + state : ""))}` : ""}`;

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "truepeoplesearch_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const profileUrlMatch = html.match(/href="(\/find\/[^"]+)"/);
      const profileUrl = profileUrlMatch ? `https://www.truepeoplesearch.com${profileUrlMatch[1]}` : null;

      const ageMatch = html.match(/Age\s*(\d+)/i);
      const extractedAge = ageMatch ? ageMatch[1] : null;

      const locationMatch = html.match(/(?:Lives in|located in)\s*([^<]+)/i);
      let extractedCity: string | null = null;
      let extractedState: string | null = null;
      if (locationMatch) {
        const parsed = parseStateFromFullAddress(locationMatch[1]);
        extractedCity = parsed.city;
        extractedState = parsed.state;
      }

      const relativesPattern = /(?:Related to|Relatives)[:\s]*([^<]+)/gi;
      const relativesMatch = html.match(relativesPattern);
      const extractedRelatives = relativesMatch ? relativesMatch.slice(0, 5).map(r => r.replace(/(?:Related to|Relatives)[:\s]*/i, "").trim()) : [];

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl,
        nameMatch: found,
        cityMatch: city ? (extractedCity ? checkCityMatch(extractedCity, city) : false) : false,
        stateMatch: state ? (extractedState ? checkStateMatch(extractedState, state) : false) : false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity,
        extractedState,
        extractedAge,
        extractedRelatives,
        rawSnippet,
        searchMethod: "truepeoplesearch_web",
        responseTimeMs: responseTime,
      };

      if (params.age && extractedAge) {
        const userAge = parseInt(params.age, 10);
        const foundAge = parseInt(extractedAge, 10);
        result.ageMatch = Math.abs(userAge - foundAge) <= 2;
      }

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createFastPeopleSearchAdapter(): BrokerAdapter {
  return {
    brokerId: "fastpeoplesearch",
    brokerName: "FastPeopleSearch",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "web_form",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      const namePart = `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, "-");
      let searchUrl = `https://www.fastpeoplesearch.com/name/${namePart}`;
      if (state) {
        searchUrl += `_${state.toLowerCase().replace(/\s+/g, "-")}`;
      }
      if (city) {
        searchUrl += `_${city.toLowerCase().replace(/\s+/g, "-")}`;
      }

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "fastpeoplesearch_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const profileUrlMatch = html.match(/data-link="([^"]*\/[^"]+)"/);
      const profileUrl = profileUrlMatch ? `https://www.fastpeoplesearch.com${profileUrlMatch[1]}` : null;

      const ageMatch = html.match(/(?:age|Age)\s*(\d+)/);
      const extractedAge = ageMatch ? ageMatch[1] : null;

      const locationMatch = html.match(/(?:Lives in|Resides in|located)\s*([^<]+)/i);
      let extractedCity: string | null = null;
      let extractedState: string | null = null;
      if (locationMatch) {
        const parsed = parseStateFromFullAddress(locationMatch[1]);
        extractedCity = parsed.city;
        extractedState = parsed.state;
      }

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl,
        nameMatch: found,
        cityMatch: city ? (extractedCity ? checkCityMatch(extractedCity, city) : false) : false,
        stateMatch: state ? (extractedState ? checkStateMatch(extractedState, state) : false) : false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity,
        extractedState,
        extractedAge,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "fastpeoplesearch_web",
        responseTimeMs: responseTime,
      };

      if (params.age && extractedAge) {
        const userAge = parseInt(params.age, 10);
        const foundAge = parseInt(extractedAge, 10);
        result.ageMatch = Math.abs(userAge - foundAge) <= 2;
      }

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createSpokeoAdapter(): BrokerAdapter {
  return {
    brokerId: "spokeo",
    brokerName: "Spokeo",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "email",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      const namePart = `${firstName}-${lastName}`;
      let searchUrl = `https://www.spokeo.com/${encodeURIComponent(namePart)}`;
      if (state) {
        searchUrl += `/${encodeURIComponent(state)}`;
      }
      if (city) {
        searchUrl += `/${encodeURIComponent(city)}`;
      }

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "spokeo_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const profileUrlMatch = html.match(/href="(\/[^"]*\/[A-Za-z]+-[A-Za-z]+\/[^"]+)"/);
      const profileUrl = profileUrlMatch ? `https://www.spokeo.com${profileUrlMatch[1]}` : null;

      const ageMatch = html.match(/(\d{2,3})\s*(?:years?\s*old|yrs)/i);
      const extractedAge = ageMatch ? ageMatch[1] : null;

      const locationMatch = html.match(/(?:Lives in|Resides in|Location[:\s]*)\s*([^<,]+,\s*[A-Z]{2})/i);
      let extractedCity: string | null = null;
      let extractedState: string | null = null;
      if (locationMatch) {
        const parsed = parseStateFromFullAddress(locationMatch[1]);
        extractedCity = parsed.city;
        extractedState = parsed.state;
      }

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl,
        nameMatch: found,
        cityMatch: city ? (extractedCity ? checkCityMatch(extractedCity, city) : false) : false,
        stateMatch: state ? (extractedState ? checkStateMatch(extractedState, state) : false) : false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity,
        extractedState,
        extractedAge,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "spokeo_web",
        responseTimeMs: responseTime,
      };

      if (params.age && extractedAge) {
        const userAge = parseInt(params.age, 10);
        const foundAge = parseInt(extractedAge, 10);
        result.ageMatch = Math.abs(userAge - foundAge) <= 2;
      }

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createWhitepagesAdapter(): BrokerAdapter {
  return {
    brokerId: "whitepages",
    brokerName: "Whitepages",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "web_form",
      requiresCaptcha: false,
      requiresPhoneVerification: true,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      let location = "";
      if (city && state) location = `${city}, ${state}`;
      else if (state) location = state;
      else if (city) location = city;

      const searchUrl = `https://www.whitepages.com/name/${encodeURIComponent(firstName)}-${encodeURIComponent(lastName)}${location ? `/${encodeURIComponent(location)}` : ""}`;

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "whitepages_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const profileUrlMatch = html.match(/href="(\/name\/[^"]+)"/);
      const profileUrl = profileUrlMatch ? `https://www.whitepages.com${profileUrlMatch[1]}` : null;

      const ageMatch = html.match(/(?:age|Age)\s*(\d+)/);
      const extractedAge = ageMatch ? ageMatch[1] : null;

      const locationMatch = html.match(/(?:Lives in|Resides in)\s*([^<]+)/i);
      let extractedCity: string | null = null;
      let extractedState: string | null = null;
      if (locationMatch) {
        const parsed = parseStateFromFullAddress(locationMatch[1]);
        extractedCity = parsed.city;
        extractedState = parsed.state;
      }

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl,
        nameMatch: found,
        cityMatch: city ? (extractedCity ? checkCityMatch(extractedCity, city) : false) : false,
        stateMatch: state ? (extractedState ? checkStateMatch(extractedState, state) : false) : false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity,
        extractedState,
        extractedAge,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "whitepages_web",
        responseTimeMs: responseTime,
      };

      if (params.age && extractedAge) {
        const userAge = parseInt(params.age, 10);
        const foundAge = parseInt(extractedAge, 10);
        result.ageMatch = Math.abs(userAge - foundAge) <= 2;
      }

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createRadarisAdapter(): BrokerAdapter {
  return {
    brokerId: "radaris",
    brokerName: "Radaris",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "email",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      let searchUrl = `https://radaris.com/p/${encodeURIComponent(firstName)}/${encodeURIComponent(lastName)}`;
      if (state) {
        searchUrl += `/${encodeURIComponent(state)}`;
      }

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "radaris_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const profileUrlPattern = new RegExp(`href="(/p/${firstName}/${lastName}[^"]*)"`, "i");
      const profileUrlMatch = html.match(profileUrlPattern);
      const profileUrl = profileUrlMatch ? `https://radaris.com${profileUrlMatch[1]}` : (found ? searchUrl : null);

      const ageMatch = html.match(/(?:age|Age)[:\s]*(\d+)/);
      const extractedAge = ageMatch ? ageMatch[1] : null;

      const locationMatch = html.match(/(?:Lives in|Address|Location)[:\s]*([^<]+)/i);
      let extractedCity: string | null = null;
      let extractedState: string | null = null;
      if (locationMatch) {
        const parsed = parseStateFromFullAddress(locationMatch[1]);
        extractedCity = parsed.city;
        extractedState = parsed.state;
      }

      const escapedFirst = firstName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${escapedFirst}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl,
        nameMatch: found,
        cityMatch: city ? (extractedCity ? checkCityMatch(extractedCity, city) : false) : false,
        stateMatch: state ? (extractedState ? checkStateMatch(extractedState, state) : false) : false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity,
        extractedState,
        extractedAge,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "radaris_web",
        responseTimeMs: responseTime,
      };

      if (params.age && extractedAge) {
        const userAge = parseInt(params.age, 10);
        const foundAge = parseInt(extractedAge, 10);
        result.ageMatch = Math.abs(userAge - foundAge) <= 2;
      }

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createBeenVerifiedAdapter(): BrokerAdapter {
  return {
    brokerId: "beenverified",
    brokerName: "BeenVerified",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "web_form",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      const searchUrl = `https://www.beenverified.com/people/${encodeURIComponent(firstName)}-${encodeURIComponent(lastName)}/${state ? encodeURIComponent(state.toLowerCase()) + "/" : ""}`;

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "beenverified_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const profileUrlMatch = html.match(/href="(\/people\/[^"]+)"/);
      const profileUrl = profileUrlMatch ? `https://www.beenverified.com${profileUrlMatch[1]}` : null;

      const ageMatch = html.match(/(\d{2,3})\s*(?:years?\s*old|yrs)/i);
      const extractedAge = ageMatch ? ageMatch[1] : null;

      const locationMatch = html.match(/(?:Location|Lives in|City)[:\s]*([^<]+)/i);
      let extractedCity: string | null = null;
      let extractedState: string | null = null;
      if (locationMatch) {
        const parsed = parseStateFromFullAddress(locationMatch[1]);
        extractedCity = parsed.city;
        extractedState = parsed.state;
      }

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl,
        nameMatch: found,
        cityMatch: city ? (extractedCity ? checkCityMatch(extractedCity, city) : false) : false,
        stateMatch: state ? (extractedState ? checkStateMatch(extractedState, state) : false) : false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity,
        extractedState,
        extractedAge,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "beenverified_web",
        responseTimeMs: responseTime,
      };

      if (params.age && extractedAge) {
        const userAge = parseInt(params.age, 10);
        const foundAge = parseInt(extractedAge, 10);
        result.ageMatch = Math.abs(userAge - foundAge) <= 2;
      }

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createInteliusAdapter(): BrokerAdapter {
  return {
    brokerId: "intelius",
    brokerName: "Intelius",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "web_form",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      const searchUrl = `https://www.intelius.com/people-search/${encodeURIComponent(firstName)}-${encodeURIComponent(lastName)}/${state ? encodeURIComponent(state) : ""}`;

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "intelius_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const profileUrlMatch = html.match(/href="(\/people-search\/[^"]+)"/);
      const profileUrl = profileUrlMatch ? `https://www.intelius.com${profileUrlMatch[1]}` : null;

      const ageMatch = html.match(/(\d{2,3})\s*(?:years?\s*old|yrs|age)/i);
      const extractedAge = ageMatch ? ageMatch[1] : null;

      const locationMatch = html.match(/(?:Location|Lives in|Resides)[:\s]*([^<]+)/i);
      let extractedCity: string | null = null;
      let extractedState: string | null = null;
      if (locationMatch) {
        const parsed = parseStateFromFullAddress(locationMatch[1]);
        extractedCity = parsed.city;
        extractedState = parsed.state;
      }

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl,
        nameMatch: found,
        cityMatch: city ? (extractedCity ? checkCityMatch(extractedCity, city) : false) : false,
        stateMatch: state ? (extractedState ? checkStateMatch(extractedState, state) : false) : false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity,
        extractedState,
        extractedAge,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "intelius_web",
        responseTimeMs: responseTime,
      };

      if (params.age && extractedAge) {
        const userAge = parseInt(params.age, 10);
        const foundAge = parseInt(extractedAge, 10);
        result.ageMatch = Math.abs(userAge - foundAge) <= 2;
      }

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createPeopleFindersAdapter(): BrokerAdapter {
  return {
    brokerId: "peoplefinders",
    brokerName: "PeopleFinders",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "web_form",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      const searchUrl = `https://www.peoplefinders.com/people/${encodeURIComponent(firstName)}-${encodeURIComponent(lastName)}${state ? `/${encodeURIComponent(state)}` : ""}`;

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "peoplefinders_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const profileUrlMatch = html.match(/href="(\/people\/[^"]+)"/);
      const profileUrl = profileUrlMatch ? `https://www.peoplefinders.com${profileUrlMatch[1]}` : null;

      const ageMatch = html.match(/(?:age|Age)[:\s]*(\d+)/);
      const extractedAge = ageMatch ? ageMatch[1] : null;

      const locationMatch = html.match(/(?:Location|Lives in|Resides)[:\s]*([^<]+)/i);
      let extractedCity: string | null = null;
      let extractedState: string | null = null;
      if (locationMatch) {
        const parsed = parseStateFromFullAddress(locationMatch[1]);
        extractedCity = parsed.city;
        extractedState = parsed.state;
      }

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl,
        nameMatch: found,
        cityMatch: city ? (extractedCity ? checkCityMatch(extractedCity, city) : false) : false,
        stateMatch: state ? (extractedState ? checkStateMatch(extractedState, state) : false) : false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity,
        extractedState,
        extractedAge,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "peoplefinders_web",
        responseTimeMs: responseTime,
      };

      if (params.age && extractedAge) {
        const userAge = parseInt(params.age, 10);
        const foundAge = parseInt(extractedAge, 10);
        result.ageMatch = Math.abs(userAge - foundAge) <= 2;
      }

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createInstantCheckmateAdapter(): BrokerAdapter {
  return {
    brokerId: "instant-checkmate",
    brokerName: "Instant Checkmate",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "web_form",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      const searchUrl = `https://www.instantcheckmate.com/people/${encodeURIComponent(firstName)}-${encodeURIComponent(lastName)}/${state ? encodeURIComponent(state) + "/" : ""}`;

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "instantcheckmate_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const profileUrlMatch = html.match(/href="(\/people\/[^"]+)"/);
      const profileUrl = profileUrlMatch ? `https://www.instantcheckmate.com${profileUrlMatch[1]}` : null;

      const ageMatch = html.match(/(?:age|Age)[:\s]*(\d+)/);
      const extractedAge = ageMatch ? ageMatch[1] : null;

      const locationMatch = html.match(/(?:Location|Lives in|Resides)[:\s]*([^<]+)/i);
      let extractedCity: string | null = null;
      let extractedState: string | null = null;
      if (locationMatch) {
        const parsed = parseStateFromFullAddress(locationMatch[1]);
        extractedCity = parsed.city;
        extractedState = parsed.state;
      }

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl,
        nameMatch: found,
        cityMatch: city ? (extractedCity ? checkCityMatch(extractedCity, city) : false) : false,
        stateMatch: state ? (extractedState ? checkStateMatch(extractedState, state) : false) : false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity,
        extractedState,
        extractedAge,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "instantcheckmate_web",
        responseTimeMs: responseTime,
      };

      if (params.age && extractedAge) {
        const userAge = parseInt(params.age, 10);
        const foundAge = parseInt(extractedAge, 10);
        result.ageMatch = Math.abs(userAge - foundAge) <= 2;
      }

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createTruthFinderAdapter(): BrokerAdapter {
  return {
    brokerId: "truthfinder",
    brokerName: "TruthFinder",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "web_form",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      const searchUrl = `https://www.truthfinder.com/people-search/results/?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}${state ? `&state=${encodeURIComponent(state)}` : ""}`;

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "truthfinder_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl: found ? searchUrl : null,
        nameMatch: found,
        cityMatch: false,
        stateMatch: false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity: null,
        extractedState: null,
        extractedAge: null,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "truthfinder_web",
        responseTimeMs: responseTime,
      };

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createMyLifeAdapter(): BrokerAdapter {
  return {
    brokerId: "mylife",
    brokerName: "MyLife",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "email",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: true,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      const searchUrl = `https://www.mylife.com/pub/name-search?fn=${encodeURIComponent(firstName)}&ln=${encodeURIComponent(lastName)}${state ? `&st=${encodeURIComponent(state)}` : ""}`;

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "mylife_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const ageMatch = html.match(/(?:age|Age)[:\s]*(\d+)/);
      const extractedAge = ageMatch ? ageMatch[1] : null;

      const locationMatch = html.match(/(?:Location|Lives in|Resides)[:\s]*([^<]+)/i);
      let extractedCity: string | null = null;
      let extractedState: string | null = null;
      if (locationMatch) {
        const parsed = parseStateFromFullAddress(locationMatch[1]);
        extractedCity = parsed.city;
        extractedState = parsed.state;
      }

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl: found ? searchUrl : null,
        nameMatch: found,
        cityMatch: city ? (extractedCity ? checkCityMatch(extractedCity, city) : false) : false,
        stateMatch: state ? (extractedState ? checkStateMatch(extractedState, state) : false) : false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity,
        extractedState,
        extractedAge,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "mylife_web",
        responseTimeMs: responseTime,
      };

      if (params.age && extractedAge) {
        const userAge = parseInt(params.age, 10);
        const foundAge = parseInt(extractedAge, 10);
        result.ageMatch = Math.abs(userAge - foundAge) <= 2;
      }

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createUSPhoneBookAdapter(): BrokerAdapter {
  return {
    brokerId: "usphonebook",
    brokerName: "USPhoneBook",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "web_form",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;

      const searchUrl = `https://www.usphonebook.com/${encodeURIComponent(firstName)}-${encodeURIComponent(lastName)}${state ? `/${encodeURIComponent(state)}` : ""}`;

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "usphonebook_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl: found ? searchUrl : null,
        nameMatch: found,
        cityMatch: false,
        stateMatch: false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity: null,
        extractedState: null,
        extractedAge: null,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "usphonebook_web",
        responseTimeMs: responseTime,
      };

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

function createCoclSearchAdapter(): BrokerAdapter {
  return {
    brokerId: "cyberbackgroundchecks",
    brokerName: "CyberBackgroundChecks",
    capabilities: {
      canSearch: true,
      canAutoOptOut: true,
      optOutMethod: "web_form",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, state } = params;

      const searchUrl = `https://www.cyberbackgroundchecks.com/people/${encodeURIComponent(firstName)}-${encodeURIComponent(lastName)}${state ? `/${encodeURIComponent(state)}` : ""}`;

      const response = await safeFetch(searchUrl);
      const responseTime = Date.now() - startTime;

      if (!response || !response.ok) {
        return { found: false, profileUrl: null, nameMatch: false, cityMatch: false, stateMatch: false, ageMatch: false, matchScore: 0, extractedName: null, extractedCity: null, extractedState: null, extractedAge: null, extractedRelatives: [], rawSnippet: null, searchMethod: "cyberbackgroundchecks_web", responseTimeMs: responseTime };
      }

      const html = await response.text();

      const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
      const nameMatches = html.match(namePattern);
      const found = nameMatches !== null && nameMatches.length > 0;

      const snippetMatch = html.match(new RegExp(`[^<]{0,100}${firstName}[^<]{0,200}`, "i"));
      const rawSnippet = snippetMatch ? snippetMatch[0].substring(0, 300) : null;

      const result: ProfileSearchResult = {
        found,
        profileUrl: found ? searchUrl : null,
        nameMatch: found,
        cityMatch: false,
        stateMatch: false,
        ageMatch: false,
        matchScore: 0,
        extractedName: nameMatches ? nameMatches[0] : null,
        extractedCity: null,
        extractedState: null,
        extractedAge: null,
        extractedRelatives: [],
        rawSnippet,
        searchMethod: "cyberbackgroundchecks_web",
        responseTimeMs: responseTime,
      };

      result.matchScore = calculateMatchScore(result);
      return result;
    },
  };
}

const coreAdapters: BrokerAdapter[] = [
  createTruePeopleSearchAdapter(),
  createFastPeopleSearchAdapter(),
  createSpokeoAdapter(),
  createWhitepagesAdapter(),
  createRadarisAdapter(),
  createBeenVerifiedAdapter(),
  createInteliusAdapter(),
  createPeopleFindersAdapter(),
  createInstantCheckmateAdapter(),
  createTruthFinderAdapter(),
  createMyLifeAdapter(),
  createUSPhoneBookAdapter(),
  createCoclSearchAdapter(),
];

const coreAdapterIds = new Set(coreAdapters.map(a => a.brokerId));

const allAdapters: BrokerAdapter[] = [...coreAdapters];

const adapterMap = new Map<string, BrokerAdapter>();
for (const adapter of coreAdapters) {
  adapterMap.set(adapter.brokerId, adapter);
}

let universalAdaptersRegistered = false;

export function registerUniversalAdapters(brokerEntries: Array<{ id: string; name: string; domain: string; category: string; isActive: boolean }>) {
  if (universalAdaptersRegistered) return;
  universalAdaptersRegistered = true;

  let count = 0;
  for (const entry of brokerEntries) {
    if (!entry.isActive) continue;
    if (coreAdapterIds.has(entry.id)) continue;
    if (adapterMap.has(entry.id)) continue;

    const adapter = createUniversalAdapter(entry.id, entry.name, entry.domain, entry.category);
    allAdapters.push(adapter);
    adapterMap.set(entry.id, adapter);
    count++;
  }
  console.log(`[broker-adapter] Registered ${count} universal search adapters (${allAdapters.length} total searchable)`);
}

export function getAdapter(brokerId: string): BrokerAdapter | null {
  return adapterMap.get(brokerId) ?? null;
}

export function getAllAdapters(): BrokerAdapter[] {
  return allAdapters;
}

export function getSearchableAdapters(): BrokerAdapter[] {
  return allAdapters.filter(a => a.capabilities.canSearch);
}

export function getAdapterCapabilities(): { brokerId: string; brokerName: string; canSearch: boolean; canAutoOptOut: boolean; optOutMethod: string }[] {
  return allAdapters.map(a => ({
    brokerId: a.brokerId,
    brokerName: a.brokerName,
    canSearch: a.capabilities.canSearch,
    canAutoOptOut: a.capabilities.canAutoOptOut,
    optOutMethod: a.capabilities.optOutMethod,
  }));
}

export async function searchBrokerForProfile(
  brokerId: string,
  params: SearchParams,
): Promise<ProfileSearchResult | null> {
  const adapter = getAdapter(brokerId);
  if (!adapter || !adapter.capabilities.canSearch) return null;

  try {
    return await adapter.searchProfile(params);
  } catch (error) {
    console.error(`[broker-adapter] Error searching ${brokerId}:`, error);
    return null;
  }
}

export interface SearchStats {
  totalSearchable: number;
  searched: number;
  found: number;
  notFound: number;
  blocked: number;
  failed: number;
  brokerStatuses: Map<string, "searched_found" | "searched_not_found" | "search_blocked" | "search_failed">;
}

export async function searchAllBrokersForProfile(
  params: SearchParams,
  batchSize = 75,
  delayBetweenBatchesMs = 150,
): Promise<{ results: Map<string, ProfileSearchResult>; stats: SearchStats }> {
  const results = new Map<string, ProfileSearchResult>();
  const searchable = getSearchableAdapters();
  const stats: SearchStats = {
    totalSearchable: searchable.length,
    searched: 0,
    found: 0,
    notFound: 0,
    blocked: 0,
    failed: 0,
    brokerStatuses: new Map(),
  };

  console.log(`[broker-adapter] Starting real profile search across ${searchable.length} broker sites for "${params.firstName} ${params.lastName}"`);

  const coreBrokerIds = new Set(coreAdapters.map(a => a.brokerId));
  const coreBrokers = searchable.filter(a => coreBrokerIds.has(a.brokerId));
  const universalBrokers = searchable.filter(a => !coreBrokerIds.has(a.brokerId));
  const orderedSearchable = [...coreBrokers, ...universalBrokers];

  const OVERALL_TIMEOUT_MS = 45_000;
  const scanStart = Date.now();
  let timedOut = false;

  const coreBatchSize = Math.min(batchSize, 5);
  const universalBatchSize = batchSize;

  for (let i = 0; i < orderedSearchable.length; i += (i < coreBrokers.length ? coreBatchSize : universalBatchSize)) {
    if (Date.now() - scanStart > OVERALL_TIMEOUT_MS) {
      timedOut = true;
      console.log(`[broker-adapter] Overall scan timeout reached after ${stats.searched} brokers searched. Returning partial results.`);
      for (let j = i; j < orderedSearchable.length; j++) {
        stats.brokerStatuses.set(orderedSearchable[j].brokerId, "search_failed");
        stats.failed++;
      }
      break;
    }

    const currentBatchSize = i < coreBrokers.length ? coreBatchSize : universalBatchSize;
    const batch = orderedSearchable.slice(i, i + currentBatchSize);

    const batchResults = await Promise.allSettled(
      batch.map(async (adapter) => {
        const result = await adapter.searchProfile(params);
        return { brokerId: adapter.brokerId, brokerName: adapter.brokerName, result };
      })
    );

    for (const batchResult of batchResults) {
      if (batchResult.status === "fulfilled") {
        const { brokerId, result } = batchResult.value;
        results.set(brokerId, result);
        stats.searched++;

        if (result.responseTimeMs === 0 && !result.found && !result.nameMatch) {
          stats.blocked++;
          stats.brokerStatuses.set(brokerId, "search_blocked");
        } else if (result.found && result.nameMatch && result.matchScore >= 40) {
          stats.found++;
          stats.brokerStatuses.set(brokerId, "searched_found");
          console.log(`[broker-adapter] PROFILE FOUND on ${brokerId} (score: ${result.matchScore}, method: ${result.searchMethod})`);
        } else {
          stats.notFound++;
          stats.brokerStatuses.set(brokerId, "searched_not_found");
        }
      } else {
        stats.failed++;
        const adapter = batch[batchResults.indexOf(batchResult)];
        if (adapter) {
          stats.brokerStatuses.set(adapter.brokerId, "search_failed");
        }
      }
    }

    const delay = i < coreBrokers.length ? delayBetweenBatchesMs * 2 : delayBetweenBatchesMs;
    if (i + currentBatchSize < orderedSearchable.length) {
      await new Promise(r => setTimeout(r, delay));
    }

    if (stats.searched % 100 === 0 && stats.searched > 0) {
      const elapsed = ((Date.now() - scanStart) / 1000).toFixed(1);
      console.log(`[broker-adapter] Progress: ${stats.searched}/${orderedSearchable.length} searched, ${stats.found} found (${elapsed}s elapsed)`);
    }
  }

  const totalTime = ((Date.now() - scanStart) / 1000).toFixed(1);
  console.log(`[broker-adapter] Profile search ${timedOut ? "timed out" : "complete"} in ${totalTime}s: ${stats.found} found, ${stats.notFound} not found, ${stats.blocked} blocked, ${stats.failed} failed across ${stats.searched}/${searchable.length} sites`);

  return { results, stats };
}

