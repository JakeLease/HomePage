// Theme handling
const themeSwitch = document.getElementById('theme-switch');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme based on system preference
document.body.setAttribute('data-theme', prefersDarkScheme.matches ? 'dark' : 'light');

themeSwitch.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Notes functionality
const notesWidget = document.querySelector('.notes-widget');
const toggleNotesBtn = document.querySelector('.toggle-notes');
const quickNotes = document.getElementById('quick-notes');

// Load saved notes
quickNotes.value = localStorage.getItem('quickNotes') || '';

toggleNotesBtn.addEventListener('click', () => {
    notesWidget.classList.toggle('expanded');
    toggleNotesBtn.querySelector('svg').style.transform = 
        notesWidget.classList.contains('expanded') ? 'rotate(45deg)' : 'rotate(0deg)';
});

quickNotes.addEventListener('input', (e) => {
    localStorage.setItem('quickNotes', e.target.value);
});

// Enhanced search functionality with visual hints
const searchBox = document.getElementById('searchbox');
const searchHints = document.querySelector('.search-hints');
const searchPrefixes = {
    'y/': { url: 'https://www.youtube.com/results?search_query=', name: 'YouTube' },
    'r/': { url: 'https://www.reddit.com/search/?q=', name: 'Reddit' },
    'gh/': { url: 'https://github.com/search?q=', name: 'GitHub' },
    'a/': { url: 'https://www.amazon.com/s?k=', name: 'Amazon' },
    'w/': { url: 'https://wikipedia.org/w/index.php?search=', name: 'Wikipedia' }
};

searchBox.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    const prefix = Object.entries(searchPrefixes).find(([p]) => query.startsWith(p));
    
    if (prefix) {
        const [key, { name }] = prefix;
        searchBox.style.borderBottom = '2px solid var(--accent-color)';
        searchBox.title = `Searching on ${name}`;
    } else {
        searchBox.style.borderBottom = 'none';
        searchBox.title = 'Search the web';
    }
});

searchBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchBox.value.trim();
        if (query) {
            // Check for search prefixes
            for (const [prefix, { url }] of Object.entries(searchPrefixes)) {
                if (query.startsWith(prefix)) {
                    const searchTerm = encodeURIComponent(query.slice(prefix.length));
                    window.location.href = `${url}${searchTerm}`;
                    return;
                }
            }
            // Default to Google search
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }
});

// Update time with animation
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeElement = document.getElementById('time');
    
    if (timeElement.textContent !== `${hours}:${minutes}`) {
        timeElement.style.transform = 'translateY(-10px)';
        timeElement.style.opacity = '0';
        
        setTimeout(() => {
            timeElement.textContent = `${hours}:${minutes}`;
            timeElement.style.transform = 'translateY(0)';
            timeElement.style.opacity = '1';
        }, 200);
    }
}

updateTime();
setInterval(updateTime, 1000);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Fade in animation
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
}); 