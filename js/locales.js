// js/locales.js
let translations = {};
let currentLocale = 'en-US'; // Default fallback (use a full locale now)

export async function loadTranslations(locale) {
  try {
    // Ensure the path is correct for full locales
    const response = await fetch(`./locales/${locale}.json`);
    if (!response.ok) {
      console.warn(`Translations for ${locale} not found, attempting fallback to base language.`);
      const baseLocale = locale.split('-')[0]; // e.g., 'en' from 'en-US'
      if (baseLocale !== locale) { // Avoid infinite loop if baseLocale is same as locale
        const baseResponse = await fetch(`./locales/${baseLocale}.json`);
        if (baseResponse.ok) {
          translations = await baseResponse.json();
          currentLocale = baseLocale; // Set currentLocale to the base if found
          console.log(`Loaded fallback translations for ${baseLocale}.`);
          return;
        }
      }
      throw new Error(`Failed to load any translations for ${locale}`);
    }
    translations = await response.json();
    currentLocale = locale;
    console.log(`Loaded translations for ${locale}.`);
  } catch (error) {
    console.error("Error loading translations:", error);
    // Optionally load a hardcoded default if all else fails or keep translations empty
    translations = {
        "home_title": "Welcome",
        "about_title": "About Us",
        "greeting": "Hello, world!",
        "call_to_action": "Learn More"
    };
    currentLocale = 'en-US'; // Fallback to a full default
  }
}

export function _t(key, ...args) {
  let translatedString = translations[key] || key; // Fallback to key if not found

  args.forEach((arg, index) => {
    translatedString = translatedString.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
  });

  return translatedString;
}

export function getCurrentLocale() {
  return currentLocale;
}

export function setCurrentLocale(locale) {
    currentLocale = locale;
}
