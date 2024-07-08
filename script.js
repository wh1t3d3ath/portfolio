// Theme Handling

const themeIcons = document.querySelectorAll(".icon");

/**
 * Set the initial theme based on system preference or local storage
 */
function setInitialTheme() {
    const isSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = localStorage.getItem('theme') || (isSystemDarkMode ? 'dark' : 'light');
    document.body.setAttribute('theme', theme);
    applyThemeIcons(theme);
}

/**
 * Update theme icons based on the current theme
 * @param {string} theme - The current theme ('dark' or 'light')
 */
function applyThemeIcons(theme) {
    themeIcons.forEach(icon => {
        icon.src = theme === 'dark' ? icon.getAttribute("src-dark") : icon.getAttribute("src-light");
    });
}

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('theme', newTheme);
    localStorage.setItem('theme', newTheme);
    applyThemeIcons(newTheme);
}

/**
 * Setup theme toggle buttons
 */
function setupThemeToggleButtons() {
    const toggleButtons = [document.getElementById('modeToggle'), document.getElementById('modeToggle2')];

    function toggleThemeHandler(event) {
        event.preventDefault();
        toggleTheme();
    }

    toggleButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', toggleThemeHandler);
            button.addEventListener('touchstart', toggleThemeHandler);
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setInitialTheme();
    setupThemeToggleButtons();
    updateAge();
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newTheme = e.matches ? 'dark' : 'light';
    document.body.setAttribute('theme', newTheme);
    applyThemeIcons(newTheme);
});

// Menu Handling

/**
 * Toggle the visibility of the menu
 */
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    const isOpen = menu.classList.contains("open");

    menu.style.opacity = isOpen ? '0' : '1';
    menu.style.transform = isOpen ? 'translateY(-20px)' : 'translateY(0)';

    setTimeout(() => {
        menu.classList.toggle("open");
    }, isOpen ? 300 : 0);

    icon.classList.toggle("open");
}

function closeMenuOnResize() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  if (window.innerWidth > 1200) {
    menu.classList.remove("open");
    icon.classList.remove("open");
  }
}

window.addEventListener('resize', closeMenuOnResize);

// Dropdown menu handling

document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const downloadCvButton = document.getElementById('downloadCvButton');

    function showDropdown() {
        dropdownContent.style.display = 'block';
        setTimeout(() => {
            dropdownContent.style.opacity = '1';
            dropdownContent.style.transform = 'translateY(0)';
            dropdownContent.style.pointerEvents = 'auto';
        }, 10);
    }

    function hideDropdown() {
        dropdownContent.style.opacity = '0';
        dropdownContent.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            dropdownContent.style.display = 'none';
            dropdownContent.style.pointerEvents = 'none';
        }, 300);
    }

    dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdownContent.style.display === 'block' ? hideDropdown() : showDropdown();
    });

    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            hideDropdown();
            downloadCvButton.classList.remove('active');
        }
    });
});

// Animations and Effects

/**
 * Add intersection observer to animate elements on scroll
 */
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target && entry.target.classList) {
                entry.target.classList.toggle('visible', entry.isIntersecting);
                entry.target.classList.toggle('not-visible', !entry.isIntersecting);
            }
        });
    }, { rootMargin: '0px', threshold: 0.3 });

    document.querySelectorAll('.animated, .animate-on-scroll').forEach(element => {
        if (element) {
            observer.observe(element);
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => link.classList.add('visible'));
}

document.addEventListener('DOMContentLoaded', setupScrollAnimations);

// Utility Functions

/**
 * Update the current year in the footer
 */
function updateCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    yearSpan.textContent = new Date().getFullYear();
}

/**
 * Update age based on birthdate
 */
function updateAge() {
    const birthdate = new Date('2004-05-25');
    const age = Math.floor((Date.now() - birthdate) / (365.25 * 24 * 60 * 60 * 1000));
    document.getElementById('age').textContent = age;
}

// Scroll to Top Function

/**
 * Scroll to the top of the page smoothly
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/Hide Back to Top Button

window.addEventListener('scroll', function() {
    const backToTopButton = document.getElementById('back-to-top');
    backToTopButton.classList.toggle('show-back-to-top', window.scrollY > 300);
});

// Splash Screen and Initial Theme

/**
 * Hide the splash screen and show profile animations
 */
function hideSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const profileSection = document.getElementById('profile');

    splashScreen.addEventListener('transitionend', () => {
        splashScreen.style.display = 'none';
        profileSection.classList.add('visible');
        AOS.init({ duration: 1000, once: false });
        AOS.refresh();
    });

    splashScreen.style.opacity = '0';
}

/**
 * Apply the initial theme on page load
 */
function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme + '-theme');
}

window.addEventListener('load', function() {
    applyInitialTheme();
    setTimeout(hideSplashScreen, 2000);
    setTimeout(() => {
        document.body.style.overflow = 'auto';
        AOS.init({
            duration: 1000,
            once: false,
            mirror: true, // Enable animations when scrolling up
            anchorPlacement: 'top-bottom' // Trigger animation when the top of the element hits the bottom of the viewport
        });
    }, 3000);
});

// Arrow Navigation

window.addEventListener('scroll', function() {
    const arrow = document.querySelector('.icon.arrow');
    arrow.style.display = (window.innerHeight + window.scrollY >= document.body.offsetHeight) ? 'block' : 'none';
});

document.querySelectorAll('.arrow').forEach(arrow => {
    arrow.addEventListener('click', function() {
        const href = this.getAttribute('onclick').match(/'#([^']+)'/)[1];
        const section = document.getElementById(href);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Scroll Indicators

document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const indicator = entry.target.querySelector('.scroll-indicator');
            if (indicator) {
                indicator.classList.toggle('visible', entry.isIntersecting);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section').forEach(section => observer.observe(section));

    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentYear();
    setupScrollAnimations();
});