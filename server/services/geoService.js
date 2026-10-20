import geoip from 'geoip-lite';
import { isPrivateIp, normalizeIp } from './privacyService.js';

// Common country code to English name map
const countryNames = {
  IN: 'India',
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  AU: 'Australia',
  JP: 'Japan',
  SG: 'Singapore',
  NL: 'Netherlands',
  BR: 'Brazil',
  ZA: 'South Africa',
  AE: 'United Arab Emirates',
  CH: 'Switzerland',
  SE: 'Sweden',
  IE: 'Ireland',
  ES: 'Spain',
  IT: 'Italy',
  RU: 'Russia',
  CN: 'China',
  KR: 'South Korea'
};

/**
 * Resolves coarse geolocation metadata on the server
 * Never uncovers precise home addresses or personal identity
 * Clearly flags all data as approximate
 */
export function lookupGeoLocation(ip) {
  const cleanIp = normalizeIp(ip);

  // Check for private, loopback, or reserved network addresses
  if (isPrivateIp(cleanIp)) {
    return {
      country: 'LOCAL',
      country_name: 'Local / Private Network',
      region: 'Intranet',
      city: 'Localhost / Internal Subnet',
      is_approximate: true,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      note: 'Private IP space (RFC 1918 / Loopback). Geolocation cannot be determined from public registry.'
    };
  }

  try {
    const geo = geoip.lookup(cleanIp);
    if (!geo) {
      return {
        country: 'UNKNOWN',
        country_name: 'Unresolvable / Satellite',
        region: '',
        city: '',
        is_approximate: true,
        timezone: 'UTC',
        note: 'IP address not found in local GeoIP database.'
      };
    }

    const code = (geo.country || 'UNKNOWN').toUpperCase();
    const countryName = countryNames[code] || code;

    return {
      country: code,
      country_name: countryName,
      region: geo.region || '',
      city: geo.city || '',
      is_approximate: true,
      timezone: geo.timezone || 'UTC',
      note: 'Coarse geolocation estimated via GeoIP database. Subject to ISP dynamic routing and proxy servers.'
    };
  } catch (err) {
    return {
      country: 'UNKNOWN',
      country_name: 'Lookup Error',
      region: '',
      city: '',
      is_approximate: true,
      timezone: 'UTC',
      note: 'GeoIP service encountered an error during lookup.'
    };
  }
}
