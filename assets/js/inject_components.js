// Function asynchrone pour charger et injecter le HTML
async function loadComponent(elementId, componentPath) {
    // 1. Fetch the new HTML content
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            console.error(`Failed to load component: ${componentPath}. Status: ${response.status}`);
            return;
        }
        const html = await response.text();
        
        // 2. Find the target container (either the original placeholder or the element it was replaced by)
        const container = document.getElementById(elementId);
        
        if (container) {
            // OPTION A: If the placeholder still exists (initial load or previous reload failed to replace completely)
            // Replace the entire placeholder with the new component's HTML
            container.outerHTML = html;
            
        } else {
            // OPTION B: The original placeholder was replaced (e.g., 'header-placeholder' is gone, 
            // replaced by <header class="top-banner">).
            // We need to find the element that holds the component and replace its content.
            
            // NOTE: Since your components are <header> and <aside>, we need a way to 
            // inject the new HTML *near* where the old ID was.
            
            // To be 100% safe and simple, let's target the *first* element that 
            // looks like the previous component's root (e.g., the <header> or <footer>).

            const newRootSelector = (elementId === 'header-placeholder') ? 'header.top-banner' : 'footer.site-footer';
            const existingRoot = document.querySelector(newRootSelector);

            if (existingRoot) {
                // If the root component is already there, replace it completely.
                existingRoot.outerHTML = html;
            } else {
                console.error(`Could not find the container ID "${elementId}" or the existing root element "${newRootSelector}" for replacement.`);
            }
        }
        
    } catch (error) {
        console.error('An error occurred during component loading:', error);
    }
}

// Fonction principale pour charger les composants
function initializeComponents() {
    // Determine the current language from the <html> tag
    const isEnglish = document.documentElement.lang === 'en';
    const langSuffix = isEnglish ? '_en' : '';

    // Load Header component
    loadComponent('header-placeholder', `components/header${langSuffix}.html`); 

    // Load Footer component
    loadComponent('footer-placeholder', `components/footer${langSuffix}.html`);
}

// Assurez-vous que le DOM est chargé avant d'initialiser les composants
// This is called on initial page load AND by the switchLang function.
document.addEventListener('DOMContentLoaded', () => {
    // We only call initializeComponents here for the first page load.
    // The switchLang function will handle subsequent reloads.
    initializeComponents();
});