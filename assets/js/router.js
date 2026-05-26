/**
 * Router for the Single Page Application (SPA).
 * Uses hash-based routing (#home, #projets) for GitHub Pages compatibility.
 */

// Define routes: key = hash, value = object with page path and title
const routes = {
    'home': { fr: { path: 'pages/fr/home.html', title: 'Accueil' }, en: { path: 'pages/en/home.html', title: 'Home' } },
    'projets': { fr: { path: 'pages/fr/projets.html', title: 'Projets' }, en: { path: 'pages/en/projects.html', title: 'Projects' } },
    'cv': { fr: { path: 'pages/fr/cv.html', title: 'CV' }, en: { path: 'pages/en/resume.html', title: 'Resume' } },
    'about': { fr: { path: 'pages/fr/about.html', title: 'À propos' }, en: { path: 'pages/en/about.html', title: 'About' } },
    'contact': { fr: { path: 'pages/fr/contact.html', title: 'Contact' }, en: { path: 'pages/en/contact.html', title: 'Contact' } },
    'legal': { fr: { path: 'pages/fr/legal.html', title: 'Mentions Légales' }, en: { path: 'pages/en/legal.html', title: 'Legal Notice' } },
    // Add new routes here
};

const appContent = document.getElementById('app-content');
const pageTitle = document.getElementById('page-title');

// Function to determine the current language (from the HTML tag)
function getCurrentLang() {
    return document.documentElement.lang;
}

// Function to load content based on the current hash and language
async function loadContent() {
    const hash = window.location.hash.slice(1) || 'home'; // Default to 'home' if hash is empty
    const lang = getCurrentLang();
    
    // Check if the base route exists
    const route = routes[hash];

    if (route) {
        // Check if the specific language version exists
        const page = route[lang];
        if (page) {
            try {
                const response = await fetch(page.path);
                if (!response.ok) throw new Error(`Failed to load: ${page.path}`);

                const html = await response.text();
                appContent.innerHTML = html;
                
                // Update the page title
                pageTitle.textContent = `Portfolio - ${page.title}`;

                // Re-initialize animations for newly loaded content
                if (typeof window.initAnimations === 'function') {
                    window.initAnimations();
                }
            } catch (error) {
                console.error(`Error loading content for #${hash} in ${lang}:`, error);
                appContent.innerHTML = `<h1>404</h1><p>Page not found or failed to load content.</p>`;
                pageTitle.textContent = `Portfolio - Error`;
            }
        } else {
            // Handle case where route exists but not in current language (shouldn't happen with your current setup)
            console.error(`Route #${hash} is missing content for language ${lang}`);
            appContent.innerHTML = `<h1>Error</h1><p>Language version missing.</p>`;
        }
    } else {
        // 404 handler for unknown routes
        appContent.innerHTML = `<h1>404 Not Found</h1><p>The requested route does not exist.</p>`;
        pageTitle.textContent = `Portfolio - 404`;
    }
}

// Event listener for hash changes (when user clicks a link or uses Back/Forward buttons)
window.addEventListener('hashchange', loadContent);

// Event listener to load content on initial page load
document.addEventListener('DOMContentLoaded', () => {
    // Initial content load
    loadContent(); 
});