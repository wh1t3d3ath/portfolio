// Splash Screen and Initial Theme Setting
window.addEventListener('load', function () {
    setInitialTheme(); // Set the initial theme based on system preference or stored theme

    setTimeout(function () {
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.style.opacity = '0'; // Start fade out
        setTimeout(function() {
            splashScreen.style.display = 'none'; // Fully hide after fade out
            document.body.style.overflow = 'auto'; // Enable scrolling after splash screen is hidden
        }, 1000); // This should match the CSS transition time
    }, 2000);  // Delay before starting the fade out
});

// Theme Handling
const btn = document.getElementById("modeToogle");
const btn2 = document.getElementById("modeToogle2");
const themeIcons = document.querySelectorAll(".icon");

function setInitialTheme() {
    const isSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = localStorage.getItem('theme'); // Get stored theme if any

    // Determine which theme to apply based on local storage or system preference
    if (theme) {
        document.body.setAttribute('theme', theme);
    } else {
        theme = isSystemDarkMode ? 'dark' : 'light';
        document.body.setAttribute('theme', theme);
    }

    // Apply the correct icon sources based on the theme
    applyThemeIcons(theme);
}

function applyThemeIcons(theme) {
    const themeIcons = document.querySelectorAll(".icon");
    themeIcons.forEach(icon => {
        icon.src = theme === 'dark' ? icon.getAttribute("src-dark") : icon.getAttribute("src-light");
    });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem("themeChangedManually")) {
        if (e.matches) {
            setDarkMode();
        } else {
            setLightMode();
        }
    }
});

btn.addEventListener("click", toggleTheme);
btn2.addEventListener("click", toggleTheme);

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('theme', newTheme);
    localStorage.setItem('theme', newTheme);
    applyThemeIcons(newTheme); // Update icons immediately when theme is toggled
}

function setDarkMode() {
    console.log("Applying dark mode settings");
    document.body.setAttribute("theme", "dark");
    const themeIcons = document.querySelectorAll(".icon");
    themeIcons.forEach(icon => {
        const darkSrc = icon.getAttribute("src-dark");
        console.log(`Updating ${icon.src} to ${darkSrc}`);
        icon.src = darkSrc;
    });
}

function setLightMode() {
    console.log("Applying light mode settings");
    document.body.setAttribute("theme", "light");
    const themeIcons = document.querySelectorAll(".icon");
    themeIcons.forEach(icon => {
        const lightSrc = icon.getAttribute("src-light");
        console.log(`Updating ${icon.src} to ${lightSrc}`);
        icon.src = lightSrc;
    });
}

function setTheme() {
    const body = document.body;
    const newTheme = body.getAttribute('theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Hamburger Menu
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");

    if (menu.classList.contains("open")) {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-20px)';
        setTimeout(() => menu.classList.remove("open"), 500);
    } else {
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';
        menu.classList.add("open");
    }
    icon.classList.toggle("open");
}

// Dropdown Menu
document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    function showDropdown() {
        dropdownContent.style.display = 'block';
        dropdownContent.style.opacity = '1';
        dropdownContent.style.transform = 'translateY(0)';
        dropdownContent.style.pointerEvents = 'auto';
    }

    function hideDropdown() {
        dropdownContent.style.display = 'none';
        dropdownContent.style.opacity = '0';
        dropdownContent.style.transform = 'translateY(-10px)';
        dropdownContent.style.pointerEvents = 'none';
    }

    dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        const isVisible = dropdownContent.style.display === 'block';
        if (isVisible) {
            hideDropdown();
        } else {
            showDropdown();
        }
    });

    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            hideDropdown();
        }
    });
});

// Scroll Animation
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.3
    });

    const sections = document.querySelectorAll('.animated');
    sections.forEach(section => observer.observe(section));
});

// Navigation Links Animation
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.add('visible'));
});

// Pulse Effect Trigger
function triggerPulseEffect() {
    const targetElement = document.getElementById('target-element-id');
    targetElement.classList.add('pulse-effect');
}

// Update Footer Year
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.getElementById('current-year');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
});