// js/app.js
import { loadTranslations, _t, getCurrentLocale, setCurrentLocale } from './locales.js';

// IMPORTANT: Update this with your full list of supported locales
const supportedLocales = ['en-US', 'en-GB', 'et-EE', 'es-MX', 'de-DE', 'fr-CA'];

// Function to get the locale from the URL
function getLocaleFromPath() {
    const pathSegments = window.location.pathname.split('/').filter(segment => segment);
    if (pathSegments.length > 0) {
        // Check if the first segment is a supported full locale (e.g., "en-US")
        // Or if it's a base language (e.g., "en") for a more flexible match
        const potentialLocale = pathSegments[0];
        if (supportedLocales.includes(potentialLocale)) {
            return potentialLocale;
        }
        // Also check if the base language is supported, and if so,
        // we might default to a primary full locale for that base
        const baseLocale = potentialLocale.split('-')[0];
        const primaryFullLocale = supportedLocales.find(loc => loc.startsWith(baseLocale));
        if (primaryFullLocale) {
            return primaryFullLocale; // Use a preferred full locale if base matches
        }
    }
    return null; // No supported locale found in path
}

// Function to determine the initial locale (Robustly)
function detectInitialLocale() {
    // 1. User Preference (from localStorage) - Highest priority
    const userPreferredLocale = localStorage.getItem('userLocale');
    if (userPreferredLocale && supportedLocales.includes(userPreferredLocale)) {
        return userPreferredLocale;
    }

    // 2. From URL Path - Next highest priority
    const localeInPath = getLocaleFromPath();
    if (localeInPath) {
        return localeInPath;
    }

    // 3. Browser Language (navigator.language / navigator.languages)
    // This now prefers exact matches, then base language matches
    const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];
    for (const browserLang of browserLanguages) {
        // Try exact match first (e.g., "en-US")
        if (supportedLocales.includes(browserLang)) {
            return browserLang;
        }
        // Then try base language match (e.g., "en" matches "en-US")
        const baseLang = browserLang.split('-')[0];
        const matchedFullLocale = supportedLocales.find(loc => loc.startsWith(baseLang));
        if (matchedFullLocale) {
            return matchedFullLocale;
        }
    }

    // 4. Fallback Default Locale - Lowest priority
    return 'en-US'; // Ensure this is one of your supportedLocales
}

// Function to update content based on current locale
function updateContent() {
    const currentLocale = getCurrentLocale();
    console.log(`Updating content for locale: ${currentLocale}`);

    // Update HTML lang attribute
    document.documentElement.lang = currentLocale;
    // Example for RTL languages (you'd add 'ar', 'he' etc.)
    document.documentElement.setAttribute('dir', (currentLocale.startsWith('ar') || currentLocale.startsWith('he')) ? 'rtl' : 'ltr');

    // Update the language switcher dropdown
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.value = currentLocale;
    }

    // Example of dynamic content based on the (simulated) page
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    // We'll simulate getting the page from the URL.
    // Assuming URL like /en-US/about or /et-EE/
    const pathSegments = window.location.pathname.split('/').filter(segment => segment);
    const page = (pathSegments.length > 1) ? pathSegments[1] : 'home'; // Default to 'home'

    let htmlContent = '';
    switch (page) {
        case 'home':
            htmlContent = `
                <h1>${_t('home_title')}</h1>
                <p>${_t('greeting')}</p>
                <button onclick="window.location.href = '/${currentLocale}/about';">${_t('call_to_action')}</button>
            `;
            break;
        case 'about':
            htmlContent = `
                <h1>${_t('about_title')}</h1>
                <p>This is the about page content in ${currentLocale}.</p>
                <button onclick="window.location.href = '/${currentLocale}/';">Back to Home</button>
            `;
            break;
        default:
            htmlContent = `<h1>Not Found</h1><p>The page you requested does not exist.</p>`;
    }
    contentDiv.innerHTML = htmlContent;
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    const initialLocale = detectInitialLocale();
    setCurrentLocale(initialLocale); // Set the global currentLocale

    await loadTranslations(initialLocale); // Load translations for the initial locale

    // --- Critical part for URL and full reload ---
    // If the determined initial locale doesn't match the current URL path,
    // or if the URL path doesn't have a locale prefix, redirect to the correct one.
    const currentPathLocale = getLocaleFromPath();
    const currentPath = window.location.pathname;

    // Construct the target path correctly, keeping the rest of the path intact
    let targetPath = currentPath;
    if (currentPathLocale) {
        // Path has a locale, check if it's the right one
        if (currentPathLocale !== initialLocale) {
            targetPath = currentPath.replace(`/${currentPathLocale}`, `/${initialLocale}`);
        }
    } else {
        // Path does not have a locale prefix, add it (e.g., /about -> /en-US/about)
        targetPath = `/${initialLocale}${currentPath}`;
    }

    // Only redirect if the targetPath is different from the current one
    if (targetPath !== currentPath) {
        // Use window.location.replace to prevent adding to history
        window.location.replace(targetPath);
        // Stop execution here, as the page will reload
        return;
    }
    // --- End of critical redirect part ---

    // If no redirect happened, proceed with rendering
    updateContent();

    // Setup Language Switcher to trigger a full page reload
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        // Set initial value of dropdown
        langSwitcher.value = initialLocale;

        langSwitcher.addEventListener('change', (event) => {
            const newLocale = event.target.value;
            localStorage.setItem('userLocale', newLocale); // Save user preference

            // Get the current path without the locale prefix (e.g., '/about')
            let currentPathWithoutLocale = window.location.pathname;
            const pathLocalePrefixMatch = currentPathWithoutLocale.match(/^\/([a-z]{2}(-[A-Z]{2})?)\//);
            if (pathLocalePrefixMatch && pathLocalePrefixMatch[1]) {
                currentPathWithoutLocale = currentPathWithoutLocale.replace(`/${pathLocalePrefixMatch[1]}`, '');
            }
            if (currentPathWithoutLocale === '') {
                currentPathWithoutLocale = '/'; // Ensure it's '/' if it was just /en-US
            }

            // Construct the new URL with the chosen locale
            const newUrl = `/${newLocale}${currentPathWithoutLocale}`;

            // Trigger a full page reload to the new URL
            window.location.href = newUrl;
        });
    }
});
