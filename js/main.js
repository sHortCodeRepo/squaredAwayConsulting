// js/main.js

/**
 * Loads locale-specific translation data from a JSON file.
 * The function assumes locale JSON files are located in the /locales/ directory
 * at the root of your domain.
 * @param {string} locale - The locale key (e.g., 'en-US', 'de-DE').
 * @returns {Promise<Object>} A promise that resolves with the translation data.
 */
async function loadLocaleData(locale) {
    try {
        // Construct the absolute path to the locale JSON file
        const response = await fetch(`/locales/${locale}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load locale data for ${locale}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading locale data:', error);
        // Return an empty object or a default set of translations on error
        return {};
    }
}

/**
 * Applies translation data to HTML elements on the page.
 * It targets elements by their 'id' attribute.
 * @param {Object} data - The translation data (key-value pairs).
 * @param {string} currentLocale - The currently active locale (e.g., 'en-US').
 */
function applyTranslations(data, currentLocale) {
    // Apply translations to specific elements by their IDs
    // The || 'Default Text' provides a fallback if a translation key is missing
    document.getElementById('hero-title').textContent = data.heroTitle || 'Welcome!';
    document.getElementById('hero-subtitle').textContent = data.heroSubtitle || 'Default subtitle.';
    document.getElementById('cta-button').textContent = data.callToAction || 'Learn More';
    document.getElementById('features-heading').textContent = data.featuresHeading || 'Our Features';
    document.getElementById('footer-copyright').textContent = data.footerCopyright || '© 2025 Squared Away Consulting.';

    // --- Language Switcher Logic ---
    const langSwitcher = document.getElementById('language-switcher');
    if (langSwitcher) {
        // Build the HTML for the language switcher
        // Ensure ALL your supported languages are listed here with their correct paths
        langSwitcher.innerHTML = `
            <a href="/en-US/">English (US)</a> | 
            <a href="/es-MX/">Español (MX)</a> |
            <a href="/fr-CA/">Français (CA)</a> |
            <a href="/de-DE/">Deutsch (DE)</a> |
            <a href="/et-EE/">Eesti (EE)</a> 
            <!-- Add other languages here following the same pattern -->
        `;
        
        // Highlight the currently active language link
        const activeLink = langSwitcher.querySelector(`a[href="/${currentLocale}/"]`);
        if (activeLink) {
            activeLink.classList.add('active-locale');
        }
    }
}

// --- Main execution when the DOM is fully loaded ---
document.addEventListener('DOMContentLoaded', async () => {
    // Dynamically determine the current locale from the URL pathname.
    // Example: For "https://www.squaredawayconsulting.net/en-US/services.html",
    // pathname will be "/en-US/services.html".
    // Splitting by '/' and filtering out empty strings results in ["en-US", "services.html"].
    // We take the first segment as the locale.
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    
    // Default to 'en-US' if no locale segment is found in the URL (e.g., if accessing root 'https://www.squaredawayconsulting.net/')
    // You might want to implement a redirect for the root if it's not a valid locale.
    const currentLocale = pathSegments.length > 0 ? pathSegments[0] : 'en-US';

    // Load and apply the translations for the determined locale
    const translations = await loadLocaleData(currentLocale);
    applyTranslations(translations, currentLocale);
});
