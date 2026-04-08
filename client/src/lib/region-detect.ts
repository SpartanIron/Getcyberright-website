export type Region = 'us' | 'americas' | 'africa' | 'europe' | 'asia' | 'middle-east' | 'australia' | 'global';

export interface RegionInfo {
  code: Region;
  headline: string;
  adjective: string;
}

const universalHeadline = 'Keeping Families Safe Online';

const regionMap: Record<Region, RegionInfo> = {
  'us': { code: 'us', headline: universalHeadline, adjective: 'American' },
  'americas': { code: 'americas', headline: universalHeadline, adjective: 'American' },
  'africa': { code: 'africa', headline: universalHeadline, adjective: 'African' },
  'europe': { code: 'europe', headline: universalHeadline, adjective: 'European' },
  'asia': { code: 'asia', headline: universalHeadline, adjective: 'Asian' },
  'middle-east': { code: 'middle-east', headline: universalHeadline, adjective: 'Middle Eastern' },
  'australia': { code: 'australia', headline: universalHeadline, adjective: 'Australian' },
  'global': { code: 'global', headline: universalHeadline, adjective: 'Global' }
};

const africaCountries = ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW'];
const europeCountries = ['AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA'];
const asiaCountries = ['AF', 'AM', 'AZ', 'BD', 'BT', 'BN', 'KH', 'CN', 'GE', 'HK', 'IN', 'ID', 'JP', 'KZ', 'KP', 'KR', 'KG', 'LA', 'MO', 'MY', 'MV', 'MN', 'MM', 'NP', 'PK', 'PH', 'SG', 'LK', 'TW', 'TJ', 'TH', 'TL', 'TM', 'UZ', 'VN'];
const middleEastCountries = ['BH', 'IR', 'IQ', 'IL', 'JO', 'KW', 'LB', 'OM', 'PS', 'QA', 'SA', 'SY', 'TR', 'AE', 'YE'];
const oceaniaCountries = ['AU', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NZ', 'PW', 'PG', 'WS', 'SB', 'TO', 'TV', 'VU'];
const americasCountries = ['AR', 'BS', 'BB', 'BZ', 'BO', 'BR', 'CA', 'CL', 'CO', 'CR', 'CU', 'DM', 'DO', 'EC', 'SV', 'GD', 'GT', 'GY', 'HT', 'HN', 'JM', 'MX', 'NI', 'PA', 'PY', 'PE', 'KN', 'LC', 'VC', 'SR', 'TT', 'UY', 'VE'];

function mapCountryToRegion(countryCode: string): Region {
  const code = countryCode.toUpperCase();
  
  if (code === 'US') return 'us';
  if (africaCountries.includes(code)) return 'africa';
  if (europeCountries.includes(code)) return 'europe';
  if (asiaCountries.includes(code)) return 'asia';
  if (middleEastCountries.includes(code)) return 'middle-east';
  if (oceaniaCountries.includes(code)) return 'australia';
  if (americasCountries.includes(code)) return 'americas';
  
  return 'global';
}

export function getRegionInfo(region: Region): RegionInfo {
  return regionMap[region] || regionMap['global'];
}

export async function detectUserRegion(): Promise<Region> {
  if (typeof window === 'undefined') return 'global';
  const cached = localStorage.getItem('user_region');
  if (cached && Object.keys(regionMap).includes(cached)) {
    return cached as Region;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return 'global';
    }
    
    const data = await response.json();
    const region = mapCountryToRegion(data.country_code || '');
    
    localStorage.setItem('user_region', region);
    return region;
  } catch {
    return 'global';
  }
}

export function setUserRegion(region: Region): void {
  if (typeof window !== 'undefined') localStorage.setItem('user_region', region);
}

export function clearUserRegion(): void {
  if (typeof window !== 'undefined') localStorage.removeItem('user_region');
}

export interface UserLocation {
  region: Region;
  countryCode: string;
}

export async function detectUserLocation(): Promise<UserLocation> {
  if (typeof window === 'undefined') return { region: 'global', countryCode: '' };
  const cachedRegion = localStorage.getItem('user_region');
  const cachedCountry = localStorage.getItem('user_country_code');
  
  if (cachedRegion && cachedCountry && Object.keys(regionMap).includes(cachedRegion)) {
    return { region: cachedRegion as Region, countryCode: cachedCountry };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return { region: 'global', countryCode: '' };
    }
    
    const data = await response.json();
    const countryCode = (data.country_code || '').toUpperCase();
    const region = mapCountryToRegion(countryCode);
    
    localStorage.setItem('user_region', region);
    localStorage.setItem('user_country_code', countryCode);
    
    return { region, countryCode };
  } catch {
    return { region: 'global', countryCode: '' };
  }
}
