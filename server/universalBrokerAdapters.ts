import type { BrokerAdapter, SearchParams, ProfileSearchResult } from "./brokerAdapters";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");
}

function checkNameInHtml(html: string, firstName: string, lastName: string): { found: boolean; extractedName: string | null; snippet: string | null } {
  const normFirst = firstName.toLowerCase();
  const normLast = lastName.toLowerCase();
  const lowerHtml = html.toLowerCase();

  const fullNameIdx = lowerHtml.indexOf(`${normFirst} ${normLast}`);
  if (fullNameIdx === -1) {
    const lastIdx = lowerHtml.indexOf(normLast);
    const firstIdx = lowerHtml.indexOf(normFirst);
    if (lastIdx === -1 || firstIdx === -1) {
      return { found: false, extractedName: null, snippet: null };
    }
    if (Math.abs(lastIdx - firstIdx) > 100) {
      return { found: false, extractedName: null, snippet: null };
    }
  }

  const namePattern = new RegExp(`(${firstName}\\s+(?:\\w+\\s+)?${lastName})`, "gi");
  const nameMatches = html.match(namePattern);
  const found = nameMatches !== null && nameMatches.length > 0;

  let snippet: string | null = null;
  if (found) {
    const snippetMatch = html.match(new RegExp(`[^<]{0,80}${firstName}[^<]{0,150}`, "i"));
    snippet = snippetMatch ? snippetMatch[0].substring(0, 250) : null;
  }

  return {
    found,
    extractedName: nameMatches ? nameMatches[0] : `${firstName} ${lastName}`,
    snippet,
  };
}

function extractLocationFromHtml(html: string, city?: string, state?: string): { cityMatch: boolean; stateMatch: boolean } {
  const lowerHtml = html.toLowerCase();
  let cityMatch = false;
  let stateMatch = false;

  if (city) {
    cityMatch = lowerHtml.includes(city.toLowerCase());
  }
  if (state) {
    stateMatch = lowerHtml.includes(state.toLowerCase());
  }
  return { cityMatch, stateMatch };
}

function calculateMatchScore(nameMatch: boolean, cityMatch: boolean, stateMatch: boolean, ageMatch: boolean): number {
  let score = 0;
  if (nameMatch) score += 40;
  if (cityMatch) score += 25;
  if (stateMatch) score += 20;
  if (ageMatch) score += 15;
  return score;
}

async function safeFetchUniversal(url: string, timeoutMs = 2500): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "DNT": "1",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);
    return response;
  } catch {
    return null;
  }
}

type UrlTemplate = (params: SearchParams, domain: string) => string[];

const PEOPLE_SEARCH_TEMPLATES: UrlTemplate = (params, domain) => {
  const { firstName, lastName, state } = params;
  const first = encodeURIComponent(firstName.toLowerCase());
  const last = encodeURIComponent(lastName.toLowerCase());
  const firstCap = encodeURIComponent(firstName);
  const lastCap = encodeURIComponent(lastName);
  const st = state ? encodeURIComponent(state.toLowerCase()) : "";

  const urls: string[] = [];

  urls.push(`https://www.${domain}/people/${first}-${last}${st ? `/${st}` : ""}`);
  urls.push(`https://www.${domain}/name/${firstCap}-${lastCap}${st ? `/${st}` : ""}`);
  urls.push(`https://www.${domain}/search?name=${firstCap}+${lastCap}${st ? `&state=${st}` : ""}`);
  urls.push(`https://www.${domain}/results?first=${firstCap}&last=${lastCap}${st ? `&state=${encodeURIComponent(state!)}` : ""}`);

  return urls;
};

