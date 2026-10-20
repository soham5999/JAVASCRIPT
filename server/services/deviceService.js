import { UAParser } from 'ua-parser-js';

/**
 * Parses user-agent header into clean, sanitized technical categories
 */
export function parseDeviceAndBrowser(userAgentString, clientScreen) {
  if (!userAgentString) {
    return {
      deviceType: 'unknown',
      browser: 'Unknown',
      os: 'Unknown',
      screenCategory: clientScreen || 'desktop'
    };
  }

  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  // Determine device type
  let deviceType = 'desktop';
  if (result.device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'tablet';
  } else if (result.device.type === 'smarttv' || result.device.type === 'wearable') {
    deviceType = result.device.type;
  } else if (clientScreen === 'mobile' || clientScreen === 'tablet') {
    deviceType = clientScreen;
  }

  // Determine browser name
  const browserName = result.browser.name || 'Unknown Browser';
  const osName = result.os.name ? `${result.os.name}${result.os.version ? ' ' + result.os.version : ''}` : 'Unknown OS';

  // Sanitize screen category
  const validScreens = ['mobile', 'tablet', 'desktop', 'ultrawide'];
  const screenCategory = validScreens.includes(clientScreen) ? clientScreen : deviceType;

  return {
    deviceType,
    browser: browserName,
    os: osName,
    screenCategory
  };
}
