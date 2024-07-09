// Theme Handling
const themeIcons = document.querySelectorAll(".icon");

function setInitialTheme() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('theme', theme);
    updateThemeIcon(theme);
}

function applyThemeIcons(theme) {
    themeIcons.forEach(icon => icon.src = icon.getAttribute(`src-${theme}`));
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('modeToogle');
    if (icon) {
        icon.className = `fas fa-${theme === 'dark' ? 'sun' : 'moon'} color-icon icons`;
    }
}

function setupThemeToggleButtons() {
    const toggleButtons = [document.getElementById('modeToggle'), document.getElementById('modeToggle2')];
    const toggleThemeHandler = event => {
        event.preventDefault();
        toggleTheme();
    };
    toggleButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', toggleThemeHandler);
            button.addEventListener('touchstart', toggleThemeHandler);
        }
    });
}

// Menu Handling
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    const isOpen = menu.classList.contains("open");

    menu.style.opacity = isOpen ? '0' : '1';
    menu.style.transform = `translateY(${isOpen ? '-20px' : '0'})`;

    setTimeout(() => menu.classList.toggle("open"), isOpen ? 300 : 0);
    icon.classList.toggle("open");
}

function closeMenuOnResize() {
    if (window.innerWidth > 1200) {
        const menu = document.querySelector(".menu-links");
        const icon = document.querySelector(".hamburger-icon");
        menu.classList.remove("open");
        icon.classList.remove("open");
    }
}

// Dropdown menu handling
function setupDropdownMenu() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const downloadCvButton = document.getElementById('downloadCvButton');

    function toggleDropdown(show) {
        dropdownContent.style.display = show ? 'block' : 'none';
        dropdownContent.style.opacity = show ? '1' : '0';
        dropdownContent.style.transform = `translateY(${show ? '0' : '-10px'})`;
        dropdownContent.style.pointerEvents = show ? 'auto' : 'none';
    }

    dropdown.addEventListener('click', event => {
        event.stopPropagation();
        toggleDropdown(dropdownContent.style.display !== 'block');
    });

    document.addEventListener('click', event => {
        if (!dropdown.contains(event.target)) {
            toggleDropdown(false);
            downloadCvButton.classList.remove('active');
        }
    });
}

// Animations and Effects
function setupScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.target && entry.target.classList) {
                entry.target.classList.toggle('visible', entry.isIntersecting);
                entry.target.classList.toggle('not-visible', !entry.isIntersecting);
            }
        });
    }, { rootMargin: '0px', threshold: 0.3 });

    document.querySelectorAll('.animated, .animate-on-scroll').forEach(element => {
        if (element) observer.observe(element);
    });

    document.querySelectorAll('.nav-links a').forEach(link => link.classList.add('visible'));
}

// Utility Functions
function updateCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}

function updateAge() {
    const birthdate = new Date('2004-05-25');
    const age = Math.floor((Date.now() - birthdate) / (365.25 * 24 * 60 * 60 * 1000));
    document.getElementById('age').textContent = age;
}

// Scroll to Top Function
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Splash Screen and Initial Theme
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

function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(`${savedTheme}-theme`);
}

// Arrow Navigation
function setupArrowNavigation() {
    const arrow = document.querySelector('.icon.arrow');
    window.addEventListener('scroll', () => {
        arrow.style.display = (window.innerHeight + window.scrollY >= document.body.offsetHeight) ? 'block' : 'none';
    });

    document.querySelectorAll('.arrow').forEach(arrow => {
        arrow.addEventListener('click', function() {
            const href = this.getAttribute('onclick').match(/'#([^']+)'/)[1];
            const section = document.getElementById(href);
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Scroll Indicators
function setupScrollIndicators() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const indicator = entry.target.querySelector('.scroll-indicator');
            if (indicator) indicator.classList.toggle('visible', entry.isIntersecting);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section').forEach(section => observer.observe(section));

    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.addEventListener('click', function() {
            const targetSection = document.querySelector(this.getAttribute('data-target'));
            if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setInitialTheme();
    setupThemeToggleButtons();
    updateAge();
    setupDropdownMenu();
    setupScrollAnimations();
    updateCurrentYear();
    setupArrowNavigation();
    setupScrollIndicators();
});

window.addEventListener('resize', closeMenuOnResize);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newTheme = e.matches ? 'dark' : 'light';
    document.body.setAttribute('theme', newTheme);
    applyThemeIcons(newTheme);
});

window.addEventListener('scroll', () => {
    const backToTopButton = document.getElementById('back-to-top');
    backToTopButton.classList.toggle('show-back-to-top', window.scrollY > 300);
});

window.addEventListener('load', () => {
    applyInitialTheme();
    setTimeout(hideSplashScreen, 2000);
    setTimeout(() => {
        document.body.style.overflow = 'auto';
        AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
            anchorPlacement: 'top-bottom'
        });
    }, 3000);
});