const BACKGROUND_CHECK_TEMPLATES: UrlTemplate = (params, domain) => {
  const { firstName, lastName, state } = params;
  const first = encodeURIComponent(firstName);
  const last = encodeURIComponent(lastName);
  const st = state ? encodeURIComponent(state) : "";

  return [
    `https://www.${domain}/people/${encodeURIComponent(firstName.toLowerCase())}-${encodeURIComponent(lastName.toLowerCase())}${st ? `/${st.toLowerCase()}` : ""}`,
    `https://www.${domain}/search?name=${first}+${last}${st ? `&state=${st}` : ""}`,
    `https://www.${domain}/results?first=${first}&last=${last}`,
  ];
};

const PUBLIC_RECORDS_TEMPLATES: UrlTemplate = (params, domain) => {
  const { firstName, lastName, state } = params;
  const first = encodeURIComponent(firstName);
  const last = encodeURIComponent(lastName);
  const st = state ? encodeURIComponent(state) : "";

  return [
    `https://www.${domain}/search?name=${first}+${last}${st ? `&state=${st}` : ""}`,
    `https://www.${domain}/people/${encodeURIComponent(firstName.toLowerCase())}-${encodeURIComponent(lastName.toLowerCase())}`,
    `https://www.${domain}/records?first=${first}&last=${last}`,
  ];
};

const GENERIC_SEARCH_TEMPLATES: UrlTemplate = (params, domain) => {
  const { firstName, lastName } = params;
  const first = encodeURIComponent(firstName);
  const last = encodeURIComponent(lastName);

  return [
    `https://www.${domain}/search?q=${first}+${last}`,
    `https://www.${domain}/search?name=${first}+${last}`,
    `https://www.${domain}/results?query=${first}+${last}`,
  ];
};

const CATEGORY_TEMPLATES: Record<string, UrlTemplate> = {
  "people-search": PEOPLE_SEARCH_TEMPLATES,
  "background-check": BACKGROUND_CHECK_TEMPLATES,
  "public-records": PUBLIC_RECORDS_TEMPLATES,
  "court-legal-records": PUBLIC_RECORDS_TEMPLATES,
  "court-legal": PUBLIC_RECORDS_TEMPLATES,
  "voter-political": PUBLIC_RECORDS_TEMPLATES,
  "real-estate-property": PUBLIC_RECORDS_TEMPLATES,
  "real-estate": PUBLIC_RECORDS_TEMPLATES,
  "social-media-aggregator": GENERIC_SEARCH_TEMPLATES,
  "social-media": GENERIC_SEARCH_TEMPLATES,
  "data-aggregator": GENERIC_SEARCH_TEMPLATES,
  "data-aggregator-enrichment": GENERIC_SEARCH_TEMPLATES,
  "identity-verification": GENERIC_SEARCH_TEMPLATES,
  "business-professional": GENERIC_SEARCH_TEMPLATES,
  "recruitment": GENERIC_SEARCH_TEMPLATES,
  "marketing": GENERIC_SEARCH_TEMPLATES,
  "marketing-data": GENERIC_SEARCH_TEMPLATES,
  "advertising": GENERIC_SEARCH_TEMPLATES,
  "financial": GENERIC_SEARCH_TEMPLATES,
  "insurance": GENERIC_SEARCH_TEMPLATES,
  "insurance-data": GENERIC_SEARCH_TEMPLATES,
  "location": GENERIC_SEARCH_TEMPLATES,
  "telecom-communication": GENERIC_SEARCH_TEMPLATES,
  "telecom": GENERIC_SEARCH_TEMPLATES,
  "vehicle-auto-records": GENERIC_SEARCH_TEMPLATES,
  "vehicle-auto": GENERIC_SEARCH_TEMPLATES,
  "health-medical": GENERIC_SEARCH_TEMPLATES,
  "health": GENERIC_SEARCH_TEMPLATES,
  "education-records": GENERIC_SEARCH_TEMPLATES,
  "education": GENERIC_SEARCH_TEMPLATES,
  "iot-smart-device": GENERIC_SEARCH_TEMPLATES,
  "iot": GENERIC_SEARCH_TEMPLATES,
};

