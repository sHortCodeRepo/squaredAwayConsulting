// js/locales.js
let translations = {};
let currentLocale = 'en'; // Default fallback

export async function loadTranslations(locale) {
  try {
    const response = await fetch(`./locales/${locale}.json`);
    if (!response.ok) {
      console.warn(`Translations for ${locale} not found, falling back to default.`);
      // Try to load a simpler language code if the full locale fails (e.g., 'en' for 'en-US')
      const simpleLocale = locale.split('-')[0];
      if (simpleLocale !== locale) {
          const simpleResponse = await fetch(`./locales/${simpleLocale}.json`);
          if (simpleResponse.ok) {
              translations = await simpleResponse.json();
              currentLocale = simpleLocale;
              return;
          }
      }
      throw new Error(`Failed to load any translations for ${locale}`);
    }
    translations = await response.json();
    currentLocale = locale;
  } catch (error) {
    console.error("Error loading translations:", error);
    // Optionally load a hardcoded default if all else fails
    translations = {
        "home_title": "Welcome",
        "about_title": "About Us",
        "greeting": "Hello, world!",
        "call_to_action": "Learn More"
    }; // Fallback to basic English or an empty object
    currentLocale = 'en';
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
