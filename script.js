// Theme Handling
const btn = document.getElementById("modeToogle");
const btn2 = document.getElementById("modeToogle2");
const themeIcons = document.querySelectorAll(".icon");

function setInitialTheme() {
    const isSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = localStorage.getItem('theme');
    if (theme) {
        document.body.setAttribute('theme', theme);
    } else {
        theme = isSystemDarkMode ? 'dark' : 'light';
        document.body.setAttribute('theme', theme);
    }
    applyThemeIcons(theme);
    updateThemeStyles(theme);
}

function applyThemeIcons(theme) {
    themeIcons.forEach(icon => {
        icon.src = theme === 'dark' ? icon.getAttribute("src-dark") : icon.getAttribute("src-light");
    });
}

function updateThemeStyles(theme) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme === 'dark' ? '#292929' : '#ffffff');
    root.style.setProperty('--background-color', theme === 'dark' ? '#333333' : '#ffffff');
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('theme', newTheme);
    localStorage.setItem('theme', newTheme);
    applyThemeIcons(newTheme);
}

btn.addEventListener("click", toggleTheme);
btn2.addEventListener("click", toggleTheme);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem("themeChangedManually")) {
        document.body.setAttribute("theme", e.matches ? "dark" : "light");
        applyThemeIcons(e.matches ? "dark" : "light");
    }
});

// Splash Screen Handling
window.addEventListener('load', function () {
    setTimeout(function () {
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.style.opacity = '0';
        setTimeout(function() {
            splashScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1000);
    }, 2000);
});

// Menu Handling
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    const isOpen = menu.classList.contains("open");

    if (isOpen) {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            menu.classList.remove("open");
        }, 300); // Delay should match the CSS transition time
    } else {
        menu.classList.add("open");
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';
    }

    icon.classList.toggle("open");
}

document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        const isVisible = dropdownContent.style.display === 'block';
        dropdownContent.style.display = isVisible ? 'none' : 'block';
        dropdownContent.style.opacity = isVisible ? '0' : '1';
        dropdownContent.style.transform = isVisible ? 'translateY(-10px)' : 'translateY(0)';
        dropdownContent.style.pointerEvents = isVisible ? 'none' : 'auto';
    });

    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdownContent.style.display = 'none';
            dropdownContent.style.opacity = '0';
            dropdownContent.style.transform = 'translateY(-10px)';
            dropdownContent.style.pointerEvents = 'none';
        }
    });
});

// Animations and Effects
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    }, { rootMargin: '0px', threshold: 0.3 });

    const sections = document.querySelectorAll('.animated');
    sections.forEach(section => observer.observe(section));

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.add('visible'));
});

function triggerPulseEffect() {
    const targetElement = document.getElementById('target-element-id');
    targetElement.classList.add('pulse-effect');
}

// Utility Functions
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.getElementById('current-year');
    yearSpan.textContent = new Date().getFullYear();
});