interface BrokerOverride {
  urlTemplates: (params: SearchParams) => string[];
}

const BROKER_OVERRIDES: Record<string, BrokerOverride> = {
  "thatsthem": {
    urlTemplates: (p) => [
      `https://thatsthem.com/name/${encodeURIComponent(p.firstName)}-${encodeURIComponent(p.lastName)}${p.state ? `/${encodeURIComponent(p.state)}` : ""}`,
    ],
  },
  "zabasearch": {
    urlTemplates: (p) => [
      `https://www.zabasearch.com/people/${encodeURIComponent(p.firstName)}+${encodeURIComponent(p.lastName)}${p.state ? `/${encodeURIComponent(p.state)}/` : "/"}`,
    ],
  },
  "anywho": {
    urlTemplates: (p) => [
      `https://www.anywho.com/people/${encodeURIComponent(p.firstName)}+${encodeURIComponent(p.lastName)}${p.state ? `+${encodeURIComponent(p.state)}` : ""}`,
    ],
  },
  "nuwber": {
    urlTemplates: (p) => [
      `https://nuwber.com/search?name=${encodeURIComponent(p.firstName)}%20${encodeURIComponent(p.lastName)}`,
    ],
  },
  "familytreenow": {
    urlTemplates: (p) => [
      `https://www.familytreenow.com/search/genealogy/results?first=${encodeURIComponent(p.firstName)}&last=${encodeURIComponent(p.lastName)}`,
    ],
  },
  "peekyou": {
    urlTemplates: (p) => [
      `https://www.peekyou.com/${encodeURIComponent(p.firstName.toLowerCase())}_${encodeURIComponent(p.lastName.toLowerCase())}${p.state ? `/${encodeURIComponent(p.state.toLowerCase())}` : ""}`,
    ],
  },
  "cocofinder": {
    urlTemplates: (p) => [
      `https://cocofinder.com/people-search/result?fn=${encodeURIComponent(p.firstName)}&ln=${encodeURIComponent(p.lastName)}${p.state ? `&state=${encodeURIComponent(p.state)}` : ""}`,
    ],
  },
  "infotracer": {
    urlTemplates: (p) => [
      `https://infotracer.com/people-search/?fname=${encodeURIComponent(p.firstName)}&lname=${encodeURIComponent(p.lastName)}${p.state ? `&state=${encodeURIComponent(p.state)}` : ""}`,
    ],
  },
  "searchpeoplefree": {
    urlTemplates: (p) => [
      `https://www.searchpeoplefree.com/find/${encodeURIComponent(p.firstName.toLowerCase())}-${encodeURIComponent(p.lastName.toLowerCase())}${p.state ? `/${encodeURIComponent(p.state.toLowerCase())}` : ""}`,
    ],
  },
  "checkpeople": {
    urlTemplates: (p) => [
      `https://checkpeople.com/result?first_name=${encodeURIComponent(p.firstName)}&last_name=${encodeURIComponent(p.lastName)}`,
    ],
  },
  "voterrecords": {
    urlTemplates: (p) => [
      `https://voterrecords.com/voters/${encodeURIComponent(p.firstName.toLowerCase())}-${encodeURIComponent(p.lastName.toLowerCase())}/${p.state ? encodeURIComponent(p.state.toLowerCase()) : "1"}`,
    ],
  },
  "spydialer": {
    urlTemplates: (p) => [
      `https://www.spydialer.com/results.aspx?type=4&name=${encodeURIComponent(p.firstName)}+${encodeURIComponent(p.lastName)}`,
    ],
  },
  "advancedbackgroundchecks": {
    urlTemplates: (p) => [
      `https://www.advancedbackgroundchecks.com/names/${encodeURIComponent(p.firstName.toLowerCase())}-${encodeURIComponent(p.lastName.toLowerCase())}`,
    ],
  },
  "smartbackgroundchecks": {
    urlTemplates: (p) => [
      `https://www.smartbackgroundchecks.com/people/${encodeURIComponent(p.firstName.toLowerCase())}-${encodeURIComponent(p.lastName.toLowerCase())}`,
    ],
  },
  "classmates": {
    urlTemplates: (p) => [
      `https://www.classmates.com/siteui/ybsearch/results?q=${encodeURIComponent(p.firstName)}+${encodeURIComponent(p.lastName)}`,
    ],
  },
  "usa-people-search": {
    urlTemplates: (p) => [
      `https://www.usa-people-search.com/search?name=${encodeURIComponent(p.firstName)}+${encodeURIComponent(p.lastName)}${p.state ? `&state=${encodeURIComponent(p.state)}` : ""}`,
    ],
  },
  "addresses-com": {
    urlTemplates: (p) => [
      `https://www.addresses.com/people/${encodeURIComponent(p.firstName)}+${encodeURIComponent(p.lastName)}`,
    ],
  },
  "publicrecordsnow": {
    urlTemplates: (p) => [
      `https://www.publicrecordsnow.com/name/${encodeURIComponent(p.firstName)}-${encodeURIComponent(p.lastName)}`,
    ],
  },
  "us-search": {
    urlTemplates: (p) => [
      `https://www.ussearch.com/search/results?fn=${encodeURIComponent(p.firstName)}&ln=${encodeURIComponent(p.lastName)}${p.state ? `&state=${encodeURIComponent(p.state)}` : ""}`,
    ],
  },
  "peoplelooker": {
    urlTemplates: (p) => [
      `https://www.peoplelooker.com/people-search/results?firstName=${encodeURIComponent(p.firstName)}&lastName=${encodeURIComponent(p.lastName)}`,
    ],
  },
  "clustrmaps": {
    urlTemplates: (p) => [
      `https://clustrmaps.com/persons/${encodeURIComponent(p.firstName.toLowerCase())}-${encodeURIComponent(p.lastName.toLowerCase())}`,
    ],
  },
  "idtrue": {
    urlTemplates: (p) => [
      `https://www.idtrue.com/people-search/results?firstName=${encodeURIComponent(p.firstName)}&lastName=${encodeURIComponent(p.lastName)}`,
    ],
  },
  "privateeye": {
    urlTemplates: (p) => [
      `https://www.privateeye.com/people/${encodeURIComponent(p.firstName.toLowerCase())}-${encodeURIComponent(p.lastName.toLowerCase())}`,
    ],
  },
  "peoplesmart": {
    urlTemplates: (p) => [
      `https://www.peoplesmart.com/people-search/${encodeURIComponent(p.firstName.toLowerCase())}-${encodeURIComponent(p.lastName.toLowerCase())}`,
    ],
  },
  "neighbor-report": {
    urlTemplates: (p) => [
      `https://neighbor.report/${encodeURIComponent(p.firstName.toLowerCase())}-${encodeURIComponent(p.lastName.toLowerCase())}`,
    ],
  },
  "pipl": {
    urlTemplates: (p) => [
      `https://pipl.com/search/?q=${encodeURIComponent(p.firstName)}+${encodeURIComponent(p.lastName)}`,
    ],
  },
  "peoplesearchnow": {
    urlTemplates: (p) => [
      `https://www.peoplesearchnow.com/person/${encodeURIComponent(p.firstName.toLowerCase())}-${encodeURIComponent(p.lastName.toLowerCase())}`,
    ],
  },
  "findpeoplesearch": {
    urlTemplates: (p) => [
      `https://www.findpeoplesearch.com/people/${encodeURIComponent(p.firstName.toLowerCase())}-${encodeURIComponent(p.lastName.toLowerCase())}${p.state ? `/${encodeURIComponent(p.state.toLowerCase())}` : ""}`,
    ],
  },
  "persopo": {
    urlTemplates: (p) => [
      `https://www.persopo.com/search?fname=${encodeURIComponent(p.firstName)}&lname=${encodeURIComponent(p.lastName)}${p.state ? `&state=${encodeURIComponent(p.state)}` : ""}`,
    ],
  },
};

