// js/app.js
import { loadTranslations, _t, getCurrentLocale, setCurrentLocale } from './locales.js';

const supportedLocales = ['en', 'et', 'es']; // Make sure these match your translation file names

// Function to get the locale from the URL
function getLocaleFromPath() {
    const pathSegments = window.location.pathname.split('/').filter(segment => segment); // Remove empty strings
    if (pathSegments.length > 0 && supportedLocales.includes(pathSegments[0])) {
        return pathSegments[0];
    }
    return null; // No locale found in path
}

// Function to determine the initial locale
function detectInitialLocale() {
    // 1. User Preference (from localStorage)
    const userPreferredLocale = localStorage.getItem('userLocale');
    if (userPreferredLocale && supportedLocales.includes(userPreferredLocale)) {
        return userPreferredLocale;
    }

    // 2. From URL Path
    const localeInPath = getLocaleFromPath();
    if (localeInPath) {
        return localeInPath;
    }

    // 3. Browser Language
    const browserLanguage = navigator.language || navigator.userLanguage;
    const matchedBrowserLocale = supportedLocales.find(loc => browserLanguage.startsWith(loc));
    if (matchedBrowserLocale) {
        return matchedBrowserLocale;
    }

    // 4. Fallback Default
    return 'en';
}

// Simple Router (for demonstration)
function navigate(path) {
    const currentLocale = getCurrentLocale();
    let newPath = `/${currentLocale}${path}`; // Prepend locale to path
    history.pushState({ path: newPath }, '', newPath);
    renderContent(newPath); // Re-render the page
}

function renderContent(path) {
    const pathSegments = path.split('/').filter(segment => segment);
    const locale = pathSegments[0]; // First segment is locale
    const page = pathSegments[1] || 'home'; // Second segment is page, default to 'home'

    // Update HTML lang attribute
    document.documentElement.lang = locale;
    document.documentElement.setAttribute('dir', (locale === 'ar' || locale === 'he') ? 'rtl' : 'ltr'); // Example for RTL

    // Example of dynamic content based on page
    const contentDiv = document.getElementById('content');
    if (!contentDiv) return;

    let htmlContent = '';
    switch (page) {
        case 'home':
            htmlContent = `
                <h1>${_t('home_title')}</h1>
                <p>${_t('greeting')}</p>
                <button onclick="window.app.navigate('/about')">${_t('call_to_action')}</button>
            `;
            break;
        case 'about':
            htmlContent = `
                <h1>${_t('about_title')}</h1>
                <p>This is the about page content.</p>
            `;
            break;
        default:
            htmlContent = `<h1>Not Found</h1><p>The page you requested does not exist.</p>`;
    }
    contentDiv.innerHTML = htmlContent;

    // Update the language switcher dropdown
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.value = locale;
    }
}

// Event Listener for PopState (browser back/forward buttons)
window.addEventListener('popstate', (event) => {
    renderContent(window.location.pathname);
});

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    const initialLocale = detectInitialLocale();
    setCurrentLocale(initialLocale); // Set the global currentLocale

    await loadTranslations(initialLocale); // Load translations for the initial locale

    // If the URL path doesn't match the determined locale, update it
    const currentPathLocale = getLocaleFromPath();
    if (currentPathLocale !== initialLocale) {
        // Redirect to the correct localized URL
        const originalPath = window.location.pathname.replace(/^\/[a-z]{2}(\-[A-Z]{2})?\//, '/'); // Remove old locale prefix
        const newPath = `/${initialLocale}${originalPath}`;
        history.replaceState({ path: newPath }, '', newPath); // Use replaceState to avoid extra history entry
    }

    renderContent(window.location.pathname);

    // Setup Language Switcher
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.value = initialLocale; // Set initial selection
        langSwitcher.addEventListener('change', async (event) => {
            const newLocale = event.target.value;
            localStorage.setItem('userLocale', newLocale); // Save user preference

            setCurrentLocale(newLocale); // Update global currentLocale
            await loadTranslations(newLocale); // Load new translations

            // Update URL to reflect the new locale
            const currentPath = window.location.pathname.replace(/^\/[a-z]{2}(\-[A-Z]{2})?\//, '/'); // Get path without locale
            navigate(currentPath); // Navigate to new path with new locale
        });
    }

    // Make navigate function globally accessible for inline onclick (or use event delegation)
    window.app = {
        navigate: navigate
    };
});