function createEmptyResult(searchMethod: string, responseTimeMs: number): ProfileSearchResult {
  return {
    found: false,
    profileUrl: null,
    nameMatch: false,
    cityMatch: false,
    stateMatch: false,
    ageMatch: false,
    matchScore: 0,
    extractedName: null,
    extractedCity: null,
    extractedState: null,
    extractedAge: null,
    extractedRelatives: [],
    rawSnippet: null,
    searchMethod,
    responseTimeMs,
  };
}

export function createUniversalAdapter(
  brokerId: string,
  brokerName: string,
  domain: string,
  category: string,
): BrokerAdapter {
  return {
    brokerId,
    brokerName,
    capabilities: {
      canSearch: true,
      canAutoOptOut: false,
      optOutMethod: "web_form",
      requiresCaptcha: false,
      requiresPhoneVerification: false,
      requiresIdVerification: false,
    },
    async searchProfile(params: SearchParams): Promise<ProfileSearchResult> {
      const startTime = Date.now();
      const { firstName, lastName, city, state } = params;
      const searchMethod = `universal_${category.replace(/-/g, "_")}`;

      const override = BROKER_OVERRIDES[brokerId];
      let urls: string[];

      if (override) {
        urls = override.urlTemplates(params);
      } else {
        const templateFn = CATEGORY_TEMPLATES[category] || GENERIC_SEARCH_TEMPLATES;
        urls = templateFn(params, domain);
      }

      const urlToTry = urls[0];
      if (!urlToTry) {
        return createEmptyResult(searchMethod, Date.now() - startTime);
      }

      try {
        const response = await safeFetchUniversal(urlToTry, 2500);
        const responseTime = Date.now() - startTime;

        if (!response) {
          return createEmptyResult(searchMethod, 0);
        }

        if (!response.ok) {
          return createEmptyResult(searchMethod, responseTime);
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("text/html") && !contentType.includes("application/xhtml") && !contentType.includes("text/plain") && !contentType.includes("application/json")) {
          return createEmptyResult(searchMethod, responseTime);
        }

        const html = await response.text();

        if (html.length < 100) {
          return createEmptyResult(searchMethod, responseTime);
        }

        const nameCheck = checkNameInHtml(html, firstName, lastName);

        if (nameCheck.found) {
          const locCheck = extractLocationFromHtml(html, city, state);
          const ageMatch = false;

          const score = calculateMatchScore(
            nameCheck.found,
            locCheck.cityMatch,
            locCheck.stateMatch,
            ageMatch,
          );

          return {
            found: true,
            profileUrl: urlToTry,
            nameMatch: true,
            cityMatch: locCheck.cityMatch,
            stateMatch: locCheck.stateMatch,
            ageMatch,
            matchScore: score,
            extractedName: nameCheck.extractedName,
            extractedCity: city && locCheck.cityMatch ? city : null,
            extractedState: state && locCheck.stateMatch ? state : null,
            extractedAge: null,
            extractedRelatives: [],
            rawSnippet: nameCheck.snippet,
            searchMethod,
            responseTimeMs: responseTime,
          };
        }

        return createEmptyResult(searchMethod, responseTime);
      } catch {
        return createEmptyResult(searchMethod, Date.now() - startTime);
      }
    },
  };
}

export function getAllBrokerSeedEntries(): Array<{ id: string; name: string; domain: string; category: string }> {
  return BROKER_REGISTRY;
}

const BROKER_REGISTRY: Array<{ id: string; name: string; domain: string; category: string }> = [];

export function registerBrokerForUniversalSearch(id: string, name: string, domain: string, category: string) {
  BROKER_REGISTRY.push({ id, name, domain, category });
}
